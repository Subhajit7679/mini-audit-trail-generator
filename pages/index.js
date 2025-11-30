import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/versions")
      .then((r) => r.json())
      .then((data) => setVersions(data))
      .catch(() => setVersions([]));
  }, []);

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/save-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const newVersion = await res.json();
      setVersions((prev) => [newVersion, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Save failed (see console).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
     <header className="header header-animate">
  <div className="logo logo-animate">AT</div>
  <div>
    <div className="title title-type">Mini Audit Trail Generator</div>
  </div>
</header>




      <section className="card">
        <div className="editor-label">Content Editor</div>
        <textarea
          className="editor"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write or paste your text here..."
        />

        <div className="actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Version"}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setContent("");
            }}
          >
            Clear
          </button>
        </div>
      </section>

      <section className="version-list">
        <h3 style={{ marginTop: 18 }}>Version History</h3>

        {versions.length === 0 && (
          <div className="card" style={{ marginTop: 12 }}>
            <div className="small empty">No versions yet — save your first version to create an audit record.</div>
          </div>
        )}

        {versions.map((v) => (
          <div key={v.id} className="version-item">
            <div className="version-left">
              <div className="meta">
                <span className="kv">{v.timestamp}</span> — <span className="small">ID: {v.id}</span>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ minWidth: 220 }}>
                  <div className="small">Added words</div>
                  <div>{v.addedWords.length ? v.addedWords.join(", ") : <span className="empty">—</span>}</div>
                </div>

                <div style={{ minWidth: 220 }}>
                  <div className="small">Removed words</div>
                  <div>{v.removedWords.length ? v.removedWords.join(", ") : <span className="empty">—</span>}</div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div className="badge">oldLen: {v.oldLength} → newLen: {v.newLength}</div>
              <div style={{ marginTop: 10 }} className="small">Click to view full content (future)</div>
            </div>
          </div>
        ))}
      </section>

      <div className="footer">
  © {new Date().getFullYear()} Subhajit Maity — Crafted with care 💝, powered by Next.js
</div>

    </div>
  );
}
