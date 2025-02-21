import React from 'react';

const Donate = () => {
  const handlePayment = async () => {
    const options = {
      key: 'your_razorpay_key', // Replace with your Razorpay Key
      amount: 50000, // Amount in paise (50000 = ₹500)
      currency: 'INR',
      name: 'NGO Donation',
      description: 'Support Our Cause',
      handler: (response) => {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Donor Name',
        email: 'donor@example.com',
        contact: '9999999999'
      },
      theme: { color: '#3399cc' }
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div>
      <h2>Donate to Our NGO</h2>
      <button onClick={handlePayment}>Donate Now</button>
    </div>
  );
};

export default Donate;
