

# Cosmic Quiz Challenge 🌌🚀

A visually stunning, space-themed quiz application that tests your knowledge of astronomy and space exploration. Dive into this interactive experience featuring dynamic scoring, time-based challenges, and a cosmic leaderboard!
![Screenshot 2025-04-18 171919](https://github.com/user-attachments/assets/7286859d-3749-4a8d-818c-0e68183e363a)
![Screenshot 2025-04-18 171958](https://github.com/user-attachments/assets/36a40027-99d6-4ba7-bd8e-de371d9bbda9)
![Screenshot 2025-04-18 172057](https://github.com/user-attachments/assets/fa1c57de-f266-4d77-b5fe-c0409698138c)
![Screenshot 2025-04-18 172159](https://github.com/user-attachments/assets/28b9d645-33f6-4c7f-89e6-b40a06471a35)

## Features ✨

- **Immersive Space Theme**: Stunning gradients and cosmic animations
- **Interactive Quiz Mechanics**:
  - 10 astronomy-themed questions
  - 30-second timer per question
  - Time-based scoring system
  - Instant answer feedback with animations
- **Dynamic Leaderboard**:
  - Top 10 scores persistence using localStorage
  - Podium display for top 3 scores
  - Historical performance tracking
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Engaging Visuals**:
  - Confetti particle effects for correct answers
  - Progress bar with gradient animation
  - Floating rocket animations

## Technologies Used 💻

- **Frontend**: HTML5, CSS3 (with Tailwind CSS framework)
- **Animations**: Custom CSS keyframes and transitions
- **Icons**: Font Awesome 6
- **Storage**: Browser localStorage for leaderboard
- **Special Effects**: Custom confetti particle system

## Installation & Usage 🚀

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lkroy/cosmic-quiz-challenge.git
   ```

2. **Open in browser**:
   - Simply open `index.html`  and 'script.js' in any modern web browser
   - No server required - works completely client-side!

3. **How to play**:
   - Enter your cosmic name at the welcome screen
   - Answer 10 space-related questions under time pressure
   - Earn bonus points for quick correct answers
   - Review your final score and compare with others on the leaderboard

## Customization 🛠️

Easily modify the quiz by editing these sections in the code:

1. **Add/Modify Questions**:
   ```javascript
   const questions = [
     {
       question: "New question text?",
       options: ["Option1", "Option2", "Option3", "Option4"],
       answer: 0 // Index of correct answer
     },
     // Add more questions here
   ];
   ```

2. **Change Visual Theme**:
   - Modify gradient colors in the CSS `linear-gradient` values
   - Adjust animation timing in `transition` and `animation` properties

3. **Scoring System**:
   ```javascript
   // Adjust the scoring formula in selectAnswer function
   const timeBonus = Math.floor(timeLeft * 3); // Modify multiplier
   score += 100 + timeBonus; // Adjust base points
   ```

## Contributing 🤝

Contributions are welcome! Here's how you can help:

1. **Report bugs** or suggest features through Issues
2. **Add new questions** to the quiz database
3. **Improve animations** and visual effects
4. **Enhance mobile responsiveness**
5. **Add new features** like:
   - Sound effects
   - Different difficulty levels
   - Category selection
   - Social sharing options

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Laddu Kumar Roy• 🚀 Shoot for the stars! 🌠
