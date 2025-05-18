# 🌌 Galactic Horoscope

🌌✨ A fun, interactive application that provides users with their astrological sign based on their birth date and generates a personalized cosmic fortune. ✨🌌

## Features

- **Zodiac Sign Determination**: Calculate your zodiac sign based on your birth date
- **Personalized Fortunes**: Receive unique, randomly generated fortunes for your sign
- **Interactive 3D Models**: Explore beautifully rendered 3D models for each zodiac sign using Three.js
- **Multiple Interfaces**:
  - Command Line Interface (CLI) for terminal interactions
  - RESTful API with proper validation and error handling
  - Web UI with a responsive and interactive design
- **Comprehensive Documentation**: API docs available via Swagger UI

## Project Structure

```
├── public/               # Client-side assets
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   │   ├── lib/          # Third-party libraries (Three.js)
│   │   ├── app.js        # Main application logic
│   │   ├── main.js       # Entry point
│   │   └── modelViewer.js # 3D model viewer component
│   ├── models/           # 3D models for zodiac signs
│   ├── index.html        # Main HTML page
│   └── viewer.html       # Zodiac sign viewer page
├── src/                  # Server-side source code
│   ├── index.js          # CLI application
│   └── server.js         # Express API server
├── server.js             # Express static file server for web app
└── package.json          # Project metadata and dependencies
```

## Prerequisites

- Node.js (v14+)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LeighAtkins/GalacticHoroscope.git
   cd GalacticHoroscope
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Web Application

Start the Express server to serve the web application:

```bash
npm run web
```

Then open your browser and navigate to: [http://localhost:3001](http://localhost:3001)

To run with auto-restart on file changes:

```bash
npm run watch:web
```

### CLI Application

For the command-line interface version:

```bash
npm start
```

## Troubleshooting

### 3D Model Loading Issues

If you see error messages in the console about 3D models failing to load with HTML content:

1. Ensure the Express server is running using `npm run web`
2. Verify that the models directory structure is correct:
   ```
   public/models/*.obj
   ```
3. Check that the server is properly configured to serve .obj files with the correct MIME type (configured in server.js)
4. Try accessing model files directly in your browser - e.g., http://localhost:3001/models/aries.obj - to verify they are accessible

The application now includes fallback handling and will display an error message if models cannot be loaded.

### Common Issues

1. **"Cannot read properties of null" errors**: These typically indicate that the application is trying to access DOM elements that don't exist on the current page. The latest version includes proper null checks.

2. **Model loading failures**: The app now validates model responses to ensure HTML isn't being incorrectly returned, provides more detailed error messages, and displays fallback models.

3. **Cross-Origin issues**: The Express server is configured to serve all necessary resources, eliminating cross-origin issues.

4. **Port conflicts**: If port 3001 is already in use, you can change the port in server.js by modifying the PORT constant.

## API Endpoints

- **GET /api/zodiac?month=&day=**: Get zodiac sign based on birth date
- **GET /api/fortune?month=&day=**: Get fortune based on birth date
- **GET /api/horoscope?month=&day=**: Get both zodiac sign and fortune
- **GET /api/models**: Get metadata for all zodiac sign 3D models
- **GET /api/models?sign=**: Get metadata for a specific zodiac sign 3D model

## Development

### Project Structure

```
.
├── config/                  # Configuration files
├── data/                    # Static data files
├── public/                  # Web UI static files
│   ├── css/                 # Stylesheets
│   ├── js/                  # Client-side JavaScript
│   │   ├── lib/             # Third-party libraries (Three.js)
│   │   ├── app.js           # Main application logic
│   │   ├── main.js          # Entry point
│   │   └── modelViewer.js   # 3D model viewer component
│   ├── models/              # 3D models for zodiac signs
│   └── index.html           # Main HTML page
├── src/                     # Source code
│   ├── controllers/         # API controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # 3D model controller and metadata
│   ├── routes/              # API routes
│   ├── swagger/             # API documentation
│   ├── app.ts               # Express application setup
│   ├── index.ts             # CLI entry point
│   ├── server.ts            # Web server entry point
│   ├── simple-server.js     # Simplified Express server
│   └── zodiac.ts            # Zodiac sign logic
└── tests/                   # Test files
```

### Available Scripts

- **`npm start`**: Run the CLI application
- **`npm run build`**: Compile TypeScript to JavaScript
- **`npm run dev`**: Run the CLI with ts-node
- **`npm test`**: Run tests
- **`npm run serve`**: Start the production web server
- **`npm run dev:api`**: Start the development web server
- **`npm run watch:api`**: Start the development web server with auto-restart
- **`npm run simple-server`**: Run the simplified Express server
- **`npm run watch:simple`**: Run the simplified server with auto-restart

## Contributing

Contributions are welcome! Please check out the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.

## 🛠️ Future Enhancements

- Enhanced 3D models with animations and interactions
- Integration with real LLM API for more dynamic fortunes
- User history and sharing features
- Model viewer with AR capabilities for mobile devices

## 📄 License

ISC © [Author] 