/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51LXfiGAOdhYXpYAGIqoAtOZvrOlbglz17gQzVXCaP5gKQovIkC8BRqEKmzqi1qakAnWa8nJIVbod86kbjJM0YQA400hbKrxBs4'
);

export const bookTour = async (tourId, dateId, participants) => {
  try {
    // 1) Get checkout session from API

    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}/dateId/${dateId}/participants/${participants}`
    );
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
