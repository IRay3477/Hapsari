import os
import re
from dotenv import load_dotenv
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Case, When
from rank_bm25 import BM25Okapi
import google.generativeai as genai

from .models import Hapsari, ConsultationSession, ChatMessage
from .serializers import HapsariSerializer

# 1. LOAD ENVIRONMENT VARIABLES
load_dotenv()

# 2. KONFIGURASI GEMINI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-3.1-flash-lite-preview')


# ========================================================
# API 1: PENCARIAN PRODUK (MENU SHOP)
# ========================================================
class ProductListAPI(generics.ListAPIView):
    serializer_class = HapsariSerializer

    def get_queryset(self):
        queryset = Hapsari.objects.all()
        search_query = self.request.query_params.get('search', None)

        if search_query:
            query_clean = re.sub(r'[^\w\s]', '', search_query.lower())
            words = query_clean.split()

            synonyms = {
                'rambut': ['hair', 'haircare', 'shampoo', 'conditioner', 'mask'],
                'ketombe': ['hair', 'haircare', 'shampoo', 'conditioner', 'mask', 'dandruff'],
                'muka': ['face', 'cleanser', 'wash', 'makeup', 'facial'],
                'wajah': ['face', 'cleanser', 'wash', 'makeup', 'facial'],
                'bibir': ['lip', 'lipstick', 'balm', 'lipcream'],
                'kulit': ['body', 'lotion', 'serum', 'moisturizer'],
                'matahari': ['sunscreen', 'sunblock', 'spf'],
                'pelembap': ['moisturizer', 'cream', 'lotion', 'hydrate'],
                'jerawat': ['acne', 'pimple', 'cleanser', 'serum']
            }

            expanded_query = list(words)
            for word in words:
                for key, syn_list in synonyms.items():
                    if key in word:
                        expanded_query.extend(syn_list)
            
            tokenized_query = expanded_query 

            products = list(queryset)
            corpus = [
                f"{p.nama_produk} {p.brand} {p.kategori}".lower().split()
                for p in products
            ]

            bm25 = BM25Okapi(corpus)
            doc_scores = bm25.get_scores(tokenized_query)

            scored_products = zip(products, doc_scores)
            sorted_products = sorted(
                [p for p in scored_products if p[1] > 0],
                key=lambda x: x[1],
                reverse=True
            )
            
            if not sorted_products:
                return Hapsari.objects.none()

            sorted_ids = [p[0].id for p in sorted_products]
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(sorted_ids)])
            queryset = Hapsari.objects.filter(pk__in=sorted_ids).order_by(preserved)

        return queryset


# ========================================================
# API 2: MANAJEMEN RIWAYAT SESI CHAT (HISTORY LIST & DELETE)
# ========================================================
class SessionListAPI(APIView):
    def get(self, request):
        sessions = ConsultationSession.objects.all().order_by('-created_at')
        data = [{"id": s.id, "title": s.title, "created_at": s.created_at} for s in sessions]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        title = request.data.get('title', 'Konsultasi Baru')
        new_session = ConsultationSession.objects.create(title=title)
        return Response({"id": new_session.id, "title": new_session.title}, status=status.HTTP_201_CREATED)


class SessionMessagesAPI(APIView):
    def get(self, request, session_id):
        try:
            session = ConsultationSession.objects.get(id=session_id)
            messages = session.messages.all().order_by('timestamp')
            data = [{"sender": m.sender, "text": m.text} for m in messages]
            return Response(data, status=status.HTTP_200_OK)
        except ConsultationSession.DoesNotExist:
            return Response({"error": "Sesi tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, session_id):
        try:
            session = ConsultationSession.objects.get(id=session_id)
            session.delete()
            return Response({"message": "Sesi berhasil dihapus"}, status=status.HTTP_200_OK)
        except ConsultationSession.DoesNotExist:
            return Response({"error": "Sesi tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)


# ========================================================
# API 3: KONSULTASI RAG UTAMA + SAVE DATA
# ========================================================
class ConsultationAPI(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        user_message = request.data.get('message', '')
        
        if not session_id or not user_message:
            return Response({"error": "Session ID dan pesan tidak boleh kosong"}, status=status.HTTP_400_BAD_REQUEST)

        if not GEMINI_API_KEY:
             return Response({"error": "Sistem AI belum dikonfigurasi."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            session = ConsultationSession.objects.get(id=session_id)
        except ConsultationSession.DoesNotExist:
            return Response({"error": "Sesi tidak valid"}, status=status.HTTP_404_NOT_FOUND)

        # Simpan pesan User asli ke Database lokal
        ChatMessage.objects.create(session=session, sender='user', text=user_message)

        query_clean = re.sub(r'[^\w\s]', '', user_message.lower())
        words = query_clean.split()

        synonyms = {
            'rambut': ['hair', 'haircare', 'shampoo', 'conditioner', 'mask'],
            'ketombe': ['hair', 'haircare', 'shampoo', 'conditioner', 'mask', 'dandruff'],
            'muka': ['face', 'cleanser', 'wash', 'makeup', 'facial'],
            'wajah': ['face', 'cleanser', 'wash', 'makeup', 'facial'],
            'bibir': ['lip', 'lipstick', 'balm', 'lipcream'],
            'kulit': ['body', 'lotion', 'serum', 'moisturizer'],
            'matahari': ['sunscreen', 'sunblock', 'spf'],
            'pelembap': ['moisturizer', 'cream', 'lotion', 'hydrate'],
            'jerawat': ['acne', 'pimple', 'cleanser', 'serum']
        }

        expanded_query = list(words)
        for word in words:
            for key, syn_list in synonyms.items():
                if key in word:
                    expanded_query.extend(syn_list)
        
        tokenized_query = expanded_query

        # Tahap 1: RETRIEVAL (BM25)
        queryset = list(Hapsari.objects.all())
        corpus = [f"{p.nama_produk} {p.brand} {p.kategori}".lower().split() for p in queryset]
        
        bm25 = BM25Okapi(corpus)
        doc_scores = bm25.get_scores(tokenized_query)
        
        top_products = sorted([p for p in zip(queryset, doc_scores) if p[1] > 0], key=lambda x: x[1], reverse=True)[:3]

        # Tahap 2: AUGMENTATION
        context_data = ""
        for idx, (prod, score) in enumerate(top_products):
            context_data += f"{idx+1}. {prod.nama_produk} (Harga: Rp {prod.harga}) - Kategori: {prod.kategori} - Brand: {prod.brand}\n"

        is_database_empty = False
        if not context_data:
            is_database_empty = True
            context_data = "MAAF, TIDAK ADA PRODUK YANG COCOK DI DATABASE HAPSARI COSMETIC UNTUK KELUHAN INI."

        if session.title == "Konsultasi Baru" and len(user_message) < 30:
            session.title = user_message
            session.save()

        system_prompt = f"""
        Kamu adalah AI Beauty Consultant resmi dari 'Hapsari Cosmetic'. Gaya bicaramu ramah, profesional, suportif, dan modern.
        
        Seorang pelanggan mengeluhkan: "{user_message}"
        
        Berdasarkan database Hapsari, berikut adalah produk yang tersedia:
        {context_data}
        
        ATURAN MUTLAK (JANGAN DILANGGAR):
        1. Sapa pelanggan dan beri sedikit tips ringan terkait masalah kulit/rambut mereka dengan empatik.
        2. Jika datanya bertuliskan "{context_data}" (kosong/tidak cocok), kamu DILARANG KERAS mengarang atau membuat-buat nama produk baru. Katakan saja dengan jujur dan ramah bahwa saat ini produk spesifik untuk keluhan tersebut belum tersedia di katalog Hapsari, lalu sarankan mereka untuk melihat menu 'SHOP' untuk mengeksplorasi produk lain yang tersedia.
        3. Jika produk tersedia di atas, rekomendasikan produk tersebut dengan menyebutkan Nama Produk, Brand, dan Harganya secara akurat sesuai data di atas. Jangan merekomendasikan produk di luar daftar tersebut!
        """

        # Tahap 3: GENERATION
        try:
            response = model.generate_content(system_prompt)
            bot_reply = response.text

            # Simpan jawaban AI ke Database lokal
            ChatMessage.objects.create(session=session, sender='ai', text=bot_reply)

            return Response({"reply": bot_reply}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)