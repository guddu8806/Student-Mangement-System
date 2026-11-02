import { Link } from "react-router-dom";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-1 items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/20" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-900/20" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg text-center">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-200/60 bg-white shadow-xl shadow-violet-500/10 dark:border-violet-500/20 dark:bg-slate-900">
          <AlertCircle
            size={38}
            strokeWidth={1.7}
            className="text-violet-600 dark:text-violet-400"
          />
        </div>

        {/* Error Code */}
        <h1 className="mt-7 bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-8xl font-black tracking-tight text-transparent sm:text-9xl">
          404
        </h1>

        {/* Text */}
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Oops! Page not found
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
          Looks like this page has gone missing. The link may be broken,
          or the page might have been moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-violet-600/30 sm:w-auto"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        {/* Footer Label */}
        <p className="mt-12 text-xs font-medium tracking-widest text-slate-400 dark:text-slate-600">
          EDUCORE <span className="mx-1">·</span> STUDENT MANAGEMENT SYSTEM
        </p>
      </div>
    </div>
  );
}

export default NotFound;