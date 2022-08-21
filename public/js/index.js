/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup, forgetPassword, resetPassword } from './signup';
import { createReview, updateReview, deleteReview } from './review';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

//Dom elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signUp');
const forgetPasswordForm = document.querySelector('.form--forget-password');
const resetPasswordForm = document.querySelector('.form--reset-password');
const ratingStar = document.querySelectorAll('.rating__star');
const reviewForm = document.querySelector('.form--review');

const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const callBookBtn = document.getElementById('call-book-modal');
const bookBtn = document.getElementById('book-btn');
const deleteReviewEl = document.querySelectorAll('.delete__review');
const tourDateSelectBox = document.getElementById('tour-date-select');
const tourParticipantsSelectBox = document.getElementById(
  'tour-participants-select'
);

//Values

//Delegation
if (mapBox) {
  let locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    signup(name, email, password, confirmPassword);
  });
}

if (forgetPasswordForm) {
  forgetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    document.querySelector('.btn--send-email').textContent = 'Sending...';
    await forgetPassword(email);
    document.getElementById('email').value = '';
    document.querySelector('.btn--send-email').textContent = 'Send';
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    document.querySelector('.btn--reset-password').textContent = 'Updating...';
    await resetPassword(password, confirmPassword);
    document.querySelector('.btn--reset-password').textContent =
      'Update password';
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, confirmPassword },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (reviewForm) {
  ratingStar.forEach((element, index) => {
    element.addEventListener('mouseover', e => {
      for (let i = 0; i <= index; i++) {
        ratingStar[i].classList.add('rating__star--active');
      }
      for (let j = index + 1; j < ratingStar.length; j++) {
        ratingStar[j].classList.remove('rating__star--active');
      }
    });
  });

  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    let btnText = document.querySelector('.post-review').textContent;
    if (btnText === 'Edit') {
      document.getElementById('review-text').removeAttribute('disabled');
      document.querySelector('.post-review').textContent = 'Update';
      return;
    }

    const rating = document.querySelectorAll('.rating__star--active').length;
    const review = document.getElementById('review-text').value;
    const tourId = document
      .getElementById('review-text')
      .getAttribute('data-tour-id');

    if (btnText == 'Update') {
      const reviewId = document
        .getElementById('review-text')
        .getAttribute('data-review-id');
      document.querySelector('.post-review').textContent = 'Updating...';
      await updateReview(tourId, reviewId, review, rating);
      return;
    }

    document.querySelector('.post-review').textContent = 'Posting...';
    await createReview(tourId, review, rating);
    document.querySelector('.post-review').textContent = 'Post';
  });
}

if (deleteReviewEl) {
  deleteReviewEl.forEach((element, index) => {
    element.addEventListener('click', async e => {
      const reviewId = element.dataset.reviewId;
      const parentNode = element.parentNode;
      parentNode.removeChild(element);
      parentNode.querySelector('.loading').classList.add('spinning');
      console.log(parentNode);

      await deleteReview(reviewId);
    });
  });
}

if (callBookBtn)
  callBookBtn.addEventListener('click', e => {
    const { tourId } = e.target.dataset;

    let modal = document.getElementById('myModal');
    modal.style.display = 'block';

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('close')[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = 'none';
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };

    // bookTour(tourId);
  });

if (tourDateSelectBox) {
  tourDateSelectBox.addEventListener('change', e => {
    const { tour } = JSON.parse(tourDateSelectBox.dataset.tour);
    const { value: dateId } = JSON.parse(tourDateSelectBox.value);
    const { ...tourDate } = tour.startDates.filter(
      dateObj => dateObj._id === dateId
    );
    const participants = tourDate[0].participants;
    const { maxGroupSize } = tour;
    const remainingBook = maxGroupSize - participants;
    let html = ``;

    if (remainingBook < 1) {
      html = `<option disabled>Booking is already full!</option>`;
    } else {
      html = `<option disabled>First Choose Tour Date</option>`;
      for (let index = 1; index <= remainingBook; index++) {
        html += `<option value=${index}>${index}</option>`;
      }
    }

    while (tourParticipantsSelectBox.firstChild) {
      tourParticipantsSelectBox.firstChild.remove();
    }
    tourParticipantsSelectBox.insertAdjacentHTML('beforeend', html);
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', async e => {
    // if (!JSON.parse(tourDateSelectBox.value)) {
    //   return showAlert('error', 'Please Select The Tour Date');
    // }
    // if (!JSON.parse(tourDateSelectBox.value)) {
    //   return showAlert('error', 'Please Select The Participants Number');
    // }
    try {
      const { value: dateId } = JSON.parse(tourDateSelectBox.value);
      const participants = tourParticipantsSelectBox.value;
      const { tour } = JSON.parse(tourDateSelectBox.dataset.tour);
      const tourId = tour._id;
      console.log(dateId);
      bookBtn.textContent = 'Booking...';
      await bookTour(tourId, dateId, participants);
    } catch (error) {
      return showAlert(
        'error',
        'Please Select The Tour Date And The Participants Numbers '
      );
    }
  });
}
