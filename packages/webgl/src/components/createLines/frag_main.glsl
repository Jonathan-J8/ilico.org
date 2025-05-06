

vec3 _pos = vPosition2;
vec2 _uv = vUv2;
float _time = uTime * -0.00001;
float _phase =  vIndex / float( COUNT ) ;
float _size = 100.;
// float y  = smoothstep(-1., 1., sin(sin((_uv.y * 10.1 ) * 10.1  + fract(uTime *0.001)* -6.14 ))) ;
// float b  = smoothstep(-1., 1., sin(cos((_pos.y * .2 ) * 3.  + fract(uTime *0.00001)* -6.14 ))) ;
// float n = gnoise(vec2( _pos.x, _pos.y * 1.1 + uTime * -0.01 *  float(vId2 / 100) )) * 1.  ;
// float r = smoothstep(-1., 1., sin(_pos.y * 10.  )) * float(vId2 / 10) * n;//  + fract(uTime *0.01)* -6.14 ;
// float nr = n * r;

float rect = smoothstep(.95, 1., sin( (_uv.y + _time + _phase  ) * _size ) ); 
float centerFade = abs(_uv.y - 0.5); 
float fade = 1.-  smoothstep(.3,  .5, centerFade) ; 

outgoingLight += rect;

#ifdef OPAQUE
    diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
    diffuseColor.a *= material.transmissionAlpha;
#endif

// diffuseColor.a *= length(diffuseColor.rgb) / 3.;
// diffuseColor.a *=_uv.y ;
diffuseColor.a *= clamp(rect, 0.2, 1.) * fade;
// diffuseColor.a *= (1. - smoothstep( fogNear, fogFar, vFogDepth )) ;

gl_FragColor = vec4( outgoingLight, diffuseColor.a );
  