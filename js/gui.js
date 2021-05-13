var config = {  rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 30,
                TransX: 0,
                TransY: 0,
                TransZ: 0,
                animate: function() {
                  requestAnimationFrame(animate);
                },
                addModel: function() {
                  addModel();
                },
                removeModel: function() {
                  rmvModel();
                },
};
var configCam = { rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  //zoom: 30,
                  TransX: 0,
                  TransY: 0,
                  TransZ: 50,
                  lookAtPoint: false,
                  lookAtModel: false,
                  animate: function() {
                    requestAnimationFrame(animateCam);
                  },
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
  guiModTransLin.add(config, "TransX", -50, 50, 0.1).listen().name("X Axis");
  guiModTransLin.add(config, "TransY", -50, 50, 0.1).listen().name("Y Axis");
  guiModTransLin.add(config, "TransZ", -50, 50, 0.1).listen().name("Z Axis");
  //guiTrans.add(config, "TransC", -50, 50, 0.1).listen().name("Curve");
    ///Folder for rotation arround axis and point
  var guiModRot = guiMod.addFolder("Rotate");
  var guiModRotAxis = guiModRot.addFolder("Axis");
  guiModRotAxis.open();
  guiModRotAxis.add(config, "rotateX", 0, 100, 0.1).listen().name("X Axis");
  guiModRotAxis.add(config, "rotateY", 0, 100, 0.1).listen().name("Y Axis");
  guiModRotAxis.add(config, "rotateZ", 0, 100, 0.1).listen().name("Z Axis");
  //guiModRot.add(config, "rotateP", 0, 100, 0.1).listen().name("Point");
  guiMod.add(config, "scale", 0, 100, 0.1).listen();  
    ///Calls function that plays animation
  guiMod.add(config, "animate").name("Animate");
    ///Calls function that creates and destroys new model new model
  guiMod.add(config, "addModel").name("Add Model");
  guiMod.add(config, "removeModel").name("Remove Model");

    ///Interface for camera transformations
  var guiCam = gui.addFolder("Camera");
    ///Folder for linear and curve translations
  var guiCamTrans = guiCam.addFolder("Translation");
  var guiCamTransLin = guiCamTrans.addFolder("Linear");
  guiCamTransLin.open();
  guiCamTransLin.add(configCam, "TransX", -50, 50, 0.1).listen().name("X Axis");
  guiCamTransLin.add(configCam, "TransY", -50, 50, 0.1).listen().name("Y Axis");
  guiCamTransLin.add(configCam, "TransZ", -50, 50, 0.1).listen().name("Z Axis");
  //guiCamTrans.add(configCam, "TransC", -50, 50, 0.1).listen().name("Curve");
    ///Folder for rotation arround axis and point
  var guiCamRot = guiCam.addFolder("Rotate");
  var guiCamRotAxis = guiCamRot.addFolder("Axis");
  guiCamRotAxis.open();
  guiCamRotAxis.add(configCam, "rotateX", -50, 50, 0.1).listen().name("X Axis");  //u
  guiCamRotAxis.add(configCam, "rotateY", -50, 50, 0.1).listen().name("Y Axis");  //v
  guiCamRotAxis.add(configCam, "rotateZ", -50, 50, 0.1).listen().name("Z Axis");  //n
  //guiCamRot.add(config, "rotateP", 0, 100, 0.1).listen().name("Point");
  //guiCam.add(config, "zoom", 0, 100, 0.1).listen().name("Zoom");
    ///Folder for look at
  var guiCamLook = guiCam.addFolder("Look At");
  ///guiCamLook.open();
  guiCamLook.add(configCam, "lookAtPoint").listen().onChange(function(){setChecked("lookAtPoint")}).name("Point");
  guiCamLook.add(configCam, "lookAtModel").listen().onChange(function(){setChecked("lookAtModel")}).name("Model");
    ///Calls function that plays animation
  guiCam.add(configCam, "animate").name("Animate"); 
    ///Allow selection between multiple cameras/Folder
  //var guiCamSel = guiCam.addFodler("Camera Selection");
  //guiCamSel.add(configCam, "selectCam1").listen().onChange(function(){setChecked("cam1")}).name("Camera 1");
};

function setChecked(element){
  if(element=="lookAtModel")
    configCam.lookAtPoint = false;
  if(element=="lookAtPoint")
    configCam.lookAtModel = false;


  // if(element=="cam1"){
  //   configCam.selectCam2 = false;
  //   configCam.selectCam3 = false;
  // }
}