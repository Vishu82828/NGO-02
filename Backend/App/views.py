from django.contrib.auth.hashers import check_password
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.conf import settings
from .models import Member, Donation
from .serializers import MemberSerializer, DonationSerializer
import razorpay


# Razorpay client setup
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@api_view(['POST'])
def register_member(request):
    """Register a new member with hashed password"""
    data = request.data
    serializer = MemberSerializer(data=data)
    
    if serializer.is_valid():
        member = serializer.save()
        member.set_password(data['password'])  # Hash password
        member.save()
        return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_member(request):
    """Authenticate user manually since `authenticate()` may not work with `email` as `USERNAME_FIELD`"""
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = Member.objects.get(email=email)
        if check_password(password, user.password):  # Verify password manually
            return Response({
                'message': 'Login successful',
                'email': user.email,
                'status': user.status  # Send user status
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    except Member.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def check_status(request, email):
    """Check user status"""
    try:
        member = Member.objects.get(email=email)
        return Response({'status': member.status}, status=status.HTTP_200_OK)
    except Member.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def create_order(request):
    """Create a Razorpay order and save donation details"""
    try:
        data = request.data
        amount = int(float(data.get('amount', 0)) * 100)  # Convert amount to paise
        
        if amount <= 0:
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        payment_data = {
            "amount": amount,
            "currency": "INR",
            "payment_capture": "1"
        }
        order = razorpay_client.order.create(data=payment_data)

        # Save order details
        donation = Donation.objects.create(
            donor_name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            amount=data.get('amount'),
            razorpay_order_id=order['id']
        )

        return Response({"order_id": order['id'], "key": settings.RAZORPAY_KEY_ID}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_payment(request):
    """Verify Razorpay payment signature"""
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

        # Update donation status
        donation = Donation.objects.get(razorpay_order_id=razorpay_order_id)
        donation.razorpay_payment_id = razorpay_payment_id
        donation.status = "successful"
        donation.save()

        return Response({"message": "Payment successful!"}, status=status.HTTP_200_OK)
    
    except Donation.DoesNotExist:
        return Response({"error": "Donation record not found"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_member_details(request, email):
    try:
        member = Member.objects.get(email=email)
        serializer = MemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Member.DoesNotExist:
        return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)

