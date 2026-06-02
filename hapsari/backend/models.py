from django.db import models

# Create your models here.
class Hapsari(models.Model):
    brand = models.CharField(max_length=100)
    kategori = models.CharField(max_length=100)
    nama_produk = models.CharField(max_length=255)
    harga = models.IntegerField()
    image_url = models.URLField(blank=True, null=True) # Untuk foto dari internet

    def __str__(self):
        return self.nama_produk