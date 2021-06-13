var paddleVar1 = {  rotateX: 270/3.6,//0,
                rotateY: 90/3.6,//45/3.6,
                rotateZ: 0,
                rotateP: 0,
                scale: 25,
                TransX: 1.6,  //(paddleWidth/2),  //0+1.6,
                TransY: 8.8,  //paddleHeight/2, //0+8.8,
                TransZ: 0,
                TransC: 0,
                // animate: function() {
                //   requestAnimationFrame(animate);
                // },
                // addModel: function() {
                //   addModel();
                // },
                // removeModel: function() {
                //   rmvModel();
                // },
};
var paddleVar2 = {  rotateX: 270/3.6,//0,
                rotateY: 90/3.6,//45/3.6,
  rotateZ: 0,
  rotateP: 0,
  scale: 25,
  TransX: 0,  //(paddleWidth/2),  //0+1.6,
  TransY: 0,  //paddleHeight/2, //0+8.8,
  TransZ: 0,
  TransC: 0,
};
var ballVar = {  rotateX: 270/3.6,
  rotateY: 45/3.6,
  rotateZ: 0,
  rotateP: 0,
  scale: 25,
  TransX: 0,  //(paddleWidth/2),  //0+1.6,
  TransY: 0,  //paddleHeight/2, //0+8.8,
  TransZ: 0,
  dx: 0,
  dy: 0,
};
var configCam = { rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  rotateP: 0,
                  zoom: 0,
                  TransX: 0,
                  TransY: 0,
                  TransZ: 0,
                  TransC: 0,
                  lookAtPoint: false,
                  lookAtModel: false,
                  animate: function() {
                    requestAnimationFrame(animateCam);
                  },
                  selectCam1: true,
                  selectCam2: false,
                  selectCam3: false,
};

const loadGUI = () => {
  const gui = new dat.GUI();
  
    ///Interface for model transformations
  var guiMod = gui.addFolder("Model");
  guiMod.open();
    ///Folders for linear and curve translations
  var guiModTrans = guiMod.addFolder("Translation");
  var guiModTransLin = guiModTrans.addFolder("Linear");
  guiModTransLin.open();
  guiModTransLin.add(paddleVar1, "TransX", -50, 50, 0.1).listen().name("X Axis");
  guiModTransLin.add(paddleVar1, "TransY", -50, 50, 0.1).listen().name("Y Axis");
  guiModTransLin.add(paddleVar1, "TransZ", -50, 50, 0.1).listen().name("Z Axis");
  guiModTrans.add(paddleVar1, "TransC", -50, 50, 0.1).listen().name("Curve");
    ///Folder for rotation arround axis and point
  var guiModRot = guiMod.addFolder("Rotate");
  var guiModRotAxis = guiModRot.addFolder("Axis");
  guiModRotAxis.open();
  guiModRotAxis.add(paddleVar1, "rotateX", 0, 100, 0.1).listen().name("X Axis");
  guiModRotAxis.add(paddleVar1, "rotateY", 0, 100, 0.1).listen().name("Y Axis");
  guiModRotAxis.add(paddleVar1, "rotateZ", 0, 100, 0.1).listen().name("Z Axis");
  guiModRot.add(paddleVar1, "rotateP", 0, 100, 0.1).listen().name("Point");
  guiMod.add(paddleVar1, "scale", 0, 100, 0.1).listen();  

    ///Interface for camera transformations
  var guiCam = gui.addFolder("Camera");
    ///Folder for linear and curve translations
  var guiCamTrans = guiCam.addFolder("Translation");
  var guiCamTransLin = guiCamTrans.addFolder("Linear");
  guiCamTransLin.open();
  guiCamTransLin.add(configCam, "TransX", -50, 50, 0.1).listen().name("X Axis");
  guiCamTransLin.add(configCam, "TransY", -50, 50, 0.1).listen().name("Y Axis");
  guiCamTransLin.add(configCam, "TransZ", -50, 50, 0.1).listen().name("Z Axis");
  guiCamTrans.add(configCam, "TransC", -50, 50, 0.1).listen().name("Curve");
    ///Folder for rotation arround axis and point
  var guiCamRot = guiCam.addFolder("Rotate");
  var guiCamRotAxis = guiCamRot.addFolder("Axis");
  guiCamRotAxis.open();
  guiCamRotAxis.add(configCam, "rotateX", -50, 50, 0.1).listen().name("X Axis");  //u
  guiCamRotAxis.add(configCam, "rotateY", -50, 50, 0.1).listen().name("Y Axis");  //v
  guiCamRotAxis.add(configCam, "rotateZ", -50, 50, 0.1).listen().name("Z Axis");  //n
  guiCamRot.add(configCam, "rotateP", 0, 100, 0.1).listen().name("Point");
  guiCam.add(configCam, "zoom", 0, 100, 0.1).listen().name("Zoom");
    ///Folder for look at
  var guiCamLook = guiCam.addFolder("Look At");
  guiCamLook.add(configCam, "lookAtPoint").listen().onChange(function(){setChecked("lookAtPoint")}).name("Point");
  guiCamLook.add(configCam, "lookAtModel").listen().onChange(function(){setChecked("lookAtModel")}).name("Model");
    ///Calls function that plays animation
  guiCam.add(configCam, "animate").name("Animate"); 
    ///Folder for camera selection
  var guiCamSel = guiCam.addFolder("Camera Selection");
  guiCamSel.add(configCam, "selectCam1").listen().onChange(function(){setChecked("cam1")}).name("Camera 1 (Front)");
  guiCamSel.add(configCam, "selectCam2").listen().onChange(function(){setChecked("cam2")}).name("Camera 2 (Above)");
  guiCamSel.add(configCam, "selectCam3").listen().onChange(function(){setChecked("cam3")}).name("Camera 3 (Side)");
};

function setChecked(element){
  //Unmarks any conflicting checkbox marking, for lookAt
  if(element=="lookAtModel")
    configCam.lookAtPoint = false;
  if(element=="lookAtPoint")
    configCam.lookAtModel = false;

  //Makes sure there is always one, and just one, camera marked
  //Also sets 'onChange' flag to true to [on main] update the GUI state to the same as the previous state of each camera
  if(element=="cam1"){
    onChange = true;
    configCam.selectCam1 = true;
    configCam.selectCam2 = false;
    configCam.selectCam3 = false;
  }
  if(element=="cam2"){
    onChange = true;
    configCam.selectCam1 = false;
    configCam.selectCam2 = true;
    configCam.selectCam3 = false;
  }
  if(element=="cam3"){
    onChange = true;
    configCam.selectCam1 = false;
    configCam.selectCam2 = false;
    configCam.selectCam3 = true;
  }
}