/*******************************************************/
// P5.play: t23_text
// Display text on the screen
// Written by Alex Curwen
/*******************************************************/


/*******************************************************/
// Classes
/*******************************************************/

class Quaternion {
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
}

class Plane {
	constructor(model, pos, rot) {
		this.model = model;
		this.pos = pos;
		this.rot = rot;
	}

	Update() {
		//Local movement
		let movement = createVector(0,0,0);
		movement.x = (KeyDown('d') - KeyDown('a')) * 0.1;
		movement.y = (KeyDown('space') - KeyDown('shift')) * 0.1;
		movement.z = -(KeyDown('w') - KeyDown('s')) * 0.1;

		//Transform movement into world space using plane.rot
		let plane_rot_quat = quat.fromEuler(quat.create(), this.rot.x, this.rot.y, this.rot.z);
		//this.rot = quaternion_to_euler(plane_rot_quat);
		//Declare orientation vectors
		let forward = vec3.fromValues(0, 0, 1);
		let up = vec3.fromValues(0, 1, 0);
		let right = vec3.fromValues(1, 0, 0);

		//Convert to world space
		vec3.transformQuat(forward, forward, plane_rot_quat);
		vec3.transformQuat(up, up, plane_rot_quat);
		vec3.transformQuat(right, right, plane_rot_quat);
		line(0, 10, 0, forward.x, forward.y, forward.z);
		line(0, 10, 0, up.x, up.y, up.z);
		line(0, 10, 0, right.x, right.y, right.z);

		console.log("Forward: " + forward);
		console.log("Up: " + up);
		console.log("Right: " + right);

		//console.log(plane_rot_quat);
		//console.log(this.rot);

		//Multiply movement by vectors
		let movement_world = createVector(0,0,0);
		let world_forward = Vec3(forward);
		let world_right = Vec3(right);
		let world_up = Vec3(up);


		vec3.scale(right, right, movement.x);
		vec3.scale(up, up, movement.y);
		vec3.scale(forward, forward, movement.z);
		let move_right = Vec3(right);
		let move_forward = Vec3(forward);
		let move_up = Vec3(up);
		movement_world.add(move_right);
		movement_world.add(move_up);
		movement_world.add(move_forward);
		console.log("Movement World: " + movement_world);
		console.log("Movement: " + movement);
		//console.log("Forward after: " + forward);
		//console.log("Up after: " + up);
		//console.log("Right after: " + right);
		this.pos.x += movement_world.x;
		this.pos.y += movement_world.y;
		this.pos.z += movement_world.z;

		this.rot.y -= (KeyDown('arrow_right') - KeyDown('arrow_left')) * 0.1;

		cam_rot.x += movedY * CAM_PITCH_SENS;
		cam_rot.y += movedX * CAM_YAW_SENS;
		cam_pos = this.pos;

		rotateX(cam_rot.x);
		rotateY(cam_rot.y);
		rotateX(-plane.rot.x);
		rotateY(-plane.rot.y);
		rotateZ(-plane.rot.z);
		translate(p5.Vector.mult(cam_pos, -1));








		//Fly
		
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
    //Test quaternions
	let up = vec3.fromValues(0, 1, 0);
	const q = quat.fromEuler(quat.create(), 0, 90, 0);

	console.log(q);
	vec3.transformQuat(up, up, q);
	console.log(up + " should be 0, 1, 0");

	let forward = vec3.fromValues(0, 0, 1);
	vec3.transformQuat(forward, forward, q);
	console.log(forward + " should be 1, 0, 0");

	let right = vec3.fromValues(1, 0, 0);
	vec3.transformQuat(right, right, q);
	console.log(right + " should be 0, 0, -1");

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
// p5 vector from gl-matrix vector
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

//-----------------------------------------//
//Thanks to https://math.stackexchange.com/questions/2975109/how-to-convert-euler-angles-to-quaternions-and-get-the-same-euler-angles-back-fr
//Code was originally written in python, I have converted it to js
function euler_to_quaternion(r) {
    let pitch = r.x;
	let yaw = r.y;
	let roll = r.z;

    let qx = Math.sin(roll/2) * Math.cos(pitch/2) * Math.cos(yaw/2) - Math.cos(roll/2) * Math.sin(pitch/2) * Math.sin(yaw/2);
    let qy = Math.cos(roll/2) * Math.sin(pitch/2) * Math.cos(yaw/2) + Math.sin(roll/2) * Math.cos(pitch/2) * Math.sin(yaw/2);
    let qz = Math.cos(roll/2) * Math.cos(pitch/2) * Math.sin(yaw/2) - Math.sin(roll/2) * Math.sin(pitch/2) * Math.cos(yaw/2);
    let qw = Math.cos(roll/2) * Math.cos(pitch/2) * Math.cos(yaw/2) + Math.sin(roll/2) * Math.sin(pitch/2) * Math.sin(yaw/2);
    return new Quaternion(qx, qy, qz, qw);
}

function quaternion_to_euler(q) {
    let x, y, z, w = (q.x, q.y, q.z, q.w);
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
    return createVector(pitch, yaw, roll);
}

//-----------------------------------------//

/*******************************************************/
//QuatMulVec3(q, v)
//Where q is a quaternion [x, y, z, w] and v is a p5 vector object
/*******************************************************/
function QuatMulVec3(v, q) {

	let tx = 2 * (q.y * v.y - q.z * v.z);
	let ty = 2 * (q.z * v.x - q.x * v.y);
	let tz = 2 * (q.x * v.z - q.y * v.x);
		
	return createVector(
		v.x + q.w * tx + (q.y * tz - q.z * ty), //x
		v.y + q.w * ty + (q.z * tx - q.x * tz), //y
		v.z + q.w * tz + (q.x * ty - q.y * tx) 	//z
	);
}




/*******************************************************/
//  END OF APP
/*******************************************************/