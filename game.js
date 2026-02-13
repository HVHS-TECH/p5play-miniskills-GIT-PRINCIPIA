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
const CAM_PITCH_SENS = 1;
const CAM_YAW_SENS = 1;

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

	cam = createCamera(0, 0, 10, 0, 0, 0, 0, 1, 0);
	cam_pos = Vec3(0, 0, 10);
	cam_rot = Vec3(0, 0, 0);
}



/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	noStroke();

	lights();

	fbo.begin();

	cam_pos.x += (KeyDown('d') - KeyDown('a'));
	cam_pos.y -= (KeyDown('space') - KeyDown('shift'));
	cam_pos.z -= (KeyDown('w') - KeyDown('s'));

	requestPointerLock();

	var roty = -movedX * CAM_YAW_SENS;
	var rotx = movedY * CAM_PITCH_SENS;

	cam.move((KeyDown('d') - KeyDown('a')), -(KeyDown('space') - KeyDown('shift')), -(KeyDown('w') - KeyDown('s')));
	cam.pan(roty);
	cam.tilt(rotx);


	scale(100, -100, 100);
	background('black'); 

	//Draw plane
	
	plane.Draw();
	



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
// compression of createVector
/*******************************************************/
function Vec3(x, y, z) {
    return createVector(x, y, z);
}


/*******************************************************/
// KeyDown(key)
// compression of kb.pressing
/*******************************************************/
function KeyDown(key) {
	return kb.pressing(key);
}

/*******************************************************/
//  END OF APP
/*******************************************************/