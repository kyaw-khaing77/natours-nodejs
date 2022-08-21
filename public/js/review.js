/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (tourId, review, rating) => {
  try {
    console.log(tourId, review, rating);
    const res = await axios({
      method: 'POST',
      url: `http://localhost:3000/api/v1/tours/${tourId}/reviews`,
      data: {
        review,
        rating
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully posted your review');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateReview = async (tourId, reviewId, review, rating) => {
  try {
    console.log(tourId, reviewId, review, rating);
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/tours/${tourId}/reviews/${reviewId}`,
      data: {
        review,
        rating
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully updated your review');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async reviewId => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://localhost:3000/api/v1/reviews/${reviewId}`
    });
    if ((res.status = 204)) {
      showAlert('success', 'Successfully deleted your review');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
