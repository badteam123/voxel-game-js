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

const speed = 0.00007;
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
    t: 0,

    camera: {
        x: 0,
        y: 0,
        z: 0,
    },

    facing: {
        x: 0,
        y: 0,
        z: 0,
        chunkX: 0,
        chunkY: 0,
        chunkZ: 0,
        block: null,
        ray: new THREE.Raycaster()
    }
};

player.chunk = {
    x: world.gc(player.x),
    y: world.gc(player.y),
    z: world.gc(player.z)
}

var texAtlas;

function setup() {

    var cnv = createCanvas(window.innerWidth, window.innerHeight);
    cnv.position(0, 0);
    pixelDensity(1);
    noSmooth();
    frameRate(9999999);

    texAtlas = new THREE.TextureLoader().load(`https://cdn.jsdelivr.net/gh/badteam123/assets@8286a7f20aa9331b86a7b3ac2401ec4b986ba7da/texsheet.png`);
    texAtlas.magFilter = THREE.NearestFilter;
    texAtlas.minFilter = THREE.NearestFilter;
    texAtlas.wrapS = THREE.RepeatWrapping;
    texAtlas.wrapT = THREE.RepeatWrapping;
 
    world.generateNearby();

    world.compile();

}

function draw() {

    if (deltaTime > 60) {
        deltaTime = 60;
    }

    let inValidChunk = false;

    if (world.chunk[world.gc(player.x)]) {
        if (world.chunk[world.gc(player.x)][world.gc(player.y)]) {
            if (Array.isArray(world.chunk[world.gc(player.x)][world.gc(player.y)][world.gc(player.z)])) {
                inValidChunk = true;
            }
        }
    }

    if (inValidChunk) {
        switch (-keyIsDown(87) + keyIsDown(83) + (keyIsDown(65) * 10) + -(keyIsDown(68) * 10) + 11) {
            case 11://no
                break;
            case 10://W
                player.zVel -= (Math.cos(player.r) * speed) * deltaTime;
                player.xVel -= (Math.sin(player.r) * speed) * deltaTime;
                break;
            case 20://WD
                player.zVel -= (Math.cos(player.r + (PI * 0.25)) * speed) * deltaTime;
                player.xVel -= (Math.sin(player.r + (PI * 0.25)) * speed) * deltaTime;
                break;
            case 21://D
                player.zVel -= (Math.cos(player.r + (PI * 0.5)) * speed) * deltaTime;
                player.xVel -= (Math.sin(player.r + (PI * 0.5)) * speed) * deltaTime;
                break;
            case 22://SD
                player.zVel -= (Math.cos(player.r + (PI * 0.75)) * speed) * deltaTime;
                player.xVel -= (Math.sin(player.r + (PI * 0.75)) * speed) * deltaTime;
                break;
            case 12://S
                player.zVel -= (Math.cos(player.r + (PI)) * speed) * deltaTime;
                player.xVel -= (Math.sin(player.r + (PI)) * speed) * deltaTime;
                break;
            case 2://SA
                player.zVel -= (Math.cos(player.r + (PI * 1.25)) * speed) * deltaTime;
                player.xVel -= (Math.sin(player.r + (PI * 1.25)) * speed) * deltaTime;
                break;
            case 1://A
                player.zVel -= (Math.cos(player.r + (PI * 1.5)) * speed) * deltaTime;
                player.xVel -= (Math.sin(player.r + (PI * 1.5)) * speed) * deltaTime;
                break;
            case 0://WA
                player.zVel -= (Math.cos(player.r + (PI * 1.75)) * speed) * deltaTime;
                player.xVel -= (Math.sin(player.r + (PI * 1.75)) * speed) * deltaTime;
                break;
        }

        if (keyIsDown(32) && player.onGround) {
            player.yVel += jumpHeight;
            player.onGround = false;
        }

        if(Math.abs(player.yVel) > 0.02){
            player.yVel = lerp(player.yVel, 0, 0.01*deltaTime);
        }

        world.collide();

        if (player.xVel != 0) {
            player.x += (player.xVel) * deltaTime;
        }
        if (player.zVel != 0) {
            player.z += (player.zVel) * deltaTime;
        }
        if (player.yVel != 0) {
            player.y += (player.yVel) * deltaTime;
        }

        player.xVel = lerp(player.xVel, 0, (deltaTime * dampening));
        player.zVel = lerp(player.zVel, 0, (deltaTime * dampening));

        if (!isNaN(gravity * deltaTime)) {
            if (Math.abs(player.yVel - (gravity * deltaTime)) <= 0.000005) {
                player.yVel = 0;
            } else if (Math.abs(gravity * deltaTime) > 0.000006) {
                player.yVel -= gravity * deltaTime;
            }
        }
    } else {
        player.xVel = 0;
        player.yVel = 0;
        player.zVel = 0;
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

    if (isNaN(smoothFps)) {
        smoothFps = 60;
    }
    if (deltaTime != undefined) {
        smoothFps = lerp(smoothFps, (1000 / deltaTime), 0.01);
    }

    

    player.camera = {
        x: player.x,
        y: player.y + (halfHeight / 2),
        z: player.z
    }

    hud();

    camera.position.x = player.camera.x;
    camera.position.y = player.camera.y;
    camera.position.z = player.camera.z;
    camera.aspect = window.innerWidth / window.innerHeight;

    updateLighting();

    updateBlockFacing();

    camera.updateProjectionMatrix();

}

function updateLighting(){
    playerLight.position.set(player.camera.x, player.camera.y, player.camera.z);
    let distUnderground = Math.max(-(player.y - ((perlin2D.noise(player.x * world.ground.scale + 100, player.z * world.ground.scale + 100) * world.ground.height) + world.ground.offset)), 0);
    caveLight = Math.min(Math.max(distUnderground*0.1, 0), 1);

    sunLight.intensity = lerp(0.5, 0, caveLight);
    ambientLight.intensity = lerp(0.8, 0, caveLight);
    playerLight.intensity = lerp(0, 0.6, caveLight);
}

function updateBlockFacing() {

    player.facing.ray = new THREE.Raycaster()
    player.facing.ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    let intersects = player.facing.ray.intersectObjects(scene.children, true);

    if (intersects.length >= 1) {
        player.facing.x = Math.round(intersects[0].point.x - (intersects[0].face.normal.x * 0.5));
        player.facing.y = Math.round(intersects[0].point.y - (intersects[0].face.normal.y * 0.5));
        player.facing.z = Math.round(intersects[0].point.z - (intersects[0].face.normal.z * 0.5));

        player.facing.chunkX = world.gc(player.facing.x);
        player.facing.chunkY = world.gc(player.facing.y);
        player.facing.chunkZ = world.gc(player.facing.z);
    }

}

function windowResized() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeCanvas(window.innerWidth, window.innerHeight);
}

document.addEventListener("mousedown", function (event) {
    if (event.button === 0) { // Left mouse button
        requestPointerLock();
        world.removeBlock(player.facing.x, player.facing.y, player.facing.z);
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

generator.onmessage = function (e) {
    world.processChunk(e.data);
    generatorReady = true;
}

generator2.onmessage = function (e) {
    world.processChunk(e.data);
    generator2Ready = true;
}