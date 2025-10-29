const express = require('express');
const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator
} = require('../utils/validators/userValidator');

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggegUserData,
  updateLoggedUserData,
  deactivateLoggedUser
} = require('../services/userService');

const authService = require('../services/authService');

const router = express.Router();

// Protect all routes
router.use(authService.protect);

// ===== Routes for logged-in user =====
router.get('/getMe', getLoggegUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserValidator, updateLoggedUserData);
router.put('/updateMe', updateLoggedUserValidator,updateLoggedUserData);
router.delete('/deleteMe', deactivateLoggedUser);

// ===== Admin / Manager only =====

// Change user password (admin/manager)
router.put(
  '/changePassword/:id',
  authService.allowTo('admin', 'manager'),
  changeUserPasswordValidator,
  changeUserPassword
);

// Get all users (admin/manager)
router.get(
  '/',
  authService.allowTo('admin', 'manager'),
  getUsers
);

// Create user (admin only)
router.post(
  '/',
  authService.allowTo('admin'),
  uploadUserImage,
  resizeImage,
  createUserValidator,
  createUser
);

// Get specific user (admin/manager)
router.get(
  '/:id',
  authService.allowTo('admin', 'manager'),
  getUserValidator,
  getUser
);

// Update user (admin only)
router.put(
  '/:id',
  authService.allowTo('admin'),
  uploadUserImage,
  resizeImage,
  updateUserValidator,
  updateUser
);

// Delete user (admin only)
router.delete(
  '/:id',
  authService.allowTo('admin'),
  deleteUserValidator,
  deleteUser
);

module.exports = router;
