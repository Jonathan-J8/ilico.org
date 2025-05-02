#include /lygia/math/rotate3d


uniform float uTime;
uniform vec3 uMousePositionLerp;
uniform vec2 uMouseVelocityLerp;

in vec3 offset;

out vec3 vPosition2;
out vec2 vUv2;
flat out int vId2;