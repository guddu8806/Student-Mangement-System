import { BookOpen, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import educoreHero from "../assets/educore-hero.png";

const stats = [
  {
    label: "Students",
    value: "2,500+",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/20",
  },
  {
    label: "Courses",
    value: "120+",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-500/20",
  },
  {
    label: "Enrollments",
    value: "98%",
    icon: GraduationCap,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-500/20",
  },
  {
    label: "Pass Rate",
    value: "95%",
    icon: GraduationCap,
    color: "text-fuchsia-600 dark:text-fuchsia-400",
    bg: "bg-fuchsia-100 dark:bg-fuchsia-500/20",
  },
];

const steps = [
  { number: "01", title: "Register Students", description: "Easily add and manage student records with a user-friendly interface." },
  { number: "02", title: "Create Courses", description: "Define and organize courses, including details like syllabus and schedule." },
  { number: "03", title: "Manage Enrollments", description: "Enroll students in courses, track progress, and manage course registrations." },
  { number: "04", title: "Dashboard ", description: "Get a comprehensive overview of your student management system." },
  { number: "05", title: "Reports & Analytics", description: "Generate reports and analyze data to make informed decisions." },
  { number: "06", title: "Manage Courses", description: "Create and manage courses, including details like syllabus and schedule." },

]

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-800 dark:text-slate-200 pb-5">
      <section
        className="relative isolate flex items-center overflow-hidden bg-center bg-cover bg-no-repeat px-4 py-16 sm:py-24"
        style={{
          backgroundImage: `url(${educoreHero})`,
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="absolute inset-0 -z-10 bg-white/10 dark:bg-slate-950/70" />

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-12 text-center md:flex-row md:text-left">
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              Welcome to{" "}
              <span className="text-violet-600 dark:text-violet-400">EduCore</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
              Your comprehensive Student Management System for efficient academic
              administration.
            </p>

            <Link
              to="/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500"
            >
              Explore Dashboard
            </Link>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:w-1/2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-white/60 bg-white/85 p-5 shadow-lg backdrop-blur-md transition hover:-translate-y-1 hover:border-violet-200 dark:border-white/10 dark:bg-slate-800/90 dark:hover:border-violet-500/30"
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon size={30} className={stat.color} />
                </div>

                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section claseName="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <h2 className="mt-8 text-3xl font-extrabold md:text-4xl dark:text-amber-100 text-purple-900">
              How EduCore Works
            </h2>

            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Manage your academic activities in three simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 p-8 dark:border-slate-800"
              >
                <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;
