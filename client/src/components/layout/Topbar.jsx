import { Bell, CircleHelp, LogOut, Menu, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice.js";
import { openMobileLibrary } from "../../features/ui/uiSlice.js";
import { useLogout } from "../../hooks/useAuthMutations.js";

export default function Topbar() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const logout = useLogout();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 lg:hidden"
            onClick={() => dispatch(openMobileLibrary())}
          >
            <Menu size={19} />
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <Sparkles size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold text-slate-950 sm:text-lg">
              IntelliQuery <span className="text-violet-500">CRAG</span>
            </h1>
            <p className="hidden truncate text-xs font-medium text-slate-500 sm:block">
              Corrective RAG for Private Docs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm sm:px-4">
            <span className="hidden max-w-[140px] truncate text-sm font-bold text-slate-800 sm:inline">
              {user?.displayName || user?.name || "Alex Parker"}
            </span>
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
