// ======================= src/services/report.js =======================

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

const REPORT_URL = `${BASE_URL}/reports`;

/* =========================================================
   AUTH HEADERS
========================================================= */

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Login required");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

/* =========================================================
   SAFE JSON
========================================================= */

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `API error (${response.status})`
    );
  }

  return data;
}

/* =========================================================
   USER → SEND REPORT
   POST /reports
   multipart/form-data
========================================================= */

export async function sendReport({
  message,
  image = null,
}) {
  try {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("Login required");
    }

    const formData = new FormData();

    formData.append(
      "message",
      String(message || "").trim()
    );

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(REPORT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const text = await response.text();

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Report failed (${response.status})`
      );
    }

    return {
      success: data?.success === true,
      data:
        data?.report ||
        data?.data ||
        null,
      message:
        data?.message ||
        "Report submitted successfully",
    };
  } catch (error) {
    console.error("sendReport error:", error);

    return {
      success: false,
      data: null,
      message:
        error?.message ||
        "Failed to submit report",
    };
  }
}

/* =========================================================
   USER → MY REPORTS

   GET /reports/my
========================================================= */

export async function getMyReports() {
  try {
    const data = await fetchJSON(
      `${REPORT_URL}/my`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const reports =
      data?.reports ||
      data?.data ||
      [];

    return Array.isArray(reports)
      ? reports
      : [];
  } catch (error) {
    console.error("getMyReports error:", error);
    return [];
  }
}

/* =========================================================
   IMAGE VIEW

   Backend proxy:
   GET /reports/image-view/:fileName
========================================================= */

export function getReportImageUrl(fileName) {
  if (!fileName) {
    return "";
  }

  const value = String(fileName).trim();

  if (!value) {
    return "";
  }

  /* Already a complete URL */
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  return `${REPORT_URL}/image-view/${encodeURIComponent(
    value
  )}`;
}

/* =========================================================
   NORMALIZE IMAGE URL

   Supports:
   - image
   - imageUrl
   - imageName
   - fileName
========================================================= */

export function getReportImage(report) {
  if (!report) {
    return "";
  }

  const value =
    report?.image ||
    report?.imageUrl ||
    report?.imageName ||
    report?.fileName ||
    "";

  if (!value) {
    return "";
  }

  const url = String(value).trim();

  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  return getReportImageUrl(url);
}

/* =========================================================
   ADMIN → ALL REPORTS

   GET /reports/admin/all
========================================================= */

export async function getAllReports() {
  try {
    const data = await fetchJSON(
      `${REPORT_URL}/admin/all`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const reports =
      data?.reports ||
      data?.data ||
      [];

    return Array.isArray(reports)
      ? reports
      : [];
  } catch (error) {
    console.error("getAllReports error:", error);
    throw error;
  }
}

/* =========================================================
   ADMIN → UPDATE STATUS

   PUT /reports/admin/:id/status
========================================================= */

export async function updateReportStatus({
  reportId,
  status,
}) {
  if (!reportId) {
    throw new Error("Report ID is required");
  }

  const allowedStatuses = [
    "PENDING",
    "SUCCESS",
  ];

  const normalizedStatus =
    String(status || "")
      .trim()
      .toUpperCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw new Error("Invalid report status");
  }

  try {
    const data = await fetchJSON(
      `${REPORT_URL}/admin/${encodeURIComponent(
        reportId
      )}/status`,
      {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: normalizedStatus,
        }),
      }
    );

    return {
      success: data?.success === true,
      data:
        data?.report ||
        data?.data ||
        null,
      message:
        data?.message ||
        "",
    };
  } catch (error) {
    console.error(
      "updateReportStatus error:",
      error
    );

    return {
      success: false,
      data: null,
      message:
        error?.message ||
        "Status update failed",
    };
  }
}

/* =========================================================
   ADMIN → DELETE REPORT

   DELETE /reports/admin/:id

   Backend should delete:
   1. MongoDB report
   2. Image from storage
========================================================= */

export async function deleteReport(reportId) {
  if (!reportId) {
    throw new Error("Report ID is required");
  }

  try {
    const data = await fetchJSON(
      `${REPORT_URL}/admin/${encodeURIComponent(
        reportId
      )}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    return {
      success: data?.success === true,
      message:
        data?.message ||
        "",
    };
  } catch (error) {
    console.error(
      "deleteReport error:",
      error
    );

    return {
      success: false,
      message:
        error?.message ||
        "Delete failed",
    };
  }
}

/* =========================================================
   HELPERS
========================================================= */

export function getReportId(report) {
  if (!report) {
    return "";
  }

  if (
    typeof report?._id === "object" &&
    report?._id?.$oid
  ) {
    return String(report._id.$oid);
  }

  if (report?._id) {
    return String(report._id);
  }

  if (report?.id) {
    return String(report.id);
  }

  return "";
}

export function getReportStatus(report) {
  return String(
    report?.status || "PENDING"
  ).toUpperCase();
}

export function getReportUserName(report) {
  return (
    report?.user?.name ||
    report?.userName ||
    "Unknown"
  );
}

export function getReportUserPhone(report) {
  return (
    report?.user?.phone ||
    report?.phone ||
    ""
  );
}

export function getReportMessage(report) {
  return String(
    report?.message || ""
  );
}

export default {
  sendReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  deleteReport,
  getReportImageUrl,
  getReportImage,
  getReportId,
  getReportStatus,
  getReportUserName,
  getReportUserPhone,
  getReportMessage,
};