class CamPosition {
    constructor(camera, distance) {
        this.camera = camera;
        this.distance = distance;
        this._i = 0;
    }

    update() {
        this._i += (Math.PI / 180.0) * 0.2;
        let cam = this.camera;
        cam.position.x = Math.sin(this._i) * this.distance;
        cam.position.z = Math.cos(this._i) * this.distance;
        cam.position.y = 0;
        cam.lookAt(new Vec3(0, 0, 0));
    }
}