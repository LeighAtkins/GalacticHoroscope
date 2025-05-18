const readline = require('readline');
const { isValid, parse, isLeapYear } = require('date-fns');

// Month names and abbreviations for parsing
const MONTH_NAMES = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12
};

/**
 * Class for handling user input for dates
 */
class InputHandler {
  /**
   * Constructor for InputHandler
   * @param {Object} options Optional options for creating the readline interface
   * @param {NodeJS.ReadableStream} options.input Input stream (defaults to process.stdin)
   * @param {NodeJS.WritableStream} options.output Output stream (defaults to process.stdout)
   */
  constructor(options = {}) {
    this.rl = readline.createInterface({
      input: options.input || process.stdin,
      output: options.output || process.stdout
    });
  }

  /**
   * Display help text for date input
   */
  showHelp() {
    console.log("\n📅 Date Input Help 📅");
    console.log("======================");
    console.log("Supported date formats:");
    console.log("- MM/DD/YYYY (e.g., 12/25/1990)");
    console.log("- DD/MM/YYYY (e.g., 25/12/1990)");
    console.log("- YYYY-MM-DD (e.g., 1990-12-25)");
    console.log("- Month DD, YYYY (e.g., December 25, 1990)");
    console.log("- DD Month YYYY (e.g., 25 December 1990)");
    console.log("\nYou can also enter individual components:");
    console.log("Month: Enter a number (1-12) or name (January)");
    console.log("Day: Enter a number between 1-31 (depending on the month)");
    console.log("Year: Optional. Enter a 2 or 4-digit year");
    console.log("======================\n");
  }

  /**
   * Ask for a single value with validation
   * @param {string} question The question to ask
   * @param {Function} validator Function to validate the input
   * @returns {Promise<any>} Promise that resolves with the validated input
   */
  async askForValue(question, validator) {
    return new Promise((resolve) => {
      this.rl.question(question, (input) => {
        const result = validator(input);
        
        if (result.isValid) {
          resolve(result.value);
        } else {
          console.log(`⚠️ ${result.errorMessage}`);
          // Recursively ask again if validation fails
          resolve(this.askForValue(question, validator));
        }
      });
    });
  }

  /**
   * Parses a date string in various formats
   * @param {string} dateString The date string to parse
   * @returns {Object|null} Parsed date object or null if invalid
   */
  parseDate(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      return null;
    }

    // Normalize input by trimming whitespace and converting to lowercase
    const input = dateString.trim().toLowerCase();
    
    if (input === '') {
      return null;
    }

    // Try to match common date formats
    let result = null;

    // Check for ISO format: YYYY-MM-DD
    const isoMatch = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoMatch) {
      const [_, year, month, day] = isoMatch;
      result = {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10)
      };
    }

    // Check for MM/DD/YYYY or MM-DD-YYYY (US format)
    const usMatch = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (!result && usMatch) {
      const [_, month, day, yearStr] = usMatch;
      // Handle 2-digit years (convert to 4 digits)
      let year = parseInt(yearStr, 10);
      if (year < 100) {
        // Assume years 00-49 are 2000s, 50-99 are 1900s
        year = year < 50 ? 2000 + year : 1900 + year;
      }
      result = {
        year,
        month: parseInt(month, 10),
        day: parseInt(day, 10)
      };
    }

    // Check for DD/MM/YYYY or DD-MM-YYYY (European format)
    const euMatch = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (!result && euMatch) {
      const [_, day, month, yearStr] = euMatch;
      // Validate day/month ordering by checking if month value is ≤ 12
      const monthVal = parseInt(month, 10);
      if (monthVal <= 12) {
        // Handle 2-digit years (convert to 4 digits)
        let year = parseInt(yearStr, 10);
        if (year < 100) {
          // Assume years 00-49 are 2000s, 50-99 are 1900s
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        result = {
          year,
          month: monthVal,
          day: parseInt(day, 10)
        };
      }
    }

    // Check for Month DD, YYYY format (e.g., "December 25, 1990" or "Dec 25 1990")
    const monthNameMatch = input.match(/^([a-z]+)\s+(\d{1,2})(?:[,\s]+)?(\d{2,4})?$/);
    if (!result && monthNameMatch) {
      const [_, monthName, day, yearStr] = monthNameMatch;
      const monthNumber = MONTH_NAMES[monthName];
      
      if (monthNumber) {
        // Handle optional year
        let year = yearStr ? parseInt(yearStr, 10) : undefined;
        // Handle 2-digit years if present
        if (year && year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        
        result = {
          year,
          month: monthNumber,
          day: parseInt(day, 10)
        };
      }
    }

    // Check for DD Month YYYY format (e.g., "25 December 1990" or "25 Dec 1990")
    const dayMonthMatch = input.match(/^(\d{1,2})\s+([a-z]+)(?:[,\s]+)?(\d{2,4})?$/);
    if (!result && dayMonthMatch) {
      const [_, day, monthName, yearStr] = dayMonthMatch;
      const monthNumber = MONTH_NAMES[monthName];
      
      if (monthNumber) {
        // Handle optional year
        let year = yearStr ? parseInt(yearStr, 10) : undefined;
        // Handle 2-digit years if present
        if (year && year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        
        result = {
          year,
          month: monthNumber,
          day: parseInt(day, 10)
        };
      }
    }

    // Check for just a month name or abbreviation
    if (!result && MONTH_NAMES[input]) {
      result = {
        month: MONTH_NAMES[input],
        day: null,
        year: null
      };
    }

    // If we found a valid result, validate the date before returning
    if (result) {
      if (this.isValidDate(result.month, result.day, result.year)) {
        return result;
      }
    }

    return null;
  }

  /**
   * Validates if a date is valid
   * @param {number} month Month (1-12)
   * @param {number} day Day of month
   * @param {number} year Optional year
   * @returns {boolean} Whether the date is valid
   */
  isValidDate(month, day, year) {
    // Check basic ranges
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Days in each month (non-leap year)
    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Adjust February for leap years
    if (year) {
      if (isLeapYear(new Date(year, 0, 1)) && month === 2) {
        daysInMonth[2] = 29;
      }
    } else {
      // If no year is provided, allow February 29 as it could be valid in a leap year
      daysInMonth[2] = 29;
    }
    
    return day <= daysInMonth[month];
  }

  /**
   * Validate month input, supporting both numbers and month names
   * @param {string} input The month input string
   * @returns {Object} Validation result
   */
  validateMonth(input) {
    if (!input || input.trim() === '') {
      return {
        isValid: false,
        errorMessage: "Month cannot be empty. Please enter a number between 1 and 12 or a month name."
      };
    }
    
    input = input.trim().toLowerCase();
    
    // Check if input is a month name or abbreviation
    if (isNaN(parseInt(input, 10))) {
      const monthNum = MONTH_NAMES[input];
      if (monthNum) {
        return {
          isValid: true,
          value: monthNum
        };
      }
      
      return {
        isValid: false,
        errorMessage: "Invalid month name. Please enter a valid month name or number between 1 and 12."
      };
    }
    
    // Handle numeric input
    const month = parseInt(input, 10);
    
    if (month < 1 || month > 12) {
      return {
        isValid: false,
        errorMessage: "Month must be between 1 and 12."
      };
    }
    
    return {
      isValid: true,
      value: month
    };
  }

  /**
   * Validate day input based on month
   * @param {string} input The day input string
   * @param {number} month The month value
   * @param {number} year Optional year value
   * @returns {Object} Validation result
   */
  validateDay(input, month, year) {
    if (!input || input.trim() === '') {
      return {
        isValid: false,
        errorMessage: "Day cannot be empty. Please enter a number."
      };
    }
    
    const day = parseInt(input, 10);
    
    if (isNaN(day)) {
      return {
        isValid: false,
        errorMessage: "Day must be a number."
      };
    }
    
    // First check basic range
    if (day < 1 || day > 31) {
      return {
        isValid: false,
        errorMessage: "Day must be between 1 and 31."
      };
    }
    
    // Check specific month constraints
    if (!this.isValidDate(month, day, year)) {
      // Get month name for better error message
      const monthNames = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"];
      
      return {
        isValid: false,
        errorMessage: `Invalid day for ${monthNames[month-1]}${year ? ` ${year}` : ''}. `+
                      `Please check the number of days in this month.`
      };
    }
    
    return {
      isValid: true,
      value: day
    };
  }

  /**
   * Validate year input
   * @param {string} input The year input string
   * @returns {Object} Validation result
   */
  validateYear(input) {
    // Empty input is valid for year (optional)
    if (input.trim() === '') {
      return {
        isValid: true,
        value: undefined
      };
    }
    
    const year = parseInt(input, 10);
    
    if (isNaN(year)) {
      return {
        isValid: false,
        errorMessage: "Year must be a number."
      };
    }
    
    // Handle 2-digit years
    let fullYear = year;
    if (year >= 0 && year < 100) {
      fullYear = year < 50 ? 2000 + year : 1900 + year;
      console.log(`Interpreted ${year} as ${fullYear}`);
    }
    
    // Basic validation for reasonable year range
    if (fullYear < 1 || fullYear > 9999) {
      return {
        isValid: false,
        errorMessage: "Year must be between 1 and 9999."
      };
    }
    
    return {
      isValid: true,
      value: fullYear
    };
  }

  /**
   * Tries to parse a complete date string first
   * @param {string} input The date input string
   * @returns {Object} Validation result with parsed date or error
   */
  validateFullDate(input) {
    // Try to parse the input as a complete date
    const parsedDate = this.parseDate(input);
    
    if (parsedDate) {
      return {
        isValid: true,
        value: parsedDate
      };
    }
    
    return {
      isValid: false,
      errorMessage: "Could not recognize the date format. Please try again with a different format."
    };
  }

  /**
   * Ask for date input interactively, allowing for full date strings or component entry
   * @returns {Promise<Object>} Promise that resolves to a DateInput object
   */
  async askForDate() {
    console.log("\n🌌✨ Enter Your Birth Date ✨🌌\n");
    console.log("You can enter a full date like '12/25/1990' or 'December 25, 1990'");
    console.log("Or enter each part separately when prompted.");
    console.log("Type 'help' at any prompt for supported date formats.\n");
    
    // First, try to get a complete date
    const fullDateInput = await this.askForValue(
      "Enter your birth date (or press Enter to input parts separately): ",
      (input) => {
        if (input.trim().toLowerCase() === 'help') {
          this.showHelp();
          return {
            isValid: false,
            errorMessage: "Please enter your birth date or press Enter to continue."
          };
        }
        
        // Empty input means user wants to enter parts separately
        if (input.trim() === '') {
          return {
            isValid: true,
            value: null
          };
        }
        
        // Try to parse the full date
        return this.validateFullDate(input);
      }
    );
    
    // If we got a valid full date, use it
    if (fullDateInput) {
      return fullDateInput;
    }
    
    // Otherwise, ask for parts separately
    console.log("\nEntering date parts separately:\n");
    
    // Ask for month
    const month = await this.askForValue(
      "Enter your birth month (1-12 or name): ",
      (input) => {
        if (input.trim().toLowerCase() === 'help') {
          this.showHelp();
          return {
            isValid: false,
            errorMessage: "Please enter your birth month."
          };
        }
        return this.validateMonth(input);
      }
    );
    
    // Ask for day
    const day = await this.askForValue(
      "Enter your birth day (1-31): ",
      (input) => {
        if (input.trim().toLowerCase() === 'help') {
          this.showHelp();
          return {
            isValid: false,
            errorMessage: "Please enter your birth day."
          };
        }
        return this.validateDay(input, month);
      }
    );
    
    // Ask for year (optional)
    const year = await this.askForValue(
      "Enter your birth year (optional, press Enter to skip): ",
      (input) => {
        if (input.trim().toLowerCase() === 'help') {
          this.showHelp();
          return {
            isValid: false,
            errorMessage: "Please enter your birth year or press Enter to skip."
          };
        }
        return this.validateYear(input);
      }
    );
    
    return { month, day, year };
  }

  /**
   * Close the readline interface
   */
  close() {
    this.rl.close();
  }
}

/**
 * Create and return a new InputHandler instance
 * @param {Object} options Optional readline interface options
 * @returns {InputHandler} New InputHandler instance
 */
function createInputHandler(options = {}) {
  return new InputHandler(options);
}

module.exports = {
  InputHandler,
  createInputHandler
}; 