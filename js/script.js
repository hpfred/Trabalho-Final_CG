/// Trabalho 2 - CG : Pong
/// Frederico Peixoto Antunes

var paddleHeight = 20;
var paddleWidth = 5;  //2.5

var speed = 0.5;
var p1score = 0, p2score = 0;
var inv = 1;

const { gl, programInfo, txt } = initializeWorld();
function main() {
  
  //const paddleBufferInfo = flattenedPrimitives.createCylinderBufferInfo(gl, paddleWidth/2, paddleHeight, 4, 1);
  const paddleBufferInfo = flattenedPrimitives.createPlaneBufferInfo(gl, paddleHeight, paddleWidth/2);
  const ballBufferInfo = flattenedPrimitives.createDiscBufferInfo(gl, paddleWidth/2, 20);
  //Testes de formas de modelo - IGNORAR
  //const paddleBufferInfo = flattenedPrimitives.createPlaneBufferInfo(gl, 20, 10); //Tem que ser visto de cima
  //const sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(gl,20,12,6);
  
  const VAO = twgl.createVAOFromBufferInfo(
    gl,
    programInfo,
    paddleBufferInfo,
    );
    
  var fieldOfViewRadians = degToRad(60);

  var objects = [];
  var objectsToDraw = [];
  
  var paddle1 = new Node();
  paddle1.drawInfo = {
    uniforms: {
      u_color: [0.5, 0.5, 1, 1],//u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: paddleBufferInfo,
    vertexArray: VAO,
  };
  var paddle2 = new Node();
  paddle2.drawInfo = {
    uniforms: {
      u_color: [0.5, 0.5, 1, 1],//u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: paddleBufferInfo,
    vertexArray: VAO,
  };
  var ball = new Node();
  ball.drawInfo = {
    uniforms: {
      u_color: [1, 1, 1, 1],//u_colorMult: [0.5, 0.5, 1, 1],
    },
    programInfo: programInfo,
    bufferInfo: ballBufferInfo,
    vertexArray: VAO,
  };

  var objectsToDraw = [paddle1.drawInfo, paddle2.drawInfo, ball.drawInfo, ];
  //var nCubes = 1;

  // var cube2 = new Node();
  // cube2.drawInfo = {
  //   uniforms: {
  //     u_colorMult: [0.5, 0.5, 1, 1],
  //   },
  //   programInfo: programInfo,
  //   bufferInfo: paddleBufferInfo,
  //   vertexArray: VAO,
  // };
  // cube2.setParent(paddle1);
  // var cube3 = new Node();
  // cube3.drawInfo = {
  //   uniforms: {
  //     u_colorMult: [0.5, 0.5, 1, 1],
  //   },
  //   programInfo: programInfo,
  //   bufferInfo: paddleBufferInfo,
  //   vertexArray: VAO,
  // };
  // cube3.setParent(paddle1);

  var objects = [paddle1, paddle2, ball, ];

  // loadGUI();
  
  paddleVar1.TransX = paddleWidth/2;
  paddleVar1.TransY = paddleHeight/2;
  paddleVar2.TransX = (gl.canvas.clientWidth/10)-(paddleWidth/2);//138.2;//gl.canvas.clientWidth/10;
  paddleVar2.TransY = paddleHeight/2;
  // ballVar.TransX = gl.canvas.clientWidth/20;
  // ballVar.TransY = gl.canvas.clientHeight/20;
  centerBall();

  console.log(gl.canvas.clientHeight, gl.canvas.clientWidth);

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

    //----------------------------------------------------------------------------------------------- eventListener
    //Captures keyboard input
    // document.addEventListener('keydown', (e) => {
    //   //problema de quanto mais vezes eh chamado, mais rapido fica
    //   //console.log(e);
    //   if(e.keyCode == 38 && paddleVar1.TransY>0+(paddleHeight/2)){
    //     // console.log(e);
    //     paddleVar1.TransY -= 0.001;
    //   }
    //   if(e.keyCode == 40 && paddleVar1.TransY<(gl.canvas.clientHeight/10)-(paddleHeight/2)){
    //     // console.log(e);
    //     paddleVar1.TransY += 0.001;
    //   }
    //   if(e.keyCode == 87 && paddleVar2.TransY>0+(paddleHeight/2)){
    //     // console.log(e);
    //     paddleVar2.TransY -= 0.001;
    //   }
    //   if(e.keyCode == 83 && paddleVar2.TransY<(gl.canvas.clientHeight/10)-(paddleHeight/2)){
    //     // console.log(e);
    //     paddleVar2.TransY += 0.001;
    //   }
    // });
    runButtons();
    //-----------------------------------------------------------------------------------------------

    ///Checa colisoes paredes
    if((ballVar.TransY-(paddleWidth/2) <= 0) || (ballVar.TransY+(paddleWidth/2) >= gl.canvas.clientHeight/10)){
      ballVar.dy = (-1)*ballVar.dy;
    }
    paddleColision();

    ///Move bola
    moveBall();
    //var inv = 1;
    // ballVar.TransY += 0.1*inv;
    // if(ballVar.TransY>64.5)//(gl.canvas.clientHeight/10)-(paddleHeight/2))
    //   inv=-1;
    // if(ballVar.TransY<paddleWidth/2+2)
    //   inv=1;

    ///Colors the background, in this case, to black. Not necessary.
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    ///ProjectionMatrix for both Perspective and Orthographic cameras
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
    var projectionMatrix2 = m4.orthographic(0, gl.canvas.clientWidth/10, gl.canvas.clientHeight/10, 0, 1, 400);

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

    if(configCam.lookAtPoint==true){
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    }
    else
      var viewProjectionMatrix = m4.multiply(projectionMatrix2, viewMatrix);

    // ------ Draw the model --------
    paddle1.localMatrix = computeMatrix1(paddle1.localMatrix);
    paddle2.localMatrix = computeMatrix2(paddle2.localMatrix);
    ball.localMatrix = computeMatrix3(ball.localMatrix);
    
    // //Calculate the matrix of both 'cube2' and 'cube3' even while not being drawn in the screen
    // cube2.localMatrix = m4.translate(cube2.localMatrix, 30, 0, 0);
    // cube3.localMatrix = m4.translate(cube3.localMatrix, -30, 0, 0);

    // //Checks flags 'add1' and 'rmv1' to add or remove 'cube2' or 'cube3' to the draw list
    // if(add1){
    //   if(nCubes==2){
    //     objectsToDraw.push(cube3.drawInfo);
    //     nCubes++;
    //   }
    //   if(nCubes==1){
    //     objectsToDraw.push(cube2.drawInfo);
    //     nCubes++;
    //   }
    //   add1=false;
    // }
    // if(rmv1){
    //   if(nCubes==2){
    //     objectsToDraw.pop();
    //     nCubes--;
    //   }
    //   if(nCubes==3){
    //     objectsToDraw.pop();
    //     nCubes--;
    //   }
    //   rmv1=false;
    // }

    paddle1.updateWorldMatrix();
    paddle2.updateWorldMatrix();
    ball.updateWorldMatrix();

    objects.forEach(function(object) {
      object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
      object.localMatrix = m4.identity();
    });
     
    twgl.drawObjectList(gl, objectsToDraw);

    //Imprime pontos
    // printScore();
    txt.clearRect(0, 0, txt.canvas.width, txt.canvas.height);
    txt.fillStyle = 'white';
    txt.font ='10px arial';
    // txt.Width=gl.canvas.clientWidth;
    // txt.height=gl.canvas.clientHeight;
    //txt.fillText(p1score, gl.canvas.clientWidth/20 - 200, 10);
    txt.fillText(p1score, 100,100);
    // text1.textContent = p1score;
    // text2.textContent = p2score;
    //txt.fill(0,0,2,2);
    
    ///Checa ponto
    if(ballVar.TransX+paddleWidth/2<=0){
      console.log(txt);
      p1score++;
      centerBall();
      console.log(p1score);
    } 
    if(ballVar.TransX-paddleWidth/2>=gl.canvas.clientWidth/10){
      p2score++;
      centerBall();
      console.log(p2score);
    }
	requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();