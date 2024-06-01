import MonacoEditor, { OnChange } from '@monaco-editor/react';

const Editor = (props: { code: string; onCodeChange: OnChange }) => {
  return (
    <>
      <div className="w-full flex-auto bg-gray-300 shadow-lg">
        <MonacoEditor
          onChange={props.onCodeChange}
          language="typescript"
          theme="twilight"
          value={props.code}
        />
      </div>
    </>
  );
};

export default Editor;
