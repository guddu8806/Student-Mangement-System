import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/queries/useAuth";

function Signup() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loading = registerMutation.isPending;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerMutation.mutateAsync(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to register.");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Join EduCore Student Management System
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              I am registering as:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect("student")}
                className={`cursor-pointer rounded-lg border py-2 px-3 text-xs font-semibold transition ${
                  formData.role === "student"
                    ? "border-violet-600 bg-violet-50 text-violet-700 shadow-xs dark:border-violet-500 dark:bg-violet-950/40 dark:text-violet-300"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                className={`cursor-pointer rounded-lg border py-2 px-3 text-xs font-semibold transition ${
                  formData.role === "admin"
                    ? "border-violet-600 bg-violet-50 text-violet-700 shadow-xs dark:border-violet-500 dark:bg-violet-950/40 dark:text-violet-300"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:text-white"
            />
          </div>
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
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Phone Number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 12345 45678"
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
                className="cursor-pointer text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              required
              minLength={6}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="•••••••• (min 6 characters)"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer flex w-full items-center justify-center rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="cursor-pointer font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;
