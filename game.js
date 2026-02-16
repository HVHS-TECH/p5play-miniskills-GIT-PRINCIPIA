/*******************************************************/
//Game Testing
//Written by Alex Curwen
/*******************************************************/


/*******************************************************/
//Classes
/*******************************************************/

/*
class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    //Operators
    mul(other) {
        return new Vec3(other.x * this.x, other.y * this.y, other.z * this.z);
    }

    div(other) {
        return new Vec3(other.x / this.x, other.y / this.y, other.z / this.z);
    }

    add(other) {
        return new Vec3(other.x + this.x, other.y + this.y, other.z + this.z);
    }

    sub(other) {
        return new Vec3(other.x - this.x, other.y - this.y, other.z - this.z);
    }

    dot(other) {
        return (other.x * this.x + other.y * this.y + other.z * this.z);
    }
}
*/

class GameObject {
    constructor(vertices, pos, rot) {
        this.vertices = vertices;
        this.pos = pos;
        this.rot = rot;
        this.geometry = new p5.Geometry();
        this.geometry.vertices = vertices;
    }

    Update() {
        
    }

    DrawObject() {
        model(this.geometry);
    }
}


/*******************************************************/
//Vars
/*******************************************************/
//Canvas
var cnv;
var cnv_width;
var cnv_height;
const BG_COLOUR = 'black';

//FBO
var fbo;
var fbo_width;
var fbo_height;
const FBO_SCALE = 2000;

//Camera
var pos;
var rot;

//Objects
var objects = [];


/*******************************************************/
//Setup()
/*******************************************************/
function setup() {
    //Initialize canvas
    cnv_width = windowWidth;
    cnv_height = windowHeight - 100;
    cnv = createCanvas(cnv_width, cnv_height, WEBGL);

    //Initialize FBO
    fbo_width = FBO_SCALE;
    fbo_height = FBO_SCALE * cnv_height / cnv_width;
    fbo = createFramebuffer();
    fbo.resize(fbo_width, fbo_height);

    var vertices = [Vec3(0, 0, 0), Vec3(100, 0, 0), Vec3(100, 100, 0)];
    var object = new GameObject(vertices, Vec3(0, 0, 0), Vec3(0, 0, 0));
    objects.push(object);

    //Camera
    pos = Vec3(0,0,0);
    rot = Vec3(0,0,0);
}



/*******************************************************/
//Draw()
/*******************************************************/
function draw() {
    //Begin the framebuffer
    fbo.begin;

    //Clear the background
    background(BG_COLOUR);

    if (kb.pressing("right")) rot.y += 2;
    if (kb.pressing("left")) rot.y -= 2;
    if (kb.pressing("up")) rot.x += 2;
    if (kb.pressing("down")) rot.x -= 2;

    if (kb.pressing("d")) pos.x += 2;
    if (kb.pressing("a")) pos.x -= 2;
    if (kb.pressing("w")) pos.z += 2;
    if (kb.pressing("s")) pos.z -= 2;

    //Draw models
    for (var o = 0; o < objects.length; o++) {
        objects[o].DrawObject();
    }
   
    
    //End framebuffer
    fbo.end;

    //Draw the framebuffer to the screen
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
// Helpers
/*******************************************************/
function Vec3(x, y, z) {
    return createVector(x,y,z);
}


/*******************************************************/
// END OF PROGRAM
/*******************************************************/