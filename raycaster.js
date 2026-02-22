//----------------------------------------//
//Written by Alex Curwen                  //
//Raycaster                               //
//----------------------------------------//


//----//
//Vars//
//----//

//World
var img;
var map = 
"11111111111111111111" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"11111111111111111111"
;
var mapList = new Array(400).fill(0);
var map = 
"11111111111111111111" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"10000000000000000001" +
"11111111111111111111"
;
var mapList = new Array(400).fill(0);


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


//CAMERA
var player_x, player_z;
var player_dir;
const FOV = 60;



//-----------------------------------//
//preload()                          //
//Load function, loads the game files//
//-----------------------------------//
function preload() {
    //--------------------------------//
    //Load the framebuffer quad shader//
    //--------------------------------//
    fbo_shader = loadShader('../assets/shaders/shader.vert', '../assets/shaders/shader.frag');


    for (var i = 0; i < 400; i++) {
        mapList[i] = Number(map[i]);
    }
    for (var i = 0; i < 400; i++) {
        mapList[i] = Number(map[i]);
    }

    
    
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
    fbo_height = Math.round(FBO_SCALE * cnv_height / cnv_width);
    fbo_height = Math.round(FBO_SCALE * cnv_height / cnv_width);
    fbo = createFramebuffer();
	fbo.resize(fbo_width, fbo_height);


    
    //Player
    player_x = 2;
    player_z = 2;
    player_dir = 0;

    
}


//------------------------------//
//draw()                        //
//Draw functiondraws the scene//
//Draw functiondraws the scene//
//------------------------------//
function draw() {
    fbo.begin();

    background('black');

    shader(fbo_shader);
    //Send the uniforms to the shader
    fbo_shader.setUniform('tex0', mapList); 
    fbo_shader.setUniform('player_x', player_x); 
    fbo_shader.setUniform('player_z', player_z); 
    fbo_shader.setUniform('player_dir', player_dir); 
    fbo_shader.setUniform('width', fbo_width); 
    
    fbo_shader.setUniform('FOV', FOV); 
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
	fbo_height = Math.round(FBO_SCALE * cnv_height / cnv_width);
	fbo_height = Math.round(FBO_SCALE * cnv_height / cnv_width);
	fbo.resize(fbo_width, fbo_height);
}
