import express from 'express';
import { query } from 'express-validator';
import zodiacController from '../controllers/zodiacController';
import validate from '../middleware/validator';

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

export default router; 