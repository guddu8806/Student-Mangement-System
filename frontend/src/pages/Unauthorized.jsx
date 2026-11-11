
import { Link, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-lg text-center">

        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-violet-600 dark:text-violet-400 sm:text-6xl">
            403
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Access Denied
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Sorry, you don't have permission to access this page.
          Please contact your administrator if you believe this is a mistake.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Go to Dashboard
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>

        <p className="mt-10 text-xs font-medium tracking-wide text-slate-400">
          EDUCORE · STUDENT MANAGEMENT SYSTEM
        </p>

      </div>
    </div>
  );
};

export default Unauthorized;
