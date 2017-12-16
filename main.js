const Vec3 = THREE.Vector3;

Utils = {
    rnd: (min, max) => Math.random() * (max - min) + min,
    amIDepressed: ()=>true, /* :c */
};

let camera, scene, renderer;
let particles = [];
let particle_lines = [];
let generate_particles_count = 100;
let std_particle_speed = 3;
let cam_position = null;
let light = null;

function main() {
    init();
    animate();

    function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
        let cam_distance = 850;
        cam_position = new CamPosition(camera, cam_distance);
        scene = new THREE.Scene();

        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        const speed = std_particle_speed;
        for (let i = 0; i < generate_particles_count; i++) {
            particle = new Particle(new Vec3(0, 0, 0), new Vec3(
                Utils.rnd(-speed, speed),
                Utils.rnd(-speed, speed),
                Utils.rnd(-speed, speed))
            );
            scene.add(particle.sceneObject);
            particles.push(particle);
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let line = new ParticleLine(particles[i], particles[j]);
                particle_lines.push(line);
                scene.add(line.sceneObject);
            }
        }

        //bounding box of particles
        let geometry = new THREE.BoxBufferGeometry(Particle.BOUND_DIM, Particle.BOUND_DIM, Particle.BOUND_DIM);
        var geo = new THREE.EdgesGeometry(geometry);
        var mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        var wireframe = new THREE.LineSegments(geo, mat);
        scene.add(wireframe);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        for (let particle of particles)
            particle.update();
        for (let particle_line of particle_lines) {
            particle_line.update();
        }
        cam_position.update();
        light.position.copy(camera.position);
        renderer.render(scene, camera);
    }
}