import { useEffect, useRef, useState } from 'react';

const Canvas = (props: {
  vertexCode: string;
  fragmentCode: string;
  programCode: string;
  glConfig: WebGLContextAttributes;
  drawType: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let [gl, setGl] = useState<WebGLRenderingContext | null>(null);

  let vertices = new Float32Array([0, 0.8, -0.6, -0.6, 0.6, -0.6]);
  const colors = new Float32Array([
    1,
    0,
    0,
    1, // 红色
    0,
    1,
    0,
    1, // 绿色
    0,
    0,
    1,
    1, // 蓝色
  ]);

  useEffect(() => {
    initGl();
  }, [props.glConfig]);

  useEffect(() => {
    gl && draw(gl);
  }, [props.vertexCode, props.fragmentCode, props.programCode, props.drawType]);

  const initGl = () => {
    console.warn('initGl', props.glConfig);
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      const gl = canvas.getContext('webgl2', props.glConfig);
      setGl(() => {
        gl && draw(gl);
        return gl;
      });
    }
  };

  const createShader = (
    gl: WebGLRenderingContext,
    type: GLenum,
    code: string,
  ): WebGLShader | null => {
    const shader: WebGLShader | null = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    return shader;
  };

  const createProgram = (
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram | null => {
    const program: WebGLProgram | null = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
  };

  const createBuffer = (
    gl: WebGLRenderingContext,
    target: GLenum,
    bufferData: Float32Array,
    attribute: number,
    size: number,
  ) => {
    const buffer = gl.createBuffer(); // 创建缓冲区对象
    gl.bindBuffer(target, buffer); // 绑定缓冲区对象到 target
    gl.bufferData(target, bufferData, gl.STATIC_DRAW); // 分配缓冲区数据
    gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 0, 0); // 将缓冲区分配到 attribute 变量
    gl.enableVertexAttribArray(attribute); // 开启 attribute 变量
  };

  const draw = (gl: WebGLRenderingContext) => {
    console.warn('draw', gl);
    try {
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, props.vertexCode);
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        props.fragmentCode,
      );
      if (!vertexShader || !fragmentShader) return;
      const program = createProgram(gl, vertexShader, fragmentShader);
      if (!program) return;
      gl.useProgram(program);

      // 获取 a_Position 的变量地址
      const a_Position = gl.getAttribLocation(program, 'a_Position');
      const a_Color = gl.getAttribLocation(program, 'a_Color');

      createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 2);
      createBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4);

      gl.drawArrays(props.drawType, 0, 3);
      // eval(props.programCode);
    } catch (error) {
      console.warn('webgl error');
    }
  };

  const onCanvasClick = () => {
    vertices = new Float32Array(
      Array.from({ length: 6 }, () => Math.random() * 2 - 1),
    );
    gl && draw(gl);
  };

  return (
    <>
      <div className="w-full h-full bg-gray-300 flex flex-col shadow-lg">
        <canvas ref={canvasRef} onClick={onCanvasClick} />
      </div>
    </>
  );
};

export default Canvas;
