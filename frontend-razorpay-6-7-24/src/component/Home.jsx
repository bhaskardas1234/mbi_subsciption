import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useCookies,Cookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Home = ({ courseDetails, user }) => {
  const navigate = useNavigate();
  // const [cookies, setCookie, removeCookie] = useCookies([]);
  const [uid, setUid] = useState(Cookies.get('user_id')); // Example of setting initial user ID
  const loadScript = (src) => {
    return new Promise((resolve) => {
      console.log("colkkdf",uid)
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    makePayment();
  };

  const makePayment = async () => {
    try {
      // Fetch order ID from your backend
      const response= await fetch(`http://localhost:5000/create_order`, {
        method: 'POST',
          headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ courseAmount: 1 }),
     });
      const data = await response.json();
      const newOrderId = data.order_id;
      var self=1*100
      console.log(self);
      console.log("order ID------>"+newOrderId);

      const options = {
        // key: 'rzp_test_WyHwnCdtRvbGyl'
        key:'rzp_test_XIKIRmwuryqbiu' , // Replace with your actual Razorpay API key
        amount: self,  // 1 INR = 100 paisa
        currency: 'INR',
        name: 'MBI',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        order_id: newOrderId.toString(),
        handler: (response) => {
          const handlePaymentSuccess = async () => {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              uid:8,
              money:self/100
            };

            try {
              // Call backend to handle payment success
              
              const verifyResponse = await fetch(`http://localhost:5000/verify_payment`, {
                       method: 'POST',
                         headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(paymentData),
                    });


              console.log("Successful paymentData----->"+ JSON.stringify(paymentData));
              alert('Payment successful');
              // Redirect to success page or do further actions
              window.location.href = '/success';  // Replace with your actual success page route
            } catch (error) {
              console.error('Payment verification failed:', error);
              alert('Payment verification failed');
              // Redirect to home or error page
              navigate('/');
            }
          };

          handlePaymentSuccess();
        },
        prefill: {
          name: "Nibedita_testing",  // Replace with actual user details
          email: "test@gmail.com",
          contact: "9635766141",
        },
        notes: {
          address: 'Kolkata',  // Replace with actual user address or additional notes
        },
        theme: {
          color: '#005792',  // Navy blue color
        },
        modal: {
          ondismiss: async () => {
            const failureData = {
              razorpay_payment_id: '',
              razorpay_order_id: newOrderId,
            };

          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure
      rzp.on('payment.failed', async (response) => {
        const failureData = {
          razorpay_payment_id: response.error.metadata.payment_id,
          razorpay_order_id: response.error.metadata.order_id,
          uid:8,
          money:self/100

        };

        try {
        
          const verifyResponse = await fetch(`http://localhost:5000/record_payment_failure`, {
            method: 'POST',
              headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify(failureData),
         });
          console.log("Failed paymentData----->"+JSON.stringify (failureData));
          alert('Payment failed and recorded.');
          navigate('/');
        } catch (error) {
          console.error('Failed to record payment failure:', error);
          alert('Failed to record payment failure.');
          navigate('/');
        }
      });

      rzp.open();
    } catch (error) {
      console.error('Error making payment:', error);
      alert('Error making payment. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button
        style={{
          backgroundColor: '#005792', // Navy blue color
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
        onClick={displayRazorpay} // Call displayRazorpay here
      >
        Pay Now
      </button>
    </div>
  );
};

export default Home;

