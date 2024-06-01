import { useState } from 'react';
import Canvas from '../components/Canvas';
import Editor from '../components/Editor';

function Playground() {
  const [vertexCode, setVertexCode] = useState(
    `attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;

void main () {
  gl_Position = a_Position;
  v_Color= a_Color;
}`,
  );
  const [fragmentCode, setFragmentCode] = useState(
    `precision mediump float;
varying vec4 v_Color;

void main() {
  gl_FragColor = v_Color;
}`,
  );
  const [programCode, setProgramCode] = useState<string>(
    `// 获取 a_Position 的变量地址
const a_Position = gl.getAttribLocation(program, 'a_Position');
const a_Color = gl.getAttribLocation(program, 'a_Color');

createBuffer(gl, gl.ARRAY_BUFFER, vertices, a_Position, 2);
createBuffer(gl, gl.ARRAY_BUFFER, colors, a_Color, 4);

gl.drawArrays(props.drawType, 0, 3);`,
  );
  const [glConfig, setGlConfig] = useState<WebGLContextAttributes>({
    preserveDrawingBuffer: false,
  });
  const [drawType, setDrawType] = useState<number>(4);

  let version = new Date().getTime();

  const onVertexCodeChange = (e: any) => {
    setVertexCode(e.target.value);
  };

  const onFragmentCodeChange = (e: any) => {
    setFragmentCode(e.target.value);
  };

  const onProgramCodeChange = (e: any) => {
    setProgramCode(e.target.value);
  };

  const onGlConfigChange = (e: any, type: string) => {
    setGlConfig({
      ...glConfig,
      [type]: e.target.checked,
    });
    version = new Date().getTime();
  };

  return (
    <>
      <div className="flex-auto">
        <div className="w-full h-full flex flex-col">
          <div className="w-full p-4 flex-auto flex flex-col">
            <div className="w-full h-6 flex items-center">
              <input
                className="mr-2"
                type="checkbox"
                id="preserveDrawingBuffer"
                checked={glConfig.preserveDrawingBuffer}
                onChange={(e) => onGlConfigChange(e, 'preserveDrawingBuffer')}
              />
              <label htmlFor="preserveDrawingBuffer">保留每次绘制</label>
              <label className="mx-2" htmlFor="drawType">
                绘制类型
              </label>
              <select
                value={drawType}
                onChange={(e) => setDrawType(parseInt(e.target.value))}
              >
                <option value="0">POINTS</option>
                <option value="1">LINES</option>
                <option value="2">LINE_LOOP</option>
                <option value="3">LINE_STRIP</option>
                <option value="4">TRIANGLES</option>
                <option value="5">TRIANGLE_STRIP</option>
                <option value="6">TRIANGLE_FAN</option>
              </select>
            </div>
            <div className="w-full flex-auto">
              <Canvas
                key={version}
                vertexCode={vertexCode}
                fragmentCode={fragmentCode}
                programCode={programCode}
                glConfig={glConfig}
                drawType={drawType}
              />
            </div>
          </div>
          <div className="w-full h-1/3 flex flex-row">
            <div className="w-1/3 m-4 flex flex-col">
              <span className="text-2xl">Vertex</span>
              <Editor code={vertexCode} onCodeChange={onVertexCodeChange} />
            </div>
            <div className="w-1/3 m-4 flex flex-col">
              <span className="text-2xl">Fragment</span>
              <Editor code={fragmentCode} onCodeChange={onFragmentCodeChange} />
            </div>
            <div className="w-1/3 m-4 flex flex-col">
              <span className="text-2xl">Buffer</span>
              <Editor code={programCode} onCodeChange={onProgramCodeChange} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Playground;
