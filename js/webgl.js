// const vertexShaderSource = `#version 300 es

//   in vec4 a_position;
//   in vec4 a_color;

//   uniform mat4 u_matrix;

//   out vec4 v_color;

//   void main() {
//     gl_Position = u_matrix * a_position;

//     v_color = a_color;
//   }
// `;

// const fragmentShaderSource = `#version 300 es
// precision highp float;

// in vec4 v_color;

// uniform vec4 u_colorMult;

// out vec4 outColor;

// void main() {
//    outColor = v_color * u_colorMult;
// }
// `;

// const initializeWorld = () => {
//   const canvas = document.querySelector("#canvas");
//   const gl = canvas.getContext("webgl2");
//   if (!gl) {
//     return;
//   }
//   twgl.setAttributePrefix("a_");
//   const meshProgramInfo = twgl.createProgramInfo(gl, [
//     vertexShaderSource,
//     fragmentShaderSource,
//   ]);

//   return {
//     gl,
//     meshProgramInfo,
//   };
// };

"use strict";

var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult + u_colorOffset;
}
`;

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

var initializeWorld = () => {
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  twgl.setAttributePrefix("a_");
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  return {
    gl,
    programInfo,
  };
};