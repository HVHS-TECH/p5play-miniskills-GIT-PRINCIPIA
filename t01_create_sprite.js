/*******************************************************/
// P5.play: t01_create_sprite
// Create a sprite
/// Written by Alex Curwen
/*******************************************************/
	
/*******************************************************/
// Notes:
// middle is [0, 0], top is [0, CNV_HEIGHT / 2], bottom is [0, -CNV_HEIGHT / 2]
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
var s_rect_y = 100; //y pos
const S_RECT_W = 100; //width
const S_RECT_H = 100; //height

var s_circ;
var s_circ_x = 0; //x pos
var s_circ_y = -100; //y pos
const S_CIRC_D = 100; //Diameter

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
	s_rect = new Sprite(s_rect_x + CNV_WIDTH / 2, -s_rect_y + CNV_HEIGHT / 2, S_RECT_W, S_RECT_H, 'd');
	s_rect.color = 'ccc';

	s_circ = new Sprite(s_circ_x + CNV_WIDTH / 2, -s_circ_y + CNV_HEIGHT / 2, S_CIRC_D, 'd');
	s_circ.color = 'ccc';

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