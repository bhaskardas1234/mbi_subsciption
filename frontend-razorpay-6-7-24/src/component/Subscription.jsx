import React from 'react'
import classes from './Subscription.module.css'
import SubscriptionIcon from '../asset/subscription.png'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mathrubhumiIcon from '../asset/mathrubhumi-logo.png'






const Subscription = () => {

    const items = ['Perfect for the dynamic reader', 'Immediate access to Exclusive Content', 'Premium Features:ad-free interface,......', 'Renews each month'];
    const items1 = ['Exceptional Value: Unlimited access at a reduced cost (12 months for the cost of 10)', 'Comprehensive Archive Access for research, nostalgia, or simply satisfying your curiosity', 'Immediate Access to Exclusive Content', 'Renews Annually'];
    const items2 = ['Unlock Exclusive Insights', 'Pay Only for What You Consume', 'Flexible and Cost-Efficient',];
    const navigate = useNavigate();
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
  
    const displayRazorpay = async (amount,duration) => {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }
  
      makePayment(amount,duration);
    };
  
    const makePayment = async (amount,duration) => {
      try {
        // Fetch order ID from your backend
        const response= await fetch(`http://localhost:5000/create_order`, {
          method: 'POST',
            headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ courseAmount:amount}),
       });
        const data = await response.json();
        const newOrderId = data.order_id;
        var self=amount*100
        console.log(self);
        console.log("order ID------>"+newOrderId);
  
        const options = {
          // key: 'rzp_test_WyHwnCdtRvbGyl',
          key:'rzp_test_XIKIRmwuryqbiu', // Replace with your actual Razorpay API key
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
                uid:uid,
                money:self/100,
                duration:duration,
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
                navigate('/success')  // Replace with your actual success page route
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
            uid:uid,
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
        <>

            <div className={classes['subscription-container']}>
                <div className={classes['heading']}>
                    <p>To read this article subscribe</p>
                </div>

                <div className={classes['cards']}>

                    <div className={classes['left']}>
                        <div className={classes['image']}>
                            <img src={SubscriptionIcon} alt="" />
                        </div>
                        <h2>Monthly</h2>
                        <div className={classes['monthly-description']}>
                            <div className={classes['lines']}>
                                <p>&#8226; Perfect for the dynamic reader</p>
                            </div>
                            <div className={classes['lines']}>
                                <p>&#8226; Immediate access to Exclusive Content</p>
                            </div>
                            <div className={classes['lines']}>
                                <p>&#8226; Premium Features:ad-free interface,......</p>
                            </div>
                            <div className={classes['lines']}>
                                <p>&#8226; Renews each month</p>
                            </div>
                        </div>
                        <div className={classes['submit-button']}>
                            <button className={classes['suscribe-button']}  onClick={() => displayRazorpay(499,"MONTHLY")}>Choose monthly Subscription</button>
                        </div>
                    </div>

                    <div className={classes['middle']}>
                        <div className={classes['image']}>
                            <img src={SubscriptionIcon} alt="" />
                        </div>
                        <h2>Yearly</h2>
                        <div className={classes['yearly-description']}>
                            <div className={classes['lines']}>
                                <p>&#8226; Exceptional Value: Unlimited access at a reduced cost (12 months for the cost of 10)</p>
                            </div>
                            <div className={classes['lines']}>
                                <p>&#8226; Comprehensive Archive Access for research, nostalgia, or simply satisfying your curiosity</p>
                            </div>
                            <div className={classes['lines']}>
                                <p>&#8226; Immediate Access to Exclusive Content</p>
                            </div>
                            <div className={classes['lines']}>
                                <p>&#8226; Renews Annually</p>
                            </div>
                        </div>
                        <div className={classes['submit-button']}>
                            <button className={classes['suscribe-button']} onClick={() => displayRazorpay(999,"YEARLY")}>Choose yearly Subscription</button>
                        </div>
                    </div>

                    <div className={classes['right']}>
                        <div className={classes['image']}>
                            <img src={SubscriptionIcon} alt="" />
                        </div>
                        <h2>Pay as you read</h2>
                        <div className={classes['pay-as-read-description']}>
                            <div className={classes['lines']}>
                                <p>&#8226; Unlock Exclusive Insights</p>
                            </div>
                            <div className={classes['lines']}>
                                <p>&#8226; Pay Only for What You Consume</p>
                            </div>
                            <div className={classes['lines']}>
                                <p>&#8226; Immediate Access to Exclusive Content</p>
                            </div>
                        </div>
                        <div className={classes['submit-button']}>
                            <button className={classes['suscribe-button']}onClick={() => displayRazorpay(2,"ONE TIME")}>Flexible and Cost-Efficient</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Subscription