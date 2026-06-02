from rest_framework import generics
from django.db.models import Case, When
from .models import Hapsari
from .serializers import HapsariSerializer
from rank_bm25 import BM25Okapi

class ProductListAPI(generics.ListAPIView):
    serializer_class = HapsariSerializer

    def get_queryset(self):
        queryset = Hapsari.objects.all()
        search_query = self.request.query_params.get('search', None)

        if search_query:
            query_lower = search_query.lower()

            # 1. KAMUS SINONIM (Query Expansion)
            # Anda bisa menambahkan kata sebanyak apa pun di sini ke depannya
            synonyms = {
                'rambut': ['hair', 'haircare', 'shampoo', 'conditioner', 'mask'],
                'ketombe': ['hair', 'haircare', 'shampoo', 'conditioner', 'mask'],
                'muka': ['face', 'cleanser', 'wash', 'makeup', 'facial'],
                'wajah': ['face', 'cleanser', 'wash', 'makeup', 'facial'],
                'bibir': ['lip', 'lipstick', 'balm', 'lipcream'],
                'kulit': ['body', 'lotion', 'serum', 'moisturizer'],
                'matahari': ['sunscreen', 'sunblock', 'spf'],
                'pelembap': ['moisturizer', 'cream', 'lotion', 'hydrate'],
                'jerawat': ['acne', 'pimple', 'cleanser', 'serum']
            }

            # 2. EKSPANSI QUERY
            # Pecah kata ketikan user (misal: "perawatan rambut")
            expanded_query = query_lower.split()
            
            # Cek setiap kata. Jika ada di kamus, masukkan terjemahannya juga
            for word in query_lower.split():
                if word in synonyms:
                    expanded_query.extend(synonyms[word])
            
            # Sekarang 'tokenized_query' bukan cuma "rambut", 
            # tapi ["rambut", "hair", "haircare", "shampoo", ...]
            tokenized_query = expanded_query 

            # 3. PROSES BM25 (Tidak Berubah)
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