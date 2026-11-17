import apiClient from "./apiClient";

function unwrap(response) {
    return response.data.data;
}

export const getReportAnalytics = async () => {
    const resp = await apiClient.get("/reports/analytics");
    return unwrap(resp);
};

export const getReportRoster = async (params = {}) => {
    const resp = await apiClient.get("/reports/roster", { params });
    return unwrap(resp);
};

export const downloadReportCsvDirect = async (params = {}) => {
    const resp = await apiClient.get("/reports/export/csv", {
        params,
        responseType: "blob",
    });
    const blob = new Blob([resp.data], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `enrollment_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
