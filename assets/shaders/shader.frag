precision highp float;
varying vec2 vTexCoord;
uniform int map[400];

void main() {

    int val = 0;
    if (vTexCoord.x + vTexCoord.y * 20 < 399) {
        val = map[vTexCoord.x + vTexCoord.y * 20];
    }
    vec4 colour = vec4(val, 1, 1, 1);
    gl_FragColor = colour;
}