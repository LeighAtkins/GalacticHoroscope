/**
 * ModelViewer - A Three.js based zodiac sign model viewer
 * This utility handles loading and displaying 3D models for each zodiac sign
 */

import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { OBJLoader } from './lib/OBJLoader.js';

export class ModelViewer {
  constructor(containerId) {
    if (typeof containerId !== 'string') {
      throw new Error('Container ID must be a string');
    }
    this.containerId = containerId;
    this.container = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.model = null;
    this.controls = null;
    this.loadingManager = null;
    this.objLoader = null;
  }

  async init() {
    try {
      // Get container element
      this.container = document.getElementById(this.containerId);
      if (!this.container) {
        throw new Error(`Container element with ID '${this.containerId}' not found`);
      }

      // Ensure the container is actually in the DOM and visible before measuring
      if (!this.container.offsetParent) {
        console.warn('Container is not visible in DOM - forcing display');
        this.container.style.display = 'block';
        this.container.style.visibility = 'visible';
      }

      // Setup Three.js scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x111a2b);

      // Ensure container has adequate dimensions before initialization
      // Get dimensions after any style changes
      const width = this.container.clientWidth || 500;  // Fallback width
      const height = this.container.clientHeight || 500;  // Fallback height
      
      console.log(`ModelViewer initializing with dimensions: ${width}x${height}`);

      if (width < 100 || height < 100) {
        console.warn('Container dimensions too small, using explicit dimensions');
        this.container.style.width = '100%';
        this.container.style.height = '500px';
        // Force reflow to apply styles
        void this.container.offsetHeight;
      }

      // Setup camera with proper dimensions
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 5);  // Set initial camera position

      // Setup renderer with proper dimensions
      this.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      // Clear container and append renderer
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
      this.container.appendChild(this.renderer.domElement);
      
      // Ensure the canvas is fully visible with explicit styles
      this.renderer.domElement.style.display = 'block';
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';

      // Setup controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 2;
      this.controls.maxDistance = 10;
      this.controls.target.set(0, 0, 0);  // Set controls target to origin

      // Setup loading manager
      this.loadingManager = new THREE.LoadingManager();
      this.loadingManager.onProgress = (url, loaded, total) => {
        const progress = (loaded / total) * 100;
        console.log(`${Math.round(progress)}% loaded`);
      };

      // Initialize OBJLoader
      this.objLoader = new OBJLoader(this.loadingManager);

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      this.scene.add(directionalLight);

      // Start animation loop
      this.animate();
      
      // Add resize handler
      window.addEventListener('resize', this.onWindowResize.bind(this));
      
      // Force an initial resize to ensure proper dimensions
      this.onWindowResize();
      
      // Render once immediately
      this.renderer.render(this.scene, this.camera);
      
      console.log('ModelViewer initialized successfully');
    } catch (error) {
      console.error('Error initializing ModelViewer:', error);
      this.showFallback();
      throw error;
    }
  }

  showFallback() {
    if (!this.container) return;
    
    // Clear container
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    // Create and show fallback content
    const fallback = document.createElement('div');
    fallback.className = 'model-fallback';
    fallback.innerHTML = `
      <div class="fallback-content">
        <div class="sign-symbol">⚠️</div>
        <div class="sign-name">3D View Unavailable</div>
        <div class="fallback-message">Could not initialize 3D viewer</div>
      </div>
    `;
    this.container.appendChild(fallback);
  }

  animate() {
    if (!this.renderer || !this.scene || !this.camera) return;
    
    requestAnimationFrame(this.animate.bind(this));
    
    if (this.controls) {
      this.controls.update();
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  async loadModel(modelPath) {
    if (!this.scene || !this.objLoader) {
      console.error('Scene or OBJLoader not initialized');
      return;
    }

    try {
      console.log('Loading model from:', modelPath);
      
      // Remove existing model if any
      if (this.model) {
        this.scene.remove(this.model);
        this.model = null;
      }

      // Determine full path
      const fullPath = modelPath.startsWith('/') ? modelPath : `/models/${modelPath}.obj`;
      console.log('Attempting to load model from full path:', fullPath);

      // Load the model
      const model = await this.objLoader.loadAsync(fullPath);

      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Calculate scale to fit in view
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;  // Reduced scale for better visibility
      model.scale.multiplyScalar(scale);
      
      // Center the model
      model.position.sub(center.multiplyScalar(scale));
      
      // Add to scene
      this.scene.add(model);
      this.model = model;

      // Reset camera and controls
      this.camera.position.set(0, 2, 5);  // Adjusted camera position
      this.controls.target.set(0, 0, 0);  // Look at center
      this.controls.update();

      console.log('Model loaded and positioned successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      this.showFallback();
    }
  }

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) {
      console.warn('Cannot resize: missing components');
      return;
    }
    
    // Ensure container is visible
    this.container.style.display = 'block';
    this.container.style.visibility = 'visible';
    
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    console.log(`Resizing to: ${width}x${height}`);
    
    if (width < 50 || height < 50) {
      console.warn('Container dimensions are too small:', width, 'x', height);
      return;
    }
    
    // Update camera
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    // Update renderer
    this.renderer.setSize(width, height, true);
    
    // Ensure the canvas is visible and properly sized
    if (this.renderer.domElement) {
      this.renderer.domElement.style.display = 'block';
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
    }
    
    // Force a render
    this.renderer.render(this.scene, this.camera);
  }

  // Cleanup method
  dispose() {
    if (this.controls) {
      this.controls.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    // Remove event listeners and clear references
    window.removeEventListener('resize', () => this.onWindowResize());
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;
  }
} 