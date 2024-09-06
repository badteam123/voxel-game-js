class World {
    constructor() {
        this.chunk = {};
        this.chunkModel = {};

        this.chunkSize = 64;

        this.seed = Math.random() * 100;

        this.initialLoad = {
            horizP: 1,
            horizN: 1,
            vertP: 0,
            vertN: 1
        }

        this.ground = {
            scaleX: 0.05,
            scaleY: 7,
            scaleZ: 0.05
        }

        this.cave = {
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            threshold: 0.5
        }
    }

    generateSpawn() {
        for (let x = -this.initialLoad.horizN; x < this.initialLoad.horizP+1; x++) {
            for (let y = -this.initialLoad.vertN; y < this.initialLoad.vertP+1; y++) {
                for (let z = -this.initialLoad.horizN; z < this.initialLoad.horizP+1; z++) {
                    this.generateChunk(x, y, z);
                }
            }
        }
        for (let x = -this.initialLoad.horizN; x < this.initialLoad.horizP+1; x++) {
            for (let y = -this.initialLoad.vertN; y < this.initialLoad.vertP+1; y++) {
                for (let z = -this.initialLoad.horizN; z < this.initialLoad.horizP+1; z++) {
                    this.compileChunk(x, y, z);
                }
            }
        }

        player.x = this.chunkSize/2;
        player.y = 6;
        player.z = this.chunkSize/2;
    }

    compileChunk(xc, yc, zc) {

        if (this.chunkModel[xc][yc][zc].model) {
            scene.remove(this.chunkModel[x][y][z].model);
            this.chunkModel[xc][yc][zc].model.geometry.dispose();
            this.chunkModel[xc][yc][zc].model.material.dispose();
        }

        let vertices = [];
        let indices = [];
        let UVs = [];

        let totalIndices = 0;

        for (let x2 = 0; x2 < this.chunkSize; x2++) {
            for (let y2 = 0; y2 < this.chunkSize; y2++) {
                for (let z2 = 0; z2 < this.chunkSize; z2++) {
                    let templx;
                    let temply;
                    switch(this.chunk[xc][yc][zc][x2][y2][z2]){
                        case -1:
                            templx = 0;
                            temply = 0;
                            break;
                        case 0:
                            templx = 0;
                            temply = 0.9;
                            break;
                        case 1:
                            templx = 0.1;
                            temply = 0.9;
                            break;
                        case 2:
                            templx = 0.2;
                            temply = 0.9;
                            break;
                    }

                    let block = {
                        x: x2 + (xc*this.chunkSize),
                        y: y2 + (yc*this.chunkSize),
                        z: z2 + (zc*this.chunkSize),
                        lx: templx,
                        ly: temply,
                        hx: templx + 0.1,
                        hy: temply + 0.1
                    };

                    if (this.chunk[xc][yc][zc][x2][y2][z2] != -1) {

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
        }

        let vertices2 = new Float32Array(vertices);
        let indices2 = new Uint32Array(indices);
        let UVs2 = new Float32Array(UVs);

        let geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(UVs2, 2));
        geometry.setIndex(new THREE.BufferAttribute(indices2, 1));

        geometry.computeVertexNormals();

        let material = new THREE.MeshStandardMaterial({ map: texAtlas, side: THREE.FrontSide });
        this.chunkModel[xc][yc][zc].model = new THREE.Mesh(geometry, material);

        scene.add(this.chunkModel[xc][yc][zc].model);
        this.chunkModel[xc][yc][zc].rendered = true;

    }

    generateChunk(x, y, z) {
        this.ensureChunkExists(x, y, z);
        if (this.doesChunkExist(x, y, z)) {
            for (let x2 = 0; x2 < this.chunkSize; x2++) {
                for (let z2 = 0; z2 < this.chunkSize; z2++) {
                    let x3 = x2 + (x * this.chunkSize);
                    let z3 = z2 + (z * this.chunkSize);
                    let groundHeight = Math.round(perlin2D.noise((x3 * this.ground.scaleX) + 1255, (z3 * this.ground.scaleZ) + 2367)*this.ground.scaleY);
                    for (let y2 = 0; y2 < this.chunkSize; y2++) {
                        let y3 = y2 + (y * this.chunkSize);
                        if (perlin3D.noise(x3 * this.cave.scaleX + 1246, y3 * this.cave.scaleY + 1285, z3 * this.cave.scaleZ + 1983) < this.cave.threshold) {
                            
                            // grass
                            if (y3 === groundHeight) {
                                this.chunk[x][y][z][x2][y2][z2] = 0; //new Block("grass", x3, y3, z3);
                            }

                            // dirt
                            else if (y3 < groundHeight && y3 > groundHeight - 3) {
                                this.chunk[x][y][z][x2][y2][z2] = 1; //new Block("dirt", x3, y3, z3);
                            }

                            // stone
                            else if (y3 <= groundHeight - 3) {
                                this.chunk[x][y][z][x2][y2][z2] = 2; //new Block("stone", x3, y3, z3);
                            }

                            else {
                                this.chunk[x][y][z][x2][y2][z2] = -1; //new Block(null);
                            }
                        } else {
                            this.chunk[x][y][z][x2][y2][z2] = -1; //new Block(null);
                        }
                    }
                }
            }
        }
    }

    ensureChunkExists(x, y, z, blockMode) {
        let [x2, y2, z2] = [x, y, z];
        let ck;
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
                    this.chunk[x2][y2][z2][a][b].push(-1); //(new Block(null));
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
        let ck;
        if (blockMode) {
            ck = this.gc(x, y, z);
            [x2, y2, z2] = ck;
        }
        return !(!this.chunk[x2] || !this.chunk[x2][y2] || !this.chunk[x2][y2][z2]);
    }

    getBlock(x, y, z) {
        let ck = this.gc(x, y, z);
        if (this.doesChunkExist(ck[0], ck[1], ck[2], false)) {
            return this.chunk[ck[0]][ck[1]][ck[2]][mod(x, this.chunkSize)][mod(y, this.chunkSize)][mod(z, this.chunkSize)] != -1;
        }
    }

    setBlock(type, x, y, z, cx, cy, cz) {
        if (arguments.length === 4) {
            let ck = this.gc(x, y, z);
            if (this.doesChunkExist(gc[0], gc[1], gc[2])) {
                this.chunk[ck[0]][ck[1]][ck[2]][mod(x, this.chunkSize)][mod(y, this.chunkSize)][mod(z, this.chunkSize)] = type; //new Block(type, x, y, z);
            }
        } else {
            if (this.doesChunkExist(cx, cy, cz)) {
                this.chunk[cx][cy][cz][x][y][z] = type; //new Block(type, x, y, z);
            }
        }
    }

    setBlockRaw(type, x, y, z, cx, cy, cz) {
        if (arguments.length === 4) {
            let ck = this.gc(x, y, z);
            this.chunk[ck[0]][ck[1]][ck[2]][mod(x, this.chunkSize)][mod(y, this.chunkSize)][mod(z, this.chunkSize)] = type; //new Block(type, x, y, z);
        } else {
            this.chunk[cx][cy][cz][x][y][z] = type; //new Block(type, x, y, z);
        }
    }

    gc(x, y, z) {
        return [Math.floor(x / this.chunkSize), Math.floor(y / this.chunkSize), Math.floor(z / this.chunkSize)];
    }
}

function mod(n, m) {
    return ((n % m) + m) % m;
}