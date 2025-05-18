const { determineZodiacSign, generateFortune, isValidDate, getAllSigns, getSignByNameOrAlias } = require('../zodiac');

/**
 * Get zodiac sign by birth date
 * @route GET /api/zodiac
 */
const getZodiacSign = (req, res, next) => {
  try {
    const { month, day } = req.query;
    
    // Parse month and day to numbers
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    
    // Validate date
    if (!isValidDate(monthNum, dayNum)) {
      const error = new Error('Invalid date');
      error.statusCode = 400;
      return next(error);
    }
    
    // Determine zodiac sign
    const sign = determineZodiacSign(monthNum, dayNum);
    
    if (!sign) {
      const error = new Error('Unable to determine zodiac sign');
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
const getFortune = (req, res, next) => {
  try {
    const { month, day } = req.query;
    
    // Parse month and day to numbers
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    
    // Validate date
    if (!isValidDate(monthNum, dayNum)) {
      const error = new Error('Invalid date');
      error.statusCode = 400;
      return next(error);
    }
    
    // Determine zodiac sign
    const sign = determineZodiacSign(monthNum, dayNum);
    
    if (!sign) {
      const error = new Error('Unable to determine zodiac sign');
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
const getHoroscope = (req, res, next) => {
  try {
    const { month, day } = req.query;
    
    // Parse month and day to numbers
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    
    // Validate date
    if (!isValidDate(monthNum, dayNum)) {
      const error = new Error('Invalid date');
      error.statusCode = 400;
      return next(error);
    }
    
    // Determine zodiac sign
    const sign = determineZodiacSign(monthNum, dayNum);
    
    if (!sign) {
      const error = new Error('Unable to determine zodiac sign');
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

/**
 * Get information about a specific zodiac sign by name
 * @route GET /api/signs/:sign
 */
const getSignByName = (req, res, next) => {
  try {
    const signName = req.params.sign.toLowerCase();
    
    // Get sign by name or alias
    const sign = getSignByNameOrAlias(signName);
    
    if (!sign) {
      // Find closest match for suggestion
      const allSigns = getAllSigns().map(s => s.name.toLowerCase());
      const closestMatch = findClosestMatch(signName, allSigns);
      
      const error = new Error(`Sign "${signName}" not found`);
      error.statusCode = 404;
      error.suggestion = closestMatch ? `Did you mean "${closestMatch}"?` : null;
      error.validSigns = allSigns;
      return next(error);
    }
    
    // Format response
    res.json({
      status: 'success',
      data: {
        name: sign.name,
        symbol: sign.symbol,
        dates: `${sign.start.month}/${sign.start.day} - ${sign.end.month}/${sign.end.day}`,
        element: sign.element,
        rulingPlanet: sign.rulingPlanet,
        traits: sign.traits
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper function to find closest match using Levenshtein distance
 */
function findClosestMatch(input, validOptions) {
  if (!input || validOptions.length === 0) return null;
  
  let closestMatch = null;
  let lowestDistance = Infinity;
  
  for (const option of validOptions) {
    const distance = levenshteinDistance(input, option);
    if (distance < lowestDistance) {
      lowestDistance = distance;
      closestMatch = option;
    }
  }
  
  // Only suggest if the distance is reasonable (e.g., a simple typo)
  return lowestDistance <= 3 ? closestMatch : null;
}

/**
 * Implementation of Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Create a matrix of size (m+1) x (n+1)
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize the matrix
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }
  
  return dp[m][n];
}

module.exports = {
  getZodiacSign,
  getFortune,
  getHoroscope,
  getSignByName
}; 