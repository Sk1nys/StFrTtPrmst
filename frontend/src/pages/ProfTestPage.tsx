 import React, { useEffect, useRef } from 'react'
import styles from './styles/ProfTestPage.module.scss'
import ButtonShine from '../Components/Buttons/ButtonShine';

const ProfTestPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if(canvas) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  interface Color { r: number; g: number; b: number; }
  class pointerPrototype {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    color: Color;
    moved: boolean;
    down: boolean;
 
    constructor() {
        this.x = this.y = this.dx = this.dy = 0;
        this.color = generateColor();
        this.moved = false;
        this.down = false;
        this.id = -1;
    }
}
const pointers = [new pointerPrototype()];
const splatStack: number[] | null = [];
const bloomFramebuffers: unknown[] = [];
const { gl, ext } = getWebGLContext(canvas);

function getWebGLContext (canvas: HTMLCanvasElement | null) {
  const params = { alpha: true};

  const gl = canvas?.getContext('webgl2', params)as WebGL2RenderingContext;;
      gl?.getExtension('EXT_color_buffer_float') as WebGL2RenderingContext;
   const supportLinearFiltering = gl?.getExtension('OES_texture_float_linear');
 
  
  const halfFloatTexType =gl.HALF_FLOAT;
    const  formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
    const  formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
    const  formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
  
  return {
      gl,
      ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering
      }
  };
}

function getSupportedFormat (gl:WebGL2RenderingContext, internalFormat:number, format:number, type : number)
{
  if (!supportRenderTextureFormat(gl, internalFormat, format, type))
  {
      switch (internalFormat)
      {
          case (gl as WebGL2RenderingContext).R16F:
              return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, type);
          case (gl as WebGL2RenderingContext).RG16F:
              return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, gl.RGBA, type);
          default:
              return null;
      }
  }

  return {
      internalFormat,
      format
  }
}

function supportRenderTextureFormat (gl: WebGL2RenderingContext, internalFormat: number, format: number, type: number) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status != gl.FRAMEBUFFER_COMPLETE)
      return false;
  return true;
}



class GLProgram {
  uniforms: { [key: string]: WebGLUniformLocation | null };
  program: WebGLProgram;

  constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    this.uniforms = {};
    const program = gl.createProgram();
    
    if (!program) {
      throw new Error('Unable to create WebGL program');
    }

    this.program = program;

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(this.program);
    }

    const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(this.program, i);
      if (uniformInfo) {
        const uniformName = uniformInfo.name;
        this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
      }
    }
  }

  bind() {
    gl.useProgram(this.program);
  }
}



function compileShader(type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Unable to create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader) || 'Shader compilation failed';
  }

  return shader;
}


const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
  precision highp float;

  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;

  void main () {
      vUv = aPosition * 0.5 + 0.5;
      vL = vUv - vec2(texelSize.x, 0.0);
      vR = vUv + vec2(texelSize.x, 0.0);
      vT = vUv + vec2(0.0, texelSize.y);
      vB = vUv - vec2(0.0, texelSize.y);
      gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`);

const clearShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;
  precision mediump sampler2D;

  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;

  void main () {
      gl_FragColor = value * texture2D(uTexture, vUv);
  }
`);

const colorShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;

  uniform vec4 color;

  void main () {
      gl_FragColor = color;
  }
`);
const displayBloomShadingShader = compileShader(gl.FRAGMENT_SHADER, `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
  uniform sampler2D uBloom;
  uniform sampler2D uDithering;
  uniform vec2 ditherScale;
  uniform vec2 texelSize;

  void main () {
      vec3 L = texture2D(uTexture, vL).rgb;
      vec3 R = texture2D(uTexture, vR).rgb;
      vec3 T = texture2D(uTexture, vT).rgb;
      vec3 B = texture2D(uTexture, vB).rgb;
      vec3 C = texture2D(uTexture, vUv).rgb;

      float dx = length(R) - length(L);
      float dy = length(T) - length(B);

      vec3 n = normalize(vec3(dx, dy, length(texelSize)));
      vec3 l = vec3(0.0, 0.0, 1.0);

      float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
      C *= diffuse;

      vec3 bloom = texture2D(uBloom, vUv).rgb;
      bloom = pow(bloom.rgb, vec3(1.0 / 2.2));
      C += bloom;

      float a = max(C.r, max(C.g, C.b));
      gl_FragColor = vec4(C, a);
  }
`);

const bloomPrefilterShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;
  precision mediump sampler2D;

  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec3 curve;
  uniform float threshold;

  void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
      float br = max(c.r, max(c.g, c.b));
      float rq = clamp(br - curve.x, 0.0, curve.y);
      rq = curve.z * rq * rq;
      c *= max(rq, br - threshold) / max(br, 0.0001);
      gl_FragColor = vec4(c, 0.0);
  }
`);

const bloomBlurShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;
  precision mediump sampler2D;

  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;

  void main () {
      vec4 sum = vec4(0.0);
      sum += texture2D(uTexture, vL);
      sum += texture2D(uTexture, vR);
      sum += texture2D(uTexture, vT);
      sum += texture2D(uTexture, vB);
      sum *= 0.25;
      gl_FragColor = sum;
  }
`);

const bloomFinalShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;
  precision mediump sampler2D;

  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uTexture;
  uniform float intensity;

  void main () {
      vec4 sum = vec4(0.0);
      sum += texture2D(uTexture, vL);
      sum += texture2D(uTexture, vR);
      sum += texture2D(uTexture, vT);
      sum += texture2D(uTexture, vB);
      sum *= 0.25;
      gl_FragColor = sum * intensity;
  }
`);

const splatShader = compileShader(gl.FRAGMENT_SHADER, `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;

  void main () {
      vec2 p = vUv - point.xy;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      vec3 base = texture2D(uTarget, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.0);
  }
`);

const advectionManualFilteringShader = compileShader(gl.FRAGMENT_SHADER, `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;

  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
      vec2 st = uv / tsize - 0.5;

      vec2 iuv = floor(st);
      vec2 fuv = fract(st);

      vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
      vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
      vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
      vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

      return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }

  void main () {
      vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
      gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);
      gl_FragColor.a = 1.0;
  }
`);

const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;

  void main () {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = dissipation * texture2D(uSource, coord);
      gl_FragColor.a = 1.0;
  }
`);
const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;
  precision mediump sampler2D;

  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;

      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) { L = -C.x; }
      if (vR.x > 1.0) { R = -C.x; }
      if (vT.y > 1.0) { T = -C.y; }
      if (vB.y < 0.0) { B = -C.y; }

      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`);
const curlShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;
  precision mediump sampler2D;

  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      float vorticity = R - L - T + B;
      gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`);
const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;

  void main () {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;

      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;

      vec2 vel = texture2D(uVelocity, vUv).xy;
      gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
  }
`);

const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;

  vec2 boundary (vec2 uv) {
      return uv;
      // uncomment if you use wrap or repeat texture mode
      // uv = min(max(uv, 0.0), 1.0);
      // return uv;
  }
  void main () {
      float L = texture2D(uPressure, boundary(vL)).x;
      float R = texture2D(uPressure, boundary(vR)).x;
      float T = texture2D(uPressure, boundary(vT)).x;
      float B = texture2D(uPressure, boundary(vB)).x;
      float C = texture2D(uPressure, vUv).x;
      float divergence = texture2D(uDivergence, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`);
const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  vec2 boundary (vec2 uv) {
      return uv;
      // uv = min(max(uv, 0.0), 1.0);
      // return uv;
  }
  void main () {
      float L = texture2D(uPressure, boundary(vL)).x;
      float R = texture2D(uPressure, boundary(vR)).x;
      float T = texture2D(uPressure, boundary(vT)).x;
      float B = texture2D(uPressure, boundary(vB)).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`);
const blit = (() => {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  return (destination: WebGLFramebuffer | null) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };
})();

type DoubleFBO = {
  read: WebGLFramebuffer;
  write: WebGLFramebuffer;
  swap: () => void;
};

 

let simWidth: number; 
let simHeight: number; 
let dyeWidth: number; 
let dyeHeight: number; 
let density: DoubleFBO | null;
let velocity: DoubleFBO | null;
let divergence: WebGLFramebuffer | null; 
let curl: WebGLFramebuffer | null; 
let pressure: DoubleFBO | null;
let bloom: WebGLFramebuffer | null;

const ditheringTexture = createTextureAsync('LDR_RGB1_0.png');
const clearProgram               = new GLProgram(baseVertexShader, clearShader);
const colorProgram               = new GLProgram(baseVertexShader, colorShader);
const displayBloomShadingProgram = new GLProgram(baseVertexShader, displayBloomShadingShader);
const bloomPrefilterProgram      = new GLProgram(baseVertexShader, bloomPrefilterShader);
const bloomBlurProgram           = new GLProgram(baseVertexShader, bloomBlurShader);
const bloomFinalProgram          = new GLProgram(baseVertexShader, bloomFinalShader);
const splatProgram               = new GLProgram(baseVertexShader, splatShader);
const advectionProgram           = new GLProgram(baseVertexShader, ext.supportLinearFiltering ? advectionShader : advectionManualFilteringShader);
const divergenceProgram          = new GLProgram(baseVertexShader, divergenceShader);
const curlProgram                = new GLProgram(baseVertexShader, curlShader);
const vorticityProgram           = new GLProgram(baseVertexShader, vorticityShader);
const pressureProgram            = new GLProgram(baseVertexShader, pressureShader);
const gradienSubtractProgram     = new GLProgram(baseVertexShader, gradientSubtractShader);
function initFramebuffers() {
  const simRes = getResolution(256);  
  const dyeRes = getResolution(1024);
  simWidth = simRes.width;
  simHeight = simRes.height;
  dyeWidth = dyeRes.width;
  dyeHeight = dyeRes.height;

  const texType = ext.halfFloatTexType;
  const rgba = ext.formatRGBA;
  const rg = ext.formatRG;
  const r = ext.formatR;
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
  const defaultInternalFormat = gl.RGBA;
  const defaultFormat = gl.RGBA;

  if (density == null) {
      density = createDoubleFBO(dyeWidth, dyeHeight, rgba?.internalFormat ?? defaultInternalFormat, rgba?.format ?? defaultFormat, texType, filtering);
  }
  if (velocity == null) {
      velocity = createDoubleFBO(simWidth, simHeight, rg?.internalFormat ?? defaultInternalFormat, rg?.format ?? defaultFormat, texType, filtering);
  }
  divergence = createFBO(simWidth, simHeight, r?.internalFormat ?? defaultInternalFormat, r?.format ?? defaultFormat, texType, gl.NEAREST);
  curl = createFBO(simWidth, simHeight, r?.internalFormat ?? defaultInternalFormat, r?.format ?? defaultFormat, texType, gl.NEAREST);
  pressure = createDoubleFBO(simWidth, simHeight, r?.internalFormat ?? defaultInternalFormat, r?.format ?? defaultFormat, texType, gl.NEAREST);

  initBloomFramebuffers();
}

function initBloomFramebuffers () {
  const res = getResolution(256);
  const texType = ext.halfFloatTexType;
  const rgba = ext.formatRGBA;
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
  const defaultInternalFormat = gl.RGBA;
  const defaultFormat = gl.RGBA;
  bloom = createFBO(res.width, res.height, rgba?.internalFormat ?? defaultInternalFormat, rgba?.format ?? defaultFormat, texType, filtering);
  bloomFramebuffers.length = 0;
  for (let i = 0; i < 8; i++)
  {
      const width = res.width >> (i + 1);
      const height = res.height >> (i + 1);

      if (width < 2 || height < 2) break;
     
      const fbo = createFBO(width, height, rgba?.internalFormat ?? defaultInternalFormat, rgba?.format ?? defaultFormat, texType, filtering);
      bloomFramebuffers.push(fbo);
  }
}

function createFBO (w: number, h: number, internalFormat: number , format: number, type: number, param: number) {
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return {
      texture,
      fbo,
      width: w,
      height: h,
      attach (id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
      }
      
  };
}
function createDoubleFBO (w: number, h: number, internalFormat: number , format: number, type: number, param: number) {
  let fbo1 = createFBO(w, h, internalFormat, format, type, param);
  let fbo2 = createFBO(w, h, internalFormat, format, type, param);
  return {
      get read () {
          return fbo1;
      },
      set read (value) {
          fbo1 = value;
      },
      get write () {
          return fbo2;
      },
      set write (value) {
          fbo2 = value;
      },
      swap () {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
      }
  }
}
function createTextureAsync(url: string) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));

  const obj = {
    texture,
    width: 1,
    height: 1,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    }
  };

  const image = new Image();
  image.src = url;
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    obj.width = image.width;
    obj.height = image.height;
  };

  return obj;
}


initFramebuffers();

update();

function update() {
      input();
          step(0.016);
      render(null);
      requestAnimationFrame(update); 
}
function input() {
  const defaultSplatStack = 0;
  if ((splatStack?.length ?? defaultSplatStack) > 0) {
    const element = splatStack?.pop();
    if (element !== undefined) {
      multipleSplats(element);
    }
  }

  for (let i = 0; i < pointers.length; i++) {
    const p = pointers[i];
    if (p.moved) {
      splat(p.x, p.y, p.dx, p.dy, p.color);
      p.moved = false;
    }
  }
}

function step (dt: number) {
  gl.disable(gl.BLEND);
  gl.viewport(0, 0, simWidth, simHeight);
  curlProgram.bind();
  gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
  gl.uniform1i(curlProgram.uniforms.uVelocity, velocity?.read.attach(0));
  blit(curl?.fbo);
  vorticityProgram.bind();
  gl.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
  gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity?.read.attach(0));
  gl.uniform1i(vorticityProgram.uniforms.uCurl, curl?.attach(1));
  gl.uniform1f(vorticityProgram.uniforms.curl, 30);
  gl.uniform1f(vorticityProgram.uniforms.dt, dt);
  blit(velocity?.write.fbo);
  velocity?.swap();
  divergenceProgram.bind();
  gl.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
  gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity?.read.attach(0));
  blit(divergence?.fbo);
  clearProgram.bind();
  gl.uniform1i(clearProgram.uniforms.uTexture, pressure?.read.attach(0));
  gl.uniform1f(clearProgram.uniforms.value, 0.8);
  blit(pressure?.write.fbo);
  pressure?.swap();
  pressureProgram.bind();
  gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
  gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence?.attach(0));
  for (let i = 0; i < 20; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure?.read.attach(1));
      blit(pressure?.write.fbo);
      pressure?.swap();
  }
  gradienSubtractProgram.bind();
  gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
  gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure?.read.attach(0));
  gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity?.read.attach(1));
  blit(velocity?.write.fbo);
  velocity?.swap();
  advectionProgram.bind();
  gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / simWidth, 1.0 / simHeight);
  const velocityId = velocity?.read.attach(0);
  gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
  gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
  gl.uniform1f(advectionProgram.uniforms.dt, dt);
  gl.uniform1f(advectionProgram.uniforms.dissipation, 0.98);
  blit(velocity?.write.fbo);
  velocity?.swap();
  gl.viewport(0, 0, dyeWidth, dyeHeight);
  gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity?.read.attach(0));
  gl.uniform1i(advectionProgram.uniforms.uSource, density?.read.attach(1));
  gl.uniform1f(advectionProgram.uniforms.dissipation, 0.97);
  blit(density?.write.fbo);
  density?.swap();
}
function render (target: null) {
      applyBloom(density?.read, bloom);
  if (target == null) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
  }
  else {
      gl.disable(gl.BLEND);
  }
  const width  = target == null ? gl.drawingBufferWidth : dyeWidth;
  const height = target == null ? gl.drawingBufferHeight : dyeHeight;
  gl.viewport(0, 0, width, height);
      colorProgram.bind();
      document.body.style.backgroundColor = `rgb(123, 129, 210)`;
      blit(target);
      const program =  displayBloomShadingProgram;
      program.bind();
      gl.uniform2f(program.uniforms.texelSize, 1.0 / width, 1.0 / height);
      gl.uniform1i(program.uniforms.uTexture, density?.read.attach(0));
          gl.uniform1i(program.uniforms.uBloom, bloom?.attach(1));
          gl.uniform1i(program.uniforms.uDithering, ditheringTexture.attach(2));
          const scale = getTextureScale(ditheringTexture, width, height);
          gl.uniform2f(program.uniforms.ditherScale, scale.x, scale.y);
  blit(target);
}
function applyBloom(source: { attach: (id: number) => number; width: number; height: number; fbo: WebGLFramebuffer; }, destination: { attach: (id: number) => number; width: number; height: number; fbo: WebGLFramebuffer; }) 
{
  if (bloomFramebuffers.length < 2) return;

  let last = destination;
  gl.disable(gl.BLEND);
  bloomPrefilterProgram.bind();
  
  const knee = 0.6 * 0.7 + 0.0001;
  const curve0 = 0.6 - knee;
  const curve1 = knee * 2;
  const curve2 = 0.25 / knee;
  
  gl.uniform3f(bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
  gl.uniform1f(bloomPrefilterProgram.uniforms.threshold, 0.6);
  gl.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
  gl.viewport(0, 0, last.width, last.height);
  blit(last.fbo);
  
  bloomBlurProgram.bind();
  for (let i = 0; i < bloomFramebuffers.length; i++) {
    
       const dest = bloomFramebuffers[i] as { attach: (id: number) => number; width: number; height: number; fbo: WebGLFramebuffer };
    gl.uniform2f(bloomBlurProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
    gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
    gl.viewport(0, 0, dest.width, dest.height);
    blit(dest.fbo);
    last = dest;
  }
  
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.enable(gl.BLEND);
  
  for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
    const baseTex = bloomFramebuffers[i] as { attach: (id: number) => number; width: number; height: number; fbo: WebGLFramebuffer };
    gl.uniform2f(bloomBlurProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
    gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
    gl.viewport(0, 0, baseTex.width, baseTex.height);
    blit(baseTex.fbo);
    last = baseTex;
  }
  
  gl.disable(gl.BLEND);
  bloomFinalProgram.bind();
  gl.uniform2f(bloomFinalProgram.uniforms.texelSize, 1.0 / last.width, 1.0 / last.height);
  gl.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0));
  gl.uniform1f(bloomFinalProgram.uniforms.intensity, 0.8);
  gl.viewport(0, 0, destination.width, destination.height);
  blit(destination.fbo);
}

function splat (x: number, y: number, dx: number, dy: number, color: Color) {
  const defaultWidth = 100;
  const defaultHeight = 100;
  gl.viewport(0, 0, simWidth, simHeight);
  splatProgram.bind();
  gl.uniform1i(splatProgram.uniforms.uTarget, velocity?.read.attach(0));
  gl.uniform1f(splatProgram.uniforms.aspectRatio, (canvas?.width ?? defaultWidth) / (canvas?.height ?? defaultHeight));
  gl.uniform2f(splatProgram.uniforms.point, x / (canvas?.width ?? defaultWidth), 1.0 - y / (canvas?.height ?? defaultHeight));
  gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
  gl.uniform1f(splatProgram.uniforms.radius, 0.5 / 100.0);
  blit(velocity?.write.fbo);
  velocity?.swap();
  gl.viewport(0, 0, dyeWidth, dyeHeight);
  gl.uniform1i(splatProgram.uniforms.uTarget, density?.read.attach(0));
  gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
  blit(density?.write.fbo);
  density?.swap();
}
function multipleSplats (amount: number) {
  const defaultWidth = 100;
  const defaultHeight = 100;
  for (let i = 0; i < amount; i++) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const x = canvas?.width ?? defaultWidth * Math.random();
      const y = canvas?.height ?? defaultHeight * Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      splat(x, y, dx, dy, color);
  }
}
canvas?.addEventListener('mousemove', e => {
  pointers[0].moved = true;
  pointers[0].dx = (e.offsetX - pointers[0].x) * 5.0;
  pointers[0].dy = (e.offsetY - pointers[0].y) * 5.0;
  pointers[0].x = e.offsetX;
  pointers[0].y = e.offsetY;
});
canvas?.addEventListener('touchmove', e => {
  e.preventDefault();
  const touches = e.targetTouches;
  for (let i = 0; i < touches.length; i++) {
      const pointer = pointers[i];
      pointer.moved = pointer.down;
      pointer.dx = (touches[i].pageX - pointer.x) * 8.0;
      pointer.dy = (touches[i].pageY - pointer.y) * 8.0;
      pointer.x = touches[i].pageX;
      pointer.y = touches[i].pageY;
  }
}, false);
window.addEventListener('touchend', e => {
  const touches = e.changedTouches;
  for (let i = 0; i < touches.length; i++)
      for (let j = 0; j < pointers.length; j++)
          if (touches[i].identifier == pointers[j].id)
              pointers[j].down = false;
});
canvas?.addEventListener('touchstart', e => {

  e.preventDefault();
  const touches = e.targetTouches;
  for (let i = 0; i < touches.length; i++) {
      if (i >= pointers.length)
          pointers.push(new pointerPrototype());

      pointers[i].id = touches[i].identifier;
      pointers[i].down = true;
      pointers[i].x = touches[i].pageX;
      pointers[i].y = touches[i].pageY;
     
  }
});
function generateColor () {
const c = HSVtoRGB(0.08, 0.6, 1.0);
  return { r: c.r * 0.15, g: c.g * 0.15, b: c.b * 0.15 };
}
function HSVtoRGB (h: number, s: number, v:  number) {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  return {
      r: [v, q, p, p, t, v][i % 6],
      g: [t, v, v, q, p, p][i % 6],
      b: [p, p, t, v, v, q][i % 6]
  };
}
function getResolution (resolution: number) {
  const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  const max = Math.round(resolution * aspectRatio);
  const min = Math.round(resolution);
  if (gl.drawingBufferWidth > gl.drawingBufferHeight)
      return { width: max, height: min };
  else
      return { width: min, height: max };
}
interface Texture { width: number; height: number; }
function getTextureScale (texture: Texture, width: number, height: number) {
  return {
      x: width / texture.width,
      y: height / texture.height
  };
}
}, [])
  return (
    <>
    <div className={styles.prof_container}>
    <div className={styles.centered_info}>
     
       <h1 className={styles.profDesc}>
        приглашаем вас на проверку знаний о профессии веб-разработчика
       </h1>
       <p className={styles.profText}>
      Советуем проходить тест на компьютере
       </p>
       <ButtonShine>
        начать тест
       </ButtonShine>
      </div>  

<canvas className={styles.profCanvas} ref={canvasRef}></canvas>
    </div>
   
    </>
   
  )
}

export default ProfTestPage