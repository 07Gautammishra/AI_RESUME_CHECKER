import * as Diff from "diff";

export function diffText(oldText, newText, mode = "words") {
  const fn = mode === "lines" ? Diff.diffLines : Diff.diffWordsWithSpace;

  if (typeof fn !== "function") {
    throw new Error(`Invalid diff mode: "${mode}". Use "words" or "lines".`);
  }

  const parts = fn(oldText || "", newText || "");

  return parts.map((p) => ({
    value: p.value,
    added: Boolean(p.added),
    removed: Boolean(p.removed),
  }));
}

export function summarize(parts = []) {
  let added = 0;
  let removed = 0;

  for (const p of parts) {
    if (p.added) added += p.value.length;
    else if (p.removed) removed += p.value.length;
  }

  return { added, removed };
}