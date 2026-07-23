"use client";

import mermaid from "mermaid";
import { useEffect, useState } from "react";

mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "strict" });

export default function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    mermaid.render(`mermaid-${Math.random().toString(36).slice(2)}`, chart).then((result) => {
      if (active) { setSvg(result.svg); setError(""); }
    }).catch(() => { if (active) setError("Mermaid 图表语法暂时无法渲染，以下为源码："); });
    return () => { active = false; };
  }, [chart]);
  return svg ? <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="mermaid-source"><small>{error || "正在渲染 Mermaid…"}</small><pre>{chart}</pre></div>;
}
