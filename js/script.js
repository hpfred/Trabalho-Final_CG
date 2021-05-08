function main() {
  const { gl, programInfo } = initializeWorld();
  
  const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20);
  
  const cubeVAO = twgl.createVAOFromBufferInfo(
    gl,
    programInfo,
    cubeBufferInfo,
    );
    
  var fieldOfViewRadians = degToRad(60);

  var objectsToDraw = [];
  var objects = [];
  
  //*
  var cubeMain = new Node();
  //cubeMain.localMatrix = m4.translation(0, 0, 0);
  cubeMain.drawInfo = {
    uniforms: {
      //u_colorOffset: [0.6, 0.6, 0, 1], // yellow
      u_colorMult: [0.5, 0.5, 1, 1],  //[1, 0.5, 0.5, 1],
      //u_matrix: m4.identity(),
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };
  //*
  var cube1 = new Node();
  //cube1.localMatrix = m4.translation(100, 0, 0);
  cube1.drawInfo = {
    uniforms: {
      u_colorMult: [0.5, 0.5, 1, 1],  //[1, 0.5, 0.5, 1],
      //u_matrix: m4.identity(),
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };
  var cube2 = new Node();
  cube2.localMatrix = m4.translation(-20, 0, 0);
  cube2.drawInfo = {
    uniforms: {
      u_colorMult: [0.5, 0.5, 1, 1],  //[1, 0.5, 0.5, 1],
      //u_matrix: m4.identity(),
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };

  cube1.setParent(cubeMain);
  cube2.setParent(cubeMain);
  //*/

  var objects = [cubeMain, cube1, cube2];
  var objectsToDraw = [cube2.drawInfo, cube1.drawInfo];
  //Additional cubes
  /*
  var nCubes = 1;
  function addModel(){
    if(nCubes==1){
      nCubes++;
      var cube2 = new Node();
      cube2.localMatrix = m4.translation(pos, 0, 0);
      cube2.drawInfo = {
        uniforms: {
          u_colorMult: [0.5, 0.5, 1, 1],  //[1, 0.5, 0.5, 1],
          u_matrix: m4.identity(),
        },
        meshProgramInfo: meshProgramInfo,
        bufferInfo: cubeBufferInfo,
        vertexArray: cubeVAO,
      };
    }
    if(nCubes==2){
      nCubes++;
      var cube2 = new Node();
      cube2.localMatrix = m4.translation(pos, 0, 0);
      cube2.drawInfo = {
        uniforms: {
          u_colorMult: [0.5, 0.5, 1, 1],  //[1, 0.5, 0.5, 1],
          u_matrix: m4.identity(),
        },
        meshProgramInfo: meshProgramInfo,
        bufferInfo: cubeBufferInfo,
        vertexArray: cubeVAO,
      };
    }
  }
  //*/

  /*
  const cubeUniforms = {
    u_colorMult: [0.5, 0.5, 1, 1],  //[1, 0.5, 0.5, 1],
    u_matrix: m4.identity(),
  };
  //*/

  /*
  function computeMatrix(viewProjectionMatrix, xRotation, yRotation, zRotation, scale, TransX, TransY, TransZ) {
    //xRotation = xRotation*0.063;      //0-360
    xRotation = degToRad(xRotation*3.6);
    yRotation = degToRad(yRotation*3.6);
    zRotation = degToRad(zRotation*3.6);
    scale = (scale*0.027)+0.2;

    var matrix = m4.translate(
      viewProjectionMatrix,
      TransX,
      TransY,
      TransZ,
    );
    //axisRotate
    var scl = m4.scale(matrix, scale, scale, scale);
    var xRot = m4.xRotate(scl, xRotation);
    var yRot = m4.yRotate(xRot, yRotation);
    return m4.zRotate(yRot, zRotation);
  }
  //*/
  
  //*
  function computeMatrix1(localMatrix, scale, TransX, TransY, TransZ) {
    scale = (scale*0.027)+0.2;
    var matrix = m4.translate(
      localMatrix,
      TransX,
      TransY,
      TransZ,
    );
    return m4.scale(matrix, scale, scale, scale);
  }
  //*
  function computeMatrix2(localMatrix, xRotation, yRotation, zRotation) {
    xRotation = degToRad(xRotation*3.6);
    yRotation = degToRad(yRotation*3.6);
    zRotation = degToRad(zRotation*3.6);
    var matrix = m4.translate(
      localMatrix,
      0,
      0,
      0,
    );
    var xRot = m4.xRotate(matrix, xRotation);
    var yRot = m4.yRotate(xRot, yRotation);
    return m4.zRotate(yRot, zRotation);
  }
  //*/

  loadGUI();
  
  function render(now) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    //gl.clearColor(0, 0, 0, 1);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var cameraPosition = [0, 0, 100];
    //var cameraPosition = [0, -200, 0];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    //var up = [0, 0, 1];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    //gl.useProgram(programInfo.program);

    // ------ Draw the cube --------

    // Setup all the needed attributes.
    //gl.bindVertexArray(cubeVAO);
    
    /*
    cubeUniforms.u_matrix = computeMatrix(
      viewProjectionMatrix,
      config.rotateX,
      config.rotateY,
      config.rotateZ,
      config.scale,
      config.TransX,
      config.TransY,
      config.TransZ,
    );
    //*/

    //*
    //cubeMain.drawInfo.uniforms.u_matrix = computeMatrix1(
    cubeMain.localMatrix = computeMatrix1(
      cubeMain.localMatrix,
      //viewProjectionMatrix,
      config.scale,
      config.TransX,
      config.TransY,
      config.TransZ,
    );
    //*
    //cube1.drawInfo.uniforms.u_matrix = computeMatrix2(
    cube1.localMatrix = computeMatrix2(
      cube1.localMatrix,
      //viewProjectionMatrix,
      config.rotateX,
      config.rotateY,
      config.rotateZ,
    );
    //*/
    
    cube2.localMatrix = m4.translate(cube2.localMatrix, -30, 0, 0);

    //m4.multiply(m4.translation(config.TransX,config.TransY,config.TransZ), cubeMain.localMatrix, cubeMain.localMatrix);
    //m4.multiply(m4.yRotation(0.01), cubeMain.localMatrix, cubeMain.localMatrix);

    //m4.multiply(m4.yRotation(0.01), cubeMain.localMatrix, cubeMain.localMatrix);
    //m4.multiply(m4.yRotation(0.01), cube1.localMatrix, cube1.localMatrix);
    //m4.multiply(m4.yRotation(0.01), cube2.localMatrix, cube2.localMatrix);
    
    cubeMain.updateWorldMatrix();

    //cubeMain.drawInfo.uniforms.u_matrix  = m4.multiply(viewProjectionMatrix, cubeMain.worldMatrix);
     objects.forEach(function(object) {
      object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
      object.localMatrix = m4.identity();
      //object.drawInfo.uniforms.u_matrix = object.worldMatrix;
     });

    // Set the uniforms we just computed
    //twgl.setUniforms(programInfo, cubeUniforms);
    twgl.drawObjectList(gl, objectsToDraw);
    //twgl.setUniforms(programInfo, cubeMain.drawInfo.uniforms, cube1.drawInfo.uniforms);//objectsToDraw);

    //twgl.drawBufferInfo(gl, cubeBufferInfo);
    //twgl.drawBufferInfo(gl, objects);
	requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

//Devido ao paralelismo(?) quanto mais vezes o botao que chama funcao animate e clicado, mais rapido a animacao e executada
//A velocidade e incrementada devido a tecnica usada para manter o tempo de execucao constante
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


//=====================================================


// function main() {
//   // Get A WebGL context
//   /** @type {HTMLCanvasElement} */
//   var { gl, programInfo} = initializeWorld();

//   var sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl, 10, 12, 6);

//   var sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);

//   var fieldOfViewRadians = degToRad(60);

//   var objectsToDraw = [];
//   var objects = [];

//   // Let's make all the nodes
//   var sunNode = new Node();
//   sunNode.localMatrix = m4.translation(0, 0, 0);  // sun a the center
//   sunNode.drawInfo = {
//     uniforms: {
//       u_colorOffset: [0.6, 0.6, 0, 1], // yellow
//       u_colorMult:   [0.4, 0.4, 0, 1],
//     },
//     programInfo: programInfo,
//     bufferInfo: sphereBufferInfo,
//     vertexArray: sphereVAO,
//   };

//   var earthNode = new Node();
//   earthNode.localMatrix = m4.translation(100, 0, 0);  // earth 100 units from the sun
//   earthNode.drawInfo = {
//     uniforms: {
//       u_colorOffset: [0.2, 0.5, 0.8, 1],  // blue-green
//       u_colorMult:   [0.8, 0.5, 0.2, 1],
//     },
//     programInfo: programInfo,
//     bufferInfo: sphereBufferInfo,
//     vertexArray: sphereVAO,
//   };

//   var moonNode = new Node();
//   moonNode.localMatrix = m4.translation(20, 0, 0);  // moon 20 units from the earth
//   moonNode.drawInfo = {
//     uniforms: {
//       u_colorOffset: [0.6, 0.6, 0.6, 1],  // gray
//       u_colorMult:   [0.1, 0.1, 0.1, 1],
//     },
//     programInfo: programInfo,
//     bufferInfo: sphereBufferInfo,
//     vertexArray: sphereVAO,
//   };


//   // connect the celetial objects
//   moonNode.setParent(earthNode);
//   earthNode.setParent(sunNode);

//   var objects = [
//     sunNode,
//     earthNode,
//     moonNode,
//   ];

//   var objectsToDraw = [
//     sunNode.drawInfo,
//     earthNode.drawInfo,
//     moonNode.drawInfo,
//   ];

//   requestAnimationFrame(drawScene);

//   // Draw the scene.
//   function drawScene(time) {
//     time *= 0.001;

//     twgl.resizeCanvasToDisplaySize(gl.canvas);

//     // Tell WebGL how to convert from clip space to pixels
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

//     gl.enable(gl.CULL_FACE);
//     gl.enable(gl.DEPTH_TEST);

//     // Clear the canvas AND the depth buffer.
//     gl.clearColor(0, 0, 0, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     // Compute the projection matrix
//     var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
//     var projectionMatrix =
//         m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

//     // Compute the camera's matrix using look at.
//     var cameraPosition = [0, -200, 0];
//     var target = [0, 0, 0];
//     var up = [0, 0, 1];
//     var cameraMatrix = m4.lookAt(cameraPosition, target, up);

//     // Make a view matrix from the camera matrix.
//     var viewMatrix = m4.inverse(cameraMatrix);

//     var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

//     // update the local matrices for each object.
//     m4.multiply(m4.yRotation(0.01), sunNode.localMatrix  , sunNode.localMatrix);
//     m4.multiply(m4.yRotation(0.01), earthNode.localMatrix, earthNode.localMatrix);
//     m4.multiply(m4.yRotation(0.01), moonNode.localMatrix , moonNode.localMatrix);

//     // Update all world matrices in the scene graph
//     sunNode.updateWorldMatrix();

//     // Compute all the matrices for rendering
//     objects.forEach(function(object) {
//         object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
//     });

//     // ------ Draw the objects --------

//     twgl.drawObjectList(gl, objectsToDraw);

//     requestAnimationFrame(drawScene);
//   }
// }

// main();
