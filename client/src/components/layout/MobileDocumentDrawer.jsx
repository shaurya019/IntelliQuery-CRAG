import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeMobileLibrary, selectIsMobileLibraryOpen } from "../../features/ui/uiSlice.js";
import DocumentLibrary from "../documents/DocumentLibrary.jsx";

export default function MobileDocumentDrawer() {
  const isOpen = useSelector(selectIsMobileLibraryOpen);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        className="absolute inset-0 bg-slate-900/30"
        onClick={() => dispatch(closeMobileLibrary())}
        aria-label="Close drawer overlay"
      />

      <aside className="absolute inset-y-0 left-0 w-[88vw] max-w-md overflow-auto bg-white p-4 shadow-2xl">
        <div className="mb-4 flex justify-end">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600"
            onClick={() => dispatch(closeMobileLibrary())}
          >
            <X size={18} />
          </button>
        </div>
        <DocumentLibrary isDrawer />
      </aside>
    </div>
  );
}
