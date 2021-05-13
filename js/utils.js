var Node = function(){
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
};
  
Node.prototype.setParent = function(parent){
    if (this.parent){
        var ndx = this.parent.children.indexOf(this);
        if(ndx>=0){
        this.parent.children.splice(ndx, 1);
        }
    }
    if (parent){
        parent.children.push(this);
    }
    this.parent = parent;
};
  
Node.prototype.updateWorldMatrix = function(matrix){
    if(matrix){
        m4.multiply(matrix, this.localMatrix, this.worldMatrix);
    }
    else{
        m4.copy(this.localMatrix, this.worldMatrix);
    }
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child){
        child.updateWorldMatrix(worldMatrix);
    });
};


const degToRad = (d) => (d * Math.PI) / 180;

const radToDeg = (r) => (r * 180) / Math.PI;

var add1=false;
var rmv1=false;
function addModel(){
  add1 = true;
}
function rmvModel(){
  rmv1 = true;
}

/*
function computeMatrix(viewProjectionMatrix) {
  var xRotation = degToRad(config.rotateX*3.6);
  var yRotation = degToRad(config.rotateY*3.6);
  var zRotation = degToRad(config.rotateZ*3.6);
  var scale = (config.scale*0.027)+0.2;

  var matrix = m4.translate(
    viewProjectionMatrix,
    config.TransX,
    config.TransY,
    config.TransZ,
  );
  var scl = m4.scale(matrix, scale, scale, scale);
  var xRot = m4.xRotate(scl, xRotation);
  var yRot = m4.yRotate(xRot, yRotation);
  return m4.zRotate(yRot, zRotation);
}
//*/

function computeMatrix1(localMatrix) {
  var scale = (config.scale*0.027)+0.2;
  var matrix = m4.translate(
    localMatrix,
    config.TransX,
    config.TransY,
    config.TransZ,
  );
  return m4.scale(matrix, scale, scale, scale);
}
function computeMatrix2(localMatrix) {
  var xRotation = degToRad(config.rotateX*3.6);
  var yRotation = degToRad(config.rotateY*3.6);
  var zRotation = degToRad(config.rotateZ*3.6);
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

//*
function computeMatrixCam1() {
  //var cameraPosition = [0, 0, 100];
  var transZ = configCam.TransZ*2;
  var cameraPosition = [configCam.TransX, configCam.TransY, transZ];
  var target = [0, 0, 0];
  var up = [0, 1, 0];
  //var up = [configCam.rotateX, configCam.rotateY, configCam.rotateZ];
  //var angleY = configCam.rotateY*0.01;
  //var angleZ = configCam.rotateZ*0.01;
  //var up = [angleX, angleY, 0];
  
  if(configCam.lookAtPoint==true){
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  }
  if(configCam.lookAtModel==true){
    target = [config.TransX+0.001, config.TransY+0.001, config.TransZ*0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  }
  if(configCam.lookAtPoint==false && configCam.lookAtModel==false){
    target = [configCam.TransX+0.001, configCam.TransY+0.001, configCam.TransZ*0];
    // var tx = -m4.dot([configCam.rotateX*3.6, 0, 0], target);
    // var ty = -m4.dot([0, configCam.rotateY*3.6, 0], target);
    // var tz = -m4.dot([0, 0, configCam.rotateZ*3.6], target);
    //target = [tx, ty, tz];

    //var angleX1 = Math.sin(degToRad(configCam.rotateX*3.6));
    //var angleX2 = Math.cos(degToRad(configCam.rotateX*3.6));
    //target = [configCam.TransX+0.001, (configCam.TransY)+0.001, 0];
    //target = [angleX1,angleX2,0]);
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    //cameraMatrix = m4.translate(cameraMatrix,tx,ty,tz);
    cameraMatrix = m4.xRotate(cameraMatrix,degToRad(configCam.rotateX*3.6));
    cameraMatrix = m4.yRotate(cameraMatrix,degToRad(configCam.rotateY*3.6));
    cameraMatrix = m4.zRotate(cameraMatrix,degToRad(configCam.rotateZ*3.6));
  }

  return cameraMatrix;
}
//*/

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

function animateCam(now){
  
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