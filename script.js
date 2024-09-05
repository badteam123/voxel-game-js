const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.01, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//scene.fog = new THREE.FogExp2( 0x000000, 0.01 );

// Add directional light

const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
sunLight.position.set(40, 100, 16);
//sunLight.castShadow = true;
scene.add(sunLight);
scene.add(sunLight.target);
sunLight.target.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const playerLight = new THREE.PointLight(0xffc996, 0, 12);
scene.add(playerLight);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

const playerHeight = 1.8;
const playerWidth = playerHeight * 0.3;
const halfHeight = playerHeight * 0.5;
const halfWidth = playerWidth * 0.5;
const stepHeight = 0.6;

const speed = 0.03;
const gravity = 0.000024;
const jumpHeight = 0.008;
const dampening = 0.012;

var world = new World();

const perlin2D = new PerlinNoise2D(world.seed);
const perlin3D = new PerlinNoise3D(world.seed);

var mouse = {
    l: false,
    r: false,
    m: false
}

var player = {
    x: 0,
    y: 0,
    z: 0,
    xVel: 0,
    yVel: 0,
    zVel: 0,
    r: 0,
    t: 0
};

var texAtlas;

function setup() {

    var cnv = createCanvas(window.innerWidth, window.innerHeight);
    cnv.position(0, 0);
    pixelDensity(1);
    noSmooth();
    frameRate(9999999);

    texAtlas = new THREE.TextureLoader().load(`assets/texsheet.png`);
    texAtlas.magFilter = THREE.NearestFilter;
    texAtlas.minFilter = THREE.NearestFilter;
    texAtlas.wrapS = THREE.RepeatWrapping;
    texAtlas.wrapT = THREE.RepeatWrapping;
 
    world.generateSpawn();

}

function draw() {

    if (deltaTime > 60) {
        deltaTime = 60;
    }

        switch (-keyIsDown(87) + keyIsDown(83) + (keyIsDown(65) * 10) + -(keyIsDown(68) * 10) + 11) {
            case 11://no
                break;
            case 10://W
                player.z -= (Math.cos(player.r) * speed) * deltaTime;
                player.x -= (Math.sin(player.r) * speed) * deltaTime;
                break;
            case 20://WD
                player.z -= (Math.cos(player.r + (PI * 0.25)) * speed) * deltaTime;
                player.x -= (Math.sin(player.r + (PI * 0.25)) * speed) * deltaTime;
                break;
            case 21://D
                player.z -= (Math.cos(player.r + (PI * 0.5)) * speed) * deltaTime;
                player.x -= (Math.sin(player.r + (PI * 0.5)) * speed) * deltaTime;
                break;
            case 22://SD
                player.z -= (Math.cos(player.r + (PI * 0.75)) * speed) * deltaTime;
                player.x -= (Math.sin(player.r + (PI * 0.75)) * speed) * deltaTime;
                break;
            case 12://S
                player.z -= (Math.cos(player.r + (PI)) * speed) * deltaTime;
                player.x -= (Math.sin(player.r + (PI)) * speed) * deltaTime;
                break;
            case 2://SA
                player.z -= (Math.cos(player.r + (PI * 1.25)) * speed) * deltaTime;
                player.x -= (Math.sin(player.r + (PI * 1.25)) * speed) * deltaTime;
                break;
            case 1://A
                player.z -= (Math.cos(player.r + (PI * 1.5)) * speed) * deltaTime;
                player.x -= (Math.sin(player.r + (PI * 1.5)) * speed) * deltaTime;
                break;
            case 0://WA
                player.z -= (Math.cos(player.r + (PI * 1.75)) * speed) * deltaTime;
                player.x -= (Math.sin(player.r + (PI * 1.75)) * speed) * deltaTime;
                break;
        }

        if (keyIsDown(32)) {
            player.y += speed*deltaTime;
        }
        if (keyIsDown(16)) {
            player.y -= speed*deltaTime;
        }

    camera.rotateX(-player.t);
    camera.rotateY(-player.r);

    let rotateCam = 0;
    let tiltCam = 0;

    rotateCam = (round(-movedX, 4) * 0.003);
    tiltCam = (round(movedY, 4) * 0.003);

    player.r += (rotateCam * deltaTime) / 8;
    player.t -= (tiltCam * deltaTime) / 8;

    if (player.t >= 1.45) {
        player.t = 1.45;
    } else if (player.t <= -1.45) {
        player.t = -1.45;
    }

    if (player.r > Math.PI) {
        player.r -= Math.PI * 2;
    } else if (player.r < -Math.PI) {
        player.r += Math.PI * 2;
    }
    camera.rotateY(player.r);
    camera.rotateX(player.t);

    camera.position.x = player.x;
    camera.position.y = player.y;
    camera.position.z = player.z;
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

}

function windowResized() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeCanvas(window.innerWidth, window.innerHeight);
}

document.addEventListener("mousedown", function (event) {
    if (event.button === 0) { // Left mouse button
        requestPointerLock();
        //world.removeBlock(player.facing.x, player.facing.y, player.facing.z);
        mouse.l = true;
    }
    if (event.button === 2) { // Right mouse button
        mouse.r = true;
    }
    if (event.button === 1) { // Middle mouse button
        mouse.m = true;
    }
});

document.addEventListener("mouseup", function (event) {
    if (event.button === 0) { // Left mouse button
        mouse.l = false;
    }
    if (event.button === 2) { // Right mouse button
        mouse.r = false;
    }
    if (event.button === 1) { // Middle mouse button
        mouse.m = false;
    }
});