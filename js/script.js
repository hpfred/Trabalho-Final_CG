function main() {
  const { gl, meshProgramInfo } = initializeWorld();

  const cubeTranslation = [0, 0, 0];

  const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20);

  const cubeVAO = twgl.createVAOFromBufferInfo(
    gl,
    meshProgramInfo,
    cubeBufferInfo,
  );

  var fieldOfViewRadians = degToRad(60);

  const cubeUniforms = {
    u_colorMult: [0.5, 0.5, 1, 1],//[1, 0.5, 0.5, 1],
    u_matrix: m4.identity(),
  };

  function computeMatrix(viewProjectionMatrix, translation, yRotation, xRotation, scale, TransX, TransY, TransZ) {
    xRotation = xRotation*0.063;      //0-360
    yRotation = yRotation*0.063;
    scale = (scale*0.027)+0.2;        //scale = (scale*0.03024)+0.126;

    var matrix = m4.translate(
      viewProjectionMatrix,
      TransX,
      TransY,
      TransZ,
    );
    //axisRotate
    var scl = m4.scale(matrix, scale, scale, scale);
    var xRot = m4.xRotate(scl, xRotation);
    return m4.yRotate(xRot, yRotation);
  }
  
  loadGUI();
  
  function render(now) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var cameraPosition = [0, 0, 100];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    //translate cameraMatrix?

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.useProgram(meshProgramInfo.program);

    // ------ Draw the cube --------

    // Setup all the needed attributes.
    gl.bindVertexArray(cubeVAO);
    
    cubeUniforms.u_matrix = computeMatrix(
      viewProjectionMatrix,
      cubeTranslation,
      config.rotateY,
      config.rotateX,
      config.scale,
      config.TransX,
      config.TransY,
      config.TransZ,
    );

    // Set the uniforms we just computed
    twgl.setUniforms(meshProgramInfo, cubeUniforms);

    twgl.drawBufferInfo(gl, cubeBufferInfo);
	requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

function animate(now){
  now *= 0.001;
  var then = now;
  var rot1 = 38, rot2 = 55, trans1 = -50;
  var aniSpeed = 5;

  requestAnimationFrame(aniRot1);
  if(config.rotateX==rot1)
    requestAnimationFrame(aniTrans1);
  if(config.TransX==trans1)
    requestAnimationFrame(aniRot2);
  
  function aniRot1(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;
    if(config.rotateX<rot1){
      config.rotateX += dTime*aniSpeed;
      if(config.rotateX<rot1)
      requestAnimationFrame(aniRot1);
      else{
        config.rotateX = rot1;
        requestAnimationFrame(aniTrans1);
      }
    }
    else if(config.rotateX>rot1){
      config.rotateX -= dTime*aniSpeed;
      if(config.rotateX>rot1)
      requestAnimationFrame(aniRot1);
      else{
        config.rotateX = rot1;
        requestAnimationFrame(aniTrans1);
      }
    }
  }
  
  function aniTrans1(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;
    if(config.TransX<trans1){
      config.TransX += dTime*aniSpeed;
      if(config.TransX<trans1)
      requestAnimationFrame(aniTrans1);
      else{
        config.TransX = trans1;
        requestAnimationFrame(aniRot2);
      }
    }
    else if(config.TransX>trans1){
      config.TransX -= dTime*aniSpeed;
      if(config.TransX>trans1)
      requestAnimationFrame(aniTrans1);
      else{
        config.TransX = trans1;
        requestAnimationFrame(aniRot2);
      }
    }
  }

  function aniRot2(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;
    if(config.rotateY<rot2){
      config.rotateY += dTime*aniSpeed;
      if(config.rotateY<rot2)
        requestAnimationFrame(aniRot2);
      else config.rotateY = rot2;
    }
    else if(config.rotateY>rot2){
      config.rotateY -= dTime*aniSpeed;
      if(config.rotateY>rot2)
        requestAnimationFrame(aniRot2);
      else config.rotateY = rot2;
    }
  }
}
