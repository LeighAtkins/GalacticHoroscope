const express = require('express');
const { query } = require('express-validator');
const zodiacController = require('../controllers/zodiacController');
const validate = require('../middleware/validator');

const router = express.Router();

/**
 * Common validations for month and day parameters
 */
const dateValidations = [
  query('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be an integer between 1 and 12'),
  query('day')
    .isInt({ min: 1, max: 31 })
    .withMessage('Day must be an integer between 1 and 31'),
];

/**
 * @route GET /zodiac
 * @desc Get zodiac sign information by birth date
 * @access Public
 */
router.get('/zodiac', validate(dateValidations), zodiacController.getZodiacSign);

/**
 * @route GET /fortune
 * @desc Get fortune information by birth date
 * @access Public
 */
router.get('/fortune', validate(dateValidations), zodiacController.getFortune);

/**
 * @route GET /horoscope
 * @desc Get complete horoscope including zodiac sign and fortune by birth date
 * @access Public
 */
router.get('/horoscope', validate(dateValidations), zodiacController.getHoroscope);

/**
 * @route GET /signs/:sign
 * @desc Get information about a specific zodiac sign by name
 * @access Public
 */
router.get('/signs/:sign', zodiacController.getSignByName);

module.exports = router; 