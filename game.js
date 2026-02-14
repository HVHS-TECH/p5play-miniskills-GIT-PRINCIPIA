/*******************************************************/
// P5.play: t23_text
// Display text on the screen
// Written by Alex Curwen
/*******************************************************/


/*******************************************************/
// Classes
/*******************************************************/

class Plane {
	constructor(model, pos, rot) {
		this.model = model;
		this.pos = pos;
		this.rot = rot;
	}

	Update() {
		//Local movement
		let movement = Vec3(0,0,0);
		movement.x += (KeyDown('d') - KeyDown('a')) * 0.1;
		movement.y += (KeyDown('space') - KeyDown('shift')) * 0.1;
		movement.z -= (KeyDown('w') - KeyDown('s')) * 0.1;

		//Transform movement into world space using plane.rot
		let plane_rot_quat = euler_to_quaternion(plane.rot);
		//Multiply movement by plane_rot_quaternion

		plane.pos.x += movement.x;
		plane.pos.y += movement.y;
		plane.pos.z += movement.z;

		plane.rot.y -= (KeyDown('arrow_right') - KeyDown('arrow_left')) * 0.1;

		cam_rot.x += movedY * CAM_PITCH_SENS;
		cam_rot.y += movedX * CAM_YAW_SENS;
		cam_pos = plane.pos;

		rotateX(cam_rot.x);
		rotateY(cam_rot.y);
		rotateX(-plane.rot.x);
		rotateY(-plane.rot.y);
		rotateZ(-plane.rot.z);
		translate(p5.Vector.mult(cam_pos, -1));
	}

	Draw() {
		push();
		translate(this.pos);
		rotateX(this.rot.x);
		rotateY(this.rot.y);
		rotateZ(this.rot.z);
		model(this.model);
		pop();
	}
}


/*******************************************************/
// Vars
/*******************************************************/

//Canvas
var cnv;
var cnv_width;
var cnv_height;


//Camera
var fbo;
const FBO_SCALE = 10000;
var FBO_WIDTH;
var FBO_HEIGHT;

//Camera
var cam;
var cam_pos;
var cam_rot;
const CAM_PITCH_SENS = 0.3;
const CAM_YAW_SENS = 0.3;

//Objects
var objects = [];

//Models
var plane;
var plane_model;

/*******************************************************/
// Preload()
/*******************************************************/
function preload() {
	plane_model = loadModel('../assets/models/Plane.obj');
	plane = new Plane(plane_model, Vec3(0, 0, 0), Vec3(0, 0, 0));
}

/*******************************************************/
// setup()
//Initializes the scene and its content
/*******************************************************/
function setup() {
	console.log("setup: ");
    

	//Initialize canvas
	cnv_width = windowWidth;
	cnv_height = windowHeight - 100;
	
	cnv = new Canvas(cnv_width, cnv_height, WEBGL); 

	
	FBO_WIDTH = FBO_SCALE;
	FBO_HEIGHT = FBO_SCALE * cnv_height / cnv_width;
	fbo = createFramebuffer();
	fbo.resize(FBO_WIDTH, FBO_HEIGHT);

	cam_pos = Vec3(0, 0, 0);
	cam_rot = Vec3(0, 0, 0);
}



/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	noStroke();

	lights();

	fbo.begin();
	
	
	

	requestPointerLock();
	
	
	
	scale(100, -100, 100);
	
	
	
	
	background('black');
	
	//Draw plane
	plane.Update();
	plane.Draw();

	scale(0.01,-0.01,0.01);
	box(); //Debug cube
	



	fbo.end();

	background("black"); // Main canvas background
	
	// Draw the framebuffer texture onto the screen
	image(fbo, -cnv_width/2, -cnv_height/2, cnv_width, cnv_height);
}



/*******************************************************/
// Callbacks
/*******************************************************/

/*******************************************************/
// windowResized() callback
// Resize the canvas and fbo
/*******************************************************/
function windowResized() {
	

	cnv_width = windowWidth;
	cnv_height = windowHeight - 100;
	cnv.resize(cnv_width, cnv_height);
	FBO_WIDTH = FBO_SCALE;
	FBO_HEIGHT = FBO_SCALE * cnv_height / cnv_width;
	fbo.resize(FBO_WIDTH, FBO_HEIGHT);

}

/*******************************************************/
// Helper functions
/*******************************************************/

/*******************************************************/
// Vec3(x,y,z)
// compression of createVector(x, y,z)
/*******************************************************/
function Vec3(x, y, z) {
    return createVector(x, y, z);
}


/*******************************************************/
// Vec3(v)
// p5 vector from math vector
/*******************************************************/
function Vec3(v) {
	return createVector(v[0], v[1], v[2]);
}

/*******************************************************/
// KeyDown(key)
// compression of kb.pressing
/*******************************************************/
function KeyDown(key) {
	return kb.pressing(key);
}

//Thanks to https://math.stackexchange.com/questions/2975109/how-to-convert-euler-angles-to-quaternions-and-get-the-same-euler-angles-back-fr
//Code was originally written in lua, I have converted it to js
function euler_to_quaternion(r) {
    let pitch = r.x;
	let yaw = r.y;
	let roll = r.z;

    let qx = Math.sin(roll/2) * Math.cos(pitch/2) * Math.cos(yaw/2) - Math.cos(roll/2) * Math.sin(pitch/2) * Math.sin(yaw/2);
    let qy = Math.cos(roll/2) * Math.sin(pitch/2) * Math.cos(yaw/2) + Math.sin(roll/2) * Math.cos(pitch/2) * Math.sin(yaw/2);
    let qz = Math.cos(roll/2) * Math.cos(pitch/2) * Math.sin(yaw/2) - Math.sin(roll/2) * Math.sin(pitch/2) * Math.cos(yaw/2);
    let qw = Math.cos(roll/2) * Math.cos(pitch/2) * Math.cos(yaw/2) + Math.sin(roll/2) * Math.sin(pitch/2) * Math.sin(yaw/2);
    return [qx, qy, qz, qw];
}

function quaternion_to_euler(q) {
    let x, y, z, w = (q[0], q[1], q[2], q[3]);
    t0 = +2.0 * (w * x + y * z);
    t1 = +1.0 - 2.0 * (x * x + y * y);
    roll = Math.atan2(t0, t1);
    t2 = +2.0 * (w * y - z * x)
    t2 = (t2 > +1.0) ? +1.0 : t2;
    t2 = (t2 < -1.0) ? -1.0 : t2;
    pitch = Math.asin(t2);
    t3 = +2.0 * (w * z + x * y);
    t4 = +1.0 - 2.0 * (y * y + z * z);
    yaw = Math.atan2(t3, t4);
    return Vec3(pitch, yaw, roll);
}
/*******************************************************/
//  END OF APP
/*******************************************************/