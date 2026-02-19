precision highp float;
varying vec2 vTexCoord;
uniform sampler2D tex0;
void main() {
    vec4 colour = texture2D(tex0, vTexCoord);
    gl_FragColor = vec4(vTexCoord.x, vTexCoord.y, 1.0, 1.0);
}