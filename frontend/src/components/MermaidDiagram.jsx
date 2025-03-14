import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ definition }) {
  const ref = useRef();

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "default" });
    mermaid.render("mermaidDiagram", definition, (svgCode) => {
      ref.current.innerHTML = svgCode;
    });
  }, [definition]);

  return <div ref={ref} className="mx-auto my-4"></div>;
}
