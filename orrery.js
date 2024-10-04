// Ensure the Three.js library is properly loaded and set up the scene

let scene = new THREE.Scene(); // Create the scene
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create lighting for better visuals
let ambientLight = new THREE.AmbientLight(0x404040); // Soft light
scene.add(ambientLight);
let pointLight = new THREE.PointLight(0xffffff, 1.5, 100); // Brighter light at the Sun
pointLight.position.set(0, 0, 0);  // Position at the Sun
scene.add(pointLight);

// Debugging Log to see if Renderer is working
console.log('Renderer and scene setup complete.');

// Create the Sun
let sunGeometry = new THREE.SphereGeometry(1, 32, 32);
let sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
let sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Data for planets with distances, sizes, and orbital periods (in Earth years)
const planetsData = [
    { name: 'Mercury', color: 0xaaaaaa, size: 0.2, distance: 2, period: 0.24 },
    { name: 'Venus', color: 0xffa500, size: 0.4, distance: 3.5, period: 0.62 },
    { name: 'Earth', color: 0x0000ff, size: 0.4, distance: 5, period: 1 },
    { name: 'Mars', color: 0xff0000, size: 0.3, distance: 7, period: 1.88 },
    { name: 'Jupiter', color: 0xffa07a, size: 0.7, distance: 9, period: 11.86 },
    { name: 'Saturn', color: 0xffd700, size: 0.6, distance: 11, period: 29.46 },
    { name: 'Uranus', color: 0x87cefa, size: 0.5, distance: 13, period: 84.01 },
    { name: 'Neptune', color: 0x4682b4, size: 0.5, distance: 15, period: 164.79 }
];

// Create planets and their orbits
let planets = [];
planetsData.forEach(data => {
    // Create planet geometry and material
    let planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
    let planetMaterial = new THREE.MeshBasicMaterial({ color: data.color });
    let planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.x = data.distance;
    scene.add(planet);

    // Add orbit (for visual purposes)
    let orbitPoints = new THREE.Path().absarc(0, 0, data.distance, 0, Math.PI * 2).getPoints(64);
    let orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    let orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    let orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate the orbit to be flat
    scene.add(orbit);

    planets.push({ mesh: planet, distance: data.distance, period: data.period });
});

// Set initial camera position for a top-down view
camera.position.set(0, 20, 20);  // Move the camera higher on the Y-axis and a little further on the Z-axis
camera.lookAt(0, 0, 0);          // Ensure the camera is pointing toward the center (the Sun)

// You may also want to adjust the aspect ratio to match your new perspective better
camera.rotation.x = -Math.PI / 4;  // Tilt the camera slightly downward by rotating it along the X-axis


// Variables for user interaction
let showNEOs = document.getElementById('toggle-neos');
let timeSpeedControl = document.getElementById('time-speed');
let neosVisible = true;
let timeSpeed = 1;

// Event listener for time speed adjustment
timeSpeedControl.addEventListener('input', function() {
    timeSpeed = this.value;
});


// Animate the solar system
function animate() {
    requestAnimationFrame(animate);

    // Make planets orbit around the Sun at their own speeds
    let time = Date.now() * (0.00001 * timeSpeed); // Adjust time with the slider
    planets.forEach(planet => {
        // Calculate the planet's position based on its orbital period
        let angle = (time / planet.period) % (2 * Math.PI);
        planet.mesh.position.x = planet.distance * Math.cos(angle);
        planet.mesh.position.z = planet.distance * Math.sin(angle);
    });

    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Debugging Logs
console.log('Animation started.');