import { MessageCircle, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveSessionId, setActiveSessionId } from "../../features/chat/chatSlice.js";
import { useCreateSession, useSessions } from "../../hooks/useSessions.js";
import Spinner from "../ui/Spinner.jsx";

export default function SessionList() {
  const dispatch = useDispatch();
  const activeSessionId = useSelector(selectActiveSessionId);

  const { data: sessions = [], isLoading } = useSessions();
  const createSession = useCreateSession();

  async function handleNewChat() {
    await createSession.mutateAsync("New Chat");
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Chats
        </h2>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100"
          onClick={handleNewChat}
          title="New chat"
        >
          {createSession.isPending ? <Spinner className="h-4 w-4" /> : <Plus size={17} />}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-5">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 ${
                activeSessionId === session.id
                  ? "border-blue-200 bg-blue-50"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <button
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                onClick={() => dispatch(setActiveSessionId(session.id))}
              >
                <MessageCircle size={16} className="shrink-0 text-blue-500" />
                <span className="truncate text-sm font-bold text-slate-800">
                  {session.title}
                </span>
              </button>
            </div>
          ))}

          {!sessions.length ? (
            <button
              onClick={handleNewChat}
              className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500"
            >
              Create your first chat
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
