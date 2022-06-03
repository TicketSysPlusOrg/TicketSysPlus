//import { useEffect, useRef } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

const code = "console.log('hello world, yo');\n\n\n";

function JsonViewer() {

    /*
    const editor = useRef();
    const { setContainer } = useCodeMirror({
        container: editor.current,
        extensions: [json()],
        value: code,
    });

   useEffect(() => {
        if (editor.current) {
            setContainer(editor.current);
        }
    }, [editor.current]);  */

    return (

        <CodeMirror
            value="console.log('hello world');"
            height="200px"
            extensions={[json()]}
            onChange={(value, ViewUpdate) => {
                console.log("value:", value);
            }}
        />
    );
    //<div ref={editor} />);

}

export default JsonViewer;
