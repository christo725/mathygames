# Multiplication Fun App - React Version

A fun, interactive React app for kids to practice multiplication tables (focusing on multiplying by 7).

## Features

- Rich, colorful UI with animations using Framer Motion
- Random multiplication problems (1×7 through 12×7 or 7×1 through 7×12)
- Visual progress tracking with animated progress bar
- Sound feedback for correct and incorrect answers using Howler.js
- Celebration animations after each correct answer
- Confetti celebration when all problems are completed
- Responsive design

## Setup

1. Make sure you have Node.js installed
2. Install dependencies:
```
cd multiplication-app-react
npm install
```

3. Add your assets:
   - Copy the celebration GIFs (numbered celebration1.gif through celebration7.gif) to the `src/assets` folder
   - Add sound effects to the `src/assets` folder: 
     - `correct.mp3` - Sound for correct answers
     - `wrong.mp3` - Sound for incorrect answers
     - `celebration.mp3` - Music for the celebration screen
   - Add the `math_fun.png` image to the `src/assets` folder for the start screen

4. Start the development server:
```
npm start
```

## Technology Stack

- React (with Hooks)
- Styled Components for styling
- Framer Motion for animations
- React Confetti for celebration effects
- Howler.js for sound management

## Project Structure

- `src/components/` - React components
  - `StartScreen.js` - Initial screen with start button
  - `GameScreen.js` - Main game screen with problems and answer input
  - `CelebrationScreen.js` - Final celebration screen
- `src/assets/` - Images and sound files 