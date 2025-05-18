// Import our custom modules
import { ModelViewer } from './modelViewer.js';
import { initApp } from './app.js';

// Check if server has models directory
async function checkModelsDirectory() {
    try {
        const response = await fetch('models/');
        if (!response.ok) {
            console.warn('Models directory may not be accessible:', response.status, response.statusText);
            return false;
        }
        return true;
    } catch (error) {
        console.warn('Error checking models directory:', error);
        return false;
    }
}

// Initialize the application
async function init() {
    console.log('Initializing application...');
    
    try {
        // For index.html, DON'T initialize the model viewer yet
        // We'll initialize it on-demand in displayHoroscope
        const isIndexPage = document.body.classList.contains('index-page');
        const modelContainer = document.getElementById('model-viewer');
        
        let modelViewer = null;
        
        // Only initialize model viewer on viewer.html
        if (!isIndexPage && modelContainer) {
            console.log('Initializing model viewer for viewer.html page');
            modelViewer = new ModelViewer('model-viewer');
            await modelViewer.init();
            console.log('Model viewer initialized. No models loaded until user interacts.');
        } else if (isIndexPage) {
            console.log('On index page - skipping model viewer initialization until needed');
        } else {
            console.log('No model viewer container found on this page');
        }
        
        // Initialize the app with the model viewer (if created)
        initApp(modelViewer);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', init); 