import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/queries/useAuth";

function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loading = loginMutation.isPending;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to sign in.");
    }
  };
  // useEffect(() => {
  //   handleSubmit();
  // }, [])
  

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your EduCore portal
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Password <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
          >
            Sign up now
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
