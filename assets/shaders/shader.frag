precision highp float;
varying vec2 vTexCoord;
uniform sampler2D tex0;
void main() {
    float scrn_x_pos = vTexCoord.x / (width); 
    


    float ray_angle = player_dir + FOV * scrn_x_pos;

    int dist = Raycast(ray_angle);
    vec4 colour = vec4(0, 1, 1, 1);
    gl_FragColor = colour;
}