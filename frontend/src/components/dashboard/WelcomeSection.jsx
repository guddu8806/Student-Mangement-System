
const WelcomeSection = ({ user, action }) => {
  const isAdmin = user?.role === "admin";

  return (
    <section className="rounded-2xl border mb-2 border-violet-100 bg-linear-to-r from-violet-50 to-indigo-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-violet-600 dark:text-violet-400">
            Welcome Back to {isAdmin
              ? "Admin Dashboard"
              : "Student Dashboard"}
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Hello, {user?.name || "there"}!
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {isAdmin
              ? "Manage your students, courses, and enrollments from your dashboard."
              : "Track your courses, monitor your enrollments, and stay on top of your learning journey."}
          </p>
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </section>
  );
};

export default WelcomeSection;
