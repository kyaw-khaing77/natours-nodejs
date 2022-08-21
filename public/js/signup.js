/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, confirmPassword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        confirmPassword
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Sign up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const forgetPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
    }
  } catch (error) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, confirmPassword) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('token');
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        confirmPassword
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password Updated successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
