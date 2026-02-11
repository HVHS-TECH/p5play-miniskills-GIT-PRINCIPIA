/*******************************************************/
// P5.play: t04_collision
// Sprite falls due to gravity & collides with the floor
// Written by Alex Curwen
/*******************************************************/


/*******************************************************/
// Classes
/*******************************************************/

class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	//Multiply
	mul(other) {
		if (typeof other == "number") {
			other = new Vec2(other, other);
		}
		return new Vec2(this.x * other.x, this.y * other.y);
	}
	//Divide
	div(other) {
		if (typeof other == "number") {
			other = new Vec2(other, other);
		}
		return new Vec2(this.x / other.x, this.y / other.y);
	}
	//Add
	add(other) {
		if (typeof other == "number") {
			other = new Vec2(other, other);
		}
		return new Vec2(this.x + other.x, this.y + other.y);
	}
	//Subtract
	sub(other) {
		if (typeof other == "number") {
			other = new Vec2(other, other);
		}
		return new Vec2(this.x - other.x, this.y - other.y);
	}
	
}

//Simple implementation, not very robust or expandable!
class LineAnimation {
	constructor(start, end, time, start_time, sprite_idx) {
		this.start = start;
		this.end = end;
		this.time = time; //Length of animation (half) in frames
		this.sprite_idx = sprite_idx;
		while (start_time < 0) {
			start_time += time * 2;
		}
		this.step = start_time % (time * 2); //Steps through the animation
		var dx = start.x - end.x;
		var dy = start.y - end.y;
		this.step_dx = dx / time;
		this.step_dy = dy / time;
		
		if (this.step <= this.time) {
			sprites[this.sprite_idx].x = Lerp(start.x, end.x, this.step / this.time);
			sprites[this.sprite_idx].y = Lerp(start.y, end.y, this.step / this.time);
		} else if (this.step <= this.time * 2) {
			sprites[this.sprite_idx].x = Lerp(end.x, start.x, (this.step - this.time) / this.time);
			sprites[this.sprite_idx].y = Lerp(end.y, start.y, (this.step - this.time) / this.time);
		}

	}
	Update() {
		if (this.step < this.time) {
			sprites[this.sprite_idx].x += this.step_dx;
			sprites[this.sprite_idx].y -= this.step_dy;
			this.step ++;
		} else if (this.step < this.time * 2) {
			sprites[this.sprite_idx].x -= this.step_dx;
			sprites[this.sprite_idx].y += this.step_dy;
			this.step ++;
		}
		if (this.step == this.time * 2) {
			this.step = 0;
		}
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
var c_pos = new Vec2(0, 0);
var c_zoom = 40; //Camera zoom
var fbo;
var FBO_WIDTH;
var FBO_HEIGHT;

//Sprites
var sprites = []; //List of all sprite objects
var animations = []; //List of all animation objects

var s_rect;
const S_RECT_POS = new Vec2(0, 7);
const S_RECT_W = 1; //width
const S_RECT_H = 1; //height

var s_circ;
const S_CIRC_POS = new Vec2(1, -7);
const S_CIRC_D = 4; //Diameter

var s_platform;
const S_PLATFORM_POS = new Vec2(-3, -9);
const S_PLATFORM_W = 5; //Width
const S_PLATFORM_H = 0.5; //Height

var s_paddle;
const S_PADDLE_POS = new Vec2(-7, -9.5);
const S_PADDLE_W = 4;
const S_PADDLE_H = 0.2;
const S_PADDLE_ROT_SPEED = -2;

var s_lift;
const S_LIFT_POS_START = new Vec2(-9, -11);
const S_LIFT_POS_END = new Vec2(-9, 10);
const S_LIFT_TIME = 60 * 2.1; //4 seconds of 60 fps
const S_LIFT_START = 60 * 3.2; //Starts at n seconds into the animation
const S_LIFT_W = 4;
const S_LIFT_H = 0.2;

var s_wedge;
const S_WEDGE_POS = new Vec2(-9, 9);
const S_WEDGE_W = 4;
const S_WEDGE_H = 0.2;


/*******************************************************/
// setup()
//Initializes the scene and its content
/*******************************************************/
function setup() {
	console.log("setup: ");
	//Initialize world
	world.gravity.y = 9.81;
	
	//Initialize canvas
	cnv_width = windowWidth;
	cnv_height = windowHeight - 100;
	FBO_WIDTH = 2000;
	FBO_HEIGHT = 2000 * cnv_height / cnv_width
	
	cnv = new Canvas(cnv_width, cnv_height, WEBGL); 

	fbo = createFramebuffer();
	fbo.resize(FBO_WIDTH, FBO_HEIGHT);

	//Initialize sprites
	const s_rect_scrn_pos = WorldToCanvas(S_RECT_POS);
	const s_rect_scrn_size = WorldToCanvasSize(S_RECT_W, S_RECT_H);
	s_rect = sprites.length;
	sprites.push(new Sprite(s_rect_scrn_pos.x, s_rect_scrn_pos.y, s_rect_scrn_size.x, s_rect_scrn_size.y, 'd'));
	sprites[s_rect].color = 'rgb(100, 46, 7)';
	sprites[s_rect].vel.y = 4;
	sprites[s_rect].rotationSpeed = 35.97;

	const s_circ_scrn_pos = WorldToCanvas(S_CIRC_POS);
	const s_circ_scrn_size = WorldToCanvasSize(S_CIRC_D, S_CIRC_D);
	s_circ = sprites.length;
	sprites.push(new Sprite(s_circ_scrn_pos.x, s_circ_scrn_pos.y, s_circ_scrn_size.x, 'k'));
	sprites[s_circ].color = 'rgb(40, 100, 100)';

	const s_platform_scrn_pos = WorldToCanvas(S_PLATFORM_POS);
	const s_platform_scrn_size = WorldToCanvasSize(S_PLATFORM_W, S_PLATFORM_H);
	s_platform = sprites.length;
	sprites.push(new Sprite(s_platform_scrn_pos.x,s_platform_scrn_pos.y,s_platform_scrn_size.x, s_platform_scrn_size.y, 'k'));
	sprites[s_platform].color = 'rgb(200,200,200)';
	sprites[s_platform].rotation = -20;
	sprites[s_platform].friction = 0; //Slippy platform to direct object
	
	const s_paddle_scrn_pos = WorldToCanvas(S_PADDLE_POS);
	const s_paddle_scrn_size = WorldToCanvasSize(S_PADDLE_W, S_PADDLE_H);
	s_paddle = sprites.length;
	sprites.push(new Sprite(s_paddle_scrn_pos.x, s_paddle_scrn_pos.y, s_paddle_scrn_size.x, s_paddle_scrn_size.y, 'k'));
	sprites[s_paddle].color = 'rgb(200,100,100)';
	sprites[s_paddle].friction = 0; //Slippy paddle to launch object

	const s_lift_scrn_pos = WorldToCanvas(S_LIFT_POS_START);
	const s_lift_scrn_pos_end = WorldToCanvas(S_LIFT_POS_END);
	const s_lift_scrn_size = WorldToCanvasSize(S_LIFT_W, S_LIFT_H);
	s_lift = sprites.length;
	sprites.push(new Sprite(s_lift_scrn_pos.x, s_lift_scrn_pos.y, s_lift_scrn_size.x, s_lift_scrn_size.y, 'k'));
	animations.push(new LineAnimation(s_lift_scrn_pos, s_lift_scrn_pos_end, S_LIFT_TIME, S_LIFT_START, s_lift));
	sprites[s_lift].color = 'rgb(100,100,100)'

	const s_wedge_scrn_pos = WorldToCanvas(S_WEDGE_POS);
	const s_wedge_scrn_size = WorldToCanvasSize(S_WEDGE_W, S_WEDGE_H);
	s_wedge = sprites.length;
	sprites.push(new Sprite(s_wedge_scrn_pos.x, s_wedge_scrn_pos.y, s_wedge_scrn_size.x, s_wedge_scrn_size.y, 'k'));
	sprites[s_wedge].color = 'rgb(200,100,100)';
	sprites[s_wedge].friction = 0; //Slippy wedge to direct object
	sprites[s_wedge].rotation = -20;



	for (var s = 0; s < sprites.length; s++) {
		sprites[s].autoDraw = false; //Use the framebuffer for drawing
	}
}





/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	sprites[s_paddle].rotation += S_PADDLE_ROT_SPEED; //Increase rotation without needing to counter gravity
	
	for (var a = 0; a < animations.length; a++) {
		animations[a].Update();
	}
	fbo.begin();
	//Fill Background
	background('black'); 
	noStroke();
	
	allSprites.draw(); 
	fbo.end();
	background("black"); // Main canvas background
	
	// Draw the framebuffer texture onto the screen
	image(fbo, -cnv_width/2, -cnv_height/2, cnv_width, cnv_height);
}

/*******************************************************/
// Helper functions
/*******************************************************/

/*******************************************************/
// WorldToCanvas(x,y)
//Returns [x,y] transformed from world space to canvas space
/*******************************************************/
function WorldToCanvas(world_pos) {
	let local_pos = world_pos.mul(c_zoom).sub(c_pos); //Multiply by the zoom and subtract the camera position
	return local_pos.mul(new Vec2(1, -1));//.add(new Vec2(cnv_width / 2, cnv_height / 2));
}

/*******************************************************/
// WorldToCanvasSize(x,y)
//Returns [x,y] size transformed from world space to canvas space
/*******************************************************/
function WorldToCanvasSize(w, h) {
	let world_size = new Vec2(w, h);
	let local_size = world_size.mul(c_zoom);
	return local_size;
}

/*******************************************************/
//Lerp(a, b, k)
//Lerps from a to b by amount k
/*******************************************************/
function Lerp(a,b,k) {
	return a + (b - a) * k;
}



/*******************************************************/
//  END OF APP
/*******************************************************/