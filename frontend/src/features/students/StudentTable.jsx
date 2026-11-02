import { Users, Pencil, Trash2, Mail, Phone } from "lucide-react";

function StudentTable({ students = [], loading = false, search = "", onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading students...
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-12 text-center">
        <Users size={32} className="mx-auto text-slate-400" />
        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
          {search ? "No matching students found" : "No students in database yet"}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {search ? "Try searching with a different term." : "Click 'Add Student' above to add your first student record."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <th className="px-5 py-3.5">Student</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Phone</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {students.map((student) => {
            const firstName = student.first_name || student.firstName || "";
            const lastName = student.last_name || student.lastName || "";
            const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "ST";

            return (
              <tr key={student.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-xs font-bold text-white shadow-xs">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {firstName} {lastName}
                      </p>
                      {/* <p className="text-xs text-slate-400">ID #{student.id}</p> */}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <Mail size={14} className="text-violet-500" />
                    <span>{student.email || "—"}</span>
                  </span>
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{student.phone || "—"}</span>
                  </span>
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(student)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-300"
                      title="Edit Student"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                      title="Delete Student"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
