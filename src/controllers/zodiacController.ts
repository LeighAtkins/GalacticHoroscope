import { Request, Response, NextFunction } from 'express';
import { determineZodiacSign, generateFortune, isValidDate } from '../zodiac';
import { ApiError } from '../middleware/errorHandler';

/**
 * Get zodiac sign by birth date
 * @route GET /api/zodiac
 */
export const getZodiacSign = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, day } = req.query;
    
    // Parse month and day to numbers
    const monthNum = parseInt(month as string, 10);
    const dayNum = parseInt(day as string, 10);
    
    // Validate date
    if (!isValidDate(monthNum, dayNum)) {
      const error: ApiError = new Error('Invalid date');
      error.statusCode = 400;
      return next(error);
    }
    
    // Determine zodiac sign
    const sign = determineZodiacSign(monthNum, dayNum);
    
    if (!sign) {
      const error: ApiError = new Error('Unable to determine zodiac sign');
      error.statusCode = 400;
      return next(error);
    }
    
    res.json({
      status: 'success',
      data: {
        sign: {
          name: sign.name,
          symbol: sign.symbol,
          period: `${sign.start.month}/${sign.start.day} - ${sign.end.month}/${sign.end.day}`
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get fortune by zodiac sign
 * @route GET /api/fortune
 */
export const getFortune = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, day } = req.query;
    
    // Parse month and day to numbers
    const monthNum = parseInt(month as string, 10);
    const dayNum = parseInt(day as string, 10);
    
    // Validate date
    if (!isValidDate(monthNum, dayNum)) {
      const error: ApiError = new Error('Invalid date');
      error.statusCode = 400;
      return next(error);
    }
    
    // Determine zodiac sign
    const sign = determineZodiacSign(monthNum, dayNum);
    
    if (!sign) {
      const error: ApiError = new Error('Unable to determine zodiac sign');
      error.statusCode = 400;
      return next(error);
    }
    
    // Generate fortune
    const fortune = generateFortune(sign);
    
    res.json({
      status: 'success',
      data: {
        sign: {
          name: sign.name,
          symbol: sign.symbol
        },
        fortune
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get zodiac sign and fortune in one request
 * @route GET /api/horoscope
 */
export const getHoroscope = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, day } = req.query;
    
    // Parse month and day to numbers
    const monthNum = parseInt(month as string, 10);
    const dayNum = parseInt(day as string, 10);
    
    // Validate date
    if (!isValidDate(monthNum, dayNum)) {
      const error: ApiError = new Error('Invalid date');
      error.statusCode = 400;
      return next(error);
    }
    
    // Determine zodiac sign
    const sign = determineZodiacSign(monthNum, dayNum);
    
    if (!sign) {
      const error: ApiError = new Error('Unable to determine zodiac sign');
      error.statusCode = 400;
      return next(error);
    }
    
    // Generate fortune
    const fortune = generateFortune(sign);
    
    res.json({
      status: 'success',
      data: {
        birthDate: {
          month: monthNum,
          day: dayNum
        },
        sign: {
          name: sign.name,
          symbol: sign.symbol,
          period: `${sign.start.month}/${sign.start.day} - ${sign.end.month}/${sign.end.day}`
        },
        fortune
      }
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getZodiacSign,
  getFortune,
  getHoroscope
}; 