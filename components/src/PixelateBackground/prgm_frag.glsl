#version 300 es
precision lowp float;
uniform vec2 resolution;
uniform float pixelSize;
uniform vec2 mousePosition;
uniform vec2 mouseVelocity;
in vec2 v_uv;
out vec4 outColor;


void main() {
	// TODO: pixelate based on mouse position;
	vec2 uv_screen = v_uv * resolution;
	vec2 position = vec2(mousePosition.x + 0.5, mousePosition.y * -1.0 + 0.5);
	position = position * resolution;
	vec2 diff = abs(uv_screen - position);
	float velocity = length(mouseVelocity * 5.0);
	vec2 boxSize = vec2(100.0) * velocity; // square region size in pixels
	float strength = step(max(diff.x, diff.y), boxSize.x);
	float mousePixelSize = 1.0;//mix(1.0, 50.0, strength) * clamp(velocity, 0.0, 1.0);
	
	vec2 uv = v_uv * resolution;
	vec2 centered = uv - 0.5 * resolution;
	float localPixelSize = mousePixelSize + pixelSize;
	centered = floor(centered / localPixelSize) * localPixelSize + 0.5 * localPixelSize;

	// Shift back
	uv = (centered + 0.5 * resolution) / resolution;
	
	
	outColor = vec4(.0);
}
