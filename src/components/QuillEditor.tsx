// src/components/QuillEditor.tsx
import React, { useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css"; // Import Quill's snow theme

Quill.register("modules/cursors", QuillCursors);

const QuillEditor: React.FC = () => {
    const editorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            const quill = new Quill(editorRef.current, {
                modules: {
                    cursors: true,
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        ["image", "code-block"],
                    ],
                    history: {
                        userOnly: true,
                    },
                },
                placeholder: "Start collaborating...",
                theme: "snow",
            });

            const ydoc = new Y.Doc();

            // const provider = new WebrtcProvider("quill-demo-room", ydoc);

            const provider = new WebsocketProvider(
                "ws://localhost:3000",
                "quill-demo-room",
                ydoc
            );

            const ytext = ydoc.getText("quill");

            const binding = new QuillBinding(ytext, quill, provider.awareness);

            const handleBlur = () => quill.blur();
            window.addEventListener("blur", handleBlur);

            return () => {
                binding.destroy();
                provider.destroy();
                ydoc.destroy();
                window.removeEventListener("blur", handleBlur);
            };
        }
    }, []);

    return <div ref={editorRef} style={{ height: "400px" }} />;
};

export default QuillEditor;
