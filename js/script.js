function main() {
  const { gl, programInfo } = initializeWorld();
  
  const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20);
  
  const cubeVAO = twgl.createVAOFromBufferInfo(
    gl,
    programInfo,
    cubeBufferInfo,
    );
    
  var fieldOfViewRadians = degToRad(60);

  var objects = [];
  var objectsToDraw = [];
  
  var cubeMain = new Node();
  //cubeMain.localMatrix = m4.translation(0, 0, 0);
  cubeMain.drawInfo = {
    uniforms: {
      u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };
  var cube1 = new Node();
  //cube1.localMatrix = m4.translation(100, 0, 0);
  cube1.drawInfo = {
    uniforms: {
      u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };
  cube1.setParent(cubeMain);

  var objectsToDraw = [cube1.drawInfo, ];
  
  var nCubes = 1;
  //Additional cubes
  /*
  function addModel(){
    if(nCubes==1){
      nCubes++;
      var cube2 = new Node();
      //cube2.localMatrix = m4.translation(30, 0, 0);
      cube2.drawInfo = {
        uniforms: {
          u_colorMult: [0.5, 0.5, 1, 1],
        },
        programInfo: programInfo,
        bufferInfo: cubeBufferInfo,
        vertexArray: cubeVAO,
      };
      cube2.setParent(cubeMain);
      
      //objects.push = cube2;
      var objects = [cubeMain, cube1, cube2];
      //objectsToDraw.push = cube2.drawInfo;
      var objectsToDraw = [cube1.drawInfo, cube2.drawInfo, ];
    }
    if(nCubes==2){
      nCubes++;
      var cube3 = new Node();
      cube3.localMatrix = m4.translation(-30, 0, 0);
      cube3.drawInfo = {
        uniforms: {
          u_colorMult: [0.5, 0.5, 1, 1],
        },
        programInfo: programInfo,
        bufferInfo: cubeBufferInfo,
        vertexArray: cubeVAO,
      };
      cube1.setParent(cubeMain);

      objects.push = cube3;
      objectsToDraw.push = cube3.drawInfo;
    }
  }
  //*/

  var cube2 = new Node();
  //cube2.localMatrix = m4.translation(30, 0, 0);
  cube2.drawInfo = {
    uniforms: {
      u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };
  cube2.setParent(cubeMain);
  var cube3 = new Node();
  //cube3.localMatrix = m4.translation(-30, 0, 0);
  cube3.drawInfo = {
    uniforms: {
      u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };
  cube3.setParent(cubeMain);

  var objects = [cubeMain, cube1, cube2, cube3];
  //var objectsToDraw = [cube1.drawInfo, cube2.drawInfo, cube3.drawInfo];

  loadGUI();
  //splineCurve();
  
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
    var cameraMatrix = computeMatrixCam1();

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // ------ Draw the cube --------
    //cubeUniforms.u_matrix = computeMatrix(viewProjectionMatrix);

    //Mudar pra rotateZ afetar modelos adicionados?
    cubeMain.localMatrix = computeMatrix1(cubeMain.localMatrix);
    cube1.localMatrix = computeMatrix2(cube1.localMatrix);
    
    //*
    //if(nCubes>=2){
      cube2.localMatrix = m4.translate(cube2.localMatrix, 30, 0, 0);
    //}
    //if(nCubes==3){
      //cube2.localMatrix = m4.translate(cube2.localMatrix, 30, 0, 0);
      cube3.localMatrix = m4.translate(cube3.localMatrix, -30, 0, 0);
    //}
    //*/
    if(add1){
      if(nCubes==2){
        objectsToDraw.push(cube3.drawInfo);
        nCubes++;
      }
      if(nCubes==1){
        objectsToDraw.push(cube2.drawInfo);
        nCubes++;
      }
      add1=false;
    }
    if(rmv1){
      if(nCubes==2){
        objectsToDraw.pop();
        nCubes--;
      }
      if(nCubes==3){
        objectsToDraw.pop();
        nCubes--;
      }
      rmv1=false;
    }

    cubeMain.updateWorldMatrix();

    objects.forEach(function(object) {
      object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
      object.localMatrix = m4.identity();
      //object.drawInfo.uniforms.u_matrix = object.worldMatrix;
    });
     
    twgl.drawObjectList(gl, objectsToDraw);
	requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();