from django.urls import path
from .views import register_member, login_member, check_status, create_order, verify_payment

urlpatterns = [
    path('register/', register_member, name='register'),
    path('login/', login_member, name='login'),
    path('status/<str:email>/', check_status, name='status'),

    path('create-order/', create_order, name='create_order'),
    path('verify-payment/', verify_payment, name='verify_payment'),
]

