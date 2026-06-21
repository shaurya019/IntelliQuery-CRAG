import { ExternalLink, FileText, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useDocument } from "../hooks/useDocuments.js";

function formatTimestamp(value) {
  if (!value) return "Recently added";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function DocumentPreviewPage() {
  const { documentId } = useParams();
  const { data: document, isLoading, error } = useDocument(documentId);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
        <header className="border-b border-slate-100 bg-gradient-to-r from-cyan-50 via-white to-blue-50 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                <Sparkles size={22} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Document Viewer
              </p>
              <h1 className="mt-2 truncate text-2xl font-extrabold text-slate-950 sm:text-3xl">
                {document?.name || "Loading document"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Opened from your document library in a dedicated tab.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/"
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Back to workspace
              </Link>

              {document?.previewUrl ? (
                <a
                  href={document.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Open file
                  <ExternalLink size={16} />
                </a>
              ) : null}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="p-6 sm:p-8">
            <EmptyState
              title="Unable to load document"
              description={error.message || "The document details could not be loaded."}
            />
          </div>
        ) : document ? (
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm">
                  <FileText size={24} />
                </div>
                <dl className="space-y-3 text-sm">
                  <Meta label="Type" value={document.type || "DOC"} />
                  <Meta label="Status" value={document.status || "Processing"} />
                  <Meta label="Uploaded" value={formatTimestamp(document.createdAt)} />
                  <Meta
                    label="Size"
                    value={document.size ? `${Math.round(document.size / 1024)} KB` : "Unknown"}
                  />
                </dl>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-extrabold text-slate-900">Summary</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {document.summary || "No summary is available yet for this document."}
                </p>
              </div>
            </aside>

            <section className="rounded-3xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-extrabold text-slate-900">Preview</h2>

              {document.previewUrl ? (
                <iframe
                  title={document.name}
                  src={document.previewUrl}
                  className="mt-4 min-h-[70vh] w-full rounded-2xl border border-slate-200"
                />
              ) : document.content ? (
                <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {document.content}
                </pre>
              ) : (
                <EmptyState
                  title="Preview not available"
                  description="This document does not expose a preview URL or text content yet."
                />
              )}
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
