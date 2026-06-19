import { makeId } from "../utils/id.js";
import { readJson, sleep, writeJson } from "./storage.js";
import { chunkText, generateCragResponse } from "./ragEngine.js";

const DOCS_KEY = "iqcrag.mock.documents";
const SESSIONS_KEY = "iqcrag.mock.sessions";
const MESSAGES_KEY = "iqcrag.mock.messages";

const seedDocuments = [
  {
    id: "doc_q3_financial",
    type: "PDF",
    name: "Q3 2024 Financial Report.pdf",
    date: "Oct 20, 2024",
    size: 2_400_000,
    active: false,
    status: "Indexed",
    content:
      "Q3 2024 financial report. Market volatility remained elevated during Q3, driven by macroeconomic uncertainties and sector-specific headwinds in technology. Revenue was exposed to changing customer demand, pricing pressure, and exchange-rate fluctuations. Cybersecurity threats and AI governance obligations also increased operational risk. The report recommends monitoring margin compression, customer churn, and vendor concentration.",
    summary:
      "Financial report covering market volatility, revenue pressure, cybersecurity threats, and regulatory changes."
  },
  {
    id: "doc_enterprise_risk",
    type: "PDF",
    name: "Enterprise Risk Assessment.pdf",
    date: "Sep 15, 2024",
    size: 1_800_000,
    active: false,
    status: "Indexed",
    content:
      "Enterprise risk assessment. Supply chain disruptions continue to be a high-impact risk due to geopolitical tensions and component shortages. Cybersecurity threats include phishing, ransomware, vendor compromise, and cloud misconfiguration. Regulatory changes in data privacy and AI governance may increase compliance costs. Recommended controls include vendor risk scoring, incident response testing, and access reviews.",
    summary:
      "Risk assessment covering supply chain, cybersecurity, privacy, compliance, and controls."
  },
  {
    id: "doc_market_analysis",
    type: "PDF",
    name: "Market Analysis Q3 2024.pdf",
    date: "Oct 18, 2024",
    size: 1_500_000,
    active: true,
    status: "Indexed",
    content:
      "Market analysis Q3 2024. Cybersecurity threats are increasing in frequency and sophistication, posing significant risks to enterprise data systems. Market volatility increased due to inflation expectations, technology sector repricing, and uncertain demand. Supply chain reliability improved in some regions but remains sensitive to geopolitical disruptions.",
    summary:
      "Market analysis focused on volatility, cybersecurity, technology sector risk, and supply chain reliability."
  },
  {
    id: "doc_data_security",
    type: "PDF",
    name: "Data Security Policy.pdf",
    date: "Jul 30, 2024",
    size: 900_000,
    active: false,
    status: "Indexed",
    content:
      "Data security policy. All users must follow least privilege access, multi-factor authentication, secure password practices, and approved data retention rules. Sensitive data must be encrypted at rest and in transit. Security incidents must be reported immediately to the security team.",
    summary:
      "Policy for authentication, encryption, data retention, and incident reporting."
  },
  {
    id: "doc_hr_policy",
    type: "PDF",
    name: "HR Policy Handbook.pdf",
    date: "Jun 11, 2024",
    size: 1_100_000,
    active: false,
    status: "Indexed",
    content:
      "HR policy handbook. Employees are eligible for casual leave, sick leave, maternity leave, and paternity leave according to company policy. Leave requests should be submitted in advance through the internal HR system. Managers approve leave based on policy rules and business needs.",
    summary:
      "HR handbook covering leave policy, approvals, eligibility, and employee process."
  }
];

const seedSessions = [
  {
    id: "session_q3_risks",
    title: "Q3 Risk Analysis",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const seedMessages = {
  session_q3_risks: [
    {
      id: "msg_1",
      role: "user",
      content: "What are the key risks in the Q3 report?",
      createdAt: new Date().toISOString()
    },
    {
      id: "msg_2",
      role: "assistant",
      content:
        "Based on the Q3 2024 report and related documents, the key risks identified are:\n\n1. **Market Volatility:** Increased volatility in global markets could impact revenue, particularly in the technology sector. [1] [3]\n2. **Supply Chain Disruptions:** Ongoing geopolitical tensions may lead to delays and increased costs. [1] [2]\n3. **Cybersecurity Threats:** Rising frequency of attacks pose risks to data and customer trust. [2] [3]\n4. **Regulatory Changes:** New data privacy and AI governance rules could raise compliance costs. [2]",
      confidence: 98,
      sources: [
        {
          id: 1,
          type: "PDF",
          title: "Q3 2024 Financial Report.pdf",
          page: "Page 15",
          relevance: "98%",
          usedIn: "1, 2",
          snippet:
            "Market volatility remained elevated during Q3, driven by macroeconomic uncertainties and sector-specific headwinds in technology.",
          highlight: "Market volatility"
        },
        {
          id: 2,
          type: "PDF",
          title: "Enterprise Risk Assessment.pdf",
          page: "Page 7",
          relevance: "94%",
          usedIn: "2, 3, 4",
          snippet:
            "Supply chain disruptions continue to be a high-impact risk due to geopolitical tensions and component shortages.",
          highlight: "Supply chain disruptions"
        },
        {
          id: 3,
          type: "PDF",
          title: "Market Analysis Q3 2024.pdf",
          page: "Page 11",
          relevance: "93%",
          usedIn: "1, 3",
          snippet:
            "Cybersecurity threats are increasing in frequency and sophistication, posing significant risks to enterprise data systems.",
          highlight: "Cybersecurity threats"
        }
      ],
      pipeline: [
        { title: "Retrieve", subtitle: "Top-K Documents", value: "12", status: "done" },
        { title: "Verify", subtitle: "Relevance Check", value: "98%", status: "done" },
        { title: "Correct", subtitle: "Fact Check & Correction", value: "94%", status: "done" },
        { title: "Answer", subtitle: "Generate Response", value: "98%", status: "done" }
      ],
      createdAt: new Date().toISOString()
    }
  ]
};

function ensureSeeded() {
  if (!localStorage.getItem(DOCS_KEY)) {
    const docs = seedDocuments.map((doc) => ({
      ...doc,
      chunks: chunkText(doc.content),
      uploadedBy: "Alex Parker"
    }));
    writeJson(DOCS_KEY, docs);
  }

  if (!localStorage.getItem(SESSIONS_KEY)) {
    writeJson(SESSIONS_KEY, seedSessions);
  }

  if (!localStorage.getItem(MESSAGES_KEY)) {
    writeJson(MESSAGES_KEY, seedMessages);
  }
}

function getDocumentsSync() {
  ensureSeeded();
  return readJson(DOCS_KEY, []);
}

function saveDocuments(docs) {
  writeJson(DOCS_KEY, docs);
}

function getSessionsSync() {
  ensureSeeded();
  return readJson(SESSIONS_KEY, []);
}

function saveSessions(sessions) {
  writeJson(SESSIONS_KEY, sessions);
}

function getMessagesMapSync() {
  ensureSeeded();
  return readJson(MESSAGES_KEY, {});
}

function saveMessagesMap(messages) {
  writeJson(MESSAGES_KEY, messages);
}

function fileTypeFromName(name) {
  const extension = name.split(".").pop()?.toUpperCase() || "FILE";
  if (extension === "MD") return "TXT";
  return extension;
}

async function readFileContent(file) {
  const supportedTextTypes = [
    "text/plain",
    "text/markdown",
    "application/json",
    "text/csv"
  ];

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (supportedTextTypes.includes(file.type) || ["txt", "md", "json", "csv"].includes(extension)) {
    return await file.text();
  }

  return [
    `${file.name} was uploaded and indexed as demo metadata.`,
    "For real PDF, DOCX, PPTX, and XLSX text extraction, connect the frontend upload endpoint to the FastAPI backend.",
    "The backend should parse files, chunk text, create embeddings, and store vectors in Pinecone."
  ].join(" ");
}

export const mockApi = {
  async login({ email, password }) {
    await sleep(450);

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    return {
      id: "user_demo",
      name: email.includes("@") ? email.split("@")[0].replace(/[._-]/g, " ") : "Alex Parker",
      displayName: "Alex Parker",
      email,
      plan: "Enterprise Plan",
      role: "Admin"
    };
  },

  async getDocuments() {
    await sleep(250);
    return getDocumentsSync();
  },

  async uploadDocuments(files) {
    await sleep(300);

    const current = getDocumentsSync();
    const uploaded = [];

    for (const file of files) {
      const content = await readFileContent(file);
      uploaded.push({
        id: makeId("doc"),
        type: fileTypeFromName(file.name),
        name: file.name,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        }),
        size: file.size,
        active: false,
        status: "Indexed",
        content,
        summary: content.slice(0, 180),
        chunks: chunkText(content),
        uploadedBy: "Current User"
      });
    }

    const next = [...uploaded, ...current];
    saveDocuments(next);
    return uploaded;
  },

  async deleteDocument(documentId) {
    await sleep(200);
    const next = getDocumentsSync().filter((doc) => doc.id !== documentId);
    saveDocuments(next);
    return { ok: true };
  },

  async getSessions() {
    await sleep(200);
    return getSessionsSync().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async createSession(title = "New Chat") {
    await sleep(200);

    const session = {
      id: makeId("session"),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const sessions = [session, ...getSessionsSync()];
    saveSessions(sessions);

    const messages = getMessagesMapSync();
    messages[session.id] = [];
    saveMessagesMap(messages);

    return session;
  },

  async deleteSession(sessionId) {
    await sleep(200);

    saveSessions(getSessionsSync().filter((session) => session.id !== sessionId));

    const messages = getMessagesMapSync();
    delete messages[sessionId];
    saveMessagesMap(messages);

    return { ok: true };
  },

  async getMessages(sessionId) {
    await sleep(200);
    const messages = getMessagesMapSync();
    return messages[sessionId] || [];
  },

  async sendMessage({ sessionId, content }) {
    await sleep(450);

    const sessions = getSessionsSync();
    const messages = getMessagesMapSync();
    const docs = getDocumentsSync();

    const userMessage = {
      id: makeId("msg"),
      role: "user",
      content,
      createdAt: new Date().toISOString()
    };

    const crag = generateCragResponse(content, docs);

    const assistantMessage = {
      id: makeId("msg"),
      role: "assistant",
      content: crag.answer,
      confidence: crag.confidence,
      sources: crag.sources,
      pipeline: crag.pipeline,
      usedFallback: crag.usedFallback,
      createdAt: new Date().toISOString()
    };

    messages[sessionId] = [...(messages[sessionId] || []), userMessage, assistantMessage];
    saveMessagesMap(messages);

    const nextSessions = sessions.map((session) => {
      if (session.id !== sessionId) return session;

      const shouldRename =
        session.title === "New Chat" || session.title === "Untitled Chat";

      return {
        ...session,
        title: shouldRename ? content.slice(0, 42) : session.title,
        updatedAt: new Date().toISOString()
      };
    });

    saveSessions(nextSessions);

    return {
      userMessage,
      assistantMessage
    };
  },

  async submitFeedback({ messageId, rating }) {
    await sleep(150);
    const key = "iqcrag.mock.feedback";
    const feedback = readJson(key, []);
    feedback.push({
      id: makeId("feedback"),
      messageId,
      rating,
      createdAt: new Date().toISOString()
    });
    writeJson(key, feedback);
    return { ok: true };
  }
};
