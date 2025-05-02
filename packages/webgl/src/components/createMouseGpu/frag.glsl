
#include <common>


uniform vec2 uMousePosition;
uniform float uMousePress;

const float uBrushSize = 0.1;          // Radius of brush (0.01 = small, 0.1 = large)
const float uBrushStrength = .5;      // Opacity of brush stroke

void main()	{

	vec2 cellSize = 1.0 / resolution.xy;
	vec2 uv = gl_FragCoord.xy * cellSize;
	vec4 prevMap = texture2D( map,  uv );

	vec2 pointerPos = (uMousePosition + 1.0) * 0.5 ;  // Now in [0, 1] range
	
    vec4 color = prevMap;

    // if (uMousePress >= 1.) {
        float dist = distance(uv, pointerPos);
        float falloff = smoothstep(uBrushSize, 0.0, dist); // soft edges
        vec4 brushColor = vec4(1.0, 1.0, 1.0, 1.0); // black pencil

        color = mix(color, brushColor, falloff * uBrushStrength);
    // }


    vec4 north = texture2D( map, ( uv + vec2( 0.0, cellSize.y ) ) );
	vec4 south = texture2D( map, ( uv + vec2( 0.0, - cellSize.y ) ) );
	vec4 east =  texture2D( map, ( uv + vec2( cellSize.x, 0.0 ) ) );
	vec4 west =  texture2D( map, ( uv + vec2( - cellSize.x, 0.0 ) ) );
	float neighbours = ( north.x + south.x + east.x + west.x )  * 0.25 ;
    color += neighbours;
    color *= .49;

    // color = mix(color, color + vec4(neighbours), .01); // blend in some of the blur
    // // color *= 0.9;
    color = clamp(color, 0.,1.);

	gl_FragColor = color;

}

