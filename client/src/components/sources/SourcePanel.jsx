import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { selectActiveSessionId } from "../../features/chat/chatSlice.js";
import { useMessages } from "../../hooks/useMessages.js";
import EmptyState from "../ui/EmptyState.jsx";

function highlightSnippet(snippet = "", highlight = "") {
  if (!highlight) return snippet;
  const index = snippet.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return snippet;

  const before = snippet.slice(0, index);
  const match = snippet.slice(index, index + highlight.length);
  const after = snippet.slice(index + highlight.length);

  return (
    <>
      {before}
      <mark className="rounded bg-blue-50 px-1 font-semibold text-slate-700">{match}</mark>
      {after}
    </>
  );
}

export default function SourcePanel() {
  const activeSessionId = useSelector(selectActiveSessionId);
  const { data: messages = [] } = useMessages(activeSessionId);

  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  const sources = lastAssistant?.sources || [];

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Source Documents
        </h2>
        <button className="text-xs font-extrabold text-blue-500">Snippets on</button>
      </div>

      {!sources.length ? (
        <EmptyState
          title="No sources yet"
          description="Ask a question to see retrieved documents, snippets, relevance scores, and citations."
        />
      ) : (
        <>
          <div className="space-y-3">
            {sources.map((source) => (
              <article
                key={`${source.title}_${source.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-3"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[10px] font-extrabold text-red-500">
                    {source.type || "DOC"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-extrabold text-slate-500">
                        {source.id}
                      </span>
                      <h3 className="truncate text-sm font-extrabold text-slate-900">
                        {source.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500">
                      Relevance:{" "}
                      <span className="font-extrabold text-emerald-600">{source.relevance}</span>
                      {" "}· Used in {source.usedIn}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-slate-500">{source.page}</span>
                </div>

                <p className="text-xs leading-5 text-slate-600">
                  ...{highlightSnippet(source.snippet, source.highlight)}
                </p>
              </article>
            ))}
          </div>

          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-blue-500 hover:bg-blue-50">
            View All Retrieved Documents
            <ArrowRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}
