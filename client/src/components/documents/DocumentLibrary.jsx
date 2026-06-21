import { FileText, Filter, FolderOpen, Plus, UploadCloud } from "lucide-react";
import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markDocumentOpened,
  selectDocumentSearch,
  selectDocumentStatusFilter,
  setDocumentSearch,
  setDocumentStatusFilter
} from "../../features/documents/documentsSlice.js";
import { useDocuments, useUploadDocuments } from "../../hooks/useDocuments.js";
import Spinner from "../ui/Spinner.jsx";

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentLibrary() {
  const dispatch = useDispatch();
  const search = useSelector(selectDocumentSearch);
  const statusFilter = useSelector(selectDocumentStatusFilter);
  const fileInputRef = useRef(null);

  const { data: documents = [], isLoading } = useDocuments();
  const uploadMutation = useUploadDocuments();

  const filteredDocuments = useMemo(() => {
    const value = search.trim().toLowerCase();

    return documents.filter((doc) => {
      const matchesSearch = !value || doc.name.toLowerCase().includes(value);
      const matchesStatus =
        statusFilter === "all" || doc.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [documents, search, statusFilter]);

  const categories = useMemo(() => {
    const countByType = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {});

    return [
      { label: "All Documents", count: documents.length },
      { label: "PDF Documents", count: countByType.PDF || 0 },
      { label: "Contracts", count: documents.filter((doc) => /contract|agreement|nda/i.test(doc.name)).length },
      { label: "Research Papers", count: documents.filter((doc) => /research|survey/i.test(doc.name)).length },
      { label: "Reports", count: documents.filter((doc) => /report|analysis/i.test(doc.name)).length },
      { label: "Slides", count: countByType.PPTX || countByType.PPT || 0 }
    ];
  }, [documents]);

  async function handleFileChange(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    await uploadMutation.mutateAsync(files);
    event.target.value = "";
  }

  function handleOpenDocument(documentId) {
    dispatch(markDocumentOpened(documentId));
    window.open(`/documents/${documentId}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Document Library
        </h2>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-xl text-blue-500 hover:bg-blue-50"
          onClick={() => fileInputRef.current?.click()}
          title="Upload documents"
        >
          <Plus size={18} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".txt,.md,.json,.csv,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-100"
      >
        {uploadMutation.isPending ? <Spinner className="h-4 w-4" /> : <UploadCloud size={17} />}
        Upload Documents
      </button>

      <div className="mb-3 flex gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2.5">
          <input
            value={search}
            onChange={(event) => dispatch(setDocumentSearch(event.target.value))}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            placeholder="Search documents..."
          />
        </div>
        <button
          className={`flex h-11 items-center justify-center rounded-2xl border px-3 text-sm font-semibold ${
            statusFilter === "indexed"
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
          onClick={() =>
            dispatch(setDocumentStatusFilter(statusFilter === "indexed" ? "all" : "indexed"))
          }
        >
          <Filter size={17} />
          <span className="ml-2 hidden sm:inline">Indexed</span>
        </button>
      </div>

      <div className="space-y-1">
        {categories.map((item, index) => (
          <button
            key={item.label}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
              index === 0
                ? "bg-blue-50 font-bold text-slate-950"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <FolderOpen size={16} className={index === 0 ? "text-blue-500" : "text-slate-400"} />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="text-xs font-bold text-slate-700">{item.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Documents
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="max-h-[420px] space-y-2 overflow-auto pr-1 no-scrollbar">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                  doc.active
                    ? "border-blue-200 bg-blue-50"
                    : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <button
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  onClick={() => handleOpenDocument(doc.id)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[10px] font-extrabold text-red-500">
                    {doc.type || <FileText size={14} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-slate-900">{doc.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {doc.date} · {formatBytes(doc.size)} · {doc.status}
                    </p>
                  </div>
                </button>
              </div>
            ))}

            {!filteredDocuments.length ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                No documents found.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
