




vec3 toCamera = normalize(cameraPosition - offset);
// Compute angle in XZ plane (or YZ if needed depending on your setup)
float angle = atan(toCamera.y, toCamera.x) ;
// Apply rotation around Z-axis using a 2D matrix
mat2 rot = mat2(
    cos(angle), -sin(angle),
    sin(angle),  cos(angle)
);

// Rotate in XY plane (Z-axis rotation)
transformed.xy = rot * transformed.xy;
transformed += offset;



vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif


// Mouse interaction
mvPosition = modelMatrix * mvPosition;
// vec3 mousePos = uMousePositionLerp;
// vec2 mouseVel = uMouseVelocityLerp;
// float dist = distance(mvPosition.xyz, mousePos.xyz);
// float r = clamp(distance(cameraPosition, mvPosition.xyz) * 0.5 , 0.5, 100.) ;
// float influence = smoothstep(5., .0, dist );
// mvPosition.x += influence * mousePos.x * mouseVel.x;
// mvPosition.z += influence * mousePos.z * mouseVel.y;

vPosition2 = mvPosition.xyz;
vUv2 = uv;
vId2 = gl_VertexID;

mvPosition = viewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;