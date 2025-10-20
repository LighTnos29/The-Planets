# COSMOS - Interactive Planet Explorer

A stunning 3D space-themed website built with Three.js that allows users to explore different planets through an immersive scroll-based navigation system.

## 🌟 Features

- **Interactive Planet Navigation**: Scroll through 4 unique planets with smooth transitions
- **Space-themed Preloader**: Beautiful loading screen with animated stars and progress tracking
- **Smooth Animations**: Fluid planet rotations with customizable speed and easing
- **Responsive Design**: Optimized for all device sizes
- **Dynamic Content**: Planet names and descriptions update automatically
- **Immersive Experience**: HDR environment mapping and realistic planet textures

## 🪐 Planets Included

1. **CSILLA** - A mysterious ice world covered in crystalline formations and ancient secrets
2. **EARTH** - Our beautiful blue planet, teeming with life and endless wonders
3. **VENUS** - The hottest planet in our solar system, shrouded in thick clouds
4. **VOLCANIC** - A fiery world of molten lava and constant volcanic activity

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd The-Planets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

## 🎮 Usage

- **Scroll Up/Down**: Navigate between planets
- **Loading Screen**: Wait for all textures to load (shows progress from 0-100%)
- **Planet Information**: Each planet displays its name and description automatically
- **Smooth Transitions**: Planets rotate smoothly with a 0.5-second scroll throttle

## 🛠️ Technologies Used

- **Three.js** - 3D graphics and WebGL rendering
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **RGBE Loader** - HDR environment mapping
- **Poppins Font** - Modern typography

## 📁 Project Structure

```
The-Planets/
├── public/
│   ├── stars.jpg                 # Background stars texture
│   ├── csilla/
│   │   └── color.png            # Csilla planet texture
│   ├── earth/
│   │   ├── map.jpg              # Earth planet texture
│   │   └── clouds.jpg           # Earth clouds (future use)
│   ├── venus/
│   │   └── map.jpg              # Venus planet texture
│   └── volcanic/
│       └── color.png            # Volcanic planet texture
├── src/
├── index.html                   # Main HTML file
├── main.js                      # Main JavaScript file
├── style.css                    # Custom CSS styles
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## ⚙️ Configuration

### Customizing Planets

To add or modify planets, edit the `planetData` array in `main.js`:

```javascript
const planetData = [
    {
        name: "PLANET_NAME",
        description: "Planet description here...",
        texture: "./path/to/texture.jpg"
    }
    // Add more planets...
];
```

### Adjusting Animation Speed

Modify the rotation speed in the animation loop:

```javascript
const rotationSpeed = 0.02; // Lower = slower, Higher = faster
```

### Changing Scroll Throttle

Adjust the scroll responsiveness:

```javascript
}, 500); // Milliseconds between scroll events
```

## 🎨 Customization

### Loading Screen

- **Stars**: Modify star positions and animation delays in `style.css`
- **Loading Text**: Update `loadingStages` array in `main.js`
- **Colors**: Change gradient colors in `index.html`

### Planet Layout

- **Orbit Radius**: Adjust `orbitRadius` variable
- **Planet Size**: Modify `radius` variable
- **Segments**: Change `segments` for planet detail level

## 🐛 Troubleshooting

### Common Issues

1. **Textures not loading**: Ensure all texture files exist in the `public` directory
2. **Scroll not working**: Check browser console for JavaScript errors
3. **Loading screen stuck**: Verify all texture paths are correct
4. **Performance issues**: Try reducing planet segments or texture sizes

### Performance Optimization

- Use compressed texture formats (WebP, optimized JPG)
- Reduce texture dimensions if needed
- Lower polygon count for better performance on mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Three.js Community** - For the amazing 3D graphics library
- **Polyhaven** - For HDR environment textures
- **NASA** - For planet texture inspirations
- **Tailwind CSS** - For the utility-first CSS framework

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Enjoy exploring the cosmos! 🌌**
