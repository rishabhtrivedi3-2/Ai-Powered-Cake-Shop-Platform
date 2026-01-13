// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'siri-glow': 'siri-glow 4s ease-in-out infinite',
      },
      keyframes: {
        'siri-glow': {
          '0%, 100%': { 'box-shadow': '0 0 40px 10px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.4)' },
          '33%': { 'box-shadow': '0 0 60px 15px rgba(236, 72, 153, 0.4), inset 0 0 25px rgba(168, 85, 247, 0.4)' },
          '66%': { 'box-shadow': '0 0 40px 10px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(236, 72, 153, 0.4)' },
        }
      }
    }
  }
}