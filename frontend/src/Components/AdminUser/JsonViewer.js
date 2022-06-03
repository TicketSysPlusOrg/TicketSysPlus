import { useEffect, useRef } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

const code = "console.log('hello world!');\n\n\n";

function JsonViewer() {
    const editor = useRef();
    const { setContainer } = useCodeMirror({
        container: editor.current,
        extensions: [json()],
        value: code
    });

    useEffect(() => {
        if (editor.current) {
            setContainer(editor.current);
        }
    }, [editor.current]);

    return <div ref={editor} />;
}

export default JsonViewer;
