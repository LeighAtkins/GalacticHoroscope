import * as readline from 'readline';
import { isValid, isLeapYear, parse, isDate, format } from 'date-fns';

/**
 * Interface for date input components
 */
export interface DateInput {
  month: number;
  day: number;
  year?: number;
}

/**
 * Interface for input validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  value?: any;
}

/**
 * Class for handling user input for dates
 */
export class InputHandler {
  private rl: readline.Interface;
  
  /**
   * Constructor for InputHandler
   * @param options Optional options for creating the readline interface
   */
  constructor(options?: {
    input?: NodeJS.ReadableStream,
    output?: NodeJS.WritableStream
  }) {
    this.rl = readline.createInterface({
      input: options?.input || process.stdin,
      output: options?.output || process.stdout
    });
  }

  /**
   * Display help text for date input
   */
  showHelp(): void {
    console.log("\n📅 Date Input Help 📅");
    console.log("======================");
    console.log("Month: Enter a number between 1-12");
    console.log("Day: Enter a number between 1-31 (depending on the month)");
    console.log("Year: Optional. Enter a 4-digit year (e.g., 1990)");
    console.log("======================\n");
  }

  /**
   * Ask for a single value with validation
   * @param question The question to ask
   * @param validator Function to validate the input
   * @returns Promise that resolves with the validated input
   */
  private async askForValue(
    question: string,
    validator: (input: string) => ValidationResult
  ): Promise<any> {
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
   * Validate month input
   * @param input The month input string
   * @returns Validation result
   */
  validateMonth(input: string): ValidationResult {
    const month = parseInt(input, 10);
    
    if (isNaN(month)) {
      return {
        isValid: false,
        errorMessage: "Month must be a number. Please enter a number between 1 and 12."
      };
    }
    
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
   * @param input The day input string
   * @param month The month value
   * @param year Optional year value
   * @returns Validation result
   */
  validateDay(input: string, month: number, year?: number): ValidationResult {
    const day = parseInt(input, 10);
    
    if (isNaN(day)) {
      return {
        isValid: false,
        errorMessage: "Day must be a number."
      };
    }
    
    // Get the maximum days for the given month
    const date = new Date(year || 2020, month - 1, day); // Use leap year as default if year not provided
    
    // First check basic range
    if (day < 1 || day > 31) {
      return {
        isValid: false,
        errorMessage: "Day must be between 1 and 31."
      };
    }
    
    // Then check if the date is valid for the specific month
    if (!isValid(date)) {
      return {
        isValid: false,
        errorMessage: `Invalid day for ${month}/${year || 'any year'}. Please check the number of days in this month.`
      };
    }
    
    return {
      isValid: true,
      value: day
    };
  }

  /**
   * Validate year input
   * @param input The year input string
   * @returns Validation result
   */
  validateYear(input: string): ValidationResult {
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
    
    // Basic validation for reasonable year range
    if (year < 1 || year > 9999) {
      return {
        isValid: false,
        errorMessage: "Year must be between 1 and 9999."
      };
    }
    
    return {
      isValid: true,
      value: year
    };
  }

  /**
   * Ask for date input interactively
   * @returns Promise that resolves to a DateInput object
   */
  async askForDate(): Promise<DateInput> {
    console.log("\n🌌✨ Enter Your Birth Date ✨🌌\n");
    
    // Ask for month
    const month = await this.askForValue(
      "Enter your birth month (1-12): ",
      (input) => this.validateMonth(input)
    );
    
    // Ask for day
    const day = await this.askForValue(
      "Enter your birth day (1-31): ",
      (input) => this.validateDay(input, month)
    );
    
    // Ask for year (optional)
    const year = await this.askForValue(
      "Enter your birth year (optional, press Enter to skip): ",
      (input) => this.validateYear(input)
    );
    
    return { month, day, year };
  }

  /**
   * Close the readline interface
   */
  close(): void {
    this.rl.close();
  }
}

/**
 * Create and return a new InputHandler instance
 * @param options Optional readline interface options
 * @returns New InputHandler instance
 */
export function createInputHandler(options?: {
  input?: NodeJS.ReadableStream,
  output?: NodeJS.WritableStream
}): InputHandler {
  return new InputHandler(options);
} 