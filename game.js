/*******************************************************/
// P5.play: t23_text
// Display text on the screen
// Written by Alex Curwen
/*******************************************************/


/*******************************************************/
// Classes
/*******************************************************/

class GameObject {
    constructor(vertices, indices, normals, pos, rot) {
        this.pos = pos;
        this.rot = rot;

        this.geometry = new p5.Geometry();
        this.geometry.vertices = vertices;
		this.geometry.faces = indices;
		this.geometry.vertexNormals = normals;
    }

    Draw() {
        translate(this.pos);
        rotateX(this.rot.x);
        rotateY(this.rot.y);
        rotateZ(this.rot.z);
        model(this.geometry);
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
const FBO_SCALE = 4000;
var FBO_WIDTH;
var FBO_HEIGHT;

//Camera
var cam;

//Objects
var objects = [];




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

	cam = createCamera();

  	cam.setPosition(0, 0, 100);
  	cam.lookAt(0, 0, 0);

}



/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	noStroke();
	//lights();
	fbo.begin();
	var pan = (kb.pressing("right") ? -0.1 : 0) - (kb.pressing("left") ? -0.1 : 0);
	cam.pan(pan);
	var tilt = (kb.pressing("up") ? -0.1 : 0) - (kb.pressing("down") ? -0.1 : 0);
	cam.tilt(tilt);
	//Fill Background
	background('black'); 
	box();
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
/*******************************************************/
function Vec3(x, y, z) {
    return createVector(x, y, z);
}


/*******************************************************/
//  END OF APP
/*******************************************************/