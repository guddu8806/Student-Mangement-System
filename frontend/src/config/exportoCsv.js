const exportToCsv = (data, filename = "report.csv", columns = null) => {
  if (!data || data.length === 0) {
    return;
  }
  const cols = Array.isArray(columns) && columns.length > 0  ? columns : Object.keys(data[0]).map((key) => ({ key, label: key }));
  const headers = cols
    .map((col) => `"${String(col.label || col.key).replace(/"/g, '""')}"`)
    .join(",");

  const csvRows = data.map((item) =>
    cols
      .map((col) => {
        let value = item[col.key];
        if (value === null || value === undefined) return '""';
        if (value instanceof Date) {
          value = value.toISOString().split("T")[0];
        } else if (
          typeof value === "string" &&
          !isNaN(Date.parse(value)) &&
          value.includes("T")
        ) {
          value = new Date(value).toLocaleDateString();
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csvContent = "\uFEFF" + [headers, ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default exportToCsv;
