import { Pencil, Trash2 } from "lucide-react";

function StudentTable({ students = [], onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          No students registered yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden  border border-slate-200  shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
          <tr>
            <th scope="col" className="px-5 py-3.5">
              Name
            </th>
            <th scope="col" className="px-5 py-3.5">
              Email
            </th>
            <th scope="col" className="px-5 py-3.5">
              Phone
            </th>
            <th scope="col" className="px-5 py-3.5 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {students.map((student) => {
            

            return (
              <tr key={student.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {student.first_name} {student.last_name}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  <span>{student.email || "—"}</span>
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  <span>{student.phone || "—"}</span>
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(student)}
                      className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-300"
                      title="Edit Student"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
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
