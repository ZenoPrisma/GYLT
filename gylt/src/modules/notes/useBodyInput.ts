import { useRef, useState } from "react";

/**
 * Handles note body input with lightweight formatting while avoiding feedback
 * loops that caused duplicated or dropped characters when typing quickly.
 */
export function useBodyInput(initial: string = "") {
  const [body, setBody] = useState(initial);
  const prevRef = useRef(initial);
  const skipRef = useRef(false);

  const handleChangeText = (text: string) => {
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }

    let next = text;

    // Replace hyphen at line start with bullet symbol
    next = next.replace(/(^|\n)-\s/g, "$1• ");

    // Auto-continue list on newline
    if (next.length > prevRef.current.length && next.endsWith("\n")) {
      const lines = next.split("\n");
      const prevLine = lines[lines.length - 2] ?? "";
      const match = /(\s*)(•|(\d+)\.)\s/.exec(prevLine);
      if (match) {
        const indent = match[1];
        if (match[2] === "•") {
          next += `${indent}• `;
        } else if (match[3]) {
          const num = parseInt(match[3], 10) + 1;
          next += `${indent}${num}. `;
        }
      }
    }

    if (next !== text) {
      skipRef.current = true; // prevent re-processing when value is programmatically updated
    }

    prevRef.current = next;
    setBody(next);
  };

  const reset = (text: string = "") => {
    prevRef.current = text;
    skipRef.current = true;
    setBody(text);
  };

  return { body, handleChangeText, reset, setBody };
}

export default useBodyInput;
