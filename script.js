// For Node.js environments
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question("What's your name? ", name => {
    console.log(`Hello, ${name}!`);
    readline.close();
  });