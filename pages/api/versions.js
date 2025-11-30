// pages/api/versions.js
import store from "./_storage";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Only GET allowed" });
  const summary = store.versions.map(v => ({
    id: v.id,
    timestamp: v.timestamp,
    addedWords: v.addedWords,
    removedWords: v.removedWords,
    oldLength: v.oldLength,
    newLength: v.newLength
  }));
  res.status(200).json(summary);
}
