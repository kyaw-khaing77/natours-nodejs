const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) Get the data,for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  //Checking user is booking or not

  let booking = '';
  let review = '';

  if (res.locals.user) {
    booking = await Booking.find({
      user: res.locals.user.id,
      tour: tour.id
    });

    review = await Review.find({
      user: res.locals.user.id,
      tour: tour.id
    });
  }

  //2)Build template
  //3)Render that template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    booking,
    review
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up your account'
  });
};

exports.getForgetPasswordForm = (req, res) => {
  res.status(200).render('forgetPassword', {
    title: 'Enter your email address'
  });
};

exports.getResetPasswordForm = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Create New Password'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // 1) Find all Reviews
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour'
  });

  res.status(200).render('all_reviews', {
    title: 'My Reviews',
    reviews,
    myReviews: true
  });
});

exports.getAllReviewsForTour = catchAsync(async (req, res, next) => {
  // 1) Find all Reviews
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  res.status(200).render('all_reviews', {
    title: 'Tour Reviews',
    reviews: tour.reviews
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
