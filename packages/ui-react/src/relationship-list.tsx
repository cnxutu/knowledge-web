import type { RelationEdge } from "@knowledge/shared";

interface RelationshipListProps {
  edges: RelationEdge[];
  onOpen?: (target: string) => void;
}

export function RelationshipList({ edges, onOpen }: RelationshipListProps) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {edges.map((edge) => (
        <button
          key={`${edge.source}-${edge.target}-${edge.label}`}
          type="button"
          onClick={() => onOpen?.(edge.target)}
          style={{
            textAlign: "left",
            border: "1px solid #d7c6a8",
            borderRadius: 16,
            padding: "12px 14px",
            background: "#fffaf0",
            cursor: "pointer"
          }}
        >
          <div style={{ fontWeight: 700, color: "#2e261c" }}>{edge.label}</div>
          <div style={{ fontSize: 13, color: "#6b5f4d" }}>{edge.relationType} · {edge.target}</div>
        </button>
      ))}
    </div>
  );
}

