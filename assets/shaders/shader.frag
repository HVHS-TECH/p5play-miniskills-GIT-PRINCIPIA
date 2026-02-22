precision highp float;
varying vec2 vTexCoord;
uniform int map[400];
uniform float player_x;
uniform float player_z;
uniform float player_dir;
uniform int FOV;
uniform int width;

int Raycast(float direction) {
    return 0 * player_x + 0 * player_z;
}

void main() {
    float scrn_x_pos = vTexCoord.x / (width); 
    


    float ray_angle = player_dir + FOV * scrn_x_pos;

    int dist = Raycast(ray_angle);
    vec4 colour = vec4(0, 1, 1, 1);
    gl_FragColor = colour;
}