import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css'; 

const CheckoutForm = ({ setShowLoader }) => {
  const userEmail = useSelector(state => state.auth.auth.email);
  const { productCode } = useSelector(state => state.profile);
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [subscriptionId, setSubscriptionId] = useState();
  const [countdown, setCountdown] = useState(5); // Initial countdown time
  const navigate = useNavigate();
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phoneNumber: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet.");
      return;
    }

    setShowLoader(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: billingDetails.name,
        email: billingDetails.email,
        phone: billingDetails.phoneNumber,
        address: {
          line1: billingDetails.address,
          city: billingDetails.city,
          state: billingDetails.state,
          country: billingDetails.country,
        },
      },
    });

    if (error) {
      console.log('Payment method processing failed', error);
      setMessage(`Error creating payment method: ${error.message}`);
      setShowLoader(false);
      return;
    } else {
      console.log('Payment method created:', paymentMethod);
    }

    try {
      const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/create_payment_request_v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,
          payment_method_id: paymentMethod.id,
          product_code: productCode,
        }),
      });

      const data = await response.json();
      console.log("Subscription data received:", data);

      if (response.ok && data.subscription_id) {
        setSubscriptionId(data.subscription_id);  // No need for setTimeout
      } else if (data.error) {
        setMessage(`Subscription creation failed: ${data.error}`);
        setShowLoader(false);
      }
    } catch (error) {
      setMessage(`Error processing payment: ${error.message}`);
      setShowLoader(false);
    }
};

// Verify subscription when subscriptionId is set
useEffect(() => {
  if (subscriptionId) {
    verifySubscription();
  }
}, [subscriptionId]);

const verifySubscription = async () => {
  try {
    const response = await fetch('https://us-east1-foursssolutions.cloudfunctions.net/create_payment_request_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscription_id: subscriptionId }),
    });

    const data = await response.json();

    if (data.error) {
      setMessage(`Subscription verification failed: ${data.error}`);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      setSuccessMessage(`Payment Status: Paid Successfully`);
      setMessage(``);
      setTimeout(() => { navigate("/") }, 5000);
      
      // Start countdown if necessary
      if (countdown > 0) {
        const timer = setInterval(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  } catch (error) {
    setMessage(`Error processing payment: ${error.message}`);
    setShowLoader(false);
  }
};



  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
  };

 

  return (
    <form onSubmit={handleSubmit} className="checkout-form basic-form checkout">
      <h2 className=''>Enter Details</h2>
      <div className="row">
        <div className="col-sm-6">
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            required
          />
        </div>
        <div className="col-sm-6 mt-2 mt-sm-0">
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            required
          />
        </div>
      </div>
      
      <div className='row'>
        <div className="col-sm-12 mt-2 mt-sm-0">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            className='form-control'
            value={billingDetails.email}
            onChange={(e) =>
              setBillingDetails({ ...billingDetails, email: e.target.value })
            }
            required
          />
        </div>
      </div>
      
      {/* Phone Number Field */}
      <div className='row'>
        <div className="col-sm-12 mt-2 mt-sm-0">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="Phone Number"
            className="form-control"
            pattern="[0-9]{10}"  // Validates a 10-digit number
            maxLength={10}
            onChange={(e) =>
              setBillingDetails({ ...billingDetails, phoneNumber: e.target.value })
            }
            required
          />
        </div>
      </div>
      
      <h2 className='mb-4 mt-2'>Billing Address</h2>
      <div className='row'>
        <div className="col-sm-12 mt-2 mt-sm-0">
          <label>Street</label>
          <input
            value={billingDetails.address}
            className='form-control'
            placeholder='Street address'
            onChange={(e) =>
              setBillingDetails({ ...billingDetails, address: e.target.value })
            }
            required
          />
        </div>
        
        <div className="col-sm-6 mt-2 mt-sm-0">
          <label>City</label>
          <input
            value={billingDetails.city}
            className='form-control'
            placeholder='Enter your city'
            onChange={(e) =>
              setBillingDetails({ ...billingDetails, city: e.target.value })
            }
            required
          />
        </div>
        
        <div className="col-sm-6 mt-2 mt-sm-0">
          <label>State</label>
          <input
            value={billingDetails.state}
            className='form-control'
            placeholder='Enter your state'
            onChange={(e) =>
              setBillingDetails({ ...billingDetails, state: e.target.value })
            }
            required
          />
        </div>
        
        <div className="col-sm-12 mt-2 mt-sm-0">
          <label>Country or region</label>
          <select
            value={billingDetails.country}
            className='form-control'
            onChange={(e) =>
              setBillingDetails({ ...billingDetails, country: e.target.value })
            }
            required
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="IN">India</option>
            <option value="CA">Canada</option>
            {/* Add other countries as needed */}
          </select>
        </div>
      </div>
      
      <h2>Pay with card</h2>
      <label>Card information</label>
      <div className="card-element-wrapper">
        <CardElement options={cardStyle} />
      </div>
      {successMessage && (
        <div className="success-message-wrapper">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="tick-icon">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" fill="none" />
          <path d="M7 12l3 3l6-6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

          <p className="absolute-green">{successMessage}</p>
          <p className="absolutetext">
            You will be redirected to the dashboard in {countdown} seconds.
          </p>
        </div>
      )}
      {message && <p>{message}</p>}

      <button type="submit" disabled={!stripe} className="submit-button">
        Proceed To Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
