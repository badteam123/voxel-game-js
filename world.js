class World {
    constructor() {
        this.chunk = {};
        this.chunkModel = {};

        this.chunkSize = 8;

        this.seed = Math.random() * 100;

        this.cave = {
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            threshold: 0.5
        }
    }

    generateSpawn(){
        for(let x=-3; x<4; x++){
            for(let y=-1; y<1; y++){
                for(let z=-3; z<4; z++){

                    console.log(x, y, z);
                    this.generateChunk(x, y, z);
                    this.compileChunk(x, y, z);
                }
            }
        }
    }

    compileChunk(x, y, z) {

        if (this.chunkModel[x][y][z].model) {
            scene.remove(this.chunkModel[x][y][z].model);
            this.chunkModel[x][y][z].model.geometry.dispose();
            this.chunkModel[x][y][z].model.material.dispose();
        }

        let vertices = [];
        let indices = [];
        let UVs = [];

        let totalIndices = 0;

        for (let x2 = 0; x2 < this.chunkSize; x2++) {
            for (let y2 = 0; y2 < this.chunkSize; y2++) {
                for (let z2 = 0; z2 < this.chunkSize; z2++) {
                    let block = this.chunk[x][y][z][x2][y2][z2];

                    // Back (z-)
                    if (!this.getBlock(block.x, block.y, block.z - 1)) {
                        vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                        vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                        vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                        vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                        UVs.push(block.lx, block.ly);
                        UVs.push(block.lx, block.hy);
                        UVs.push(block.hx, block.hy);
                        UVs.push(block.hx, block.ly);
                        indices.push(0 + totalIndices, 1 + totalIndices, 2 + totalIndices, 0 + totalIndices, 2 + totalIndices, 3 + totalIndices);
                        totalIndices += 4;
                    }


                    // Front (z+)
                    if (!this.getBlock(block.x, block.y, block.z + 1)) {
                        vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                        vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                        vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                        vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                        UVs.push(block.lx, block.ly);
                        UVs.push(block.lx, block.hy);
                        UVs.push(block.hx, block.hy);
                        UVs.push(block.hx, block.ly);
                        indices.push(0 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices);
                        totalIndices += 4;
                    }

                    // Left (x-)
                    if (!this.getBlock(block.x - 1, block.y, block.z)) {
                        vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                        vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                        vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                        vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                        UVs.push(block.hx, block.hy);
                        UVs.push(block.lx, block.hy);
                        UVs.push(block.lx, block.ly);
                        UVs.push(block.hx, block.ly);
                        indices.push(2 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices);
                        totalIndices += 4;
                    }

                    // Right (x+)
                    if (!this.getBlock(block.x + 1, block.y, block.z)) {
                        vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                        vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                        vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                        vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                        UVs.push(block.hx, block.hy);
                        UVs.push(block.lx, block.hy);
                        UVs.push(block.lx, block.ly);
                        UVs.push(block.hx, block.ly);
                        indices.push(0 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices);
                        totalIndices += 4;
                    }

                    // Bottom (y-)
                    if (!this.getBlock(block.x, block.y - 1, block.z)) {
                        vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                        vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                        vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                        vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                        UVs.push(block.lx, block.ly);
                        UVs.push(block.lx, block.hy);
                        UVs.push(block.hx, block.hy);
                        UVs.push(block.hx, block.ly);
                        indices.push(0 + totalIndices, 3 + totalIndices, 2 + totalIndices, 0 + totalIndices, 2 + totalIndices, 1 + totalIndices);
                        totalIndices += 4;
                    }

                    // Top (y+)
                    if (!this.getBlock(block.x, block.y + 1, block.z)) {
                        vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                        vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                        vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                        vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                        UVs.push(block.lx, block.hy);
                        UVs.push(block.lx, block.ly);
                        UVs.push(block.hx, block.ly);
                        UVs.push(block.hx, block.hy);
                        indices.push(1 + totalIndices, 3 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices);
                        totalIndices += 4;
                    }
                }
            }
        }

        let vertices2 = new Float32Array(vertices);
        let indices2 = new Uint16Array(indices);
        let UVs2 = new Float32Array(UVs);

        let geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(UVs2, 2));
        geometry.setIndex(new THREE.BufferAttribute(indices2, 1));

        geometry.computeVertexNormals();

        let material = new THREE.MeshStandardMaterial({ map: texAtlas, side: THREE.FrontSide });
        this.chunkModel[x][y][z].model = new THREE.Mesh(geometry, material);

        scene.add(this.chunkModel[x][y][z].model);
        this.chunkModel[x][y][z].rendered = true;

    }

    generateChunk(x, y, z) {
        this.ensureChunkExists(x, y, z);
        if (this.doesChunkExist(x, y, z)) {
            for (let x2 = 0; x2 < this.chunkSize; x2++) {
                for (let z2 = 0; z2 < this.chunkSize; z2++) {
                    let x3 = x2 + (x*this.chunkSize);
                    let z3 = z2 + (z*this.chunkSize);
                    let groundHeight = perlin2D.noise((x3*0.1) + 1255, (z3*0.1) + 2367);
                    for (let y2 = 0; y2 < this.chunkSize; y2++) {
                        let y3 = y2 + (y*this.chunkSize);
                        if (perlin3D.noise(x3 * this.cave.scaleX + 1246, y3 * this.cave.scaleY + 1285, z3 * this.cave.scaleZ + 1983) < this.cave.threshold) {
                            // grass
                            if (y3 === groundHeight) {
                                this.chunk[x][y][z][x2][y2][z2] = new Block("grass", x3, y3, z3);
                            }

                            // dirt
                            else if (y3 < groundHeight && y3 > groundHeight - 3) {
                                this.chunk[x][y][z][x2][y2][z2] = new Block("dirt", x3, y3, z3);
                            }

                            // stone
                            else if (y3 <= groundHeight - 3) {
                                this.chunk[x][y][z][x2][y2][z2] = new Block("stone", x3, y3, z3);
                            }

                            else {
                                this.chunk[x][y][z][x2][y2][z2] = new Block(null);
                            }
                        } else {
                            this.chunk[x][y][z][x2][y2][z2] = new Block(null);
                        }
                    }
                }
            }
        }
    }

    ensureChunkExists(x, y, z, blockMode) {
        let [x2, y2, z2] = [x, y, z];
        if (blockMode) {
            ck = this.gc(x, y, z);
            [x2, y2, z2] = ck;
        }
        if (!this.chunk[x2]) {
            this.chunk[x2] = {};
        }
        if (!this.chunk[x2][y2]) {
            this.chunk[x2][y2] = {};
        }
        if (!this.chunk[x2][y2][z2]) {
            this.chunk[x2][y2][z2] = [];
        }
        for (let a = 0; a < this.chunkSize; a++) {
            this.chunk[x2][y2][z2].push([]);
            for (let b = 0; b < this.chunkSize; b++) {
                this.chunk[x2][y2][z2][a].push([]);
                for (let c = 0; c < this.chunkSize; c++) {
                    this.chunk[x2][y2][z2][a][b].push(new Block(null));
                }
            }
        }
        if (!this.chunkModel[x2]) {
            this.chunkModel[x2] = {};
        }
        if (!this.chunkModel[x2][y2]) {
            this.chunkModel[x2][y2] = {};
        }
        if (!this.chunkModel[x2][y2][z2]) {
            this.chunkModel[x2][y2][z2] = {};
        }
    }

    doesChunkExist(x, y, z, blockMode) {
        let [x2, y2, z2] = [x, y, z];
        if (blockMode) {
            ck = this.gc(x, y, z);
            [x2, y2, z2] = ck;
        }
        return !(!this.chunk[x2] || !this.chunk[x2][y2] || !this.chunk[x2][y2][z2]);
    }

    getBlock(x, y, z) {
        let ck = this.gc(x, y, z);
        if (this.doesChunkExist(ck[0], ck[1], ck[2], false)) {
            console.log(x % this.chunkSize);
            return this.chunk[ck[0]][ck[1]][ck[2]][Math.abs(x % this.chunkSize)][Math.abs(y % this.chunkSize)][Math.abs(z % this.chunkSize)];
        }
    }

    setBlock(type, x, y, z, cx, cy, cz) {
        if (arguments.length === 4) {
            let ck = this.gc(x, y, z);
            if (this.doesChunkExist(gc[0], gc[1], gc[2])) {
                this.chunk[ck[0]][ck[1]][ck[2]][x % this.chunkSize][y % this.chunkSize][z % this.chunkSize] = new Block(type, x, y, z);
            }
        } else {
            if (this.doesChunkExist(cx, cy, cz)) {
                this.chunk[cx][cy][cz][x][y][z] = new Block(type, x, y, z);
            }
        }
    }

    setBlockRaw(type, x, y, z, cx, cy, cz) {
        if (arguments.length === 4) {
            let ck = this.gc(x, y, z);
            this.chunk[ck[0]][ck[1]][ck[2]][x % this.chunkSize][y % this.chunkSize][z % this.chunkSize] = new Block(type, x, y, z);
        } else {
            this.chunk[cx][cy][cz][x][y][z] = new Block(type, x, y, z);
        }
    }

    gc(x, y, z) {
        return [Math.round(x / this.chunkSize), Math.round(y / this.chunkSize), Math.round(z / this.chunkSize)];
    }
}

/*

if (this.chunkModel[x][y][z].model === undefined) {

} else {
    scene.remove(this.chunkModel[x][y][z].model);
    this.chunkModel[x][y][z].model.geometry.dispose();
    this.chunkModel[x][y][z].model.material.dispose();
}

let vertices = [];
let indices = [];
let UVs = [];

let totalIndices = 0;

let chunk = this.chunk[x][y][z];

let lngth = this.chunk[x][y][z].length

for (let b = 0; b < lngth; b++) {
    let block = chunk[b];

    // Back (z-)
    if (!this.checkForBlock(chunk, block.x, block.y, block.z - 1)) {
        vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
        vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
        vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
        vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
        UVs.push(block.lx, block.ly);
        UVs.push(block.lx, block.hy);
        UVs.push(block.hx, block.hy);
        UVs.push(block.hx, block.ly);
        indices.push(0 + totalIndices, 1 + totalIndices, 2 + totalIndices, 0 + totalIndices, 2 + totalIndices, 3 + totalIndices);
        totalIndices += 4;
    }


    // Front (z+)
    if (!this.checkForBlock(chunk, block.x, block.y, block.z + 1)) {
        vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
        vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
        vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
        vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
        UVs.push(block.lx, block.ly);
        UVs.push(block.lx, block.hy);
        UVs.push(block.hx, block.hy);
        UVs.push(block.hx, block.ly);
        indices.push(0 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices);
        totalIndices += 4;
    }

    // Left (x-)
    if (!this.checkForBlock(chunk, block.x - 1, block.y, block.z)) {
        vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
        vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
        vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
        vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
        UVs.push(block.hx, block.hy);
        UVs.push(block.lx, block.hy);
        UVs.push(block.lx, block.ly);
        UVs.push(block.hx, block.ly);
        indices.push(2 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices);
        totalIndices += 4;
    }

    // Right (x+)
    if (!this.checkForBlock(chunk, block.x + 1, block.y, block.z)) {
        vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
        vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
        vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
        vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
        UVs.push(block.hx, block.hy);
        UVs.push(block.lx, block.hy);
        UVs.push(block.lx, block.ly);
        UVs.push(block.hx, block.ly);
        indices.push(0 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices);
        totalIndices += 4;
    }

    // Bottom (y-)
    if (!this.checkForBlock(chunk, block.x, block.y - 1, block.z)) {
        vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
        vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
        vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
        vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
        UVs.push(block.lx, block.ly);
        UVs.push(block.lx, block.hy);
        UVs.push(block.hx, block.hy);
        UVs.push(block.hx, block.ly);
        indices.push(0 + totalIndices, 3 + totalIndices, 2 + totalIndices, 0 + totalIndices, 2 + totalIndices, 1 + totalIndices);
        totalIndices += 4;
    }

    // Top (y+)
    if (!this.checkForBlock(chunk, block.x, block.y + 1, block.z)) {
        vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
        vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
        vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
        vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
        UVs.push(block.lx, block.hy);
        UVs.push(block.lx, block.ly);
        UVs.push(block.hx, block.ly);
        UVs.push(block.hx, block.hy);
        indices.push(1 + totalIndices, 3 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices);
        totalIndices += 4;
    }
}

let vertices2 = new Float32Array(vertices);
let indices2 = new Uint16Array(indices);
let UVs2 = new Float32Array(UVs);

let geometry = new THREE.BufferGeometry();

geometry.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
geometry.setAttribute('uv', new THREE.BufferAttribute(UVs2, 2));
geometry.setIndex(new THREE.BufferAttribute(indices2, 1));

geometry.computeVertexNormals();

let material = new THREE.MeshStandardMaterial({ map: grassTex, side: THREE.FrontSide });
this.chunkModel[x][y][z].model = new THREE.Mesh(geometry, material);

scene.add(this.chunkModel[x][y][z].model);
this.chunkModel[x][y][z].rendered = true;

*/