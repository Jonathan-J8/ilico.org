#include /lygia/generative/pnoise
#include /lygia/math/map

uniform float uTime;
uniform vec3 uMouseWorldPositionLerp;
uniform vec2 uMouseVelocityLerp;
uniform vec2 uScroll;
uniform vec2 uScrollVelocity;
uniform vec2 uScrollVelocityLerp;

in vec3 offset;
in float index;

out vec3 vPosition2;
out vec2 vUv2;
out float vIndex;
