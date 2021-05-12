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
/*
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
//*/
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