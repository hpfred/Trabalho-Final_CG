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

// var text1 = document.querySelector("#p1");
// var text2 = document.querySelector("#p2");
// var p1node = document.createTextNode("");
// var p2node = document.createTextNode("");
// text1.appendChild(p1node);
// text2.appendChild(p2node);
var initializeWorld = () => {
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  var textCanvas = document.querySelector("#text");
  var txt = textCanvas.getContext("2d");
  if (!gl) {
    return;
  }
  twgl.setAttributePrefix("a_");
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  return {
    gl,
    programInfo,
    txt,
  };
};