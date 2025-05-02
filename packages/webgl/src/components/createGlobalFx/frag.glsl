
#include <common>

uniform vec2 uResolution;
uniform sampler2D uMap0;
uniform sampler2D tDiffuse;

varying vec2 vUv;
out vec4 FragColor;

vec2 uvCover(in vec2 res){
  vec2 s = res; // Screen
  vec2 i = vec2(128.); // Image known size
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 uv = vUv * s / new + offset;
  return uv;
}

void main()	{

	// vec2 cellsize = 1. / uResolution.xy;

	// vec2 uv = vUv * cellsize;

	// vec2 waterUV = gl_FragCoord.xy / uResolution ;

	// vec2 res = uResolution;
	// // vec2 simAspect = res.xy / min(res.x, res.y);
	// // vec2 centeredUV = (vUv - 0.5) * simAspect + 0.5;
	// vec2 centeredUV = uvCover(res);
	// uv.x -= 0.5;
	// uv = uv * 2. - 1.; //[-1,1]

// vec2 scale = uResolution / vec2(1004.0, 1004.0); // if uWaterMap is 512x512
// vec2 waterUV = gl_FragCoord.xy / uResolution * scale;	// waterUV.x *= 0.5;
	// waterUV.x -= 0.5;

	vec4 map0 = texture2D( uMap0, vUv );
	vec4 diffuse = texture2D( tDiffuse, vUv );

	FragColor =  map0;

}

