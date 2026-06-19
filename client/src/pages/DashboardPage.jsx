import ChatPanel from "../components/chat/ChatPanel.jsx";
import SessionList from "../components/chat/SessionList.jsx";
import DocumentLibrary from "../components/documents/DocumentLibrary.jsx";
import MobileDocumentDrawer from "../components/layout/MobileDocumentDrawer.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import RetrievalPanel from "../components/pipeline/RetrievalPanel.jsx";
import SourcePanel from "../components/sources/SourcePanel.jsx";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <MobileDocumentDrawer />

      <main className="mx-auto grid max-w-[1800px] grid-cols-1 gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[320px_minmax(0,1fr)_340px] xl:grid-cols-[420px_minmax(0,1fr)_420px]">
        <aside className="hidden space-y-4 lg:block">
          <DocumentLibrary />
          <SessionList />
        </aside>

        <section>
          <ChatPanel />
        </section>

        <aside className="grid gap-4">
          <SourcePanel />
        </aside>

        <section className="lg:hidden">
          <SessionList />
        </section>
      </main>
    </div>
  );
}
