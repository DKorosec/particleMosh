class Particle {
    constructor(position, velocity) {
        let geometry = new THREE.SphereBufferGeometry(Particle.RADIUS_SIZE, Particle.SPHERE_SEGMENTS, Particle.SPHERE_SEGMENTS);
        let material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.velocity = velocity.clone();
        this.position = position;
    }

    update() {
        let tmpPos = this.mesh.position.clone();
        this._move();
        this.fixMapBoundingsCollision(tmpPos);
    }

    _move() {
        this.mesh.position.add(this.velocity);
    }

    fixMapBoundingsCollision(tmpPos) {
        const BOUND_DIM = Particle.BOUND_DIM; //DIM x DIM x DIM cube!
        const AXIS_DIM = BOUND_DIM / 2;// [DIM/2-----0-----DIM/2] is total BOUND_DIM

        let collides = false;
        for (let axis of ['x', 'y', 'z']) {
            if (this.position[axis] >= AXIS_DIM || this.position[axis] <= -AXIS_DIM) {
                this.velocity[axis] *= -1;
                collides = true;
            }
        }
        if (collides) {
            this.mesh.position.copy(tmpPos); //reset pos
            this._move(); //make legal move with updated velocity
        }
    }

    set position(vec) {
        this.mesh.position.copy(vec);
    }
    get position() {
        return this.mesh.position;
    }

    get sceneObject() {
        return this.mesh;
    }
}
Particle.MAX_CONNECTION_RADIUS_PERCENTAGE = 0.125; //[0-1]
Particle.BOUND_DIM = 600;
Particle.RADIUS_SIZE = 8;
Particle.SPHERE_SEGMENTS = 8;