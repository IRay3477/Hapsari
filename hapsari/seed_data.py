import os
import django
import pandas as pd

# Setup environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hapsari.settings')
django.setup()

from backend.models import Hapsari

# Kamus URL Gambar Berdasarkan Tipe
GAMBAR_KATEGORI = {
    'serum': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800',       # Botol putih (Serum)
    'cleanser': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800',    # Tube biru (Cleanser)
    'moisturizer': 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800', # Jar krim putih (Moisturizer)
    'lip': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800',         # Lip makeup
    'face': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600',        # Bedak/Brush (Face Makeup)
    'sunscreen': 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600',      # Sunscreen
    'hair': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800',        # Botol Shampoo (Untuk Makarizo dkk)
    'default': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800'      # Default jika kategori tidak dikenali
}

def get_gambar(kategori):
    kat = str(kategori).lower()
    if 'serum' in kat: return GAMBAR_KATEGORI['serum']
    elif 'cleanser' in kat or 'wash' in kat: return GAMBAR_KATEGORI['cleanser']
    elif 'moisturizer' in kat or 'cream' in kat: return GAMBAR_KATEGORI['moisturizer']
    elif 'lip' in kat: return GAMBAR_KATEGORI['lip']
    elif 'makeup' in kat or 'face' in kat: return GAMBAR_KATEGORI['face']
    elif 'sunscreen' in kat or 'sunblock' in kat: return GAMBAR_KATEGORI['sunscreen']
    elif 'hair' in kat or 'shampoo' in kat or 'mask' in kat: return GAMBAR_KATEGORI['hair']
    else: return GAMBAR_KATEGORI['default']

def run_seed():
    print("Membaca file CSV...")
    df = pd.read_csv('hapsari_cosmetic_clean.csv')

    print("Menghapus 242 data lama yang gambarnya sama semua...")
    Hapsari.objects.all().delete()

    print("Mulai mengimpor data baru dengan gambar yang bervariasi...")
    for index, row in df.iterrows():
        Hapsari.objects.create(
            brand=row['brand'],
            kategori=row['kategori'],
            nama_produk=row['nama_produk'],
            harga=row['harga'],
            image_url=get_gambar(row['kategori']) # Memanggil fungsi mapping gambar
        )
    print("Selesai! Database sudah diperbarui.")

if __name__ == '__main__':
    run_seed()