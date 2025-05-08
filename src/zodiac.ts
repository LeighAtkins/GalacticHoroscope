// Galactic Horoscope - Star Sign and Fortune Generator
import * as readline from 'readline';
import { format } from 'date-fns';

// Types for zodiac signs and related data
export interface ZodiacSign {
  name: string;
  symbol: string;
  start: { month: number; day: number };
  end: { month: number; day: number };
}

export interface FortuneTemplates {
  [category: string]: string[];
}

// Zodiac sign definitions with date ranges
export const zodiacSigns: ZodiacSign[] = [
  { name: 'Capricorn', symbol: '♑', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { name: 'Aquarius', symbol: '♒', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { name: 'Pisces', symbol: '♓', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
  { name: 'Aries', symbol: '♈', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { name: 'Taurus', symbol: '♉', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { name: 'Gemini', symbol: '♊', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { name: 'Cancer', symbol: '♋', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { name: 'Leo', symbol: '♌', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { name: 'Virgo', symbol: '♍', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { name: 'Libra', symbol: '♎', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { name: 'Scorpio', symbol: '♏', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { name: 'Sagittarius', symbol: '♐', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
];

// Fortune templates by category
export const fortuneTemplates: FortuneTemplates = {
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

export const timeFrames: string[] = ["week", "month", "season", "year"];
export const intensities: string[] = ["slightly", "notably", "significantly", "dramatically", "profoundly"];
export const qualities: string[] = ["creativity", "intuition", "discipline", "communication", "leadership", "empathy"];

/**
 * Determines zodiac sign based on birth date
 * @param month Birth month (1-12)
 * @param day Birth day (1-31)
 * @returns The zodiac sign or null if not found
 */
export function determineZodiacSign(month: number, day: number): ZodiacSign | null {
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

/**
 * Generates a random fortune based on the zodiac sign
 * @param sign The zodiac sign
 * @returns A formatted fortune string
 */
export function generateFortune(sign: ZodiacSign): string {
  // Select random categories
  const categories = Object.keys(fortuneTemplates);
  const selectedCategories: string[] = [];
  
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

/**
 * Validates if a date is valid
 * @param month Month (1-12)
 * @param day Day (1-31, varies by month)
 * @returns Boolean indicating if the date is valid
 */
export function isValidDate(month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  
  // Check days in month (simplified version)
  const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= daysInMonth[month];
}

/**
 * Main application function
 */
export function startGalacticHoroscope(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log("\n🌌✨ Welcome to Galactic Horoscope ✨🌌\n");
  console.log("Discover your star sign and receive a personalized cosmic fortune!\n");
  
  // Ask for birth month
  rl.question("Enter your birth month (1-12): ", (monthInput: string) => {
    const month = parseInt(monthInput, 10);
    
    if (isNaN(month) || month < 1 || month > 12) {
      console.log("⚠️ Invalid month. Please enter a number between 1 and 12.");
      rl.close();
      return startGalacticHoroscope(); // Restart
    }
    
    // Ask for birth day
    rl.question("Enter your birth day (1-31): ", (dayInput: string) => {
      const day = parseInt(dayInput, 10);
      
      if (isNaN(day) || !isValidDate(month, day)) {
        console.log("⚠️ Invalid day for the given month. Please try again.");
        rl.close();
        return startGalacticHoroscope(); // Restart
      }
      
      // Ask for birth year (optional)
      rl.question("Enter your birth year (optional, press Enter to skip): ", (yearInput: string) => {
        // Determine zodiac sign
        const sign = determineZodiacSign(month, day);
        
        if (!sign) {
          console.log("⚠️ Unable to determine your zodiac sign. Please try again.");
          rl.close();
          return startGalacticHoroscope(); // Restart
        }
        
        console.log("\n" + "=".repeat(60));
        console.log(`You were born on ${month}/${day}${yearInput ? "/" + yearInput : ""}`);
        console.log(`Your zodiac sign is ${sign.name} ${sign.symbol}`);
        console.log("=".repeat(60) + "\n");
        
        // Generate and display fortune
        const fortune = generateFortune(sign);
        console.log(fortune);
        
        // Ask if user wants another reading
        rl.question("\nWould you like another reading? (y/n): ", (answer: string) => {
          rl.close();
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            startGalacticHoroscope(); // Restart
          } else {
            console.log("\nThank you for consulting the stars. May the cosmos guide your journey! ✨\n");
          }
        });
      });
    });
  });
} 