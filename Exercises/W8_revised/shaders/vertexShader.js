export default `
  // attributes: inputs with a different value for every vertex. main.js fills them in Task 1a.
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;

  // ======== TASK 3a ========
  // add the vertex color attribute (a vec4: r, g, b, a)
  // TODO ...
  // ====== END TASK 3a ======

  // uniforms: inputs with one value for the whole mesh. main.js sets them in Task 1b.
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform vec4 uLightPos;

  // varying: the output of this shader. The fragment shader reads it.
  varying lowp vec4 vColor;

  float computeDiffuseIntens(in vec4 position, in vec3 normal, in vec4 lightPos)
  {
    // the light position is given in camera coordinates, so transform the vertex position and normal to camera space first
    // (w = 0 drops the translation for the normal; this works because the model-view matrix contains no scaling)
    position = uModelViewMatrix * position;
    normal = (uModelViewMatrix * vec4(normal, 0.0)).xyz;
    normal = normalize(normal);
    
    // compute the light direction
    vec3 vecToLight = normalize(lightPos.xyz - position.xyz);
    
    // the intensity is proportional to the angle between the surface and the light direction
    float diffuseIntensity = dot(normal, vecToLight);
    diffuseIntensity = clamp(diffuseIntensity, 0.0, 1.0);
    
    return diffuseIntensity;
  }

  void main(void) {

    // transform the vertex position from object space to clip space
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

    // === very simplistic lighting model ===
    float ambientIntensity = 0.4; // controls how much ambient light there is in the scene, some value between 0.0 and 1.0
    float diffuseIntensity = computeDiffuseIntens(aVertexPosition, aVertexNormal, uLightPos); // accounts for direct light

    // ======== TASK 3a ========
    // TODO: use the vertex color instead of the constant grey
    vColor = vec4(0.3, 0.3, 0.3, 1.0) * (diffuseIntensity + ambientIntensity);
    // ====== END TASK 3a ======
    
    // make sure we don't overshoot
    vColor = clamp(vColor, 0.0, 1.0);
    vColor[3] = 1.0; // alpha value
  }
  `;
