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
  
  //*
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
  //*
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
  /*
  var cube2 = new Node();
  cube2.localMatrix = m4.translation(-20, 0, 0);
  cube2.drawInfo = {
    uniforms: {
      u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    vertexArray: cubeVAO,
  };
  cube2.setParent(cubeMain);
  //*/

  //var objects = [cubeMain, cube1, cube2, ];
  //var objects = [cubeMain, cube1, ];
  //var objectsToDraw = [cube1.drawInfo, cube2.drawInfo, ];
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
  cube3.localMatrix = m4.translation(-30, 0, 0);
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

    // ------ Draw the cube --------
    
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
    cubeMain.localMatrix = computeMatrix1(
      cubeMain.localMatrix,
      config.scale,
      config.TransX,
      config.TransY,
      config.TransZ,
    );
    //*
    cube1.localMatrix = computeMatrix2(
      cube1.localMatrix,
      config.rotateX,
      config.rotateY,
      config.rotateZ,
    );
    //*/
    
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

var add1=false;
var rmv1=false;
function addModel(){
  add1 = true;
}
function rmvModel(){
  rmv1 = true;
}
/*
var nCubes = 1;
function addModel(){
  if(nCubes==1){
    nCubes++;
    var cube2 = new Node();
    cube2.localMatrix = m4.translation(30, 0, 0);
    cube2.drawInfo = {
      uniforms: {
        u_colorMult: [0.5, 0.5, 1, 1],
      },
      programInfo: main.programInfo,
      bufferInfo: main.cubeBufferInfo,
      vertexArray: main.cubeVAO,
    };

    main.objects = [cubeMain, cube1, cube2];
    main.objectsToDraw = [cube1.drawInfo, cube2.drawInfo];
    cube2.setParent(main.cubeMain);
  }
  if(nCubes==2){
    nCubes++;
    var cube3 = new Node();
    cube3.localMatrix = m4.translation(-30, 0, 0);
    cube3.drawInfo = {
      uniforms: {
        u_colorMult: [0.5, 0.5, 1, 1],
      },
      programInfo: main.programInfo,
      bufferInfo: main.cubeBufferInfo,
      vertexArray: main.cubeVAO,
    };

    main.objects.push = cube3;
    main.objectsToDraw.push = cube3.drawInfo;
    cube1.setParent(main.cubeMain);
  }
}
//*/