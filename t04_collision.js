/*******************************************************/
// P5.play: t04_collision
// Sprite falls due to gravity & collides with the floor
// Written by Alex Curwen
/*******************************************************/

/*******************************************************/
// Notes:
// middle is [0, 0], top is [0, 1], bottom is [0, -1]
// position and sizes are relative to canvas HEIGHT
/*******************************************************/

/*******************************************************/
// Classes
/*******************************************************/

class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

//Simple implementation, not very robust or expandable!
class LineAnimation {
	constructor(start, end, time, start_time, sprite_idx) {
		this.start = start;
		this.end = end;
		this.time = time; //Length of animation (half) in frames
		this.sprite_idx = sprite_idx;
		this.step = start_time; //Steps through the animation
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
var CNV_WIDTH;
var CNV_HEIGHT;

//Sprites
var sprites = []; //List of all sprite objects
var animations = []; //List of all animation objects

var s_rect;
const s_rect_pos = new Vec2(0, 0.7);
const S_RECT_W = 0.1; //width
const S_RECT_H = 0.1; //height

var s_circ;
const s_circ_pos = new Vec2(0.1, -0.7);
const S_CIRC_D = 0.2; //Diameter

var s_platform;
const s_platform_pos = new Vec2(-0.3, -0.9);
const S_PLATFORM_W = 0.3; //Width
const S_PLATFORM_H = 0.05; //Height

var s_paddle;
const s_paddle_pos = new Vec2(-0.7, -0.875);
const S_PADDLE_W = 0.2;
const S_PADDLE_H = 0.01;
const S_PADDLE_ROT_SPEED = -5;

var s_lift;
const s_lift_pos_START = new Vec2(-0.9, -0.95);
const s_lift_pos_END = new Vec2(-0.9, 0.8);
const s_lift_time = 60 * 2; //4 seconds of 60 fps
const s_lift_start = 60 * 1; //Starts at 5 seconds into the animation
const S_LIFT_W = 0.1;
const S_LIFT_H = 0.01;

var s_wedge;
const s_wedge_pos = new Vec2(-0.9, 0.9);
const S_WEDGE_W = 0.1;
const S_WEDGE_H = 0.01;


/*******************************************************/
// setup()
//Initializes the scene and its content
/*******************************************************/
function setup() {
	console.log("setup: ");
	//Initialize world
	world.gravity.y = 9.81;

	//Initialize canvas
	CNV_WIDTH = windowWidth;
	CNV_HEIGHT = windowHeight - 100;
	cnv = new Canvas(CNV_WIDTH, CNV_HEIGHT); //-100 for heading

	//Initialize sprites
	const s_rect_scrn_pos = CanvasToScreen(s_rect_pos);
	s_rect = sprites.length;
	sprites.push(new Sprite(s_rect_scrn_pos.x, s_rect_scrn_pos.y, S_RECT_W * CNV_HEIGHT, S_RECT_H * CNV_HEIGHT, 'd'));
	sprites[s_rect].color = 'rgb(100, 46, 7)';
	sprites[s_rect].vel.y = 4;
	sprites[s_rect].rotationSpeed = 35.97;

	const s_circ_scrn_pos = CanvasToScreen(s_circ_pos);
	s_circ = sprites.length;
	sprites.push(new Sprite(s_circ_scrn_pos.x, s_circ_scrn_pos.y, S_CIRC_D * CNV_HEIGHT, 'k'));
	sprites[s_circ].color = 'rgb(40, 100, 100)';

	const s_platform_scrn_pos = CanvasToScreen(s_platform_pos);
	s_platform = sprites.length;
	sprites.push(new Sprite(s_platform_scrn_pos.x,s_platform_scrn_pos.y,S_PLATFORM_W * CNV_WIDTH, S_PLATFORM_H * CNV_HEIGHT, 'k'));
	sprites[s_platform].color = 'rgb(200,200,200)';
	sprites[s_platform].rotation = -20;
	sprites[s_platform].friction = 0; //Slippy platform to direct object
	
	const s_paddle_scrn_pos = CanvasToScreen(s_paddle_pos);
	s_paddle = sprites.length;
	sprites.push(new Sprite(s_paddle_scrn_pos.x, s_paddle_scrn_pos.y, S_PADDLE_W * CNV_WIDTH, S_PADDLE_H * CNV_HEIGHT, 'k'));
	sprites[s_paddle].color = 'rgb(200,100,100)';
	sprites[s_paddle].friction = 0; //Slippy paddle to launch object

	const s_lift_scrn_pos = CanvasToScreen(s_lift_pos_START);
	const s_lift_scrn_pos_end = CanvasToScreen(s_lift_pos_END);
	s_lift = sprites.length;
	sprites.push(new Sprite(s_lift_scrn_pos.x, s_lift_scrn_pos.y, S_LIFT_W * CNV_WIDTH, S_LIFT_H * CNV_HEIGHT, 'k'));
	animations.push(new LineAnimation(s_lift_scrn_pos, s_lift_scrn_pos_end, s_lift_time, s_lift_start, s_lift));

	const s_wedge_scrn_pos = CanvasToScreen(s_wedge_pos);
	s_wedge = sprites.length;
	sprites.push(new Sprite(s_wedge_scrn_pos.x, s_wedge_scrn_pos.y, S_WEDGE_W * CNV_WIDTH, S_WEDGE_H * CNV_HEIGHT, 'k'));
	sprites[s_wedge].color = 'rgb(200,100,100)';
	sprites[s_wedge].friction = 0; //Slippy wedge to direct object
	sprites[s_wedge].rotation = -30;
}



/*******************************************************/
// CanvasToScreen(x,y)
//Returns [x,y] transformed from canvas space [-1,-1] - [1,1] to world space [-CNV_WIDTH / 2, -CNV_HEIGHT / 2] - [CNV_WIDTH / 2, CNV_HEIGHT / 2]
/*******************************************************/
function CanvasToScreen(pos) {
	return new Vec2((pos.x + 1) * CNV_WIDTH / 2, (-pos.y + 1) * CNV_HEIGHT / 2);
}	

/*******************************************************/
//Lerp()
/*******************************************************/
function Lerp(a,b,k) {
	return a + (b - a) * k;
}


/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background('ccc'); 
	sprites[s_paddle].rotation += S_PADDLE_ROT_SPEED; //Increase rotation without needing to counter gravity
	for (var a = 0; a < animations.length; a++) {
		animations[a].Update();
	}
}

/*******************************************************/
//  END OF APP
/*******************************************************/