// pages/api/diff.js
export function computeDiffSummary(oldText = "", newText = "") {
  const normalizeWords = (s) =>
    s
      .split(/\s+/)
      .map((w) => w.replace(/^[^\w]+|[^\w]+$/g, ""))
      .map((w) => w.toLowerCase())
      .filter(Boolean);

  const oldWords = normalizeWords(oldText);
  const newWords = normalizeWords(newText);

  const count = (arr) => {
    const m = new Map();
    for (const w of arr) m.set(w, (m.get(w) || 0) + 1);
    return m;
  };

  const oldCount = count(oldWords);
  const newCount = count(newWords);

  const added = [];
  const removed = [];

  for (const [w, nVal] of newCount.entries()) {
    const oVal = oldCount.get(w) || 0;
    if (nVal > oVal) {
      for (let i = 0; i < nVal - oVal; i++) added.push(w);
    }
  }

  for (const [w, oVal] of oldCount.entries()) {
    const nVal = newCount.get(w) || 0;
    if (oVal > nVal) {
      for (let i = 0; i < oVal - nVal; i++) removed.push(w);
    }
  }

  return {
    addedWords: added,
    removedWords: removed,
    oldLength: oldWords.length,
    newLength: newWords.length,
  };
}
