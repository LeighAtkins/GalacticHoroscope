// Galactic Horoscope - Star Sign and Fortune Generator
const { createInputHandler } = require('./inputHandler');

// Extended zodiac sign definitions with more details
const zodiacSigns = [
  { 
    name: 'Capricorn', 
    symbol: '♑', 
    start: { month: 12, day: 22 }, 
    end: { month: 1, day: 19 },
    element: 'Earth',
    rulingPlanet: 'Saturn',
    traits: ['Responsible', 'Disciplined', 'Self-controlled', 'Practical', 'Patient']
  },
  { 
    name: 'Aquarius', 
    symbol: '♒', 
    start: { month: 1, day: 20 }, 
    end: { month: 2, day: 18 },
    element: 'Air',
    rulingPlanet: 'Uranus, Saturn',
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual']
  },
  { 
    name: 'Pisces', 
    symbol: '♓', 
    start: { month: 2, day: 19 }, 
    end: { month: 3, day: 20 },
    element: 'Water',
    rulingPlanet: 'Neptune, Jupiter',
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise']
  },
  { 
    name: 'Aries', 
    symbol: '♈', 
    start: { month: 3, day: 21 }, 
    end: { month: 4, day: 19 },
    element: 'Fire',
    rulingPlanet: 'Mars',
    traits: ['Courageous', 'Determined', 'Passionate', 'Confident', 'Enthusiastic']
  },
  { 
    name: 'Taurus', 
    symbol: '♉', 
    start: { month: 4, day: 20 }, 
    end: { month: 5, day: 20 },
    element: 'Earth',
    rulingPlanet: 'Venus',
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Responsible']
  },
  { 
    name: 'Gemini', 
    symbol: '♊', 
    start: { month: 5, day: 21 }, 
    end: { month: 6, day: 20 },
    element: 'Air',
    rulingPlanet: 'Mercury',
    traits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Quick-witted']
  },
  { 
    name: 'Cancer', 
    symbol: '♋', 
    start: { month: 6, day: 21 }, 
    end: { month: 7, day: 22 },
    element: 'Water',
    rulingPlanet: 'Moon',
    traits: ['Tenacious', 'Highly Imaginative', 'Loyal', 'Emotional', 'Sympathetic']
  },
  { 
    name: 'Leo', 
    symbol: '♌', 
    start: { month: 7, day: 23 }, 
    end: { month: 8, day: 22 },
    element: 'Fire',
    rulingPlanet: 'Sun',
    traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful']
  },
  { 
    name: 'Virgo', 
    symbol: '♍', 
    start: { month: 8, day: 23 }, 
    end: { month: 9, day: 22 },
    element: 'Earth',
    rulingPlanet: 'Mercury',
    traits: ['Analytical', 'Practical', 'Diligent', 'Perfectionist', 'Shy']
  },
  { 
    name: 'Libra', 
    symbol: '♎', 
    start: { month: 9, day: 23 }, 
    end: { month: 10, day: 22 },
    element: 'Air',
    rulingPlanet: 'Venus',
    traits: ['Diplomatic', 'Fair', 'Social', 'Cooperative', 'Gracious']
  },
  { 
    name: 'Scorpio', 
    symbol: '♏', 
    start: { month: 10, day: 23 }, 
    end: { month: 11, day: 21 },
    element: 'Water',
    rulingPlanet: 'Pluto, Mars',
    traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn', 'Mysterious']
  },
  { 
    name: 'Sagittarius', 
    symbol: '♐', 
    start: { month: 11, day: 22 }, 
    end: { month: 12, day: 21 },
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    traits: ['Generous', 'Idealistic', 'Humorous', 'Adventurous', 'Enthusiastic']
  }
];

// Sign aliases for more flexible lookups
const signAliases = {
  'ari': 'Aries',
  'tau': 'Taurus',
  'gem': 'Gemini',
  'can': 'Cancer',
  'crab': 'Cancer',
  'leo': 'Leo',
  'lion': 'Leo',
  'vir': 'Virgo',
  'lib': 'Libra',
  'scales': 'Libra',
  'sco': 'Scorpio',
  'scorp': 'Scorpio',
  'sag': 'Sagittarius',
  'archer': 'Sagittarius',
  'cap': 'Capricorn',
  'goat': 'Capricorn',
  'aqu': 'Aquarius',
  'water bearer': 'Aquarius',
  'pis': 'Pisces',
  'fish': 'Pisces'
};

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

/**
 * Function to get all zodiac signs
 * @returns {Array} Array of all zodiac signs
 */
function getAllSigns() {
  return zodiacSigns;
}

/**
 * Function to get a sign by name or alias, with case insensitive matching
 * @param {string} nameOrAlias The name or alias to search for
 * @returns {Object|null} The matching zodiac sign or null if not found
 */
function getSignByNameOrAlias(nameOrAlias) {
  if (!nameOrAlias) return null;
  
  const normalizedInput = nameOrAlias.toLowerCase().trim();
  
  // Try direct name match first (case insensitive)
  const directMatch = zodiacSigns.find(sign => 
    sign.name.toLowerCase() === normalizedInput
  );
  
  if (directMatch) return directMatch;
  
  // Try partial name match
  const partialMatch = zodiacSigns.find(sign => 
    sign.name.toLowerCase().startsWith(normalizedInput)
  );
  
  if (partialMatch) return partialMatch;
  
  // Try alias lookup
  const alias = Object.keys(signAliases).find(key => 
    key.toLowerCase() === normalizedInput
  );
  
  if (alias) {
    const aliasName = signAliases[alias];
    return zodiacSigns.find(sign => sign.name === aliasName);
  }
  
  return null;
}

// Function to determine zodiac sign based on birth date
function determineZodiacSign(month, day) {
  // Handle Capricorn's special case (spans December-January)
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return zodiacSigns[0]; // Capricorn
  }
  
  // Check other signs
  for (let i = 1; i < zodiacSigns.length; i++) {
    const sign = zodiacSigns[i];
    if ((month === sign.start.month && day >= sign.start.day) || 
        (month === sign.end.month && day <= sign.end.day)) {
      return sign;
    }
  }
  
  // Fallback (should never reach here if input is valid)
  return null;
}

// Function to generate a random fortune
function generateFortune(sign) {
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

// Function to validate date input
function isValidDate(month, day) {
  if (month < 1 || month > 12) return false;
  
  // Check days in month (simplified version)
  const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= daysInMonth[month];
}

// Main application function
async function startGalacticHoroscope() {
  console.log("\n🌌✨ Welcome to Galactic Horoscope ✨🌌\n");
  console.log("Discover your star sign and receive a personalized cosmic fortune!\n");
  
  // Create input handler
  const inputHandler = createInputHandler();
  
  try {
    // Get date input using the InputHandler
    const { month, day, year } = await inputHandler.askForDate();
    
    // Determine zodiac sign
    const sign = determineZodiacSign(month, day);
    
    if (!sign) {
      console.log("⚠️ Unable to determine your zodiac sign. Please try again.");
      inputHandler.close();
      return startGalacticHoroscope(); // Restart
    }
    
    console.log("\n" + "=".repeat(60));
    console.log(`You were born on ${month}/${day}${year ? "/" + year : ""}`);
    console.log(`Your zodiac sign is ${sign.name} ${sign.symbol}`);
    console.log("=".repeat(60) + "\n");
    
    // Generate and display fortune
    const fortune = generateFortune(sign);
    console.log(fortune);
    
    // Ask if user wants another reading
    const wantsAnotherReading = await inputHandler.askForValue(
      "\nWould you like another reading? (y/n): ",
      (input) => {
        const normalizedInput = input.toLowerCase().trim();
        if (normalizedInput === 'y' || normalizedInput === 'yes' || 
            normalizedInput === 'n' || normalizedInput === 'no') {
          return {
            isValid: true,
            value: normalizedInput === 'y' || normalizedInput === 'yes'
          };
        }
        return {
          isValid: false,
          errorMessage: "Please enter 'y' for yes or 'n' for no."
        };
      }
    );
    
    // Close the input handler
    inputHandler.close();
    
    if (wantsAnotherReading) {
      startGalacticHoroscope(); // Restart
    } else {
      console.log("\nThank you for consulting the stars. May the cosmos guide your journey! ✨\n");
    }
  } catch (error) {
    console.error("Error during horoscope generation:", error);
    inputHandler.close();
    console.log("\nAn error occurred. Please try again.\n");
  }
}

// Export functions for use in other modules
module.exports = {
  startGalacticHoroscope,
  determineZodiacSign,
  generateFortune,
  isValidDate,
  zodiacSigns,
  getAllSigns,
  getSignByNameOrAlias
}; 