import { BookOpen, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import educoreHero from "../assets/educore-hero.png";

const stats = [
  {
    label: "Students",
    value: "2,500+",
    icon: Users,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-500/20",
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
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-500/20",
  },
  {
    label: "Pass Rate",
    value: "95%",
    icon: GraduationCap,
    color: "text-fuchsia-600 dark:text-fuchsia-400",
    bg: "bg-fuchsia-100 dark:bg-fuchsia-500/20",
  },
];

const portalFeatures = [
  {
    tag: "STUDENT DIRECTORY",
    title: "Centralized Student Information System",
    description:
      "EduCore serves as a single source of truth for all student records. It stores and organizes personal profiles, verified contact details, email addresses, and phone numbers in a secure relational database, allowing administrators to search, update, and manage records without data duplication or manual spreadsheets.",
  },
  {
    tag: "COURSE CATALOG",
    title: "Curriculum & Syllabus Organization",
    description:
      "Design, update, and publish the complete institutional academic catalog. Each course profile maintains standard course codes (such as CS101 or ENG201), credit hour allocations, and detailed course descriptions to provide students and faculty with crystal-clear academic expectations.",
  },
  {
    tag: "REGISTRATION ENGINE",
    title: "Smart Enrollment Management",
    description:
      "Handle course admissions and class registrations with automated validation. EduCore prevents accidental duplicate enrollments for the same student-course pair, logs official enrollment dates, and enables swift enrollment management with built-in audit safety.",
  },
  {
    tag: "ANALYTICS & INSIGHTS",
    title: "Executive Administrative Dashboard",
    description:
      "Gain immediate visibility into institutional health through live metrics. The executive dashboard aggregates total student headcounts, course enrollment distributions, recent admissions, and class size comparisons to support data-driven academic planning.",
  },
  {
    tag: "DATA ARCHITECTURE",
    title: "Relational Database Reliability",
    description:
      "Powered by PostgreSQL and an Express API architecture, every record adheres to strict relational integrity rules. Foreign key relationships between students, courses, and enrollments ensure that no orphan records or inconsistent states can occur.",
  },
  {
    tag: "USER EXPERIENCE",
    title: "Responsive & Intuitive Interface",
    description:
      "A fast, responsive single-page portal built with modern web standards. Faculty and staff can navigate seamlessly across mobile, tablet, and desktop viewports, with instant multi-field searching, real-time feedback, and built-in light and dark modes.",
  },
];

const steps = [
  {
    number: "01",
    title: "Student Onboarding",
    description:
      "Enter new or returning student credentials through the student management portal. Records are validated instantly and stored in the primary student registry.",
  },
  {
    number: "02",
    title: "Curriculum Setup",
    description:
      "Define departmental courses with their unique course codes, descriptive syllabi, and credit weightages ready for the academic term.",
  },
  {
    number: "03",
    title: "Course Enrollment",
    description:
      "Pair students with their selected courses in a single click. The system verifies enrollment eligibility and timestamped registration records.",
  },
  {
    number: "04",
    title: "Institutional Monitoring",
    description:
      "Review real-time enrollment distributions, track student growth trends, and evaluate departmental demand directly from the central dashboard.",
  },
];

const highlights = [
  "Comprehensive centralized management of student rosters and contact directories",
  "Standardized course catalog management with course codes, descriptions, and credit ratings",
  "Automated validation system preventing duplicate student-course enrollment entries",
  "Live statistical dashboard displaying student headcount, course volumes, and charts",
  "High-performance PostgreSQL relational database with foreign-key referential safety",
  "Accessible single-page application with responsive dark and light display modes",
];

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <section
        className="relative isolate flex items-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-16 sm:py-24"
        style={{
          backgroundImage: `url(${educoreHero})`,
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="absolute inset-0 -z-10 bg-white/20  dark:bg-slate-950/75" />

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-12 text-center md:flex-row md:text-left">
          <div className="md:w-1/2">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              Welcome to{" "}
              <span className="text-violet-600 dark:text-violet-400">EduCore</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg">
              EduCore is an integrated web portal designed to coordinate modern
              educational administration. It unites student registration,
              academic curriculum structuring, course enrollment handling, and
              live analytics into one organized, secure workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <Link
                to="/signup"
                className="inline-flex items-center rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500"
              >
                Get Started
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs backdrop-blur-sm transition hover:bg-slate-100 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-violet-400"
              >
                View Courses
              </Link>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:w-1/2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-white/60 bg-white/85 p-5 shadow-lg backdrop-blur-md transition hover:-translate-y-1 hover:border-violet-200 dark:border-white/10 dark:bg-slate-900/90 dark:hover:border-violet-500/30"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                >
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            About The Portal
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            A Complete Hub for Academic Management
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Managing an academic institution involves coordinating thousands of data points
            daily. EduCore consolidates student records, course catalogs, and class
            registrations into a unified interface, eliminating data silos and administrative delays.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portalFeatures.map((feat) => (
            <div
              key={feat.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/40"
            >
              <span className="inline-block rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-bold tracking-wide text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                {feat.tag}
              </span>

              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feat.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-100/60 py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Operational Highlights
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Built to Support Faculty, Staff, and Administrators
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                From admissions to curriculum planning, educational administrators require a
                dependable system that maintains accuracy. EduCore automates manual
                verification steps, provides direct relational linking between students and
                courses, and ensures high availability for everyday institutional operations.
              </p>

              <div className="mt-6 space-y-3">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-600 dark:bg-violet-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                  PostgreSQL Relational DB
                </span>
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                  RESTful API Architecture
                </span>
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                  Instant Search & Filtering
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Core System Modules
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                The four primary functional pillars of the EduCore portal:
              </p>

              <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      1. Student Registry
                    </span>
                    <span className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                      Admissions
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Register, edit, search, and view individual student profiles with validated emails and phone numbers.
                  </p>
                </div>

                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      2. Course Curriculum
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      Curriculum
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Define course catalog records with assigned course codes (e.g. CS101), academic credits, and course descriptions.
                  </p>
                </div>

                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      3. Enrollment Management
                    </span>
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                      Registrations
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Enroll students into available courses with automatic duplicate detection and date tracking.
                  </p>
                </div>

                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      4. Reports & Dashboard
                    </span>
                    <span className="rounded-md bg-fuchsia-50 px-2 py-0.5 text-xs font-semibold text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300">
                      Analytics
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    View real-time metric counters, course enrollment distribution charts, and recent activity logs.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link
                  to="/enrollments"
                  className="flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Manage Current Enrollments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            Step-by-Step Workflow
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
            How EduCore Works
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            A clear four-stage process that organizes daily academic administration.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/40"
            >
              <div>
                <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-linear-to-r from-violet-600 to-indigo-700 p-8 text-center text-white shadow-xl sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Ready to streamline your academic administration?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-violet-100 sm:text-base">
            Access student profiles, course offerings, and enrollment records directly
            through the EduCore portal.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-md transition hover:bg-violet-50"
            >
              Get Started
            </Link>
            <Link
              to="/courses"
              className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
