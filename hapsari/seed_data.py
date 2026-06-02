import os
import django
import pandas as pd

# 1. Setup environment agar script ini bisa mengenali Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hapsari.settings')
django.setup()

# 2. Import model setelah setup
from backend.models import Hapsari

def run_seed():
    print("Membaca file CSV...")
    # Sesuaikan nama file jika berbeda
    df = pd.read_csv('hapsari_cosmetic_clean.csv')

    print("Membersihkan data lama (jika ada)...")
    Hapsari.objects.all().delete()

    print("Mulai mengimpor data ke database...")
    for index, row in df.iterrows():
        # Memasukkan setiap baris DataFrame ke database Django
        Hapsari.objects.create(
            brand=row['brand'],
            kategori=row['kategori'],
            nama_produk=row['nama_produk'],
            harga=row['harga'],
            image_url="https://images.unsplash.com/photo-1620916566398-39f1143ab7be" # Dummy URL gambar kosmetik
        )
    print(f"Selesai! {len(df)} produk berhasil dimasukkan ke database.")

if __name__ == '__main__':
    run_seed()