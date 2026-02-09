/*******************************************************/
// P5.play: t03_gravity
// Sprite falls due to gravity
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

/*******************************************************/
// Vars
/*******************************************************/

//Canvas
var cnv;
var CNV_WIDTH;
var CNV_HEIGHT;

//Sprite
var s_rect;
var s_rect_pos = new Vec2(0, 0.7);
const S_RECT_W = 0.1; //width
const S_RECT_H = 0.1; //height

var s_circ;
var s_circ_pos = new Vec2(0.1, -0.7);
const S_CIRC_D = 0.2; //Diameter

var s_platform;
var s_platform_pos = new Vec2(-0.3, -0.9);
const S_PLATFORM_W = 0.3; //Width
const S_PLATFORM_H = 0.05; //Height

var s_paddle;
var s_paddle_pos = new Vec2(-0.7, -0.875);
const S_PADDLE_W = 0.2;
const S_PADDLE_H = 0.01;
const S_PADDLE_ROT_SPEED = -5;

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
	var s_rect_scrn_pos = CanvasToScreen(s_rect_pos);
	s_rect = new Sprite(s_rect_scrn_pos.x, s_rect_scrn_pos.y, S_RECT_W * CNV_HEIGHT, S_RECT_H * CNV_HEIGHT, 'd');
	s_rect.color = 'rgb(100, 46, 7)';
	s_rect.vel.y = 4;
	s_rect.rotationSpeed = 35.97;

	var s_circ_scrn_pos = CanvasToScreen(s_circ_pos);
	s_circ = new Sprite(s_circ_scrn_pos.x, s_circ_scrn_pos.y, S_CIRC_D * CNV_HEIGHT, 'k');
	s_circ.color = 'rgb(40, 100, 100)';

	var s_platform_scrn_pos = CanvasToScreen(s_platform_pos);
	s_platform = new Sprite(s_platform_scrn_pos.x,s_platform_scrn_pos.y,S_PLATFORM_W * CNV_WIDTH, S_PLATFORM_H * CNV_HEIGHT, 'k');
	s_platform.color = 'rgb(200,200,200)';
	s_platform.rotation = -20;
	
	var s_paddle_scrn_pos = CanvasToScreen(s_paddle_pos);
	s_paddle = new Sprite(s_paddle_scrn_pos.x, s_paddle_scrn_pos.y, S_PADDLE_W * CNV_WIDTH, S_PADDLE_H * CNV_HEIGHT, 'k');
	s_paddle.color = 'rgb(200,100,100)';
}



/*******************************************************/
// CanvasToScreen(x,y)
//Returns [x,y] transformed from canvas space [-1,-1] - [1,1] to world space [-CNV_WIDTH / 2, -CNV_HEIGHT / 2] - [CNV_WIDTH / 2, CNV_HEIGHT / 2]
/*******************************************************/
function CanvasToScreen(pos) {
	return new Vec2((pos.x + 1) * CNV_WIDTH / 2, (-pos.y + 1) * CNV_HEIGHT / 2);
}	


/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background('ccc'); 
	s_paddle.rotation += S_PADDLE_ROT_SPEED; //Increase rotation without needing to counter gravity
}

/*******************************************************/
//  END OF APP
/*******************************************************/