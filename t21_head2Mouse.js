/*******************************************************/
// P5.play: t21_head2Mouse
// Move sprite towards the mouse' position
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
class Variable {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}
}
//Base class
class Animation {
	constructor(sprite_idx) {
		this.sprite_idx = sprite_idx;
		
	}
	Update() {
		
	}
	
}
//Customizable simple animation class
class CustomAnimation extends Animation {
	constructor(sprite_idx, vars) {
		super(sprite_idx);
		this.vars = vars;
	}
	Update() {
		//Can be customized
	}
	GetVar(name) {
		for (var v = 0; v < this.vars.length; v++) {
			if (this.vars[v].name == name) return this.vars[v].value;
		}
		console.log("Cannot find variable '" + name + "'");
		return 0;
	}
}
//Simple implementation, not very robust or expandable!
class LineAnimation extends Animation {
	constructor(start, end, time, start_time, sprite_idx) {
		super(sprite_idx);
		this.start = start;
		this.end = end;
		this.time = time; //Length of animation (half) in frames
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
const FBO_SCALE = 2000;
var FBO_WIDTH;
var FBO_HEIGHT;

//Aliens
const VEL_ARRAY = [-1, 1]; //randomly select a positive or negative velocity
const NUM_ALIENS = 100;
const ALIEN_MAX_VEL = 7;
const ALIEN_MIN_VEL = 4;
const ALIEN_MIN_DISTANCE = 100;
var alienGroup;

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

var s_car;
const S_CAR_POS = new Vec2(-20, 0);
const S_CAR_W = 1;
const S_CAR_H = 3;


//Walls
var s_wall_left;
var s_wall_right;
var s_wall_top;
var s_wall_bottom;

//Images
var imgBG;
var imgFace;

/*******************************************************/
// preload()
/*******************************************************/
function preload() {

}

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
	
	cnv = new Canvas(cnv_width, cnv_height, WEBGL); 

	
	FBO_WIDTH = FBO_SCALE;
	FBO_HEIGHT = FBO_SCALE * cnv_height / cnv_width;
	fbo = createFramebuffer();
	fbo.resize(FBO_WIDTH, FBO_HEIGHT);

	//Initialize sprites
	//Sprites from animation
	const S_RECT_SCRN_POS = WorldToCanvas(S_RECT_POS);
	const S_RECT_SCRN_SIZE = WorldToCanvasSize(S_RECT_W, S_RECT_H);
	s_rect = sprites.length;
	sprites.push(new Sprite(S_RECT_SCRN_POS.x, S_RECT_SCRN_POS.y, S_RECT_SCRN_SIZE.x, S_RECT_SCRN_SIZE.y, 'd'));
	sprites[s_rect].color = 'rgb(100, 46, 7)';
	sprites[s_rect].vel.y = 4;
	sprites[s_rect].rotationSpeed = 35.97;

	const S_CIRC_SCRN_POS = WorldToCanvas(S_CIRC_POS);
	const S_CIRC_SCRN_SIZE = WorldToCanvasSize(S_CIRC_D, S_CIRC_D);
	s_circ = sprites.length;
	sprites.push(new Sprite(S_CIRC_SCRN_POS.x, S_CIRC_SCRN_POS.y, S_CIRC_SCRN_SIZE.x, 'k'));
	sprites[s_circ].color = 'rgb(40, 100, 100)';

	const S_PLATFORM_SCRN_POS = WorldToCanvas(S_PLATFORM_POS);
	const S_PLATFORM_SCRN_SIZE = WorldToCanvasSize(S_PLATFORM_W, S_PLATFORM_H);
	s_platform = sprites.length;
	sprites.push(new Sprite(S_PLATFORM_SCRN_POS.x,S_PLATFORM_SCRN_POS.y,S_PLATFORM_SCRN_SIZE.x, S_PLATFORM_SCRN_SIZE.y, 'k'));
	sprites[s_platform].color = 'rgb(200,200,200)';
	sprites[s_platform].rotation = -20;
	sprites[s_platform].friction = 0; //Slippy platform to direct object
	
	const S_PADDLE_SCRN_POS = WorldToCanvas(S_PADDLE_POS);
	const S_PADDLE_SCRN_SIZE = WorldToCanvasSize(S_PADDLE_W, S_PADDLE_H);
	s_paddle = sprites.length;
	sprites.push(new Sprite(S_PADDLE_SCRN_POS.x, S_PADDLE_SCRN_POS.y, S_PADDLE_SCRN_SIZE.x, S_PADDLE_SCRN_SIZE.y, 'k'));
	sprites[s_paddle].color = 'rgb(200,100,100)';
	sprites[s_paddle].friction = 0; //Slippy paddle to launch object
	sprites[s_paddle].rotationSpeed = S_PADDLE_ROT_SPEED;

	const S_LIFT_SCRN_POS = WorldToCanvas(S_LIFT_POS_START);
	const S_LIFT_SCRN_POS_end = WorldToCanvas(S_LIFT_POS_END);
	const S_LIFT_SCRN_SIZE = WorldToCanvasSize(S_LIFT_W, S_LIFT_H);
	s_lift = sprites.length;
	sprites.push(new Sprite(S_LIFT_SCRN_POS.x, S_LIFT_SCRN_POS.y, S_LIFT_SCRN_SIZE.x, S_LIFT_SCRN_SIZE.y, 'k'));
	animations.push(new LineAnimation(S_LIFT_SCRN_POS, S_LIFT_SCRN_POS_end, S_LIFT_TIME, S_LIFT_START, s_lift));
	sprites[s_lift].color = 'rgb(100,100,100)'

	const S_WEDGE_SCRN_POS = WorldToCanvas(S_WEDGE_POS);
	const S_WEDGE_SCRN_SIZE = WorldToCanvasSize(S_WEDGE_W, S_WEDGE_H);
	s_wedge = sprites.length;
	sprites.push(new Sprite(S_WEDGE_SCRN_POS.x, S_WEDGE_SCRN_POS.y, S_WEDGE_SCRN_SIZE.x, S_WEDGE_SCRN_SIZE.y, 'k'));
	sprites[s_wedge].color = 'rgb(200,100,100)';
	sprites[s_wedge].friction = 0; //Slippy wedge to direct object
	sprites[s_wedge].rotation = -20;
	
	const S_CAR_SCRN_POS = WorldToCanvas(S_CAR_POS);
	const S_CAR_SCRN_SIZE = WorldToCanvasSize(S_CAR_W, S_CAR_H);
	s_car = sprites.length;
	sprites.push(new Sprite(S_CAR_SCRN_POS.x, S_CAR_SCRN_POS.y, S_CAR_SCRN_SIZE.x, S_CAR_SCRN_SIZE.y, 'k'));
	sprites[s_car].color = 'rgb(30,30,100)';
	var vars = [];
	vars.push(new Variable("Speed", 10)); //how fast it moves toward the mouse
	animations.push(new CustomAnimation(s_car, vars));
	animations[animations.length - 1].Update = 
	function() {
		sprites[this.sprite_idx].moveTo(
			mouseX * (FBO_WIDTH / cnv_width) - FBO_WIDTH / 2, 
			mouseY * (FBO_HEIGHT / cnv_height) - FBO_HEIGHT / 2, 
			this.GetVar("Speed")
		);
		if (mouseIsPressed) {
			sprites[this.sprite_idx].moveTo(
				mouseX * (FBO_WIDTH / cnv_width) - FBO_WIDTH / 2, 
				mouseY * (FBO_HEIGHT / cnv_height) - FBO_HEIGHT / 2, 
				this.GetVar("Speed") * 4
			);
		}
	};
	sprites[s_car].gravity_scale = 0;

	CreateWalls();
	SpawnAliens();

	for (var s = 0; s < sprites.length; s++) {
		sprites[s].autoDraw = false; //Use the framebuffer for drawing
	}
}
/*******************************************************/
// CreateWalls()
/*******************************************************/
function SpawnAliens() {

	alienGroup = new Group();
	for (var i = 0; i < NUM_ALIENS; i++) {
		var world_x = random(-cnv_width, cnv_height);

		var world_y = random(-cnv_width, cnv_height);



		const pos = new Vec2(world_x, world_y);
		const scrn_pos = pos;

		const vel = new Vec2(random(ALIEN_MIN_VEL, ALIEN_MAX_VEL) * random(VEL_ARRAY),random(ALIEN_MIN_VEL, ALIEN_MAX_VEL) * random(VEL_ARRAY));

		const scrn_size = WorldToCanvasSize(1, 1);
		sprites.push(new Sprite(scrn_pos.x, scrn_pos.y, scrn_size.x, scrn_size.y, 'd'));
		sprites[sprites.length - 1].color = 'rgb(100,200,200)';
		sprites[sprites.length - 1].bounciness = 1;
  		sprites[sprites.length - 1].friction = 0;
		sprites[sprites.length - 1].vel.x = vel.x;
		sprites[sprites.length - 1].vel.y = vel.y;
		alienGroup.add(sprites[sprites.length - 1]);
		
	}

	//When an alien collides with the ball, call alienHit
	alienGroup.collides(sprites[s_car], AlienHit);
}


/*******************************************************/
// CreateWalls()
/*******************************************************/
function CreateWalls() {
	const WALL_BOUNCINESS = 0;
	const WALL_FRICTION = 0;

	s_wall_left = sprites.length;
	sprites.push(new Sprite(-FBO_WIDTH / 2, 0, 8, FBO_HEIGHT, 'k'));
	sprites[s_wall_left].color = 'rgb(200,0,0)';
	sprites[s_wall_left].bounciness = WALL_BOUNCINESS;
	sprites[s_wall_left].friction = WALL_FRICTION;

	s_wall_right = sprites.length;
	sprites.push(new Sprite(FBO_WIDTH / 2, 0, 8, FBO_HEIGHT, 'k'));
	sprites[s_wall_right].color = 'rgb(100,100,0)';
	sprites[s_wall_right].bounciness = WALL_BOUNCINESS;
	sprites[s_wall_right].friction = WALL_FRICTION;
	
	s_wall_top = sprites.length;
	sprites.push(new Sprite(0, FBO_HEIGHT / 2, FBO_WIDTH, 8, 'k'));
	sprites[s_wall_top].color = 'rgb(0,200,0)';
	sprites[s_wall_top].bounciness = WALL_BOUNCINESS;
	sprites[s_wall_top].friction = WALL_FRICTION;

	s_wall_bottom = sprites.length;
	sprites.push(new Sprite(0, -FBO_HEIGHT / 2, FBO_WIDTH, 8, 'k'));
	sprites[s_wall_bottom].color = 'rgb(0,100,100)';
	sprites[s_wall_bottom].bounciness = WALL_BOUNCINESS;
	sprites[s_wall_bottom].friction = WALL_FRICTION;
}



/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	//resize canvas
	
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


	//Reposition Walls
	sprites[s_wall_left].color = 'rgb(200,0,0)';
	sprites[s_wall_left].bounciness = WALL_BOUNCINESS;
	sprites[s_wall_left].friction = WALL_FRICTION;

	sprites[s_wall_right].color = 'rgb(100,100,0)';
	sprites[s_wall_right].bounciness = WALL_BOUNCINESS;
	sprites[s_wall_right].friction = WALL_FRICTION;
	
	sprites[s_wall_top].color = 'rgb(0,200,0)';
	sprites[s_wall_top].bounciness = WALL_BOUNCINESS;
	sprites[s_wall_top].friction = WALL_FRICTION;

	sprites[s_wall_bottom].color = 'rgb(0,100,100)';
	sprites[s_wall_bottom].bounciness = WALL_BOUNCINESS;
	sprites[s_wall_bottom].friction = WALL_FRICTION;
}

/*******************************************************/
// AlienHit(ball, alien)
// Called when the ball hits an alien
// Deletes the alien that the ball hit
/*******************************************************/
function AlienHit(alien, ball) {
	alien.remove(); //remove the alien
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