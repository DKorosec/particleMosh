class ParticleLine {
    constructor(from_particle, to_particle) {
        this.from_particle = from_particle;
        this.to_particle = to_particle;

        let c1 = from_particle.mesh.material.color;
        let c2 = to_particle.mesh.material.color;

        let ac = {
            r: Math.sqrt((c1.r ** 2 + c2.r ** 2) / 2),
            g: Math.sqrt((c1.g ** 2 + c2.g ** 2) / 2),
            b: Math.sqrt((c1.b ** 2 + c2.b ** 2) / 2)
        };

        this.geometry = new THREE.CylinderGeometry(Particle.RADIUS_SIZE, Particle.RADIUS_SIZE, 1, 32);
        this.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(ac.r, ac.g, ac.b) });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    update() {
        let fp = this.from_particle.position;
        let tp = this.to_particle.position;

        let center_vec = tp.clone().sub(fp).multiplyScalar(0.5);
        this.mesh.position.copy(fp.clone().add(center_vec));


        let dist = fp.distanceTo(tp);
        const max_cube_dist = Math.sqrt(3 * (Particle.BOUND_DIM ** 2)); //sqrt(a**2+b**2+c**2) diagonal
        let max_dist = max_cube_dist * Particle.MAX_CONNECTION_RADIUS_PERCENTAGE;

        this.mesh.lookAt(this.to_particle.position);
        this.mesh.rotateX(Math.PI / 180 * 90);
        if (dist > max_dist) {
            this.mesh.visible = false;
        } else {
            this.mesh.scale.y = dist;
            this.mesh.visible = true;
            let width = (1 - dist / max_dist) * 1.5;
            if (width < 0.1)
                this.mesh.visible = false;
            else {
                this.material.transparent = true;
                if (ParticleLine.USE_POWER_OF_TWO_DISTANCE)
                    this.material.opacity = 1 - Math.pow(dist / max_dist, 2);
                else
                    this.material.opacity = 1 - dist / max_dist;
            }
        }
    }

    get sceneObject() {
        return this.mesh;
    }
}
ParticleLine.USE_POWER_OF_TWO_DISTANCE = false;