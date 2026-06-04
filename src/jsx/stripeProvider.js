import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51Q9pepP9YE5TMcZPcE3MSMauCQCy2CjCgRVEtKazyCDmC5FDxYIicB2iZk8lpi0NRff1SoVOgbjHgrjzA1xWGT3e00KOiECVOW');

const StripeProvider = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;