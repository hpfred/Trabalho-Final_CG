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
// var add1=false;
// var rmv1=false;
//Functions that sets flag as true on button click, to be used on render time to add or remove model to draw list
// function addModel(){
//   add1 = true;
// }
// function rmvModel(){
//   rmv1 = true;
// }

function pointRotation(matrix, point, pRotation){
  //Translate
  matrix = m4.translate(matrix,point[0],point[1],point[2]);
  //Rotate
  matrix = m4.zRotate(matrix,pRotation);
  //Translate back
  matrix = m4.translate(matrix,-point[0],-point[1],-point[2]);

  return matrix;
}
function splineCurve(matrix, TransC, x, y){
  var t = TransC*0.01;
  var xout = (1-t)*((1-t)*((1-t)*x[0] + t*x[1]) + t*((1-t)*x[1] + t*x[2])) + t*((1-t)*((1-t)*x[1] + t*x[2]) + t*((1-t)*x[2] + t*x[3]));
  var yout = (1-t)*((1-t)*((1-t)*y[0] + t*y[1]) + t*((1-t)*y[1] + t*y[2])) + t*((1-t)*((1-t)*y[1]+t*y[2]) + t*((1-t)*y[2] + t*y[3]));

  matrix = m4.translate(matrix, xout, yout, 0);

  return matrix;
}
function computeMatrix1(localMatrix) {
  var scale = (paddleVar1.scale*0.027)+0.2;
  var xRotation = degToRad(paddleVar1.rotateX*3.6);
  var yRotation = degToRad(paddleVar1.rotateY*3.6);
  var zRotation = degToRad(paddleVar1.rotateZ*3.6);
  var matrix = m4.translate(
    localMatrix,
    paddleVar1.TransX,
    paddleVar1.TransY,
    paddleVar1.TransZ,
  );

  // var point = [0,-40,0];
  // var pRotation = degToRad(paddleVar1.rotateP*3.6);
  // matrix = pointRotation(matrix, point, pRotation);
  // matrix = splineCurve(matrix, 50-paddleVar1.TransC, [75,0,0,-75], [0,-100,100,0]);
  matrix = m4.xRotate(matrix, xRotation);
  matrix = m4.yRotate(matrix, yRotation);
  matrix = m4.zRotate(matrix, zRotation);
  return m4.scale(matrix, scale, scale, scale);
}
function computeMatrix2(localMatrix) {
  var scale = (paddleVar2.scale*0.027)+0.2;
  var xRotation = degToRad(paddleVar2.rotateX*3.6);
  var yRotation = degToRad(paddleVar2.rotateY*3.6);
  var zRotation = degToRad(paddleVar2.rotateZ*3.6);
  var matrix = m4.translate(
    localMatrix,
    paddleVar2.TransX,
    paddleVar2.TransY,
    paddleVar2.TransZ,
  );

  // var point = [0,-40,0];
  // var pRotation = degToRad(paddleVar2.rotateP*3.6);
  // matrix = pointRotation(matrix, point, pRotation);
  // matrix = splineCurve(matrix, 50-paddleVar2.TransC, [75,0,0,-75], [0,-100,100,0]);
  matrix = m4.xRotate(matrix, xRotation);
  matrix = m4.yRotate(matrix, yRotation);
  matrix = m4.zRotate(matrix, zRotation);
  return m4.scale(matrix, scale, scale, scale);
}
function computeMatrix3(localMatrix) {
  var scale = (ballVar.scale*0.027)+0.2;
  var xRotation = degToRad(ballVar.rotateX*3.6);
  var yRotation = degToRad(ballVar.rotateY*3.6);
  var zRotation = degToRad(ballVar.rotateZ*3.6);
  var matrix = m4.translate(
    localMatrix,
    ballVar.TransX,
    ballVar.TransY,
    ballVar.TransZ,
  );

  // var point = [0,-40,0];
  // var pRotation = degToRad(ballVar.rotateP*3.6);
  // matrix = pointRotation(matrix, point, pRotation);
  // matrix = splineCurve(matrix, 50-ballVar.TransC, [75,0,0,-75], [0,-100,100,0]);
  matrix = m4.xRotate(matrix, xRotation);
  matrix = m4.yRotate(matrix, yRotation);
  matrix = m4.zRotate(matrix, zRotation);
  return m4.scale(matrix, scale, scale, scale);
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
  matrix = splineCurve(matrix,50-configCam.TransC,  [0,-100,100,0], [-40,0,0,40]);
  cameraPosition = m4.addVectors(cameraPosition,[matrix[12],matrix[13],matrix[14]]);

  var point = [-40,0,0];
  var pRotation = degToRad(configCam.rotateP*3.6);
  
  if(configCam.lookAtPoint==true){
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  }
  if(configCam.lookAtModel==true){
    var modelPosition = [paddleVar1.TransX, paddleVar1.TransY, paddleVar1.TransZ];
    //Zoom is proportional to the distance between the camera and the model
    //but the proportional nature might break in some situation with some camera and model positions/angles
    var zoom = m4.distance(cameraPosition,modelPosition);
    zoom = (75-zoom)+(50-configCam.zoom);

    //Sometimes the 'look at model' might break with some camera and model positions/angles
    //specifically having simultaneously rotation around a point and curve translation made the 'look at' break (appears to have stopped/been fixed)
    matrix = m4.identity();
    target = [paddleVar1.TransX+0.001, paddleVar1.TransY+0.001, paddleVar1.TransZ*0];
    matrix = pointRotation(matrix,[0,-40,0],degToRad(paddleVar1.rotateP*3.6));
    target = m4.addVectors(target,[matrix[12],matrix[13],matrix[14]]);
    matrix = m4.identity();
    matrix = splineCurve(matrix,50+paddleVar1.TransC, [75,0,0,-75], [0,-100,100,0]);
    target = m4.subtractVectors(target,[matrix[12],matrix[13],matrix[14]]);

    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    cameraMatrix = m4.translate(cameraMatrix,0,0,zoom);
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
  if(paddleVar1.rotateX==rot1)
    requestAnimationFrame(aniTrans1);
  if(paddleVar1.TransX==trans1)
    requestAnimationFrame(aniRot2);
  
  function aniRot1(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;

    if(paddleVar1.rotateX<rot1){
      paddleVar1.rotateX += dTime*aniSpeed;
      if(paddleVar1.rotateX<rot1)
      requestAnimationFrame(aniRot1);
      else{
        paddleVar1.rotateX = rot1;
        requestAnimationFrame(aniTrans1);
      }
    }
    else if(paddleVar1.rotateX>rot1){
      paddleVar1.rotateX -= dTime*aniSpeed;
      if(paddleVar1.rotateX>rot1)
      requestAnimationFrame(aniRot1);
      else{
        paddleVar1.rotateX = rot1;
        requestAnimationFrame(aniTrans1);
      }
    }
  }
    
  function aniTrans1(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;

    if(paddleVar1.TransX<trans1){
      paddleVar1.TransX += dTime*aniSpeed;
      if(paddleVar1.TransX<trans1)
      requestAnimationFrame(aniTrans1);
      else{
        paddleVar1.TransX = trans1;
        requestAnimationFrame(aniRot2);
      }
    }
    else if(paddleVar1.TransX>trans1){
      paddleVar1.TransX -= dTime*aniSpeed;
      if(paddleVar1.TransX>trans1)
      requestAnimationFrame(aniTrans1);
      else{
        paddleVar1.TransX = trans1;
        requestAnimationFrame(aniRot2);
      }
    }
  }
  
  function aniRot2(now){
    now *= 0.001;
    var dTime = now - then;
    then = now;

    if(paddleVar1.rotateY<rot2){
      paddleVar1.rotateY += dTime*aniSpeed;
      if(paddleVar1.rotateY<rot2)
        requestAnimationFrame(aniRot2);
      else paddleVar1.rotateY = rot2;
    }
    else if(paddleVar1.rotateY>rot2){
      paddleVar1.rotateY -= dTime*aniSpeed;
      if(paddleVar1.rotateY>rot2)
        requestAnimationFrame(aniRot2);
      else paddleVar1.rotateY = rot2;
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

const controller = {
  87:  {pressed: false, func: moveUp1},
  83:  {pressed: false, func: moveDown1},
  38:  {pressed: false, func: moveUp2},
  40:  {pressed: false, func: moveDown2},
  32:  {pressed: false, func: playBall},
}
const handleKeyDown = (e) => {
  if(controller[e.keyCode])
    controller[e.keyCode].pressed = true;
}
const handleKeyUp = (e) => {
  if(controller[e.keyCode])
    controller[e.keyCode].pressed = false;
}
document.addEventListener('keydown',handleKeyDown);
document.addEventListener('keyup',handleKeyUp);
function moveUp1(){
  if(paddleVar1.TransY > paddleHeight/2)
    paddleVar1.TransY -= speed;
}
function moveDown1(){
  if(paddleVar1.TransY<(gl.canvas.clientHeight/10)-(paddleHeight/2))
    paddleVar1.TransY += speed;
}
function moveUp2(){
  if(paddleVar2.TransY > paddleHeight/2)
    paddleVar2.TransY -= speed;
}
function moveDown2(){
  if(paddleVar2.TransY<(gl.canvas.clientHeight/10)-(paddleHeight/2))
    paddleVar2.TransY += speed;
}
function runButtons(){
  Object.keys(controller).forEach(key => {
    if(controller[key].pressed){  
      controller[key].func();
    }
  })
}

var inMovement = false;
function centerBall(){
  ballVar.TransX = gl.canvas.clientWidth/20;
  ballVar.TransY = gl.canvas.clientHeight/20;
  ballVar.dx = 0;
  ballVar.dy = 0;
  inMovement = false;
}
function playBall(){
  //só quando jogo estiver parado
  //só quando jogo nao tiver terminado
  if(p1win || p2win){
    document.getElementById("canvas").style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    if(p1win)
      txt.fillText("Player 1 Wins", gl.canvas.clientWidth/10, gl.canvas.clientHeight/10);
      if(p2win)
      txt.fillText("Player 2 Wins", gl.canvas.clientWidth/10, gl.canvas.clientHeight/10);
  }
  else if(!inMovement){
    inMovement=true;
    ballVar.dx = speed*Math.sign(Math.random()-.5);//-speed;  //aleatorizar pra que lado vai
    //ballVar.dy = speed;   //isso pode tirar se colocar o slice
  }
}

var slice = 6;
function paddleColision(){
  ///Checa colisoes paddle1
  //verifica se chegou na linha de paddle
  //if(ballVar.TransX-(gl.canvas.clientWidth/10) <= paddleWidth/2){
  if(ballVar.TransX-(paddleWidth/2) <= paddleWidth/2){
    //se na linha de paddle, testa colisão
    //lógica >= e <= invertida?
    if((paddleVar1.TransY - paddleHeight/2 <= (ballVar.TransY+paddleWidth/2)) 
    && paddleVar1.TransY + paddleHeight/2 >= (ballVar.TransY-paddleWidth/2)){
      //nova direção da bola
      ballVar.dx = (-1)*ballVar.dx;
      //corrige erro
      //ballVar.TransX+=Math.sign(ballVar.dx)*8;
      //slice
      ballVar.dy = (ballVar.TransY-paddleVar1.TransY)/slice;
      ///Teste pra deixar a velocidade mais constante, mas acaba criando um modo de jogo caotico (mas divertido :) )
      // if(ballVar.dx>0)
      //   ballVar.dx-=ballVar.dy = (ballVar.TransY-paddleVar1.TransY)/slice;
      // if(ballVar.dx<0)
      //   ballVar.dx+=ballVar.dy = (ballVar.TransY-paddleVar1.TransY)/slice;
    }
  }
  ///Checa colisoes paddle2
  //if(ballVar.TransX >= (gl.canvas.clientWidth/10)-(paddleWidth/2)){
  if(ballVar.TransX+(paddleWidth/2) >= (gl.canvas.clientWidth/10)-paddleWidth/2){
    if((paddleVar2.TransY - paddleHeight/2 <= (ballVar.TransY+paddleWidth/2)) 
    && paddleVar2.TransY + paddleHeight/2 >= (ballVar.TransY-paddleWidth/2)){
      //nova direção da bola
      ballVar.dx = (-1)*ballVar.dx;
      //corrige erro
      //ballVar.TransX+=Math.sign(ballVar.dx)*8;
      //slice
      ballVar.dy = (ballVar.TransY-paddleVar2.TransY)/slice;
      ///Modo de jogo caotico
      // if(ballVar.dx>0)
      //   ballVar.dx-=ballVar.dy = (ballVar.TransY-paddleVar1.TransY)/slice;
      // if(ballVar.dx<0)
      //   ballVar.dx+=ballVar.dy = (ballVar.TransY-paddleVar1.TransY)/slice;
    }
  }
}
function moveBall(){
  ballVar.TransX+=ballVar.dx;
  ballVar.TransY+=ballVar.dy;
}

// function printScore(){
//   txt.clearRect(0, 0, txt.canvas.width, txt.canvas.height);
//   // window.devicePixelRatio=2;
//   // textCanvas.style.width=150;
//   // textCanvas.style.height=150;
//   // textCanvas.width=Math.floor(150*window.devicePixelRatio);
//   // textCanvas.height=Math.floor(150*window.devicePixelRatio);
//   // txt.scale(window.devicePixelRatio,window.devicePixelRatio);
//   txt.fillStyle = 'white';
//   txt.font ='1px arial';
//   txt.scale(2,2);
//   // txt.Width=gl.canvas.clientWidth;
//   // txt.height=gl.canvas.clientHeight;
//   //txt.fillText(p1score, gl.canvas.clientWidth/20 - 200, 10);
//   txt.fillText(p1score, 1,1);
//   // text1.textContent = p1score;
//   // text2.textContent = p2score;
//   //txt.fill(0,0,2,2);
// }

// function printScore(){
//   txt.clearRect(0, 0, txt.canvas.width, txt.canvas.height);
//     txt.fillStyle = 'white';
//     //console.log((txt.canvas.clientHeight));
//     txt.font = '48px serif';
//     //txt.fillText(p1score, gl.canvas.clientWidth/20 - 200, 10);
//     txt.fillText("Hellow World", 200,200);
// }