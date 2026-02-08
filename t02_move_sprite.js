/*******************************************************/
// P5.play: t02_move_sprite
// Move a sprite
// Written by Alex Curwen
/*******************************************************/

/*******************************************************/
// Notes:
// middle is [0, 0], top is [0, 1], bottom is [0, -1]
// position and sizes are relative to canvas HEIGHT
/*******************************************************/

/*******************************************************/
// vars
/*******************************************************/

//Canvas
var cnv;
var CNV_WIDTH;
var CNV_HEIGHT;

//Sprite
var s_rect;
var s_rect_x = 0; //x pos
var s_rect_y = 0.8; //y pos
const S_RECT_W = 0.1; //width
const S_RECT_H = 0.1; //height

var s_circ;
var s_circ_x = 0.1; //x pos
var s_circ_y = -0.5; //y pos
const S_CIRC_D = 0.2; //Diameter

/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	console.log("setup: ");

	//Initialize canvas
	CNV_WIDTH = windowWidth;
	CNV_HEIGHT = windowHeight - 100;
	cnv = new Canvas(CNV_WIDTH, CNV_HEIGHT); //-100 for heading

	//Initialize sprite
	s_rect = new Sprite((s_rect_x + 1) * CNV_WIDTH / 2, (-s_rect_y + 1) * CNV_HEIGHT / 2, S_RECT_W * CNV_HEIGHT, S_RECT_H * CNV_HEIGHT, 'd');
	s_rect.color = 'rgb(100, 46, 7)';
	s_rect.vel.y = 4;
	s_rect.rotationSpeed = 6.97;

	s_circ = new Sprite((s_circ_x + 1) * CNV_WIDTH / 2, (-s_circ_y + 1) * CNV_HEIGHT / 2, S_CIRC_D * CNV_HEIGHT, 'k');
	s_circ.color = 'rgb(40, 100, 100)';

}
	
/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background('ccc'); 
}

/*******************************************************/
//  END OF APP
/*******************************************************/