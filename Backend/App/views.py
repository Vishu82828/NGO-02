from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Member
from .serializers import MemberSerializer

# Donation 
import razorpay
from django.conf import settings
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
from .models import Donation
from .serializers import DonationSerializer

@api_view(['POST'])
def register_member(request):
    serializer = MemberSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_member(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(email=email, password=password)
    if user:
        return Response({'message': 'Login successful', 'email': user.email}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def check_status(request, email):
    try:
        member = Member.objects.get(email=email)
        return Response({'status': member.status}, status=status.HTTP_200_OK)
    except Member.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


#  Donations ..................

# Razorpay client setup
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@api_view(['POST'])
def create_order(request):
    data = request.data
    amount = int(float(data['amount']) * 100)  # Convert amount to paise
    payment_data = {
        "amount": amount,
        "currency": "INR",
        "payment_capture": "1"
    }
    order = razorpay_client.order.create(data=payment_data)

    # Save order details in the database
    donation = Donation.objects.create(
        donor_name=data['name'],
        email=data['email'],
        phone=data['phone'],
        amount=data['amount'],
        razorpay_order_id=order['id']
    )

    return Response({"order_id": order['id'], "key": settings.RAZORPAY_KEY_ID}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def verify_payment(request):
    data = request.data
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_signature = data.get("razorpay_signature")

    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_order_id": razorpay_order_id,
            "razorpay_signature": razorpay_signature
        })

        # Update payment status in the database
        donation = Donation.objects.get(razorpay_order_id=razorpay_order_id)
        donation.razorpay_payment_id = razorpay_payment_id
        donation.status = "successful"
        donation.save()

        return Response({"message": "Payment successful!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
