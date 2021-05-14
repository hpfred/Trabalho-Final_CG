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

///Criar uma classe camera para guardar as informacoes da GUI de cada camera, atualizando a GUI na troca das cameras
// var Camera = function(){
//   this.translation = [];
//   this.rotation = [];
//   this.zoom = 0;
//   this.lAP = false;
//   this.lAM = false;
// }
// Camera.prototype.init = function(){
//
// }


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

function pointRotation(matrix, point,pRotation){
  //translate
  matrix = m4.translate(matrix,point[0],point[1],point[2]);
  //rotate
  matrix = m4.zRotate(matrix,pRotation);
  //translate back
  matrix = m4.translate(matrix,-point[0],-point[1],-point[2]);

  return matrix;
}
function computeMatrix1(localMatrix) {
  var scale = (config.scale*0.027)+0.2;
  var matrix = m4.translate(
    localMatrix,
    config.TransX,
    config.TransY,
    config.TransZ,
  );

  var point = [0,-40,0];
  var pRotation = degToRad(config.rotateP*3.6);
  matrix = pointRotation(matrix, point, pRotation);

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
function computeMatrixCam1() {
  //var cameraPosition = [0, 0, 100];
  var target = [0, 0, 0];
  var up = [0, 1, 0];
  
  var transZ = configCam.TransZ*2;
  var cameraPosition = [configCam.TransX, configCam.TransY, transZ];
  var point = [-40,0,0];
  var pRotation = degToRad(configCam.rotateP*3.6);
  
  if(configCam.lookAtPoint==true){
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  }
  if(configCam.lookAtModel==true){
    //var zoom = cameraPosition[2]-config.TransZ;
    var modelPosition = [config.TransX, config.TransY, config.TransZ];
    var zoom = m4.distance(cameraPosition,modelPosition);
    zoom = (75-zoom)+(50-configCam.zoom);
    
    target = [config.TransX+0.001, config.TransY+0.001, config.TransZ*0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    cameraMatrix = pointRotation(cameraMatrix,[0,-40,0],degToRad(config.rotateP*3.6));
    cameraMatrix = m4.translate(cameraMatrix,0,0,zoom);
    
    // target = [config.TransX+0.001, config.TransY+0.001, config.TransZ*0];
    // var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    // cameraMatrix = pointRotation(cameraMatrix,[0,-40,0],degToRad(config.rotateP*3.6));
  }
  if(configCam.lookAtPoint==false && configCam.lookAtModel==false){
    target = [configCam.TransX+0.001, configCam.TransY+0.001, configCam.TransZ*0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    cameraMatrix = m4.xRotate(cameraMatrix,degToRad(configCam.rotateX*3.6));
    cameraMatrix = m4.yRotate(cameraMatrix,degToRad(configCam.rotateY*3.6));
    cameraMatrix = m4.zRotate(cameraMatrix,degToRad(configCam.rotateZ*3.6));
    cameraMatrix = pointRotation(cameraMatrix,point,pRotation);
  }

  return cameraMatrix;
}

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
  now *= 0.001;
  var then = now;
  var rot1 = -13.9, rot2 = 3, rot3 = -2.7;
  var trans1 = -50, trans2 = 15.8;
  var aniSpeed = 10;

  requestAnimationFrame(aniTrans1);
  if(configCam.TransX==trans1)//
    requestAnimationFrame(aniRot1);
  else if(configCam.rotateY==rot1)//
    requestAnimationFrame(aniRot2);
  else if(configCam.rotateX==rot2)//
    requestAnimationFrame(aniTrans2);
  else if(configCam.TransZ==trans2)//
    requestAnimationFrame(aniRot3);
    
  function aniTrans1(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;

    if(configCam.TransX<trans1){
      configCam.TransX += dTime*aniSpeed;
      if(configCam.TransX<trans1)
      requestAnimationFrame(aniTrans1);
      else{
        configCam.TransX = trans1;
        requestAnimationFrame(aniRot1);
      }
    }
    else if(configCam.TransX>trans1){
      configCam.TransX -= dTime*aniSpeed;
      if(configCam.TransX>trans1)
      requestAnimationFrame(aniTrans1);
      else{
        configCam.TransX = trans1;
        requestAnimationFrame(aniRot1);
      }
    }
  }

  function aniRot1(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;
    
    if(configCam.rotateY<rot1){
      configCam.rotateY += dTime*aniSpeed;
      if(configCam.rotateY<rot1)
        requestAnimationFrame(aniRot1);
      else{
        configCam.rotateY = rot1;
        requestAnimationFrame(aniRot2);
      }
    }
    else if(configCam.rotateY>rot1){
      configCam.rotateY -= dTime*aniSpeed;
      if(configCam.rotateY>rot1)
        requestAnimationFrame(aniRot1);
      else{
        configCam.rotateY = rot1;
        requestAnimationFrame(aniRot2);
      }
    }
  }
  
  function aniRot2(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;
    
    if(configCam.rotateX<rot2){
      configCam.rotateX += dTime*aniSpeed;
      if(configCam.rotateX<rot2)
        requestAnimationFrame(aniRot2);
      else{
        configCam.rotateX = rot2;
        requestAnimationFrame(aniTrans2);
      }
    }
    else if(configCam.rotateX>rot2){
      configCam.rotateX -= dTime*aniSpeed;
      if(configCam.rotateX>rot2)
        requestAnimationFrame(aniRot2);
      else{
        configCam.rotateX = rot2;
        requestAnimationFrame(aniTrans2);
      }
    }
  }

  function aniTrans2(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;
    
    if(configCam.TransZ<trans2){
      configCam.TransZ += dTime*aniSpeed;
      if(configCam.TransZ<trans2)
        requestAnimationFrame(aniTrans2);
      else{
        configCam.TransZ = trans2;
        requestAnimationFrame(aniRot3);
      }
    }
    else if(configCam.TransZ>trans2){
      configCam.TransZ -= dTime*aniSpeed;
      if(configCam.TransZ>trans2)
        requestAnimationFrame(aniTrans2);
      else{
        configCam.TransZ = trans2;
        requestAnimationFrame(aniRot3);
      }
    }
  }

  function aniRot3(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;
    
    if(configCam.rotateZ<rot3){
      configCam.rotateZ += dTime*aniSpeed;
      if(configCam.rotateZ<rot3)
        requestAnimationFrame(aniRot3);
      else{
        configCam.rotateZ = rot3;
      }
    }
    else if(configCam.rotateZ>rot3){
      configCam.rotateZ -= dTime*aniSpeed;
      if(configCam.rotateZ>rot3)
        requestAnimationFrame(aniRot3);
      else{
        configCam.rotateZ = rot3;
      }
    }
  }
}


// function splineCurve(){
//   var jsspline = require("js-spline");
  
//   var curve = new jsspline.BSpline({
//     steps: 100 // number of interpolated points between 4 way points
//   });
//   for(var i = 0; i < 100; ++i) {
//   curve.addWayPoint({ x: i, y: Math.sin(Math.PI * i * 0.2), z: 0.0});
//   }
//   console.log("nodes: " + curve.nodes.length); // 9700 interpolated points
  
//   // first node
//   curve.nodes[0].x;
//   curve.nodes[0].y;
//   curve.nodes[0].z;
  
//   // second node
//   curve.nodes[1].x;
//   curve.nodes[1].y;
//   curve.nodes[1].z;
//   // distance from the first node
//   curve.distances[1]
  
//   // third node
//   curve.nodes[2].x;
//   curve.nodes[2].y;
//   curve.nodes[2].z;
//   // distance from the first node
//   curve.distances[2];
// }