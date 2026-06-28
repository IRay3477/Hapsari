from django.urls import path
from .views import ProductListAPI, ConsultationAPI, SessionListAPI, SessionMessagesAPI

urlpatterns = [
    path('products/', ProductListAPI.as_view(), name='product-list'),
    path('consultation/', ConsultationAPI.as_view(), name='consultation'), # Tambahkan baris ini
    path('consultation/sessions/', SessionListAPI.as_view()),
    path('consultation/sessions/<int:session_id>/messages/', SessionMessagesAPI.as_view()),
    path('consultation/chat/', ConsultationAPI.as_view()),
]