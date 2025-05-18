/**
 * Main application logic for the Galactic Horoscope interface
 * Using ES modules syntax
 */
import { ModelViewer } from './modelViewer.js';
import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { OBJLoader } from './lib/OBJLoader.js';

// Global variables for network status tracking
let lastSuccessfulApiCall = null;
let lastFailedApiCall = null;

// Global zodiac data for offline fallback
const zodiacData = {
    aries: { 
        name: 'Aries', 
        symbol: '♈', 
        dates: 'March 21 - April 19',
        element: 'Fire',
        rulingPlanet: 'Mars',
        traits: ['Courageous', 'Determined', 'Passionate', 'Confident', 'Enthusiastic'],
        dailyReading: 'Today is perfect for starting new projects. Your natural leadership will shine through, especially in group settings.'
    },
    taurus: { 
        name: 'Taurus', 
        symbol: '♉', 
        dates: 'April 20 - May 20',
        element: 'Earth',
        rulingPlanet: 'Venus',
        traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Responsible'],
        dailyReading: 'Focus on financial planning today. Your practical approach to life will help you make sound long-term decisions.'
    },
    gemini: { 
        name: 'Gemini', 
        symbol: '♊', 
        dates: 'May 21 - June 20',
        element: 'Air',
        rulingPlanet: 'Mercury',
        traits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Quick-witted'],
        dailyReading: 'Communication channels are open wide. Your natural charm will help you connect with someone special today.'
    },
    cancer: { 
        name: 'Cancer', 
        symbol: '♋', 
        dates: 'June 21 - July 22',
        element: 'Water',
        rulingPlanet: 'Moon',
        traits: ['Tenacious', 'Highly Imaginative', 'Loyal', 'Emotional', 'Sympathetic'],
        dailyReading: 'Home and family matters take center stage. Trust your intuition when making decisions about your living space.'
    },
    leo: { 
        name: 'Leo', 
        symbol: '♌', 
        dates: 'July 23 - August 22',
        element: 'Fire',
        rulingPlanet: 'Sun',
        traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful'],
        dailyReading: 'Your creative energy is at a peak. Take time to express yourself through art or performance today.'
    },
    virgo: { 
        name: 'Virgo', 
        symbol: '♍', 
        dates: 'August 23 - September 22',
        element: 'Earth',
        rulingPlanet: 'Mercury',
        traits: ['Analytical', 'Practical', 'Diligent', 'Perfectionist', 'Shy'],
        dailyReading: 'Your attention to detail will be appreciated at work. Consider organizing your space for maximum productivity.'
    },
    libra: { 
        name: 'Libra', 
        symbol: '♎', 
        dates: 'September 23 - October 22',
        element: 'Air',
        rulingPlanet: 'Venus',
        traits: ['Diplomatic', 'Fair', 'Social', 'Cooperative', 'Gracious'],
        dailyReading: 'Balance in relationships is key today. Your natural diplomacy will help resolve a conflict between friends.'
    },
    scorpio: { 
        name: 'Scorpio', 
        symbol: '♏', 
        dates: 'October 23 - November 21',
        element: 'Water',
        rulingPlanet: 'Pluto, Mars',
        traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn', 'Mysterious'],
        dailyReading: 'Your intuition is especially strong. Pay attention to subtle clues in your interactions with others.'
    },
    sagittarius: { 
        name: 'Sagittarius', 
        symbol: '♐', 
        dates: 'November 22 - December 21',
        element: 'Fire',
        rulingPlanet: 'Jupiter',
        traits: ['Generous', 'Idealistic', 'Humorous', 'Adventurous', 'Enthusiastic'],
        dailyReading: 'Expand your horizons through learning or travel. A spontaneous adventure could lead to valuable insights.'
    },
    capricorn: { 
        name: 'Capricorn', 
        symbol: '♑', 
        dates: 'December 22 - January 19',
        element: 'Earth',
        rulingPlanet: 'Saturn',
        traits: ['Responsible', 'Disciplined', 'Self-controlled', 'Practical', 'Patient'],
        dailyReading: 'Career goals are highlighted today. Your natural discipline will help you make significant progress on a major project.'
    },
    aquarius: { 
        name: 'Aquarius', 
        symbol: '♒', 
        dates: 'January 20 - February 18',
        element: 'Air',
        rulingPlanet: 'Uranus, Saturn',
        traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual'],
        dailyReading: 'Your innovative ideas will be well-received. Consider joining a group or community focused on positive change.'
    },
    pisces: { 
        name: 'Pisces', 
        symbol: '♓', 
        dates: 'February 19 - March 20',
        element: 'Water',
        rulingPlanet: 'Neptune, Jupiter',
        traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
        dailyReading: 'Your creativity and empathy are heightened today. Make time for artistic pursuits or helping someone in need.'
    }
};

/**
 * Track successful API calls to improve network detection
 */
function recordSuccessfulApiCall() {
  lastSuccessfulApiCall = new Date().toISOString();
  console.log('Recorded successful API call at:', lastSuccessfulApiCall);
}

/**
 * Track failed API calls to improve network detection
 */
function recordFailedApiCall() {
  lastFailedApiCall = new Date().toISOString();
  console.log('Recorded failed API call at:', lastFailedApiCall);
}

// Network status tracking
let isOnline = navigator.onLine;

function isNetworkAvailable() {
  return isOnline;
}

// Update network status
window.addEventListener('online', () => {
  isOnline = true;
  console.log('Network connection restored');
  updateNetworkStatus();
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('Network connection lost');
  updateNetworkStatus();
});

function updateNetworkStatus() {
  const networkElements = document.querySelectorAll('[data-requires-network]');
  networkElements.forEach(element => {
    if (isNetworkAvailable()) {
      element.classList.remove('disabled', 'offline');
    } else {
      element.classList.add('disabled', 'offline');
    }
  });
}

// Initial network state check
console.log('Initial network state, assuming online based on navigator.onLine');
updateNetworkStatus();

// Export the main initialization function
export function initApp(modelViewer) {
    // Reference to the model viewer instance
    const viewer = modelViewer;
    
    // Elements
    const signSelector = document.getElementById('sign-selector');
    const zodiacViewerSection = document.querySelector('.zodiac-viewer');

    // Only set up sign selector if we're on the viewer page (where it's needed)
    if (window.location.pathname.includes('viewer.html') && signSelector) {
        console.log('Setting up sign selector for viewer page');
        setupSignSelector(signSelector, 'aries');
        
        // Add change event listener
        signSelector.addEventListener('change', (event) => {
            const sign = event.target.value;
            
            // Load the model
            if (viewer) {
                console.log(`Loading model for ${sign}`);
                viewer.loadModel(sign);
            }
            
            // Update sign info if we're on a page with this element
            updateSignInfo(sign);
        });
        
        // Trigger initial load for the default selected sign
        const initialSign = signSelector.value;
        if (initialSign && viewer) {
            console.log(`Initial model load for ${initialSign}`);
            viewer.loadModel(initialSign);
            updateSignInfo(initialSign);
        }
    } else if (!window.location.pathname.includes('viewer.html')) {
        console.log('Not on viewer page - skipping sign selector setup');
    }
    
    // Don't do additional setup if the zodiac viewer section is hidden
    if (zodiacViewerSection && zodiacViewerSection.classList.contains('initial-hidden')) {
        console.log('Zodiac viewer section is hidden - skipping additional setup');
        return;
    }
}

/**
 * Set up the sign selector dropdown with all zodiac signs
 */
function setupSignSelector(selectorElement, currentSign) {
    const signs = [
        'aries', 'taurus', 'gemini', 'cancer', 
        'leo', 'virgo', 'libra', 'scorpio', 
        'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];
    
    signs.forEach(sign => {
        const option = document.createElement('option');
        option.value = sign;
        option.textContent = capitalizeFirstLetter(sign);
        
        if (sign === currentSign) {
            option.selected = true;
        }
        
        selectorElement.appendChild(option);
    });
}

/**
 * Update the sign information panel
 */
function updateSignInfo(sign) {
    // First try getting the element with ID 'sign-info' (for viewer.html)
    let signInfo = document.getElementById('sign-info');
    const isViewerPage = !!signInfo;
    
    // If that doesn't exist, try the class from the main page
    if (!signInfo) {
        signInfo = document.querySelector('.sign-details-grid');
    }
    
    if (!signInfo) {
        console.error('Sign info element not found');
        return;
    }
    
    // Show loading state
    signInfo.innerHTML = '<div class="sign-detail"><div class="sign-detail-value">Loading sign information...</div></div>';
    
    // Check if network is available immediately
    if (!isNetworkAvailable()) {
        console.log(`Network offline - using local data for ${sign}`);
        useLocalData(sign, isViewerPage);
        return;
    }
    
    // Try to fetch sign data from API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Extended timeout to 5 seconds
    
    // Add some client debug info
    console.log(`Attempting to fetch sign data from: api/signs/${sign}`);
    
    // Add retry mechanism
    let retryCount = 0;
    const maxRetries = 1;

    function fetchSignData() {
        console.log(`Attempting to fetch sign data from: api/signs/${sign}`);
        
        // Create an abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        fetch(`api/signs/${sign}`, { 
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' } // Prevent caching issues
        })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`Failed to fetch sign data: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Record successful API call
                recordSuccessfulApiCall();
                
                // Use the data regardless of format
                console.log('Sign data received:', data);
                
                // Check for different response formats
                const signData = data.data || data;
                
                if (isViewerPage) {
                    // Display in viewer format
                    displaySignDetailsForViewer(signData, sign);
                } else {
                    // Format for main page
                    const formattedHTML = `
                        <div class="sign-detail">
                            <div class="sign-detail-label">Name</div>
                            <div class="sign-detail-value">${signData.name || (signData.sign && signData.sign.name) || capitalizeFirstLetter(sign)} ${signData.symbol || (signData.sign && signData.sign.symbol) || ''}</div>
                        </div>
                        <div class="sign-detail">
                            <div class="sign-detail-label">Dates</div>
                            <div class="sign-detail-value">${signData.dates || (signData.sign && signData.sign.dates) || ''}</div>
                        </div>
                        <div class="sign-detail">
                            <div class="sign-detail-label">Element</div>
                            <div class="sign-detail-value">${signData.element || (signData.sign && signData.sign.element) || ''}</div>
                        </div>
                        <div class="sign-detail">
                            <div class="sign-detail-label">Planet</div>
                            <div class="sign-detail-value">${signData.rulingPlanet || (signData.sign && signData.sign.rulingPlanet) || ''}</div>
                        </div>
                    `;
                    signInfo.innerHTML = formattedHTML;
                }
            })
            .catch(error => {
                console.error('Error fetching sign data:', error);
                recordFailedApiCall();
                
                // Use zodiacData as fallback
                if (zodiacData[sign.toLowerCase()]) {
                    if (isViewerPage) {
                        // Display in viewer format
                        displaySignDetailsForViewer(zodiacData[sign.toLowerCase()], sign);
                    } else {
                        const localData = zodiacData[sign.toLowerCase()];
                        // Format for main page
                        const formattedHTML = `
                            <div class="sign-detail">
                                <div class="sign-detail-label">Name</div>
                                <div class="sign-detail-value">${localData.name} ${localData.symbol}</div>
                            </div>
                            <div class="sign-detail">
                                <div class="sign-detail-label">Dates</div>
                                <div class="sign-detail-value">${localData.dates}</div>
                            </div>
                            <div class="sign-detail">
                                <div class="sign-detail-label">Element</div>
                                <div class="sign-detail-value">${localData.element}</div>
                            </div>
                            <div class="sign-detail">
                                <div class="sign-detail-label">Planet</div>
                                <div class="sign-detail-value">${localData.rulingPlanet}</div>
                            </div>
                        `;
                        signInfo.innerHTML = formattedHTML;
                    }
                } else {
                    console.error(`No local data found for sign: ${sign}`);
                    
                    if (signInfo) {
                        signInfo.innerHTML = `<div class="sign-detail"><div class="sign-detail-value">No information available for ${capitalizeFirstLetter(sign)}</div></div>`;
                    }
                }
            });
    }

    // Start the fetch process
    fetchSignData();
}

/**
 * Display sign details specifically for the viewer page
 */
function displaySignDetailsForViewer(data, sign) {
    const signInfo = document.getElementById('sign-info');
    if (!signInfo) return;
    
    // Extract sign data from the API response (handle different response formats)
    const signData = data.sign || data;
    
    // Create a more detailed card for the viewer page
    const detailsHTML = `
        <div class="sign-card">
            <div class="sign-header">
                <h2>${signData.name || capitalizeFirstLetter(sign)} ${signData.symbol}</h2>
                <div class="sign-dates">${signData.dates}</div>
            </div>
            <div class="sign-traits">
                <div class="traits-header">Traits:</div>
                <ul class="traits-list">
                    ${signData.traits ? signData.traits.map(trait => `<li>${trait}</li>`).join('') : ''}
                </ul>
            </div>
            <div class="sign-attributes">
                <div class="attribute">
                    <span class="attr-label">Element:</span>
                    <span class="attr-value">${signData.element}</span>
                </div>
                <div class="attribute">
                    <span class="attr-label">Ruling Planet:</span>
                    <span class="attr-value">${signData.rulingPlanet}</span>
                </div>
            </div>
            <div class="sign-reading">
                ${signData.dailyReading || ''}
            </div>
        </div>
    `;
    
    signInfo.innerHTML = detailsHTML;
}

/**
 * Helper function to capitalize the first letter of a string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Galactic Horoscope Web UI JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const horoscopeForm = document.getElementById('horoscope-form');
  const resultSection = document.getElementById('result');
  const zodiacViewerSection = document.getElementById('zodiac-viewer-section');
  const errorMessage = document.getElementById('error-message');
  const loadingIndicator = document.getElementById('loading');
  const submitButton = document.getElementById('submit-btn');
  const newReadingBtn = document.getElementById('new-reading-btn');
  
  // Date selection elements
  const monthSelect = document.getElementById('month');
  const daySelect = document.getElementById('day');
  
  // Populate the day dropdown initially with default days (31)
  if (daySelect) {
    populateDayDropdown(31);
    
    // Update days when month changes
    if (monthSelect) {
      monthSelect.addEventListener('change', function() {
        const month = parseInt(this.value);
        updateDaysForMonth(month);
      });
    }
  }
  
  // Result elements
  const signSymbol = document.getElementById('sign-symbol');
  const signName = document.getElementById('sign-name');
  const signPeriod = document.getElementById('sign-period');
  const fortuneText = document.getElementById('fortune-text');
  const insight = document.getElementById('insight');
  const cosmicNumber = document.getElementById('cosmic-number');
  
  // Initialize the model viewer but don't display it yet
  let modelViewerInstance = null;
  const modelContainer = document.getElementById('model-viewer');
  
  if (modelContainer) {
    try {
      modelViewerInstance = new ModelViewer('model-viewer');
      modelViewerInstance.init().catch(error => {
        console.error('Failed to initialize model viewer:', error);
        showModelFallback();
      });
    } catch (error) {
      console.error('Failed to create model viewer:', error);
      showModelFallback();
    }
  }
  
  // API endpoint for horoscope
  const API_URL = 'api/horoscope';
  
  /**
   * Update days in the dropdown based on selected month
   * @param {number} month - Selected month (1-12)
   */
  function updateDaysForMonth(month) {
    if (!daySelect) return;
    
    // Get the correct number of days for the selected month
    let daysInMonth;
    
    switch (month) {
      case 2: // February (accounting for leap year in a simplified way)
        daysInMonth = 29;
        break;
      case 4: // April
      case 6: // June
      case 9: // September
      case 11: // November
        daysInMonth = 30;
        break;
      default:
        daysInMonth = 31;
    }
    
    // Remember the currently selected day if any
    const selectedDay = daySelect.value;
    
    // Populate the days dropdown
    populateDayDropdown(daysInMonth);
    
    // Try to restore the previously selected day if valid
    if (selectedDay && parseInt(selectedDay) <= daysInMonth) {
      daySelect.value = selectedDay;
    }
  }
  
  /**
   * Populate the days dropdown with the correct number of days
   * @param {number} numDays - Number of days to populate
   */
  function populateDayDropdown(numDays) {
    if (!daySelect) return;
    
    // Clear existing options except the placeholder
    while (daySelect.options.length > 1) {
      daySelect.remove(1);
    }
    
    // Add options for each day
    for (let i = 1; i <= numDays; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }
  }
  
  // Add a full date input field to the form
  if (horoscopeForm) {
    // Create a full date input field above the month/day dropdowns
    const formInputs = horoscopeForm.querySelector('.form-inputs');
    
    if (formInputs) {
      const fullDateGroup = document.createElement('div');
      fullDateGroup.className = 'input-group full-date-group';
      
      const fullDateLabel = document.createElement('label');
      fullDateLabel.setAttribute('for', 'full-date');
      fullDateLabel.textContent = 'Enter full date (any format):';
      
      const fullDateInput = document.createElement('input');
      fullDateInput.type = 'text';
      fullDateInput.id = 'full-date';
      fullDateInput.name = 'full-date';
      fullDateInput.placeholder = 'e.g., 12/25, Dec 25, or 12-25-2022';
      
      const formatInfo = document.createElement('div');
      formatInfo.className = 'format-info';
      formatInfo.innerHTML = 'Supports MM/DD, DD-MM-YYYY, Month DD, etc.';
      
      fullDateGroup.appendChild(fullDateLabel);
      fullDateGroup.appendChild(fullDateInput);
      fullDateGroup.appendChild(formatInfo);
      
      const orSeparator = document.createElement('div');
      orSeparator.className = 'or-separator';
      orSeparator.innerHTML = '<span>OR</span>';
      
      // Add the elements at the beginning of the form
      formInputs.insertBefore(fullDateGroup, formInputs.firstChild);
      formInputs.insertBefore(orSeparator, formInputs.children[1]);
      
      // Handle input in the full date field
      fullDateInput.addEventListener('input', function() {
        const parsed = parseDate(this.value);
        if (parsed) {
          // If valid, update the month/day dropdowns
          if (monthSelect && parsed.month) {
            monthSelect.value = parsed.month;
            // Update days in the day dropdown
            updateDaysForMonth(parsed.month);
          }
          
          if (daySelect && parsed.day) {
            daySelect.value = parsed.day;
          }
        }
      });
    }
  }
  
  // Handle form submission
  if (horoscopeForm) {
    horoscopeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Hide any existing errors
      hideError();
      
      // Get form values
      const fullDateInput = document.getElementById('full-date');
      let month, day;
      
      // Try to parse full date input first if it has a value
      if (fullDateInput && fullDateInput.value.trim()) {
        const parsed = parseDate(fullDateInput.value);
        if (parsed) {
          month = parsed.month;
          day = parsed.day;
        } else {
          // Show specific error for invalid full date format with suggestions
          const inputVal = fullDateInput.value.trim();
          let suggestion = 'Try a format like "MM/DD", "MM/DD/YYYY", or "Month DD".';
          
          if (inputVal.includes('/') || inputVal.includes('-')) {
            if (!/\d/.test(inputVal)) {
              suggestion = 'Date must contain numbers for month and day.';
            } else if ((inputVal.match(/\//g) || []).length > 2 || (inputVal.match(/-/g) || []).length > 2) {
              suggestion = 'Too many separators. Use format like "MM/DD" or "MM/DD/YYYY".';
            }
          } else if (/^[a-zA-Z]+$/.test(inputVal)) {
            suggestion = 'Month name alone is not enough. Include a day number, like "January 15".';
          }
          
          showError('Could not understand the date format you entered.', suggestion);
          return;
        }
      } else {
        // Fall back to month/day dropdowns
        month = document.getElementById('month').value;
        day = document.getElementById('day').value;
        
        // Check if values are selected
        if (!month || month === '0') {
          showError('Please select a month from the dropdown.');
          return;
        }
        
        if (!day || day === '0') {
          showError('Please select a day from the dropdown.');
          return;
        }
        
        // Validate inputs
        if (!validateDate(month, day)) {
          const suggestion = getDateErrorSuggestion(month, day);
          showError('The date you entered is not valid.', suggestion);
          return;
        }
      }
      
      // Show loading indicator
      showLoading();
      
      try {
        // Call the API
        const horoscope = await fetchHoroscope(month, day);
        
        // Display horoscope data
        await displayHoroscope(horoscope);
      } catch (error) {
        // Provide clear error message with fallback suggestion
        let errorMessage = 'Error fetching your horoscope.';
        let suggestion = '';
        
        if (error.message) {
          // Network errors
          if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            errorMessage = 'Could not contact the horoscope service.';
            suggestion = 'Check your internet connection and try again.';
          } 
          // API errors
          else if (error.message.includes('404')) {
            errorMessage = 'Horoscope service could not find data for this date.';
            suggestion = 'Try a different date or refresh the page.';
          }
          // Timeout errors
          else if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out.';
            suggestion = 'The server is taking too long to respond. Try again later.';
          }
          // Fallback
          else {
            errorMessage = `Error: ${error.message}`;
            suggestion = 'Please try again or refresh the page.';
          }
        }
        
        showError(errorMessage, suggestion);
        
        // Log full error to console
        console.error('API Error Details:', error);
      } finally {
        // Hide loading indicator
        hideLoading();
      }
    });
  }
  
  // Reset form and show form card
  if (newReadingBtn) {
    newReadingBtn.addEventListener('click', () => {
      // Reset form
      horoscopeForm.reset();
      
      // Hide result section with animation
      if (resultSection) {
        resultSection.classList.add('fade-out');
        setTimeout(() => {
          resultSection.style.display = 'none';
          resultSection.classList.remove('fade-out', 'show');
          resultSection.classList.add('result'); // Add back the display:none class for next time
        }, 500);
      }
      
      // Hide 3D viewer section
      const zodiacViewer = document.querySelector('.zodiac-viewer');
      if (zodiacViewer) {
        zodiacViewer.classList.add('fade-out');
        setTimeout(() => {
          zodiacViewer.style.display = 'none';
          zodiacViewer.classList.add('initial-hidden');
          zodiacViewer.classList.remove('animate-fade-in', 'fade-out');
          
          // Also clear the model viewer contents
          const modelViewer = document.getElementById('model-viewer');
          if (modelViewer) {
            modelViewer.innerHTML = '';
            
            // If model viewer instance exists, dispose it
            if (modelViewerInstance) {
              try {
                modelViewerInstance.dispose();
                modelViewerInstance = null;
              } catch (e) {
                console.log('Error disposing model viewer:', e);
              }
            }
          }
        }, 500);
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  /**
   * Load the 3D model for the zodiac sign
   * @param {string} sign - The zodiac sign name
   */
  async function loadZodiacModel(sign) {
    if (!modelViewerInstance || !modelContainer) return;
    
    try {
        // Add loading indicator
        const loader = document.createElement('div');
        loader.className = 'model-loading';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        loader.appendChild(spinner);
        
        const text = document.createElement('p');
        text.textContent = 'Loading 3D model...';
        loader.appendChild(text);
        
        modelContainer.appendChild(loader);
        
        // Check if network is available - if not, immediately go to fallback
        if (!isNetworkAvailable()) {
            console.log('Network offline - using fallback for 3D model');
            throw new Error('Network offline');
        }
        
        console.log('Loading zodiac model:', sign);
        
        // Load model with timeout
        const loadPromise = modelViewerInstance.loadModel(sign);
        
        // Add a timeout to the load operation
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Model loading timed out')), 10000);
        });
        
        // Race between the load and the timeout
        await Promise.race([loadPromise, timeoutPromise]);
        
        console.log('Successfully loaded model for:', sign);
        
        // Remove loading indicator if it exists
        if (modelContainer.contains(loader)) {
            modelContainer.removeChild(loader);
        }
    } catch (error) {
        console.error('Error loading 3D model:', error);
        recordFailedApiCall();
        
        // Create a fallback visual with the sign name
        if (modelContainer) {
            // Remove loading indicator if it exists
            const existingLoader = modelContainer.querySelector('.model-loading');
            if (existingLoader) {
                modelContainer.removeChild(existingLoader);
            }
            
            // Check if we already have a fallback element
            let fallbackEl = modelContainer.querySelector('.model-fallback');
            if (!fallbackEl) {
                fallbackEl = document.createElement('div');
                fallbackEl.className = 'model-fallback';
                modelContainer.appendChild(fallbackEl);
            }
            
            // Update the fallback content
            fallbackEl.innerHTML = `
                <div class="fallback-content">
                    <div class="sign-symbol">${zodiacData[sign.toLowerCase()]?.symbol || '♈'}</div>
                    <div class="sign-name">${capitalizeFirstLetter(sign)}</div>
                    <div class="fallback-message">3D model unavailable${!isNetworkAvailable() ? ' (offline)' : ''}</div>
                </div>
            `;
        }
    }
  }
  
  /**
   * Fetch the horoscope from the API
   */
  async function fetchHoroscope(month, day) {
    try {
        console.log(`Fetching horoscope for ${month}/${day} from ${API_URL}`);
        
        // Check if network is available before attempting to fetch
        if (!isNetworkAvailable()) {
            console.warn('Network is offline - using fallback data');
            // For offline mode, return a fallback with the zodiac sign
            const sign = determineZodiacSign(month, day);
            if (sign) {
                console.log(`Using fallback data for ${sign.toLowerCase()} due to network being offline`);
                return getFallbackHoroscope(sign, month, day);
            }
            throw new Error('Network is offline');
        }
        
        // Add a timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // Extended timeout to 8 seconds
        
        try {
            console.log('Making API request with timeout...');
            const response = await fetch(`${API_URL}?month=${month}&day=${day}`, {
                signal: controller.signal,
                headers: { 'Cache-Control': 'no-cache' } // Prevent caching issues
            });
            
            // Clear the timeout
            clearTimeout(timeoutId);
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                // Handle HTTP errors
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    console.log('Could not parse error response as JSON');
                    errorData = null;
                }
                
                const errorMessage = errorData?.message || `HTTP error ${response.status}`;
                const errorSuggestion = errorData?.suggestion || null;
                
                console.error('API error:', errorData || response.statusText);
                recordFailedApiCall();
                
                throw new Error(`Failed to fetch sign data: ${errorMessage}`, { 
                    cause: { 
                        status: response.status,
                        suggestion: errorSuggestion
                    } 
                });
            }
            
            let data;
            try {
                data = await response.json();
                // Record successful API call
                recordSuccessfulApiCall();
                console.log('API response:', data);
            } catch (jsonError) {
                console.error('Error parsing JSON response:', jsonError);
                throw new Error('Invalid JSON response from server');
            }
            
            // Handle different response formats
            let result;
            
            if (data.status === 'success' && data.data) {
                console.log('Using status/data format');
                result = data.data;
            } else if (data.error) {
                console.error('API returned error:', data.message);
                throw new Error(data.message || 'API returned an error response', { 
                    cause: { suggestion: data.suggestion } 
                });
            } else {
                console.log('Using direct data format');
                result = data;
            }
            
            // Check if we have a sign property or error
            if (!result || !result.sign) {
                throw new Error('Invalid API response format: missing sign data');
            }
            
            return result;
        } catch (fetchError) {
            // Clear timeout if it's a fetch error
            clearTimeout(timeoutId);
            recordFailedApiCall();
            throw fetchError;
        }
    } catch (error) {
        console.error('Failed to fetch horoscope:', error);
        recordFailedApiCall();
        // Extract any suggestion from the error
        const suggestion = error.cause?.suggestion;
        
        if (error.name === 'AbortError') {
            console.log('Request timed out - using fallback data');
            // Don't rethrow, use fallback
        } else if (!isNetworkAvailable() || error.message.includes('offline') || error.message.includes('Failed to fetch')) {
            console.log('Network error or offline - using fallback data');
            // Don't rethrow, use fallback
        } else {
            // Only log other types of errors, still use fallback
            console.log('API error:', error.message);
        }
        
        // For any error, return a fallback with the zodiac sign
        const sign = determineZodiacSign(month, day);
        if (sign) {
            console.log(`Using fallback data for ${sign.toLowerCase()} due to API error`);
            return getFallbackHoroscope(sign, month, day);
        }
        
        // Only rethrow if we couldn't generate a fallback
        throw new Error(error.message, { cause: { suggestion } });
    }
  }
  
  /**
   * Get fallback horoscope data when API is unavailable
   */
  function getFallbackHoroscope(signName, month, day) {
    // Basic fallback data
    const fallbackData = {
      sign: {
        name: capitalizeFirstLetter(signName),
        symbol: getSignSymbol(signName),
        dates: getSignDateRange(signName),
        element: getSignElement(signName),
        rulingPlanet: getSignPlanet(signName)
      },
      fortune: `As a ${capitalizeFirstLetter(signName)}, your natural traits will be highlighted today. Trust your instincts and stay true to yourself.`,
      insight: "Offline mode: Using locally generated content",
      cosmicNumber: ((month + day) % 12) + 1,
      date: new Date().toISOString().split('T')[0],
      offlineGenerated: true
    };
    
    console.log('Generated fallback data:', fallbackData);
    return fallbackData;
  }
  
  /**
   * Get sign symbol for fallback data
   */
  function getSignSymbol(sign) {
    const symbols = {
      aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
      leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
      sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
    };
    return symbols[sign.toLowerCase()] || '⭐';
  }
  
  /**
   * Get sign element for fallback data
   */
  function getSignElement(sign) {
    const elements = {
      aries: 'Fire', leo: 'Fire', sagittarius: 'Fire',
      taurus: 'Earth', virgo: 'Earth', capricorn: 'Earth',
      gemini: 'Air', libra: 'Air', aquarius: 'Air',
      cancer: 'Water', scorpio: 'Water', pisces: 'Water'
    };
    return elements[sign.toLowerCase()] || 'Unknown';
  }
  
  /**
   * Get ruling planet for fallback data
   */
  function getSignPlanet(sign) {
    const planets = {
      aries: 'Mars', taurus: 'Venus', gemini: 'Mercury', 
      cancer: 'Moon', leo: 'Sun', virgo: 'Mercury',
      libra: 'Venus', scorpio: 'Pluto', sagittarius: 'Jupiter',
      capricorn: 'Saturn', aquarius: 'Uranus', pisces: 'Neptune'
    };
    return planets[sign.toLowerCase()] || 'Unknown';
  }
  
  /**
   * Get date range for fallback data
   */
  function getSignDateRange(sign) {
    const dateRanges = {
      aries: 'March 21 - April 19',
      taurus: 'April 20 - May 20',
      gemini: 'May 21 - June 20',
      cancer: 'June 21 - July 22',
      leo: 'July 23 - August 22',
      virgo: 'August 23 - September 22',
      libra: 'September 23 - October 22',
      scorpio: 'October 23 - November 21',
      sagittarius: 'November 22 - December 21',
      capricorn: 'December 22 - January 19',
      aquarius: 'January 20 - February 18',
      pisces: 'February 19 - March 20'
    };
    return dateRanges[sign.toLowerCase()] || '';
  }
  
  /**
   * Determine zodiac sign based on month and day
   */
  function determineZodiacSign(month, day) {
    // Month is 1-based (1 = January)
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return 'aries';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return 'taurus';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      return 'gemini';
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      return 'cancer';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return 'leo';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return 'virgo';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      return 'libra';
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return 'scorpio';
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return 'sagittarius';
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return 'capricorn';
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return 'aquarius';
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return 'pisces';
    }
    return null;
  }
  
  /**
   * Format the fortune text for display
   * @param {string} text - Raw fortune text
   * @returns {string} Formatted HTML
   */
  function formatFortuneText(text) {
    if (!text) return '';
    
    // Split into lines
    const lines = text.split('\n');
    
    // Process each line
    const formattedLines = lines.map(line => {
      // Skip empty lines
      if (!line.trim()) return '';
      
      // Format bullet points
      if (line.startsWith('•')) {
        return `<p class="fortune-bullet">${line}</p>`;
      }
      
      // Format categories (text followed by colon)
      if (line.includes(':')) {
        const [category, content] = line.split(':');
        return `<p><span class="fortune-category">${category}:</span>${content}</p>`;
      }
      
      // Regular lines
      return `<p>${line}</p>`;
    });
    
    // Join lines and return
    return formattedLines.join('\n');
  }

  /**
   * Display horoscope data in the UI
   * @param {Object} horoscope - Horoscope data from API
   */
  async function displayHoroscope(horoscope) {
    try {
      console.log('Attempting to display horoscope:', horoscope);
      
      // Show the result section
      const resultSection = document.getElementById('result');
      if (resultSection) {
        resultSection.style.display = 'block';
        resultSection.classList.remove('result');
        resultSection.classList.add('show');
      }

      // Process and display fortune
      if (horoscope.fortune) {
        console.log('Fortune type:', typeof horoscope.fortune);
        if (typeof horoscope.fortune === 'string') {
          console.log('Processing string fortune format');
          document.getElementById('fortune-text').innerHTML = formatFortuneText(horoscope.fortune);
        } else {
          console.warn('Unexpected fortune format:', horoscope.fortune);
        }
      }

      // Set insight if available
      if (horoscope.insight) {
        console.log('Setting insight from horoscope.insight:', horoscope.insight);
        document.getElementById('insight').textContent = horoscope.insight;
      }

      // Set cosmic number if available
      if (horoscope.cosmicNumber) {
        console.log('Setting cosmic number from horoscope.cosmicNumber:', horoscope.cosmicNumber);
        document.getElementById('cosmic-number').textContent = horoscope.cosmicNumber;
      }

      // Update sign information
      if (horoscope.sign) {
        document.getElementById('sign-name').textContent = horoscope.sign.name;
        document.getElementById('sign-symbol').textContent = horoscope.sign.symbol;
        document.getElementById('sign-period').textContent = horoscope.sign.dates;
      }

      // Show the zodiac viewer section and load the model
      const zodiacViewerSection = document.querySelector('.zodiac-viewer');
      if (zodiacViewerSection && horoscope.sign) {
        const signName = horoscope.sign.name.toLowerCase();
        const isIndexPage = document.body.classList.contains('index-page');
        
        // Display approach differs between index and viewer pages
        if (isIndexPage) {
          // On index.html: No animations, just show immediately
          console.log('Showing zodiac viewer immediately (index page)');
          zodiacViewerSection.classList.remove('initial-hidden');
          zodiacViewerSection.style.display = 'block';
          
          // Ensure model container is visible
          const modelContainer = document.querySelector('.model-container');
          if (modelContainer) {
            modelContainer.style.display = 'block';
            modelContainer.style.visibility = 'visible';
          }
        } else {
          // On other pages: Use the animation approach
          console.log('Showing zodiac viewer with animation (non-index page)');
          zodiacViewerSection.classList.remove('initial-hidden');
          zodiacViewerSection.style.display = 'block';
          
          // Force a reflow to ensure the styles are applied
          void zodiacViewerSection.offsetHeight;
          
          // Add animation class
          zodiacViewerSection.classList.add('animate-fade-in');
          
          // Wait for animation
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Let the browser render the container before initializing ThreeJS
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Force window resize event to help Three.js update dimensions
        window.dispatchEvent(new Event('resize'));
        
        // Initialize or reinitialize the model viewer
        if (!modelViewerInstance) {
          try {
            console.log('Initializing model viewer for zodiac sign display');
            modelViewerInstance = await initializeModelViewer();
            
            // If model viewer initialization failed, show fallback
            if (!modelViewerInstance) {
              console.error('Failed to initialize model viewer');
              showModelFallback(signName);
              return;
            }
            
            // Force another resize after initialization
            window.dispatchEvent(new Event('resize'));
          } catch (error) {
            console.error('Error initializing model viewer:', error);
            showModelFallback(signName);
            return;
          }
        }
        
        // Load the 3D model
        if (modelViewerInstance) {
          try {
            console.log('Loading zodiac model:', signName);
            await modelViewerInstance.loadModel(signName);
            console.log('Successfully loaded model for:', signName);
            
            // Force another resize after model load to ensure everything is sized correctly
            window.dispatchEvent(new Event('resize'));
          } catch (error) {
            console.error('Error loading model:', error);
            showModelFallback(signName);
          }
        } else {
          console.error('No model viewer instance available to load model');
          showModelFallback(signName);
        }
      }

      // Scroll to the result section
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    } catch (error) {
      console.error('Error displaying horoscope:', error);
      showError('Error displaying your horoscope. Please try again.');
    }
  }
  
  // Add a function to show model fallback
  function showModelFallback(signName) {
    const modelViewer = document.getElementById('model-viewer');
    if (modelViewer) {
      modelViewer.innerHTML = `
        <div class="model-fallback">
          <div class="fallback-content">
            <div class="sign-symbol">${getSignSymbol(signName)}</div>
            <div class="sign-name">${capitalizeFirstLetter(signName)}</div>
            <div class="fallback-message">3D model unavailable</div>
          </div>
        </div>
      `;
    }
  }
  
  /**
   * Parse a date string into month and day
   * @param {string} dateString - Date string to parse
   * @returns {Object|null} - Parsed date object or null if invalid
   */
  function parseDate(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      return null;
    }

    // Normalize input by trimming whitespace and converting to lowercase
    const input = dateString.trim().toLowerCase();
    
    if (input === '') {
      return null;
    }
    
    // Month names lookup
    const monthNames = {
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
      const monthNumber = monthNames[monthName];
      
      if (monthNumber) {
        // Handle optional year
        let year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
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
      const monthNumber = monthNames[monthName];
      
      if (monthNumber) {
        // Handle optional year
        let year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
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

    // If we found a valid result, validate the date
    if (result && isValidDate(result.month, result.day, result.year)) {
      return result;
    }

    return null;
  }

  /**
   * Check if a year is a leap year
   * @param {number} year - Year to check
   * @returns {boolean} True if leap year
   */
  function isLeapYear(year) {
    // Leap year logic: divisible by 4, except century years not divisible by 400
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * Check if a date is valid
   * @param {number} month - Month (1-12)
   * @param {number} day - Day of month
   * @param {number} year - Year (optional)
   * @returns {boolean} True if date is valid
   */
  function isValidDate(month, day, year) {
    // Basic range checks
    if (isNaN(month) || isNaN(day)) {
      return false;
    }
    
    if (month < 1 || month > 12) {
      return false;
    }
    
    if (day < 1 || day > 31) {
      return false;
    }
    
    // Days in each month (non-leap year)
    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Adjust February for leap years
    if (year) {
      if (isLeapYear(year) && month === 2) {
        daysInMonth[2] = 29;
      }
    } else {
      // If no year is provided, assume it could be a leap year
      daysInMonth[2] = 29;
    }
    
    return day <= daysInMonth[month];
  }
  
  /**
   * Validate date input
   * @param {number|string} month - Month (1-12) or full date string
   * @param {number|string} day - Day of month (optional if month is a full date string)
   * @param {number} year - Year (optional)
   * @returns {boolean} True if date is valid
   */
  function validateDate(month, day, year) {
    // If month is a string that could be a full date (contains separators)
    if (typeof month === 'string' && 
        (month.includes('/') || month.includes('-') || month.includes(' '))) {
      // Try to parse it as a full date string
      const parsed = parseDate(month);
      if (parsed) {
        return true;
      }
    }
    
    // Convert inputs to numbers if they're strings (standard case)
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = year ? parseInt(year, 10) : undefined;
    
    return isValidDate(monthNum, dayNum, yearNum);
  }
  
  /**
   * Show error message with detailed feedback
   * @param {string} message - Error message to display
   * @param {string} suggestion - Optional suggestion for fixing the error
   */
  function showError(message, suggestion = '') {
    if (!errorMessage) return;
    
    // Create rich error message with suggestion if provided
    let errorHTML = `<div class="error-message-text">${message}</div>`;
    
    if (suggestion) {
      errorHTML += `<div class="error-suggestion"><span class="suggestion-prefix">Suggestion:</span> ${suggestion}</div>`;
    }
    
    errorMessage.innerHTML = errorHTML;
    errorMessage.style.display = 'block';
    errorMessage.classList.add('error-bounce');
    
    // Log error for tracking
    console.error('Form validation error:', message);
    
    // Remove animation class after animation completes
    setTimeout(() => {
      if (errorMessage) {
        errorMessage.classList.remove('error-bounce');
      }
    }, 1000);
    
    hideLoading();
  }
  
  /**
   * Get suggestion based on invalid date input
   * @param {string|number} month - Month input that caused error
   * @param {string|number} day - Day input that caused error
   * @returns {string} Suggestion for correction
   */
  function getDateErrorSuggestion(month, day) {
    // Parse inputs to numbers for comparison
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    
    // Month-specific suggestions
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return 'Month should be between 1-12 or a valid month name like "January" or "Jan".';
    }
    
    // Invalid days for specific months
    if (!isNaN(dayNum)) {
      // Days in each month
      const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
      if (dayNum < 1) {
        return 'Day should be 1 or higher.';
      } else if (dayNum > daysInMonth[monthNum]) {
        if (monthNum === 2 && dayNum === 29) {
          return 'February 29 is only valid in leap years.';
        } else {
          return `${monthNames[monthNum]} only has ${daysInMonth[monthNum]} days.`;
        }
      }
    } else {
      return 'Day should be a number between 1-31 depending on the month.';
    }
    
    // General suggestion for unspecified errors
    return 'Try using the full date input with a format like "MM/DD" or "Month Day".';
  }
  
  /**
   * Hide error message
   */
  function hideError() {
    if (!errorMessage) return;
    
    // Fade out animation
    errorMessage.classList.add('fade-out');
    
    // Remove after animation completes
    setTimeout(() => {
      errorMessage.innerHTML = '';
      errorMessage.style.display = 'none';
      errorMessage.classList.remove('fade-out');
    }, 300);
  }
  
  /**
   * Show loading indicator
   */
  function showLoading() {
    if (!loadingIndicator || !submitButton) return;
    
    loadingIndicator.style.display = 'block';
    submitButton.disabled = true;
    
    // Disable form inputs during loading
    if (horoscopeForm) {
      const inputs = horoscopeForm.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.disabled = true;
      });
    }
  }
  
  /**
   * Hide loading indicator
   */
  function hideLoading() {
    if (!loadingIndicator || !submitButton) return;
    
    loadingIndicator.style.display = 'none';
    submitButton.disabled = false;
    
    // Re-enable form inputs
    if (horoscopeForm) {
      const inputs = horoscopeForm.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.disabled = false;
      });
    }
  }

  // Network status monitoring
  window.addEventListener('online', handleNetworkChange);
  window.addEventListener('offline', handleNetworkChange);

  /**
   * Handle network status changes
   */
  function handleNetworkChange(event) {
    const isOnline = navigator.onLine;
    const statusIndicator = document.getElementById('network-status');
    
    if (statusIndicator) {
      if (isOnline) {
        statusIndicator.textContent = 'Online';
        statusIndicator.className = 'status-indicator online';
        console.log('Network status changed: Online');
        
        // Reset the API call status tracking on reconnection to allow fresh attempts
        if (!lastSuccessfulApiCall) {
          console.log('First connection or reconnection detected');
        }
      } else {
        statusIndicator.textContent = 'Offline';
        statusIndicator.className = 'status-indicator offline';
        console.log('Network status changed: Offline');
        
        // Record a failed API call state when we go offline
        if (lastSuccessfulApiCall) {
          recordFailedApiCall();
        }
        
        // Show warning message to user
        showOfflineWarning();
      }
    }
    
    // Update any content that depends on network status
    updateNetworkDependentContent();
  }

  /**
   * Use local fallback data when the API is not available
   */
  function useLocalData(sign, isViewerPage = false) {
    console.log(`Using local data for ${sign}`);
    
    // Convert sign to lowercase for case-insensitive matching
    const signLower = sign.toLowerCase();
    
    // Find the matching sign data
    if (zodiacData[signLower]) {
        if (isViewerPage) {
            // Display in viewer format
            displaySignDetailsForViewer(zodiacData[signLower], sign);
        } else {
            // Find the sign info element - first try for viewer page
            let signInfo = document.getElementById('sign-info');
            
            // If that doesn't exist, try the class from the main page
            if (!signInfo) {
                signInfo = document.querySelector('.sign-details-grid');
            }
            
            if (!signInfo) {
                console.error('Sign info element not found');
                return;
            }
            
            // Format for main page
            const formattedHTML = `
                <div class="sign-detail">
                    <div class="sign-detail-label">Name</div>
                    <div class="sign-detail-value">${zodiacData[signLower].name} ${zodiacData[signLower].symbol}</div>
                </div>
                <div class="sign-detail">
                    <div class="sign-detail-label">Dates</div>
                    <div class="sign-detail-value">${zodiacData[signLower].dates}</div>
                </div>
                <div class="sign-detail">
                    <div class="sign-detail-label">Element</div>
                    <div class="sign-detail-value">${zodiacData[signLower].element}</div>
                </div>
                <div class="sign-detail">
                    <div class="sign-detail-label">Planet</div>
                    <div class="sign-detail-value">${zodiacData[signLower].rulingPlanet}</div>
                </div>
            `;
            signInfo.innerHTML = formattedHTML;
        }
    } else {
        console.error(`No local data found for sign: ${sign}`);
        
        // Find the sign info element
        let signInfo = document.getElementById('sign-info');
        if (!signInfo) {
            signInfo = document.querySelector('.sign-details-grid');
        }
        
        if (signInfo) {
            signInfo.innerHTML = `<div class="sign-detail"><div class="sign-detail-value">No information available for ${capitalizeFirstLetter(sign)}</div></div>`;
        }
    }
  }

  // Add this function to the app.js file to create and manage a network status indicator

  /**
   * Create and manage a network status indicator
   */
  function setupNetworkStatusIndicator() {
    // Create the status indicator element
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'network-status-indicator';
    statusIndicator.className = 'network-status-indicator'; // Style this in CSS
    document.body.appendChild(statusIndicator);
    
    // Function to update the status indicator
    function updateNetworkStatus() {
      const isOnline = navigator.onLine;
      
      if (isOnline) {
        statusIndicator.className = 'network-status-indicator online';
        statusIndicator.innerHTML = '<span class="status-dot"></span> Online';
        statusIndicator.title = 'Connected to the network';
        
        // Hide after a delay if online
        setTimeout(() => {
          statusIndicator.classList.add('fade-out');
        }, 3000);
      } else {
        statusIndicator.className = 'network-status-indicator offline';
        statusIndicator.innerHTML = '<span class="status-dot"></span> Offline - Using local data';
        statusIndicator.title = 'Not connected to the network - Using fallback data';
        
        // Keep visible when offline
        statusIndicator.classList.remove('fade-out');
      }
    }
    
    // Update status when online/offline events fire
    window.addEventListener('online', () => {
      console.log('Browser reports online status');
      updateNetworkStatus();
    });
    
    window.addEventListener('offline', () => {
      console.log('Browser reports offline status');
      updateNetworkStatus();
    });
    
    // Initial status check
    updateNetworkStatus();
    
    // Also update whenever we check network availability
    const originalIsNetworkAvailable = isNetworkAvailable;
    window.isNetworkAvailable = function() {
      const result = originalIsNetworkAvailable();
      // Only update UI if there's a change from what the browser reports
      if (result !== navigator.onLine) {
        updateNetworkStatus();
      }
      return result;
    };
    
    return {
      update: updateNetworkStatus
    };
  }

  // Check network status initially
  if (!isNetworkAvailable()) {
    console.warn('Application started in offline mode - using local data');
  }

  // Setup network status indicator
  const networkIndicator = setupNetworkStatusIndicator();

  /**
   * Show a warning message when the app goes offline
   */
  function showOfflineWarning() {
    // Only show warning if we don't already have an active one
    if (document.getElementById('offline-warning')) return;
    
    const warning = document.createElement('div');
    warning.id = 'offline-warning';
    warning.className = 'offline-warning';
    warning.innerHTML = `
      <div class="warning-icon">⚠️</div>
      <div class="warning-message">
        You're currently offline. Some features may be limited.
        <span class="warning-submessage">Horoscope readings will use locally stored data.</span>
      </div>
      <button class="close-warning">×</button>
    `;
    
    document.body.appendChild(warning);
    
    // Add close button functionality
    const closeBtn = warning.querySelector('.close-warning');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (document.body.contains(warning)) {
          warning.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(warning)) {
              document.body.removeChild(warning);
            }
          }, 300);
        }
      });
    }
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (document.body.contains(warning)) {
        warning.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(warning)) {
            document.body.removeChild(warning);
          }
        }, 300);
      }
    }, 10000);
  }

  /**
   * Update any content that depends on network status
   */
  function updateNetworkDependentContent() {
    // Update submit button state
    const submitButton = document.getElementById('submit-btn');
    if (submitButton) {
      if (!navigator.onLine) {
        submitButton.classList.add('offline-mode');
        submitButton.setAttribute('title', 'Offline Mode: Using local data');
      } else {
        submitButton.classList.remove('offline-mode');
        submitButton.setAttribute('title', 'Get Your Horoscope');
      }
    }
    
    // Update any other network-dependent elements
    const networkDependentElements = document.querySelectorAll('[data-requires-network]');
    networkDependentElements.forEach(element => {
      if (!navigator.onLine) {
        element.classList.add('disabled');
        element.classList.add('offline');
      } else {
        element.classList.remove('disabled');
        element.classList.remove('offline');
      }
    });
  }

  async function initializeModelViewer() {
    try {
      // Clean up existing model viewer if it exists
      if (modelViewerInstance) {
        modelViewerInstance.dispose();
        modelViewerInstance = null;
      }
     
      // Ensure we have a visible container
      let container = document.getElementById('model-viewer');
      if (!container) {
        console.log('Model viewer container not found, creating one');
        container = document.createElement('div');
        container.id = 'model-viewer';
        container.className = 'model-viewer';
        
        const modelContainer = document.querySelector('.model-container');
        if (modelContainer) {
          console.log('Appending model viewer to existing container');
          modelContainer.appendChild(container);
        } else {
          console.log('No model container found, appending to zodiac viewer');
          const zodiacViewer = document.querySelector('.zodiac-viewer');
          if (zodiacViewer) {
            // Create model container if it doesn't exist
            const newModelContainer = document.createElement('div');
            newModelContainer.className = 'model-container';
            zodiacViewer.appendChild(newModelContainer);
            newModelContainer.appendChild(container);
          } else {
            console.error('No suitable container found for model viewer');
            return null;
          }
        }
      } else {
        console.log('Found existing model viewer container');
        // Clear the container
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }

      // Ensure container is visible before initializing Three.js
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.width = '100%';
      container.style.height = '500px';

      // Force a reflow to ensure dimensions are applied
      void container.offsetHeight;
      
      // Get current dimensions after style changes
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      console.log('Container dimensions before initialization:', width, 'x', height);
      
      // Safety check - don't initialize if container has no dimensions
      if (width < 100 || height < 100) {
        console.error('Container dimensions still too small, aborting initialization:', width, 'x', height);
        return null;
      }

      // Create new ModelViewer instance with container ID
      console.log('Creating new ModelViewer instance');
      const viewer = new ModelViewer('model-viewer');
      
      // Immediately initialize it
      console.log('Initializing model viewer');
      await viewer.init();
      
      // Force a resize to ensure proper dimensions
      window.dispatchEvent(new Event('resize'));
      
      return viewer;
    } catch (error) {
      console.error('Error initializing model viewer:', error);
      showModelFallback();
      return null;
    }
  }

  function showModelFallback(sign = '') {
    const container = document.getElementById('model-viewer');
    if (!container) return;

    // Clear existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Create fallback element
    const fallback = document.createElement('div');
    fallback.className = 'model-fallback';
    fallback.innerHTML = `
      <div class="fallback-content">
        <div class="sign-symbol">${sign ? getSignSymbol(sign) : '⚠️'}</div>
        <div class="sign-name">${sign || '3D View'}</div>
        <div class="fallback-message">3D model unavailable</div>
      </div>
    `;
    container.appendChild(fallback);
  }
}); 