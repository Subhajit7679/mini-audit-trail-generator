// pages/api/save-version.js
import store from "./_storage";
import { computeDiffSummary } from "./diff";

function nowString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { content } = req.body;
  if (typeof content !== "string") return res.status(400).json({ error: "content required" });

  const prev = store.versions.length ? store.versions[0].content : "";

  const diff = computeDiffSummary(prev, content);

  const id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2,8);

  const version = {
    id,
    timestamp: nowString(),
    addedWords: diff.addedWords,
    removedWords: diff.removedWords,
    oldLength: diff.oldLength,
    newLength: diff.newLength,
    content
  };

  store.versions.unshift(version);
  if (store.versions.length > 1000) store.versions.pop();

  res.status(201).json(version);
}
