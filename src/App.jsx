import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Toolbar from "./components/Toolbar";

const App = () => {
  const [text, setText] = useState(
    localStorage.getItem("markdownText") || "# Hello, Markdown!"
  );
  const [selection, setSelection] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("markdownText", text);
  }, [text]);

  // Reaplica a posição do cursor depois que o novo texto é renderizado no
  // textarea (o React reseta a seleção sempre que o value muda).
  useLayoutEffect(() => {
    if (selection && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(selection.start, selection.end);
      setSelection(null);
    }
  }, [selection, text]);

  const insertText = (before, after) => {
    const textArea = textAreaRef.current;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const previousText = textArea.value;
    const beforeText = previousText.substring(0, start);
    const selectedText = previousText.substring(start, end);
    const afterText = previousText.substring(end);

    const newText = `${beforeText}${before}${selectedText}${after}${afterText}`;

    // Se havia texto selecionado, deixa o cursor logo após ele (antes do
    // marcador de fechamento); caso contrário, deixa o cursor entre os
    // marcadores para o usuário já começar a digitar ali.
    const newCursorPos = start + before.length + selectedText.length;

    setText(newText);
    setSelection({ start: newCursorPos, end: newCursorPos });
  };

  const renderText = () => {
    return { __html: DOMPurify.sanitize(marked(text)) };
  };

  return (
    <div className="app-container">
      <Toolbar insertText={insertText} />
      <textarea
        ref={textAreaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div dangerouslySetInnerHTML={renderText()} />
    </div>
  );
};

export default App;
