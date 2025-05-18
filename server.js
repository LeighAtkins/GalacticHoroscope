// Express server for Galactic Horoscope application
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Define MIME types for 3D model files
express.static.mime.define({
  'model/obj': ['obj'],
  'application/octet-stream': ['mtl']
});

// Middleware
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  // Only log API requests
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Params:`, req.params, 'Query:', req.query);
    
    // Log response status on completion
    const originalEnd = res.end;
    res.end = function(...args) {
      console.log(`[${new Date().toISOString()}] Response ${req.method} ${req.path}: ${res.statusCode}`);
      return originalEnd.apply(this, args);
    };
  }
  next();
});

// More permissive CORS middleware to fix cross-origin issues
app.use((req, res, next) => {
  // Set headers to allow all origins - most permissive approach for development
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '3600');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  
  next();
});

// Serve static files from the public directory
app.use(express.static('public', {
  extensions: ['html', 'htm'],
  setHeaders: (res, path, stat) => {
    // Set appropriate headers for OBJ files
    if (path.endsWith('.obj')) {
      res.set('Content-Type', 'model/obj');
    }
  }
}));

// Check if models directory exists and has content
const modelsPath = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(modelsPath)) {
  console.error('ERROR: The models directory does not exist at:', modelsPath);
  console.error('Please create it and add .obj model files for the zodiac signs.');
} else {
  console.log('Models directory:', modelsPath);
  
  // List available models
  try {
    const modelFiles = fs.readdirSync(modelsPath)
      .filter(file => file.endsWith('.obj'))
      .map(file => file.replace('.obj', ''));
      
    if (modelFiles.length === 0) {
      console.error('No .obj model files found in the models directory.');
      console.error('Please add model files named after each zodiac sign (e.g., aries.obj)');
    } else {
      console.log('Available models:', modelFiles.join(', '));
    }
  } catch (error) {
    console.error('Error reading models directory:', error);
  }
}

// Zodiac sign data - used for API responses
const zodiacSigns = [
  { 
    name: 'Aries', 
    symbol: '♈', 
    dates: 'March 21 - April 19',
    element: 'Fire',
    rulingPlanet: 'Mars',
    traits: ['Courageous', 'Determined', 'Passionate', 'Confident', 'Enthusiastic'],
    dailyReading: 'Today is perfect for starting new projects. Your natural leadership will shine through, especially in group settings.'
  },
  { 
    name: 'Taurus', 
    symbol: '♉', 
    dates: 'April 20 - May 20',
    element: 'Earth',
    rulingPlanet: 'Venus',
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Responsible'],
    dailyReading: 'Focus on financial planning today. Your practical approach to life will help you make sound long-term decisions.'
  },
  { 
    name: 'Gemini', 
    symbol: '♊', 
    dates: 'May 21 - June 20',
    element: 'Air',
    rulingPlanet: 'Mercury',
    traits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Quick-witted'],
    dailyReading: 'Communication channels are open wide. Your natural charm will help you connect with someone special today.'
  },
  { 
    name: 'Cancer', 
    symbol: '♋', 
    dates: 'June 21 - July 22',
    element: 'Water',
    rulingPlanet: 'Moon',
    traits: ['Tenacious', 'Highly Imaginative', 'Loyal', 'Emotional', 'Sympathetic'],
    dailyReading: 'Home and family matters take center stage. Trust your intuition when making decisions about your living space.'
  },
  { 
    name: 'Leo', 
    symbol: '♌', 
    dates: 'July 23 - August 22',
    element: 'Fire',
    rulingPlanet: 'Sun',
    traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful'],
    dailyReading: 'Your creative energy is at a peak. Take time to express yourself through art or performance today.'
  },
  { 
    name: 'Virgo', 
    symbol: '♍', 
    dates: 'August 23 - September 22',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    traits: ['Analytical', 'Practical', 'Diligent', 'Perfectionist', 'Shy'],
    dailyReading: 'Your attention to detail will be appreciated at work. Consider organizing your space for maximum productivity.'
  },
  { 
    name: 'Libra', 
    symbol: '♎', 
    dates: 'September 23 - October 22',
    element: 'Air',
    rulingPlanet: 'Venus',
    traits: ['Diplomatic', 'Fair', 'Social', 'Cooperative', 'Gracious'],
    dailyReading: 'Balance in relationships is key today. Your natural diplomacy will help resolve a conflict between friends.'
  },
  { 
    name: 'Scorpio', 
    symbol: '♏', 
    dates: 'October 23 - November 21',
    element: 'Water',
    rulingPlanet: 'Pluto, Mars',
    traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn', 'Mysterious'],
    dailyReading: 'Your intuition is especially strong. Pay attention to subtle clues in your interactions with others.'
  },
  { 
    name: 'Sagittarius', 
    symbol: '♐', 
    dates: 'November 22 - December 21',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    traits: ['Generous', 'Idealistic', 'Humorous', 'Adventurous', 'Enthusiastic'],
    dailyReading: 'Expand your horizons through learning or travel. A spontaneous adventure could lead to valuable insights.'
  },
  { 
    name: 'Capricorn', 
    symbol: '♑', 
    dates: 'December 22 - January 19',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    traits: ['Responsible', 'Disciplined', 'Self-controlled', 'Practical', 'Patient'],
    dailyReading: 'Career goals are highlighted today. Your natural discipline will help you make significant progress on a major project.'
  },
  { 
    name: 'Aquarius', 
    symbol: '♒', 
    dates: 'January 20 - February 18',
    element: 'Air',
    rulingPlanet: 'Uranus, Saturn',
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual'],
    dailyReading: 'Your innovative ideas will be well-received. Consider joining a group or community focused on positive change.'
  },
  { 
    name: 'Pisces', 
    symbol: '♓', 
    dates: 'February 19 - March 20',
    element: 'Water',
    rulingPlanet: 'Neptune, Jupiter',
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
    dailyReading: 'Your creativity and empathy are heightened today. Make time for artistic pursuits or helping someone in need.'
  }
];

// API endpoint to get information about a specific zodiac sign
app.get('/api/signs/:sign', (req, res) => {
  const requestedSign = req.params.sign.toLowerCase();
  
  console.log(`API request for sign: "${requestedSign}"`);
  
  if (!requestedSign || requestedSign.trim() === '') {
    return res.status(400).json({
      status: 'error',
      error: true,
      message: 'Missing sign parameter',
      suggestion: 'Use format: /api/signs/aries (where "aries" is the zodiac sign name)'
    });
  }
  
  // Try to find sign by name or alias match
  console.log(`Looking for sign match for: "${requestedSign}"`);
  
  // First try exact match by name
  let sign = zodiacSigns.find(s => s.name.toLowerCase() === requestedSign);
  
  // If not found, try exact match by lowercase name to handle case sensitivity
  if (!sign) {
    sign = zodiacSigns.find(s => s.name.toLowerCase() === requestedSign);
  }
  
  // If not found, try partial match at beginning of name
  if (!sign) {
    sign = zodiacSigns.find(s => s.name.toLowerCase().startsWith(requestedSign));
    if (sign) {
      console.log(`Found partial match: "${requestedSign}" -> "${sign.name}"`);
    }
  }
  
  // If still not found, check if it's a misspelling using levenshtein distance
  if (!sign) {
    // Get closest match for suggestion
    const validSigns = zodiacSigns.map(s => s.name.toLowerCase());
    const closestMatch = findClosestMatch(requestedSign, validSigns);
    
    if (closestMatch) {
      console.log(`Using fuzzy match: "${requestedSign}" -> "${closestMatch}"`);
      sign = zodiacSigns.find(s => s.name.toLowerCase() === closestMatch);
    }
  }
  
  if (!sign) {
    console.error(`Sign "${requestedSign}" not found in API request`);
    
    // Get closest match for suggestion
    const validSigns = zodiacSigns.map(s => s.name.toLowerCase());
    const closestMatch = findClosestMatch(requestedSign, validSigns);
    
    return res.status(404).json({ 
      status: 'error',
      error: true, 
      message: `Sign "${requestedSign}" not found`,
      suggestion: closestMatch ? `Did you mean "${closestMatch}"?` : null,
      valid_signs: validSigns
    });
  }
  
  console.log(`Serving data for sign: ${sign.name}`);
  
  // Return sign data with consistent response format
  res.json({
    status: 'success',
    data: {
      name: sign.name,
      symbol: sign.symbol,
      dates: sign.dates,
      element: sign.element,
      rulingPlanet: sign.rulingPlanet,
      traits: sign.traits,
      dailyReading: sign.dailyReading
    }
  });
});

// API endpoint to get a horoscope based on birth date
app.get('/api/horoscope', validateDateParameters, (req, res) => {
  // Use validated params from middleware
  const { month, day } = req.validatedParams;
  
  console.log(`Horoscope request for date: ${month}/${day}`);
  
  const sign = determineZodiacSign(month, day);
  
  if (!sign) {
    return res.status(500).json({ 
      status: 'error', 
      error: true,
      message: 'Unable to determine zodiac sign',
      debug_info: { month, day }
    });
  }
  
  // Get the sign data for additional info
  const signData = getZodiacSignData(sign.name);
  
  // Generate fortune
  const fortuneText = generateFortune(sign);
  const dateRange = getSignDateRange(sign.name);
  
  // Extract insight and cosmic number from the generated fortune
  let insight = "Trust your intuition to guide your path.";
  let cosmicNumber = Math.floor(Math.random() * 99) + 1;
  
  // Try to extract insight and cosmic number from the fortune text
  const fortuneLines = fortuneText.split('\n');
  for (const line of fortuneLines) {
    if (line.startsWith('✨ Special Insight:')) {
      insight = line.replace('✨ Special Insight:', '').trim();
    } else if (line.startsWith('🔮 Your cosmic number:')) {
      const match = line.match(/(\d+)/);
      if (match && match[1]) {
        cosmicNumber = parseInt(match[1]);
      }
    }
  }
  
  // Return in the format {status: 'success', data: {...}} which seems to be what the client expects
  res.json({
    status: 'success',
    data: {
      sign: {
        name: sign.name,
        symbol: sign.symbol,
        period: dateRange,
        dates: dateRange,
        element: signData ? signData.element : '',
        rulingPlanet: signData ? signData.rulingPlanet : ''
      },
      fortune: fortuneText,
      insight: insight,
      cosmicNumber: cosmicNumber,
      date: new Date().toISOString().split('T')[0]
    }
  });
});

// Fallback route for all other requests to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at:
  - http://localhost:${PORT}/api/signs/:sign
  - http://localhost:${PORT}/api/horoscope?month=1&day=15`);
});

// Helper functions

// Function to list available models
function listAvailableModels() {
  try {
    return fs.readdirSync(modelsPath)
      .filter(file => file.endsWith('.obj'))
      .map(file => file.replace('.obj', ''));
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}

// Validate date input
function isValidDate(month, day) {
  if (month < 1 || month > 12) return false;
  
  // Check days in month (including February leap year max)
  const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= daysInMonth[month];
}

// Determine zodiac sign from birth date
function determineZodiacSign(month, day) {
  // Convert month and day to lowercase strings for easy comparison
  const signs = [
    { name: 'Capricorn', symbol: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { name: 'Aquarius', symbol: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { name: 'Pisces', symbol: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { name: 'Aries', symbol: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { name: 'Taurus', symbol: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { name: 'Gemini', symbol: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { name: 'Cancer', symbol: '♋', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { name: 'Leo', symbol: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { name: 'Virgo', symbol: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { name: 'Libra', symbol: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { name: 'Scorpio', symbol: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { name: 'Sagittarius', symbol: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 }
  ];

  // Special case for Capricorn, which spans December to January
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return signs[0]; // Capricorn
  }

  // Check other signs
  for (let i = 1; i < signs.length; i++) {
    const sign = signs[i];
    if ((month === sign.startMonth && day >= sign.startDay) || 
        (month === sign.endMonth && day <= sign.endDay)) {
      return sign;
    }
  }

  // Should never reach here if inputs are valid
  return null;
}

// Get sign date range for display
function getSignDateRange(signName) {
  const sign = zodiacSigns.find(s => s.name.toLowerCase() === signName.toLowerCase());
  return sign ? sign.dates : '';
}

// Generate a fortune for a zodiac sign
function generateFortune(sign) {
  // Fortune templates by category
  const fortuneTemplates = {
    career: [
      "Your career will take an unexpected turn this {timeFrame}, leading to new opportunities.",
      "A colleague will offer valuable insights that will boost your professional growth.",
      "Your hard work will be recognized by someone important in your field.",
      "Now is the perfect time to pursue that project you've been postponing.",
      "Trust your instincts in professional matters—they'll lead you to success."
    ],
    love: [
      "Romance is in the air! Keep your heart open to new possibilities.",
      "An important conversation will strengthen your closest relationship.",
      "Someone from your past may reenter your life with surprising consequences.",
      "Your natural charisma will be especially strong in the coming {timeFrame}.",
      "Take time to nurture your most valued relationships; the effort will be rewarded."
    ],
    health: [
      "Focus on balance in your routine to maintain optimal wellness.",
      "A new approach to your health will yield unexpected benefits.",
      "Listen to your body—it's trying to tell you something important.",
      "The stars suggest this is an excellent time to begin a new wellness practice.",
      "Your energy levels will align perfectly with your ambitions."
    ],
    general: [
      "The universe is aligning to bring you a pleasant surprise.",
      "An unexpected encounter will shift your perspective in a meaningful way.",
      "Your natural talents will shine especially bright in the coming {timeFrame}.",
      "Trust the process—what seems challenging now is preparing you for something greater.",
      "Your intuition is particularly strong right now; let it guide your decisions."
    ]
  };

  const timeFrames = ["week", "month", "season", "year"];
  const intensities = ["slightly", "notably", "significantly", "dramatically", "profoundly"];
  const qualities = ["creativity", "intuition", "discipline", "communication", "leadership", "empathy"];

  // Select random categories
  const categories = Object.keys(fortuneTemplates);
  const selectedCategories = [];
  
  // Ensure we get 2-3 unique categories
  while (selectedCategories.length < Math.floor(Math.random() * 2) + 2) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    if (!selectedCategories.includes(randomCategory)) {
      selectedCategories.push(randomCategory);
    }
  }
  
  // Build a fortune from the selected categories
  let fortune = `🌟 ${sign.name} (${sign.symbol}) Galactic Horoscope 🌟\n\n`;
  
  selectedCategories.forEach(category => {
    // Select a random template from the category
    const templates = fortuneTemplates[category];
    let template = templates[Math.floor(Math.random() * templates.length)];
    
    // Replace placeholder if present
    if (template.includes("{timeFrame}")) {
      const timeFrame = timeFrames[Math.floor(Math.random() * timeFrames.length)];
      template = template.replace("{timeFrame}", timeFrame);
    }
    
    // Add the fortune line to our complete fortune
    fortune += `• ${template}\n`;
  });
  
  // Add a special personalized insight
  const randomIntensity = intensities[Math.floor(Math.random() * intensities.length)];
  const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
  fortune += `\n✨ Special Insight: Your ${randomQuality} will ${randomIntensity} increase in the coming days.\n`;
  
  // Add a cosmic number
  const cosmicNumber = Math.floor(Math.random() * 99) + 1;
  fortune += `\n🔮 Your cosmic number: ${cosmicNumber}\n`;
  
  return fortune;
}

// Get detailed data for a specific zodiac sign
function getZodiacSignData(sign) {
  const signData = zodiacSigns.find(s => s.name.toLowerCase() === sign.toLowerCase());
  
  if (!signData) {
    return null;
  }
  
  return signData;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    status: 'error',
    error: true,
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.error(`404 - API endpoint not found: ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    error: true,
    message: `API endpoint not found: ${req.path}`,
    suggestion: 'Available endpoints are /api/horoscope and /api/signs/:sign'
  });
});

// API input validation middleware
function validateDateParameters(req, res, next) {
  const { month, day } = req.query;
  
  // Check if month and day are provided
  if (!month || !day) {
    return res.status(400).json({
      status: 'error',
      error: true,
      message: 'Missing required parameters',
      required: ['month', 'day'],
      suggestion: 'Use format: /api/horoscope?month=1&day=15'
    });
  }
  
  // Parse and validate parameters
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  if (isNaN(monthNum) || isNaN(dayNum)) {
    return res.status(400).json({
      status: 'error',
      error: true,
      message: 'Month and day must be numbers',
      suggestion: 'Month should be 1-12, day should be 1-31 depending on the month'
    });
  }
  
  if (monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      status: 'error',
      error: true,
      message: 'Invalid month value',
      valid_range: '1-12',
      received: monthNum
    });
  }
  
  if (dayNum < 1 || dayNum > 31) {
    return res.status(400).json({
      status: 'error',
      error: true,
      message: 'Invalid day value',
      valid_range: '1-31 (depending on month)',
      received: dayNum
    });
  }
  
  // Validate days in month
  if (!isValidDate(monthNum, dayNum)) {
    // Get month name for nicer error message
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    return res.status(400).json({
      status: 'error',
      error: true,
      message: `Invalid date: ${monthNames[monthNum]} ${dayNum}`,
      suggestion: `${monthNames[monthNum]} has ${
        monthNum === 2 ? '28 days (29 in leap years)' : 
        [4, 6, 9, 11].includes(monthNum) ? '30 days' : '31 days'
      }`
    });
  }
  
  // Store validated parameters and continue
  req.validatedParams = {
    month: monthNum,
    day: dayNum
  };
  
  next();
}

// Helper function to find closest match for typos
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

// Implementation of Levenshtein distance for fuzzy matching
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