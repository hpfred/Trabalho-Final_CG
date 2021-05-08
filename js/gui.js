var config = {  rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 30,
                TransX: 0,
                TransY: 0,
                TransZ: 0,
                //chckBoxTst: true,
                animate: function() {
                  requestAnimationFrame(animate);
                }
};
//var configCam

const loadGUI = () => {
  const gui = new dat.GUI();
  
    ///Interface for model transformations
  var guiMod = gui.addFolder("Model");
    ///Folders for linear and curve translations
  var guiModTrans = guiMod.addFolder("Translation");
  var guiModTransLin = guiModTrans.addFolder("Linear");
  guiModTransLin.add(config, "TransX", -50, 50, 0.1).listen();
  guiModTransLin.add(config, "TransY", -50, 50, 0.1).listen();
  guiModTransLin.add(config, "TransZ", -50, 50, 0.1).listen();
  //guiTransCur
    ///Folder for axis rotation
  var guiModRot = guiMod.addFolder("Rotate");
  guiModRot.add(config, "rotateX", 0, 100, 0.1).listen();  //guiRotAxis?
  guiModRot.add(config, "rotateY", 0, 100, 0.1).listen();
  guiModRot.add(config, "rotateZ", 0, 100, 0.1).listen();
  //guiRotPt
  guiMod.add(config, "scale", 0, 100, 0.1).listen();  
    ///Calls function that plays animation
  guiMod.add(config, "animate"); 
    ///Calls function that creates new model
  //gui.add(config, "newMod");

    ///Interface for camera transformations
  var guiCam = gui.addFolder("Camera");
    ///Folder for linear and curve translations
  var guiCamTrans = guiCam.addFolder("Translation");
  var guiCamTransLin = guiCamTrans.addFolder("Linear");
  //guiCamCur
    ///Folder for axis rotation
  //point rotation
  //zoom
    ///Folder for look at
  //look at point
  //look at model while moving
    ///Calls function that plays animation
  //
    ///Allow selection between multiple cameras/Folder
  //guiCamSel
};