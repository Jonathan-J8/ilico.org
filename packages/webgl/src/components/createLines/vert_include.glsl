#include /lygia/generative/pnoise

uniform float uTime;
uniform vec3 uMousePositionLerp;
uniform vec2 uMouseVelocityLerp;
uniform vec2 uScroll;

in vec3 offset;

out vec3 vPosition2;
out vec2 vUv2;
flat out int vId2;