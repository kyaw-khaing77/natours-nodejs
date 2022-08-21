/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (tourId, review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
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
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tours/${tourId}/reviews/${reviewId}`,
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
      url: `/api/v1/reviews/${reviewId}`
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
