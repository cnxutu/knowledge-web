import type { SearchResultItem } from "@knowledge/shared";

interface SearchResultListProps {
  results: SearchResultItem[];
}

export function SearchResultList({ results }: SearchResultListProps) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {results.map((item) => (
        <article
          key={item.id}
          style={{
            border: "1px solid #ddd2c4",
            borderRadius: 18,
            padding: "18px",
            background: "#fffef9"
          }}
        >
          <div style={{ fontSize: 12, color: "#8c7f70", marginBottom: 6 }}>{item.type} · score {item.score}</div>
          <h3 style={{ margin: "0 0 8px", color: "#1f1b16" }}>{item.title}</h3>
          <p style={{ margin: 0, color: "#5c5549", lineHeight: 1.6 }}>{item.snippet}</p>
        </article>
      ))}
    </div>
  );
}

