

vec3 _pos = vPosition2;
vec2 _uv = vUv2;
float _time = uTime * 0.001;
float y  = smoothstep(-1., 1., sin(sin((_uv.y * 10.1 ) * 10.1  + fract(uTime *0.001)* -6.14 ))) ;
float b  = smoothstep(-1., 1., sin(cos((_pos.y * .2 ) * 3.  + fract(uTime *0.00001)* -6.14 ))) ;
float n = gnoise(vec2( _pos.x, _pos.y * 1.1 + uTime * -0.01 *  float(vId2 / 100) )) * 1.  ;
float r = smoothstep(-1., 1., sin(_pos.y * 10.  )) * float(vId2 / 10) * n;//  + fract(uTime *0.01)* -6.14 ;
// float nr = n * r;

float id = float(vId2 % 500);
float nr = gnoise(vec2( _uv.x * 2., _uv.y * 10. + uTime * -0.001 )) * 1.  ;
nr = smoothstep(.94, 1., sin((_uv.y + _time * (-0.01) ) * 100. ) ); 


outgoingLight += nr;

#ifdef OPAQUE
    diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
    diffuseColor.a *= material.transmissionAlpha;
#endif

diffuseColor.a *= (nr + 0.1);

diffuseColor.a *= (1. - smoothstep( fogNear, fogFar, vFogDepth )) ;

gl_FragColor = vec4( outgoingLight, diffuseColor.a );
  