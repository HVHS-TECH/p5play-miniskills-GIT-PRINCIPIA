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

var BG_COLOUR;
/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	console.log("setup: ");

	//Initialize canvas
	CNV_WIDTH = windowWidth;
	CNV_HEIGHT = windowHeight - 100;
	cnv = new Canvas(CNV_WIDTH, CNV_HEIGHT); //-100 for heading
    BG_COLOUR = color(random(255), random(255), random(255));
	
    SpawnSprites();
}

/*******************************************************/
// SpawnSprites()
/*******************************************************/
function SpawnSprites() {
    const SPACING = 25;
    const SIZE = 50;

    for (var y = SPACING + SIZE; y < CNV_HEIGHT - SPACING - SIZE; y+= SPACING + SIZE) {
        let rowColour = color(random(255), random(255), random(255));
        for (var x = SPACING + SIZE; x < CNV_WIDTH - SPACING - SIZE; x+= SPACING + SIZE) {
            let s = createSprite(x, y, SIZE, SIZE);
            s.color = rowColour;
        }
    }
}
	
/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background(BG_COLOUR); 
}

/*******************************************************/
//  END OF APP
/*******************************************************/