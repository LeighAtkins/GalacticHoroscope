/**
 * ZodiacModelController
 * 
 * Manages the 3D models for zodiac signs, including:
 * - Model information and metadata
 * - Coordinate mappings between signs
 * - Model optimization utilities
 */

const fs = require('fs');
const path = require('path');

class ZodiacModelController {
  constructor() {
    this.modelsDirectory = path.join(__dirname, '../../public/models');
    this.modelMetadata = this.initializeMetadata();
  }

  /**
   * Initialize metadata for all zodiac sign models
   * @returns {Object} Metadata for all models
   */
  initializeMetadata() {
    return {
      aries: {
        name: 'Aries',
        element: 'Fire',
        symbol: '♈',
        period: '3/21 - 4/19',
        rulingPlanet: 'Mars',
        traits: ['Courageous', 'Energetic', 'Adventurous', 'Enthusiastic', 'Independent'],
        sourceFile: 'aries.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: Math.PI / 4, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      taurus: {
        name: 'Taurus',
        element: 'Earth',
        symbol: '♉',
        period: '4/20 - 5/20',
        rulingPlanet: 'Venus',
        traits: ['Patient', 'Reliable', 'Practical', 'Determined', 'Sensual'],
        sourceFile: 'taurus.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      gemini: {
        name: 'Gemini',
        element: 'Air',
        symbol: '♊',
        period: '5/21 - 6/20',
        rulingPlanet: 'Mercury',
        traits: ['Adaptable', 'Curious', 'Communicative', 'Witty', 'Intellectual'],
        sourceFile: 'gemini.obj',
        modelAttributes: {
          scale: 2.8,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      cancer: {
        name: 'Cancer',
        element: 'Water',
        symbol: '♋',
        period: '6/21 - 7/22',
        rulingPlanet: 'Moon',
        traits: ['Emotional', 'Nurturing', 'Intuitive', 'Protective', 'Empathetic'],
        sourceFile: 'cancer.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      leo: {
        name: 'Leo',
        element: 'Fire',
        symbol: '♌',
        period: '7/23 - 8/22',
        rulingPlanet: 'Sun',
        traits: ['Generous', 'Creative', 'Charismatic', 'Confident', 'Loyal'],
        sourceFile: 'leo.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      virgo: {
        name: 'Virgo',
        element: 'Earth',
        symbol: '♍',
        period: '8/23 - 9/22',
        rulingPlanet: 'Mercury',
        traits: ['Analytical', 'Practical', 'Diligent', 'Detail-oriented', 'Modest'],
        sourceFile: 'virgo.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      libra: {
        name: 'Libra',
        element: 'Air',
        symbol: '♎',
        period: '9/23 - 10/22',
        rulingPlanet: 'Venus',
        traits: ['Diplomatic', 'Balanced', 'Harmonious', 'Fair-minded', 'Social'],
        sourceFile: 'libra.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      scorpio: {
        name: 'Scorpio',
        element: 'Water',
        symbol: '♏',
        period: '10/23 - 11/21',
        rulingPlanet: 'Pluto',
        traits: ['Passionate', 'Resourceful', 'Intuitive', 'Determined', 'Intense'],
        sourceFile: 'scorpio.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      sagittarius: {
        name: 'Sagittarius',
        element: 'Fire',
        symbol: '♐',
        period: '11/22 - 12/21',
        rulingPlanet: 'Jupiter',
        traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Freedom-loving', 'Extroverted'],
        sourceFile: 'sagittarius.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      capricorn: {
        name: 'Capricorn',
        element: 'Earth',
        symbol: '♑',
        period: '12/22 - 1/19',
        rulingPlanet: 'Saturn',
        traits: ['Disciplined', 'Responsible', 'Ambitious', 'Practical', 'Patient'],
        sourceFile: 'capricorn.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      aquarius: {
        name: 'Aquarius',
        element: 'Air',
        symbol: '♒',
        period: '1/20 - 2/18',
        rulingPlanet: 'Uranus',
        traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Inventive'],
        sourceFile: 'aquarius.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      },
      pisces: {
        name: 'Pisces',
        element: 'Water',
        symbol: '♓',
        period: '2/19 - 3/20',
        rulingPlanet: 'Neptune',
        traits: ['Compassionate', 'Artistic', 'Intuitive', 'Dreamy', 'Spiritual'],
        sourceFile: 'pisces.obj',
        modelAttributes: {
          scale: 3.0,
          rotationOffset: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 }
        }
      }
    };
  }

  /**
   * Check if all models have been copied to the public directory
   * @returns {boolean} True if all models exist
   */
  checkModelsExist() {
    let allExist = true;
    
    Object.keys(this.modelMetadata).forEach(sign => {
      const modelPath = path.join(this.modelsDirectory, `${sign}.obj`);
      if (!fs.existsSync(modelPath)) {
        console.error(`Model file for ${sign} does not exist at ${modelPath}`);
        allExist = false;
      }
    });
    
    return allExist;
  }

  /**
   * Get model metadata for a specific sign
   * @param {string} sign - The zodiac sign
   * @returns {Object|null} The metadata or null if not found
   */
  getModelMetadata(sign) {
    const signLower = sign.toLowerCase();
    return this.modelMetadata[signLower] || null;
  }

  /**
   * Get model path for a specific sign
   * @param {string} sign - The zodiac sign
   * @returns {string|null} The model path or null if not found
   */
  getModelPath(sign) {
    const signLower = sign.toLowerCase();
    if (!this.modelMetadata[signLower]) {
      return null;
    }
    
    return path.join(this.modelsDirectory, `${signLower}.obj`);
  }

  /**
   * Get the colors associated with each zodiac sign
   * @returns {Object} Object mapping sign names to their colors
   */
  getSignColors() {
    return {
      aries: '#ff5757',
      taurus: '#7cdf64',
      gemini: '#f8e16c',
      cancer: '#b8e6ff',
      leo: '#ffa726',
      virgo: '#cddc39',
      libra: '#ec407a',
      scorpio: '#7e57c2',
      sagittarius: '#42a5f5',
      capricorn: '#5d4037',
      aquarius: '#00b0ff',
      pisces: '#ab47bc'
    };
  }

  /**
   * Get grouped attributes of signs
   * @returns {Object} Object grouping signs by element, and adding additional metadata
   */
  getSignGroups() {
    const elements = {
      fire: ['aries', 'leo', 'sagittarius'],
      earth: ['taurus', 'virgo', 'capricorn'],
      air: ['gemini', 'libra', 'aquarius'],
      water: ['cancer', 'scorpio', 'pisces']
    };
    
    const qualities = {
      cardinal: ['aries', 'cancer', 'libra', 'capricorn'],
      fixed: ['taurus', 'leo', 'scorpio', 'aquarius'],
      mutable: ['gemini', 'virgo', 'sagittarius', 'pisces']
    };
    
    return { elements, qualities };
  }
}

module.exports = new ZodiacModelController(); 