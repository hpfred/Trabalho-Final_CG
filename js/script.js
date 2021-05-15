/// Trabalho 1 - CG : Mudar posicoes usando uma interface
/// Frederico Peixoto Antunes

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
  cubeMain.drawInfo = {
    uniforms: {
      u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };
  var cube1 = new Node();
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

  var cube2 = new Node();
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

  loadGUI();

  var cam1 = new Camera();
  cam1.update([0,0,50,0], [0,0,0,0], 25, false, false, [0,1,0]);
  cam1.init();
  var cam2 = new Camera();                  //Camera above model, looking down - Vision from above
  cam2.update([0,100,0,0], [-50,-12.5,0,0], 25, false, false, [0,0,1]);
  var cam3 = new Camera();                  //Camera on the right side, looking left - vision from the side
  cam3.update([100,0,0,0], [37.5,0,50,0], 25, false, false, [0,1,0]);
  
  function render(now) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    ///Colors the background, in this case, to black. Not necessary.
    //gl.clearColor(0, 0, 0, 1);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    //Checks selected camera and calculates it's matrix [using look at] calling 'computeMatrixCam1' function
    if(configCam.selectCam1 == true){
      //Checks flag 'onChange' to update the GUI values when selected camera first changes
      if(onChange==true){
        cam1.init();
        onChange = false;
      }
      var cameraMatrix = computeMatrixCam1(cam1);
    }
    if(configCam.selectCam2 == true){
      if(onChange==true){
        cam2.init();
        onChange = false;
      }
      var cameraMatrix = computeMatrixCam1(cam2);
    }
    if(configCam.selectCam3 == true){
      if(onChange==true){
        cam3.init();
        onChange = false;
      }
      var cameraMatrix = computeMatrixCam1(cam3);
    }

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // ------ Draw the cube --------
    cubeMain.localMatrix = computeMatrix1(cubeMain.localMatrix);
    cube1.localMatrix = computeMatrix2(cube1.localMatrix);
    
    //Calculate the matrix of both 'cube2' and 'cube3' even while not being drawn in the screen
    cube2.localMatrix = m4.translate(cube2.localMatrix, 30, 0, 0);
    cube3.localMatrix = m4.translate(cube3.localMatrix, -30, 0, 0);

    //Checks flags 'add1' and 'rmv1' to add or remove 'cube2' or 'cube3' to the draw list
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
    });
     
    twgl.drawObjectList(gl, objectsToDraw);
	requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();