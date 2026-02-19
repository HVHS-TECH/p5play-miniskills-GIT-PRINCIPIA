//----------------------------------------//
//Written by Alex Curwen                  //
//Raycaster                               //
//----------------------------------------//


//----//
//Vars//
//----//

//World
var img;
var data = [
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


//FBO
var fbo;
const FBO_SCALE = 4000;
var fbo_width;
var fbo_height;
var fbo_shader;


//CANVAS
var cnv;
var cnv_width;
var cnv_height;


//-----------------------------------//
//preload()                          //
//Load function, loads the game files//
//-----------------------------------//
function preload() {
    //--------------------------------//
    //Load the framebuffer quad shader//
    //--------------------------------//
    fbo_shader = loadShader('../assets/shaders/shader.vert', '../assets/shaders/shader.frag');




    //Load image from map data

    
    
}

//------------------------------------//
//setup()                             //
//Setup function, initializes the game//
//------------------------------------//
function setup() {

    

    //Initialize canvas
    cnv_width = windowWidth;
    cnv_height = windowHeight - 100;
    cnv = createCanvas(cnv_width, cnv_height, WEBGL);
    
    //Initialize fbo
    fbo_width = FBO_SCALE;
    fbo_height = FBO_SCALE * cnv_height / cnv_width;
    fbo = createFramebuffer();
	fbo.resize(fbo_width, fbo_height);


    

}


//------------------------------//
//draw()                        //
//Draw function, draws the scene//
//------------------------------//
function draw() {
    fbo.begin();

    background('black');

    shader(fbo_shader);
    //Send the map to the shader
    fbo_shader.setUniform('tex0', img); 
    plane(fbo_width, fbo_height);

    fbo.end();
    background('black');
    image(fbo, -cnv_width/2, -cnv_height/2, cnv_width, cnv_height);
}





















//---------//
//Callbacks//
//---------//

function windowResized() {
	
	cnv_width = windowWidth;
	cnv_height = windowHeight - 100;
	cnv.resize(cnv_width, cnv_height);
	fbo_width = FBO_SCALE;
	fbo_height = FBO_SCALE * cnv_height / cnv_width;
	fbo.resize(fbo_width, fbo_height);
}
