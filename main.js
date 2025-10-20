import "./style.css";
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { texture } from "three/tsl";

// Loading Manager
const loadingManager = new THREE.LoadingManager();
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');
const loadingPercentage = document.getElementById('loading-percentage');
const loadingText = document.getElementById('loading-text');

let totalItems = 0;
let loadedItems = 0;

const loadingStages = [
    'Initializing cosmos...',
    'Loading planet textures...',
    'Configuring stellar environment...',
    'Preparing orbital mechanics...',
    'Finalizing universe...'
];

function updateLoadingProgress() {
    const progress = totalItems > 0 ? (loadedItems / totalItems) * 100 : 0;
    const stageIndex = Math.min(Math.floor(progress / 20), loadingStages.length - 1);
    
    loadingBar.style.width = `${progress}%`;
    loadingPercentage.textContent = `${Math.round(progress)}%`;
    loadingText.textContent = loadingStages[stageIndex];
}

loadingManager.onLoad = () => {
    loadingBar.style.width = '100%';
    loadingPercentage.textContent = '100%';
    loadingText.textContent = 'Universe ready!';
    
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Show main content and navbar after loading completes
            document.getElementById('main-content').style.display = 'block';
        }, 1000);
    }, 500);
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    totalItems = itemsTotal;
    loadedItems = itemsLoaded;
    updateLoadingProgress();
};

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);

// Detect mobile device
const isMobile = window.innerWidth <= 768;

// Adjust camera position for mobile
if (isMobile) {
    camera.position.z = 7.5; // Further back to show more of the scene
    camera.position.y = 0.2; // Slightly adjusted view
} else {
    camera.position.z = 9; // Default desktop position
}

// Renderer setup
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// RGBE Loader for HDR textures (with loading manager)
const loader = new RGBELoader(loadingManager);
loader.load("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/moonlit_golf_4k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture;
});

// Adjust sizes for mobile vs desktop
let radius = isMobile ? 1.1 : 1.3; // Slightly smaller planets on mobile
let segments = isMobile ? 32 : 64; // Fewer segments on mobile for performance
let orbitRadius = isMobile ? 4.0 : 4.5; // Adjusted orbit for mobile
const textures = ["./csilla/color.png", "./earth/map.jpg", "./venus/map.jpg", "./volcanic/color.png"]

// Planet data with names and descriptions
const planetData = [
    {
        name: "CSILLA",
        description: "A mysterious ice world covered in crystalline formations and ancient secrets.",
        texture: "./csilla/color.png"
    },
    {
        name: "EARTH",
        description: "Our beautiful blue planet, teeming with life and endless wonders.",
        texture: "./earth/map.jpg"
    },
    {
        name: "VENUS",
        description: "The hottest planet in our solar system, shrouded in thick clouds.",
        texture: "./venus/map.jpg"
    },
    {
        name: "VOLCANIC",
        description: "A fiery world of molten lava and constant volcanic activity.",
        texture: "./volcanic/color.png"
    }
];

let currentPlanetIndex = 1; // Start with Earth (index 1)
let targetRotation = 0;
let isTransitioning = false;

// Create texture loader with loading manager
const textureLoader = new THREE.TextureLoader(loadingManager);

// Create a large background sphere for stars
const starsGeometry = new THREE.SphereGeometry(50, 32, 32);
const starsTexture = textureLoader.load('./stars.jpg');
starsTexture.wrapS = THREE.RepeatWrapping;
starsTexture.wrapT = THREE.RepeatWrapping;
starsTexture.colorSpace = THREE.SRGBColorSpace;
const starsMaterial = new THREE.MeshStandardMaterial({
    opacity: 0.1,
    map: starsTexture,
    side: THREE.BackSide
});
const starsSphere = new THREE.Mesh(starsGeometry, starsMaterial);
scene.add(starsSphere);
const spheres = new THREE.Group()

// Load all planet textures with loading manager
for (let i = 0; i < 4; i++) {
    const texture = textureLoader.load(textures[i]);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);

    const angle = (i / 4) * (Math.PI * 2)
    sphere.position.x = orbitRadius * Math.cos(angle)
    sphere.position.z = orbitRadius * Math.sin(angle)
    spheres.add(sphere);
}
spheres.rotation.x = 0.1
// Adjust positioning for mobile vs desktop
if (isMobile) {
    spheres.position.y = -0.3; // Higher position on mobile for better visibility
} else {
    spheres.position.y = -0.8; // Default desktop position
}
scene.add(spheres);

// Function to update planet name and description in HTML
function updatePlanetInfo() {
    const planetName = document.querySelector('h1');
    const planetDescription = document.querySelector('p');
    
    if (planetName) {
        planetName.textContent = planetData[currentPlanetIndex].name;
    }
    if (planetDescription) {
        planetDescription.textContent = planetData[currentPlanetIndex].description;
    }
}

// Function to rotate to next/previous planet
function rotateToPlanet(direction) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    if (direction === 'next') {
        currentPlanetIndex = (currentPlanetIndex + 1) % planetData.length;
        targetRotation -= Math.PI / 2; // Rotate 90 degrees clockwise
    } else if (direction === 'prev') {
        currentPlanetIndex = (currentPlanetIndex - 1 + planetData.length) % planetData.length;
        targetRotation += Math.PI / 2; // Rotate 90 degrees counter-clockwise
    }
    
    updatePlanetInfo();
    
    // Reset transition flag after animation completes (reduced time for responsiveness)
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Wheel event handler with planet rotation
const throttledWheel = throttle((e) => {
    if (e.deltaY > 0) {
        rotateToPlanet('next');
    } else {
        rotateToPlanet('prev');
    }
}, 500); // Reduced to 0.5 seconds for better responsiveness

// Add wheel event listener
window.addEventListener('wheel', throttledWheel);

// Enhanced mobile touch support
let touchStartY = 0;
let touchEndY = 0;
let isTouching = false;

function handleTouchStart(e) {
    // Avoid interfering with navigation menu touches
    if (e.target.closest('nav') || e.target.closest('#mobile-menu')) {
        return;
    }
    
    isTouching = true;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!isTouching) return;
    
    // Only prevent default if we're not in the navigation area
    if (!e.target.closest('nav') && !e.target.closest('#mobile-menu')) {
        e.preventDefault(); // Prevent scrolling
    }
}

function handleTouchEnd(e) {
    if (!isTouching) return;
    
    // Avoid interfering with navigation menu touches
    if (e.target.closest('nav') || e.target.closest('#mobile-menu')) {
        isTouching = false;
        return;
    }
    
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
    isTouching = false;
}

function handleSwipe() {
    const swipeThreshold = 30; // Reduced threshold for easier swiping
    const deltaY = touchStartY - touchEndY;
    
    if (Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0) {
            // Swipe up - next planet
            rotateToPlanet('next');
        } else {
            // Swipe down - previous planet
            rotateToPlanet('prev');
        }
    }
}

// Add touch event listeners to the entire document for better mobile support
if (isMobile) {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Also add wheel event for mobile browsers that support it
    document.addEventListener('wheel', throttledWheel, { passive: true });
}

// Mobile menu functionality and navigation buttons
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    // Mobile navigation buttons
    const prevPlanetBtn = document.getElementById('prev-planet');
    const nextPlanetBtn = document.getElementById('next-planet');
    
    if (prevPlanetBtn) {
        prevPlanetBtn.addEventListener('click', () => {
            rotateToPlanet('prev');
        });
    }
    
    if (nextPlanetBtn) {
        nextPlanetBtn.addEventListener('click', () => {
            rotateToPlanet('next');
        });
    }
});

// Initialize planet info on load
updatePlanetInfo();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth rotation animation (slower and smoother)
    const rotationSpeed = 0.02;
    const currentRotation = spheres.rotation.y;
    const rotationDiff = targetRotation - currentRotation;
    
    if (Math.abs(rotationDiff) > 0.0001) {
        spheres.rotation.y += rotationDiff * rotationSpeed;
    } else {
        spheres.rotation.y = targetRotation;
    }
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});
