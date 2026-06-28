from django.db import models

class Hapsari(models.Model):
    brand = models.CharField(max_length=100)
    kategori = models.CharField(max_length=100)
    nama_produk = models.CharField(max_length=255)
    harga = models.IntegerField()
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nama_produk

# --- TABEL HISTORY CHAT (TANPA LOGIN) ---

class ConsultationSession(models.Model):
    title = models.CharField(max_length=255, default="Konsultasi Baru")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.created_at.strftime('%d %b %Y')})"

class ChatMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('ai', 'AI'),
    ]
    session = models.ForeignKey(ConsultationSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.text[:30]}"