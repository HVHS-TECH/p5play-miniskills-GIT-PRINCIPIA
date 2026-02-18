/*******************************************************/
// P5.play: t23_text
// Display text on the screen
// Written by Alex Curwen
/*******************************************************/


/*******************************************************/
// Classes
/*******************************************************/

//Terrain Chunk
class Chunk {
	constructor(pos) {
		this.pos = pos;
	}
	Draw() {
		push();
		translate(this.pos);
		scale(10, 10, 10);
		model(terrain_model);
		pop();
	}
}


class Plane {
	constructor(model, pos, rot) {
		this.model = model;
		this.pos = pos;
		this.rot = rot;
		this.q = quat.create();
		quat.fromEuler(this.q, rot.x, rot.y, rot.z);
	}

	Update() {
		//Local movement
		let movement = createVector(0,0,0);
		movement.x = (KeyDown('d') - KeyDown('a')) * 1;
		movement.y = (KeyDown('space') - KeyDown('shift')) * 0.7;
		movement.z = (KeyDown('w') - KeyDown('s')) * 2;

		//------------------------------//
		//NEED TO USE ROTATION MATRICIES//
		//------------------------------//
		let rotation = mat4.create();
		mat4.rotateX(rotation, this.rot.x);
		mat4.rotateY(rotation, this.rot.y);
		mat4.rotateZ(rotation, this.rot.z);

		//Get the orientation vectors from the matrix:
		//https://www.google.com/search?q=get+forward%2C+up%2C+right+from+mat4+gl-matrix&sca_esv=0a6eb62db35b49cd&rlz=1C1GCEA_enNZ1200NZ1200&biw=1920&bih=859&ei=2B-VaZLxLY6OseMPzeedsQw&ved=0ahUKEwiSvcSp--GSAxUOR2wGHc1zJ8YQ4dUDCBM&uact=5&oq=get+forward%2C+up%2C+right+from+mat4+gl-matrix&gs_lp=Egxnd3Mtd2l6LXNlcnAiKmdldCBmb3J3YXJkLCB1cCwgcmlnaHQgZnJvbSBtYXQ0IGdsLW1hdHJpeDIHECEYChigAUiMElDHAljrDnABeACQAQCYAfYDoAHXHKoBBzMtMy41LjG4AQPIAQD4AQGYAgqgAvgcwgIIEAAY7wUYsAPCAgUQIRigAcICBBAhGBWYAwCIBgGQBgGSBwcxLjMtMy42oAe5GrIHBTMtMy42uAf1HMIHAzEuOcgHDoAIAQ&sclient=gws-wiz-serp&safe=active&ssui=on
		//Declare orientation vectors
		let forward = vec3.fromValues(0, 0, -1);//...
		let up = vec3.fromValues(0, 1, 0);//...
		let right = vec3.fromValues(1, 0, 0);//...

		let forward_glmat = vec3.clone(forward);
		let up_glmat = vec3.clone(up);
		let right_glmat = vec3.clone(right);

		//Normalize the orientation vectors




        quat.fromEuler(this.q, this.rot.x, this.rot.y, this.rot.z);

		//Transform movement into world space using plane.rot
		let plane_rot_quat = this.q;
		

		

		//Convert to world space
		vec3.transformQuat(forward, forward, plane_rot_quat);
		vec3.transformQuat(up, up, plane_rot_quat);
		vec3.transformQuat(right, right, plane_rot_quat);
		console.log("Forward: " + forward);
		console.log("Up: " + up);
		console.log("Right: " + right);



		//console.log(plane_rot_quat);
		//console.log(this.rot);
		let world_up_glmat = vec3.clone(up);
		let world_forward_glmat = vec3.clone(forward);
		let world_right_glmat = vec3.clone(right);

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

		
		let yaw = (KeyDown('q') - KeyDown('e')) / 100;
		let pitch = -(KeyDown('arrow_up') - KeyDown('arrow_down')) / 100;
		let roll = (KeyDown('arrow_right') - KeyDown('arrow_left')) / 100;

		//Rotate the matrix by pitch, yaw and roll (XYZ)

		//Get the quaternion from the matrix

		//Convert the quaternion to euler angles

		//Set this.rot to the euler angles
        
		quat.normalize(plane_rot_quat, plane_rot_quat);

		this.RotateWorld(world_forward_glmat, roll);

		quat.normalize(plane_rot_quat, plane_rot_quat);

		this.RotateWorld(world_right_glmat, pitch);

		quat.normalize(plane_rot_quat, plane_rot_quat);

		this.RotateWorld(world_up_glmat, yaw);
		
		quat.normalize(plane_rot_quat, plane_rot_quat);

		this.q = plane_rot_quat;


		//Apply rotation
		this.rot = quaternion_to_euler(plane_rot_quat);
        console.log("This.rot = " + this.rot + ", this.quat = " + this.q);
		cam_rot.x += movedY * CAM_PITCH_SENS;
		cam_rot.y += movedX * CAM_YAW_SENS;
		
		cam_pos = this.pos;



		//rotateX(cam_rot.x);
		//rotateY(cam_rot.y);
		//rotateX(-plane.rot.x);
		//rotateY(-plane.rot.y);
		//rotateZ(-plane.rot.z);
		//translate(p5.Vector.mult(cam_pos, -1));

		






		//Fly
		
	}
	RotateWorld(axis, angle) {
		let plane_rot_quat = this.q;
		let rotation = quat.create();
		quat.setAxisAngle(rotation, axis, angle);
		quat.multiply(plane_rot_quat, plane_rot_quat, rotation);
		this.q = plane_rot_quat;
		this.rot = quaternion_to_euler(plane_rot_quat);
	}

	RotateLocal(axis, angle) {
		let plane_rot_quat = this.q;
		let rotation = quat.create();
		quat.setAxisAngle(rotation, axis, angle);
		quat.multiply(plane_rot_quat, rotation, plane_rot_quat);
		this.q = plane_rot_quat;
		this.rot = quaternion_to_euler(plane_rot_quat);
	}

	Draw() {
		rotateX(cam_rot.x);
		rotateY(cam_rot.y);
		translate(-cam_pos.x, -cam_pos.y, -cam_pos.z);
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
const FBO_SCALE = 3000;
var FBO_WIDTH;
var FBO_HEIGHT;

//Camera
var cam;
var cam_pos;
var cam_rot;
const CAM_PITCH_SENS = 0.3;
const CAM_YAW_SENS = 0.3;



//Models
var plane;
var plane_model;

//Terrain
var terrain;
var terrain_model;

/*******************************************************/
// Preload()
/*******************************************************/
function preload() {
	plane_model = loadModel('../assets/models/Plane.obj');
	
	terrain_model = loadModel('../assets/models/Terrain.obj');
	
}

/*******************************************************/
// setup()
//Initializes the scene and its content
/*******************************************************/
function setup() {
	console.log("setup: ");
    //Test quaternions
	let up = vec3.fromValues(0, 1, 0);
	let q = quat.fromEuler(quat.create(), 0, 90, 0);

	console.log(q + " should be 0, 0.7071, 0, 0.7071");
	vec3.transformQuat(up, up, q);
	console.log(up + " should be 0, 1, 0");

	let forward = vec3.fromValues(0, 0, 1);
	vec3.transformQuat(forward, forward, q);
	console.log(forward + " should be 1, 0, 0");

	let right = vec3.fromValues(1, 0, 0);
	vec3.transformQuat(right, right, q);
	console.log(right + " should be 0, 0, -1");

	let rot = quaternion_to_euler(q);
	console.log(rot + " should be 0, 90, 0");

    var q2 = quat.create();
	quat.fromEuler(q2, 90, 0, 0);
    console.log("q2 " + q2 + " should be 0.7071, 0, 0, 0.7071");
	rot = quaternion_to_euler(q2);
	console.log("q2 euler " + rot + " should be 90, 0, 0");


    var q3 = quat.create();
    quat.fromEuler(q3, 0, 0, 90);
    console.log("q3 " + q3 + " should be 0, 0, 0.7071, 0.7071");
    rot = quaternion_to_euler(q3);
    console.log("q3 euler " + rot + " should be 0, 0, 90");



    var vec_2_rotate = vec3.fromValues(0, 1, 1);
    var axis = vec3.fromValues(1, 0, 0);
    var rotation = quat.create();
    quat.setAxisAngle(rotation, axis, -Math.PI / 2); //90 degrees
    vec3.transformQuat(vec_2_rotate, vec_2_rotate, rotation);
    console.log("Vec " + vec_2_rotate + " should be 0, 1, -1");

	var axis2 = vec3.fromValues(0, 1, 0);
	var rotation2 = quat.create();
	quat.setAxisAngle(rotation2, axis2, -Math.PI); //180 degrees
	vec3.transformQuat(vec_2_rotate, vec_2_rotate, rotation2);
	console.log("Vec " + vec_2_rotate + " should be 0, 1, 1");

	//Initialize canvas
	cnv_width = windowWidth;
	cnv_height = windowHeight - 100;
	
	cnv = new Canvas(cnv_width, cnv_height, WEBGL); 

	
	FBO_WIDTH = FBO_SCALE;
	FBO_HEIGHT = FBO_SCALE * cnv_height / cnv_width;
	fbo = createFramebuffer();
	fbo.resize(FBO_WIDTH, FBO_HEIGHT);

	//Camera
	
	cam_pos = Vec3(0, 0, 0);
	cam_rot = Vec3(0, 0, 0);

	//Objects
	plane = new Plane(plane_model, createVector(0, 100, 0), createVector(0, 0, -90));
	terrain = new Chunk(createVector(0, -100, 0), 100);
}



/*******************************************************/
// draw()
/*******************************************************/
function draw() {


	fbo.begin();
	directionalLight(128, 128, 128, 0, 0.3, -1);
	ambientLight(64);
	perspective(60, FBO_WIDTH / FBO_HEIGHT, 100, 1000000);
	
	
	

	requestPointerLock();
	
	
	
	scale(100, -100, 100);
	
	
	
	
	background('black');
	
	//Update plane
	plane.Update();

	//Draw
	strokeWeight(10);
	stroke('black');
	//Draw plane
	plane.Draw();

	//Draw terrain
	terrain.Draw();

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
	return kb.pressing(key) ? 1 : 0;
}


function quaternion_to_euler(q) {
	//Thanks to https://stackoverflow.com/questions/53033620/how-to-convert-euler-angles-to-quaternions-and-get-the-same-euler-angles-back-fr for the original code (in python)
	let x = q[0], y = q[1], z = q[2], w = q[3];
	
	// ZYX order (yaw, pitch, roll)
	let t1 = 2.0 * (w * z + x * y);
	let t2 = 1.0 - 2.0 * (y * y + z * z);
	let vz = Math.atan2(t1, t2);

	let t3 = 2.0 * (w * y - z * x);
	t3 = t3 > 1.0 ? 1.0 : t3;
	t3 = t3 < -1.0 ? -1.0 : t3;
	let vy = Math.asin(t3);

	let t4 = 2.0 * (w * x + y * z);
	let t5 = 1.0 - 2.0 * (x * x + y * y);
	let vx = Math.atan2(t4, t5);

	return createVector(
		vx * 180 / Math.PI, 
		vy * 180 / Math.PI,
		vz * 180 / Math.PI
	);
}

/*******************************************************/
//  END OF APP
/*******************************************************/