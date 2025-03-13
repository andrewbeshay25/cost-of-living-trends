import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ definition }) {
  const ref = useRef();

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: "default" });
    try {
      mermaid.render("mermaidDiagram", definition, (svgCode) => {
        ref.current.innerHTML = svgCode;
      });
    } catch (error) {
      console.error("Mermaid rendering error:", error);
    }
  }, [definition]);

  return <div ref={ref} className="mx-auto my-4"></div>;
}
