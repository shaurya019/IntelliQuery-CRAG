import { FileQuestion } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm">
        <FileQuestion size={24} />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
