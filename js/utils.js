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

var Camera = function(){
  this.translation = [];
  this.rotation = [];
  this.zoom = 0;
  this.lAP = false;
  this.lAM = false;
  this.up = [];
}
//Sets the sliders and values to the current state of that camera
Camera.prototype.init = function(){
  configCam.TransX = this.translation[0];
  configCam.TransY = this.translation[1];
  configCam.TransZ = this.translation[2];
  configCam.TransC = this.translation[3];
  configCam.rotateX = this.rotation[0];
  configCam.rotateY = this.rotation[1];
  configCam.rotateZ = this.rotation[2];
  configCam.rotateP = this.rotation[3];
  configCam.zoom = this.zoom;
  configCam.lookAtPoint = this.lAP;
  configCam.lookAtModel = this.lAM;
}
//Updates the values on the class
Camera.prototype.update = function(trans, rot, zoom, lAP, lAM, up){
  this.translation = trans;
  this.rotation = rot;
  this.zoom = zoom;
  this.lAP = lAP;
  this.lAM = lAM;
  this.up = up;
}

const degToRad = (d) => (d * Math.PI) / 180;
const radToDeg = (r) => (r * 180) / Math.PI;

//Creates global scope flags
var onChange = false;
var add1=false;
var rmv1=false;
//Functions that sets flag as true on button click, to be used on render time to add or remove model to draw list
function addModel(){
  add1 = true;
}
function rmvModel(){
  rmv1 = true;
}

function pointRotation(matrix, point, pRotation){
  //Translate
  matrix = m4.translate(matrix,point[0],point[1],point[2]);
  //Rotate
  matrix = m4.zRotate(matrix,pRotation);
  //Translate back
  matrix = m4.translate(matrix,-point[0],-point[1],-point[2]);

  return matrix;
}
function splineCurve(matrix, TransC){
  //((1-t)((1-t)((1-t)*10+t*6)+t((1-t)*6+t*4))+t((1-t)((1-t)*6+t*4)+t((1-t)*4+t*0)), (1-t)((1-t)((1-t)*6+t*2)+t((1-t)*2+t*10))+t((1-t)((1-t)*2+t*10)+t((1-t)*10+t*6)))
  var t = TransC*0.01;
  //var x0=10, y0=6, x1=6, y1=2, x2=4, y2=10, x3=0, y3=6;
  var x0=75, y0=0, x1=0, y1=-100, x2=0, y2=100, x3=-75, y3=0;
  var x = (1-t)*((1-t)*((1-t)*x0 + t*x1) + t*((1-t)*x1 + t*x2)) + t*((1-t)*((1-t)*x1 + t*x2) + t*((1-t)*x2 + t*x3));
  var y = (1-t)*((1-t)*((1-t)*y0 + t*y1) + t*((1-t)*y1 + t*y2)) + t*((1-t)*((1-t)*y1+t*y2) + t*((1-t)*y2 + t*y3));

  matrix = m4.translate(matrix, x, y, 0);

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
  matrix = splineCurve(matrix, 100-config.TransC);

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
function computeMatrixCam1(cam) {
  var target = [0, 0, 0];
  var up = cam.up;
  
  cam.update(
    [configCam.TransX,configCam.TransY,configCam.TransZ,configCam.TransC],
    [configCam.rotateX,configCam.rotateY,configCam.rotateZ,configCam.rotateP],
    configCam.zoom,
    configCam.lookAtPoint,
    configCam.lookAtModel,
    up,
  );

  var transZ = configCam.TransZ*2;
  var cameraPosition = [configCam.TransX, configCam.TransY, transZ];
  var matrix = m4.identity();
  matrix = splineCurve(matrix,50-configCam.TransC);
  cameraPosition = m4.addVectors(cameraPosition,[matrix[12],matrix[13],matrix[14]]);

  var point = [-40,0,0];
  var pRotation = degToRad(configCam.rotateP*3.6);
  
  if(configCam.lookAtPoint==true){
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  }
  if(configCam.lookAtModel==true){
    var modelPosition = [config.TransX, config.TransY, config.TransZ];
    var zoom = m4.distance(cameraPosition,modelPosition);
    zoom = (75-zoom)+(50-configCam.zoom);

    matrix = m4.identity();
    target = [config.TransX+0.001, config.TransY+0.001, config.TransZ*0];
    matrix = pointRotation(matrix,[0,-40,0],degToRad(config.rotateP*3.6));
    target = m4.addVectors(target,[matrix[12],matrix[13],matrix[14]]);
    matrix = m4.identity();
    matrix = splineCurve(matrix,config.TransC);
    target = m4.subtractVectors(target,[matrix[12],matrix[13],matrix[14]]);

    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    //cameraMatrix = pointRotation(cameraMatrix,[0,-40,0],degToRad(config.rotateP*3.6));
    cameraMatrix = m4.translate(cameraMatrix,0,0,zoom);
    //cameraMatrix = splineCurve(cameraMatrix,config.TransC);
  }
  if(configCam.lookAtPoint==false && configCam.lookAtModel==false){
    target = [configCam.TransX+0.001+matrix[12], configCam.TransY+0.001+matrix[13], configCam.TransZ*0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    cameraMatrix = m4.xRotate(cameraMatrix,degToRad(configCam.rotateX*3.6));
    cameraMatrix = m4.yRotate(cameraMatrix,degToRad(configCam.rotateY*3.6));
    cameraMatrix = m4.zRotate(cameraMatrix,degToRad(configCam.rotateZ*3.6));
    cameraMatrix = pointRotation(cameraMatrix,point,pRotation);
  }

  return cameraMatrix;
}

///There is some kind of paralelization while running 'requestAnimationFrame', which causes that the more times you click the animation function button, the faster the animation will play
///The animation speed is probably incremented due to the technique used to keep the animation time constant, with the multiple calls accessing the memory and changing the time values, and making the dTime increase exponentially 
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

///This is a test code for the Spline library. It's commented because I wasn't able to make it work
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