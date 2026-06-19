import {
  Bot,
  Copy,
  FileSymlink,
  Mic,
  Paperclip,
  Send,
  Settings2,
  ThumbsDown,
  ThumbsUp,
  MessageSquare,
  Plus
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearInputDraft,
  selectActiveSessionId,
  selectInputDraft,
  setActiveSessionId,
  setInputDraft
} from "../../features/chat/chatSlice.js";
import { useCreateSession, useSessions } from "../../hooks/useSessions.js";
import { useMessages, useSendMessage, useSubmitFeedback } from "../../hooks/useMessages.js";
import Spinner from "../ui/Spinner.jsx";
import EmptyState from "../ui/EmptyState.jsx";

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function MarkdownLite({ content }) {
  const html = content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");

  return (
    <div
      className="prose prose-sm max-w-none leading-7 text-slate-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function ChatPanel() {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  const activeSessionId = useSelector(selectActiveSessionId);
  const draft = useSelector(selectInputDraft);

  const { data: sessions = [] } = useSessions();
  const createSession = useCreateSession();
  const { data: messages = [], isLoading } = useMessages(activeSessionId);
  const sendMessage = useSendMessage();
  const feedback = useSubmitFeedback();

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [sessions, activeSessionId]
  );

  useEffect(() => {
    if (!sessions.length) return;

    const activeSessionExists = sessions.some((session) => session.id === activeSessionId);

    if (!activeSessionId || !activeSessionExists) {
      dispatch(setActiveSessionId(sessions[0].id));
    }
  }, [activeSessionId, sessions, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sendMessage.isPending]);

  async function handleNewChat() {
    await createSession.mutateAsync("New Chat");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const value = draft.trim();
    if (!value || sendMessage.isPending) return;

    let sessionId = activeSessionId;

    if (!sessionId) {
      const session = await createSession.mutateAsync("New Chat");
      sessionId = session.id;
    }

    dispatch(clearInputDraft());
    await sendMessage.mutateAsync({ sessionId, content: value });
  }

  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col rounded-[1.5rem] border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
            <MessageSquare size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-extrabold text-slate-950">
              {activeSession?.title || "IntelliQuery Chat"}
            </h2>
            <p className="truncate text-xs text-slate-500">
              Your AI assistant for private documents
            </p>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
        >
          {createSession.isPending ? <Spinner className="h-4 w-4" /> : <Plus size={16} />}
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-auto p-4 sm:p-5">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : messages.length ? (
          messages.map((message) =>
            message.role === "user" ? (
              <UserMessage key={message.id} message={message} />
            ) : (
              <AssistantMessage
                key={message.id}
                message={message}
                onFeedback={(rating) => feedback.mutate({ messageId: message.id, rating })}
              />
            )
          )
        ) : (
          <EmptyState
            title="Start asking questions from your documents"
            description="Upload documents, then ask questions. The CRAG flow will retrieve, verify, correct, and answer with source citations."
          />
        )}

        {sendMessage.isPending ? (
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <Spinner />
              IntelliQuery CRAG is retrieving, verifying, and generating...
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 p-4">
        <div className="rounded-2xl bg-blue-50 p-3">
          <textarea
            rows={2}
            value={draft}
            onChange={(event) => dispatch(setInputDraft(event.target.value))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-500"
            placeholder="Ask anything about your documents..."
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500">
              <button type="button" className="hover:text-slate-900">
                <Paperclip size={17} />
              </button>
              <button type="button" className="hover:text-slate-900">
                <FileSymlink size={17} />
              </button>
              <button type="button" className="hover:text-slate-900">
                <Settings2 size={17} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="hidden text-slate-500 hover:text-slate-900 sm:block">
                <Mic size={18} />
              </button>
              <button
                disabled={sendMessage.isPending || !draft.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-lg shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={19} />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-slate-500">
          IntelliQuery CRAG can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="rounded-2xl bg-blue-50 p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        <span className="font-bold text-slate-700">AP</span>
        <span className="font-bold text-slate-900">You</span>
        <span>·</span>
        <span>{formatTime(message.createdAt)}</span>
      </div>
      <p className="text-sm font-bold leading-7 text-slate-900 sm:text-base">
        {message.content}
      </p>
    </div>
  );
}

function AssistantMessage({ message, onFeedback }) {
  return (
    <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white">
          <Bot size={15} />
        </div>
        <span className="text-sm font-extrabold text-slate-900">IntelliQuery CRAG</span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-extrabold text-blue-500">AI</span>
        <span className="text-xs text-slate-500">· {formatTime(message.createdAt)}</span>
        {message.usedFallback ? (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600">
            Fallback suggested
          </span>
        ) : null}
      </div>

      <MarkdownLite content={message.content} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-slate-500">
          <button type="button" className="hover:text-slate-900" title="Copy">
            <Copy size={18} />
          </button>
          <button type="button" className="hover:text-slate-900" title="Helpful" onClick={() => onFeedback("positive")}>
            <ThumbsUp size={18} />
          </button>
          <button type="button" className="hover:text-slate-900" title="Not helpful" onClick={() => onFeedback("negative")}>
            <ThumbsDown size={18} />
          </button>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold ${
            message.confidence >= 70
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          ● Confidence {message.confidence || 0}%
        </span>
      </div>
    </article>
  );
}
