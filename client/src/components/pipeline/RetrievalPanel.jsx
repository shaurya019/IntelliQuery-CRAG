import { MessageSquare, Search, ShieldCheck, Wand2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectActiveSessionId } from "../../features/chat/chatSlice.js";
import { useMessages } from "../../hooks/useMessages.js";

const icons = [Search, ShieldCheck, Wand2, MessageSquare];

const defaultSteps = [
  { title: "Retrieve", subtitle: "Top-K Documents", value: "-", status: "idle" },
  { title: "Verify", subtitle: "Relevance Check", value: "-", status: "idle" },
  { title: "Correct", subtitle: "Fact Check & Correction", value: "-", status: "idle" },
  { title: "Answer", subtitle: "Generate Response", value: "-", status: "idle" }
];

export default function RetrievalPanel() {
  const activeSessionId = useSelector(selectActiveSessionId);
  const { data: messages = [] } = useMessages(activeSessionId);

  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  const steps = lastAssistant?.pipeline?.length ? lastAssistant.pipeline : defaultSteps;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-soft lg:sticky lg:top-20">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Retrieval Pipeline
        </h2>
        <button className="text-xs font-extrabold text-blue-500">View Details</button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = icons[index] || Search;

          return (
            <div key={`${step.title}_${index}`} className="relative flex items-center gap-3">
              {index !== steps.length - 1 ? (
                <div className="absolute left-5 top-11 h-5 w-px bg-slate-200" />
              ) : null}

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  step.status === "warning"
                    ? "bg-amber-50 text-amber-500"
                    : step.status === "idle"
                    ? "bg-slate-100 text-slate-400"
                    : "bg-blue-50 text-blue-500"
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-900">{step.title}</p>
                <p className="text-xs text-slate-500">{step.subtitle}</p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
                  step.status === "warning"
                    ? "bg-amber-50 text-amber-600"
                    : step.status === "idle"
                    ? "bg-slate-100 text-slate-500"
                    : index === 0
                    ? "bg-blue-50 text-blue-500"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {step.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
