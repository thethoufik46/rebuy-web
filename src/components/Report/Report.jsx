// ============================================================
// USER REPORT SCREEN
// C:\flutter_projects\rebuy-web\src\components\Report\Report.jsx
// ============================================================

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiImage,
  FiLoader,
  FiMessageSquare,
  FiRefreshCw,
  FiSend,
  FiUploadCloud,
  FiUser,
  FiX,
  FiZoomIn,
} from "react-icons/fi";

import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";

/* ============================================================
   API BASE URL
============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

/* ============================================================
   TOKEN
============================================================ */

const getToken = () => {
  const keys = [
    "auth_token",
    "token",
    "accessToken",
    "access_token",
  ];

  for (const key of keys) {
    const value = localStorage.getItem(key);

    if (value && value.trim()) {
      return value;
    }
  }

  return "";
};

/* ============================================================
   AUTH HEADERS
============================================================ */

const getAuthHeaders = () => {
  const token = getToken();

  return {
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

/* ============================================================
   API REQUEST
============================================================ */

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed (${response.status})`
    );
  }

  return data;
};

/* ============================================================
   IMAGE URL
============================================================ */

const getImageUrl = (image) => {
  if (!image) return "";

  const value = String(image).trim();

  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  const cleanName = value
    .replace(/^\/+/, "")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${API_BASE_URL}/reports/image-view/${cleanName}`;
};

/* ============================================================
   STATUS
============================================================ */

const normalizeStatus = (status) => {
  return String(status || "PENDING").toUpperCase();
};

const getStatusMeta = (status) => {
  const value = normalizeStatus(status);

  if (value === "SUCCESS") {
    return {
      label: "Resolved",
      icon: <FiCheckCircle />,
      className: "report-status-success",
    };
  }

  if (value === "PENDING") {
    return {
      label: "Pending",
      icon: <FiClock />,
      className: "report-status-pending",
    };
  }

  return {
    label: value,
    icon: <FiClock />,
    className: "report-status-default",
  };
};

/* ============================================================
   MAIN
============================================================ */

export default function Report() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [reports, setReports] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isReportsLoading, setIsReportsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  /* ==========================================================
     LOAD USER REPORTS
  ========================================================== */

  const loadMyReports = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsReportsLoading(true);
        }

        setError("");

        const data = await apiRequest(
          "/reports/my",
          {
            method: "GET",
          }
        );

        const list = Array.isArray(data?.reports)
          ? data.reports
          : [];

        setReports(list);
      } catch (err) {
        console.error(
          "MY REPORTS LOAD ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load your reports."
        );
      } finally {
        setIsReportsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    loadMyReports();
  }, [loadMyReports]);

  /* ==========================================================
     FILE CLEANUP
  ========================================================== */

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /* ==========================================================
     ESCAPE IMAGE MODAL
  ========================================================== */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* ==========================================================
     PICK IMAGE
  ========================================================== */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert(
        "Please select a PNG or JPG image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      window.alert(
        "Image size should be less than 8 MB."
      );

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(url);
  };

  /* ==========================================================
     OPEN PICKER
  ========================================================== */

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  /* ==========================================================
     REMOVE IMAGE
  ========================================================== */

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ==========================================================
     CLEAR FORM
  ========================================================== */

  const clearForm = () => {
    setMessage("");

    removeImage();

    setSuccessMessage("");

    setError("");
  };

  /* ==========================================================
     SEND REPORT
  ========================================================== */

  const sendReport = async () => {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      setError(
        "Please describe your issue before sending."
      );

      return;
    }

    if (cleanMessage.length > 100) {
      setError(
        "Report message should be within 100 characters."
      );

      return;
    }

    try {
      setIsLoading(true);

      setError("");

      setSuccessMessage("");

      const formData = new FormData();

      formData.append(
        "message",
        cleanMessage
      );

      if (selectedFile) {
        formData.append(
          "image",
          selectedFile,
          selectedFile.name || "report.jpg"
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/reports`,
        {
          method: "POST",

          headers: {
            ...getAuthHeaders(),
          },

          body: formData,
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to send report."
        );
      }

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Unable to send report."
        );
      }

      setMessage("");

      removeImage();

      setSuccessMessage(
        "Your report has been submitted successfully."
      );

      await loadMyReports(true);

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 3500);
    } catch (err) {
      console.error(
        "SEND REPORT ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to send report."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================
     DATE
  ========================================================== */

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* ==========================================================
     IMAGE URL
  ========================================================== */

  const getReportImage = (report) => {
    return getImageUrl(report?.image);
  };

  /* ==========================================================
     LOADING SCREEN
  ========================================================== */

  if (isReportsLoading) {
    return (
      <>
        <div className="report-page">
          <div className="report-orb report-orb-one" />

          <div className="report-orb report-orb-two" />

          <div className="report-loading">
            <div className="report-loader">
              <FiLoader />
            </div>

            <p>
              Loading your reports...
            </p>
          </div>
        </div>

        <style>{REPORT_STYLES}</style>
      </>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <div className="report-page">

        {/* BACKGROUND ORBS */}

        <div className="report-orb report-orb-one" />

        <div className="report-orb report-orb-two" />

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="report-header">

          <button
            type="button"
            className="report-back-button"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
          </button>

          <div className="report-title-area">

            <div className="report-title-icon">
              <FiMessageSquare />
            </div>

            <div>
              <h1>
                Report Issue
              </h1>

              <p>
                Tell us about any problem you are facing
              </p>
            </div>

          </div>

          <button
            type="button"
            className={`report-refresh-button ${
              isRefreshing
                ? "report-refreshing"
                : ""
            }`}
            onClick={() =>
              loadMyReports(true)
            }
            disabled={isRefreshing}
            title="Refresh"
          >
            <FiRefreshCw />
          </button>

        </header>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <main className="report-content">

          {/* ==================================================
              SUCCESS
          ================================================== */}

          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                className="report-alert report-success-alert"
              >
                <FiCheckCircle />

                <span>
                  {successMessage}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================================================
              ERROR
          ================================================== */}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                className="report-alert report-error-alert"
              >
                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setError("")
                  }
                >
                  <FiX />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================================================
              GLASS REPORT FORM
          ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="report-glass-card"
          >

            {/* ==================================================
                IMAGE UPLOAD
            ================================================== */}

            <button
              type="button"
              className={`report-upload-area ${
                previewUrl
                  ? "has-preview"
                  : ""
              }`}
              onClick={openFilePicker}
            >

              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Selected screenshot"
                    className="report-preview-image"
                  />

                  <div className="report-preview-overlay">
                    <FiImage />

                    <span>
                      Change Screenshot
                    </span>
                  </div>
                </>
              ) : (
                <div className="report-upload-content">

                  <div className="report-upload-icon">
                    <FiUploadCloud />
                  </div>

                  <h3>
                    Upload Screenshot
                  </h3>

                  <p>
                    Optional • PNG / JPG
                  </p>

                </div>
              )}

            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              hidden
            />

            {/* REMOVE SELECTED IMAGE */}

            {selectedFile && (
              <div className="report-selected-file">

                <div className="report-file-info">

                  <FiImage />

                  <span>
                    {selectedFile.name}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={removeImage}
                >
                  <FiX />
                </button>

              </div>
            )}

            {/* ==================================================
                MESSAGE
            ================================================== */}

            <div className="report-message-field">

              <div className="report-field-label">

                <FiMessageSquare />

                <span>
                  Describe your issue
                </span>

                <small>
                  {message.length}/100
                </small>

              </div>

              <textarea
                value={message}
                onChange={(event) => {
                  const value =
                    event.target.value;

                  if (value.length <= 100) {
                    setMessage(value);
                  }

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Describe your issue clearly..."
                rows={6}
                maxLength={100}
              />

            </div>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="report-form-buttons">

              <button
                type="button"
                className="report-cancel-button"
                onClick={clearForm}
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="report-send-button"
                onClick={sendReport}
                disabled={
                  isLoading ||
                  !message.trim()
                }
              >

                {isLoading ? (
                  <>
                    <FiLoader className="report-spin" />

                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend />

                    Send Report
                  </>
                )}

              </button>

            </div>

          </motion.section>

          {/* ==================================================
              MY REPORTS TITLE
          ================================================== */}

          <div className="my-reports-heading">

            <div>
              <h2>
                My Reports
              </h2>

              <p>
                Track the reports you have submitted
              </p>
            </div>

            <span className="report-count">
              {reports.length}
            </span>

          </div>

          {/* ==================================================
              MY REPORTS
          ================================================== */}

          {reports.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="report-empty-card"
            >

              <div className="report-empty-icon">
                <FiMessageSquare />
              </div>

              <h3>
                No Reports Yet
              </h3>

              <p>
                Your submitted reports will appear here.
              </p>

            </motion.div>
          ) : (
            <div className="my-reports-list">

              {reports.map(
                (report, index) => {
                  const imageUrl =
                    getReportImage(
                      report
                    );

                  const status =
                    normalizeStatus(
                      report?.status
                    );

                  const statusMeta =
                    getStatusMeta(
                      status
                    );

                  return (
                    <motion.article
                      key={
                        String(
                          report?._id ||
                            report?.id ||
                            `report-${index}`
                        )
                      }
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          Math.min(
                            index * 0.05,
                            0.3
                          ),
                      }}
                      className="my-report-card"
                    >

                      {/* CARD HEADER */}

                      <div className="my-report-top">

                        <div className="my-report-user">

                          <div className="my-report-avatar">
                            <FiUser />
                          </div>

                          <div>
                            <h3>
                              My Report
                            </h3>

                            <span>
                              {formatDate(
                                report?.createdAt
                              )}
                            </span>
                          </div>

                        </div>

                        <div
                          className={`my-report-status ${statusMeta.className}`}
                        >
                          {statusMeta.icon}

                          {statusMeta.label}
                        </div>

                      </div>

                      {/* MESSAGE */}

                      <div className="my-report-message">

                        <div className="my-report-message-label">
                          <FiMessageSquare />

                          Report
                        </div>

                        <p>
                          {report?.message ||
                            "No message provided."}
                        </p>

                      </div>

                      {/* IMAGE */}

                      {imageUrl && (
                        <button
                          type="button"
                          className="my-report-image"
                          onClick={() =>
                            setSelectedImage(
                              imageUrl
                            )
                          }
                        >

                          <img
                            src={imageUrl}
                            alt="Report screenshot"
                            loading="lazy"
                          />

                          <span>
                            <FiZoomIn />

                            View Image
                          </span>

                        </button>
                      )}

                      {/* STATUS MESSAGE */}

                      <div className="my-report-footer">

                        <span>
                          {status === "SUCCESS"
                            ? "Your report has been resolved."
                            : "Your report is under review."}
                        </span>

                        <FiCheckCircle />

                      </div>

                    </motion.article>
                  );
                }
              )}

            </div>
          )}

        </main>

      </div>

      {/* ======================================================
          IMAGE MODAL
      ====================================================== */}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="report-image-modal"
            onClick={() =>
              setSelectedImage(null)
            }
          >

            <button
              type="button"
              className="report-modal-close"
              onClick={() =>
                setSelectedImage(null)
              }
            >
              <FiX />
            </button>

            <motion.img
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
              }}
              transition={{
                duration: 0.25,
              }}
              src={selectedImage}
              alt="Report screenshot"
              onClick={(event) =>
                event.stopPropagation()
              }
            />

          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================
          STYLES
      ====================================================== */}

      <style>{REPORT_STYLES}</style>
    </>
  );
}

/* ============================================================
   COMPLETE REPORT SCREEN STYLES
============================================================ */

const REPORT_STYLES = `

* {
  box-sizing: border-box;
}

.report-page {
  min-height: 100vh;
  width: 100%;

  position: relative;

  overflow-x: hidden;

  background:
    linear-gradient(
      180deg,
      #d6cef3 0%,
      #e5ddf8 28%,
      #f3efff 62%,
      #faf8ff 100%
    );

  color: #24202b;

  padding-bottom: 70px;
}

/* ============================================================
   BACKGROUND
============================================================ */

.report-orb {
  position: fixed;

  width: 420px;
  height: 420px;

  border-radius: 50%;

  pointer-events: none;

  z-index: 0;

  background:
    radial-gradient(
      circle,
      rgba(180,157,238,.26),
      rgba(255,255,255,.05) 55%,
      transparent 75%
    );

  filter: blur(20px);
}

.report-orb-one {
  top: -230px;
  left: -180px;
}

.report-orb-two {
  right: -230px;
  bottom: -230px;
}

/* ============================================================
   LOADING
============================================================ */

.report-loading {
  min-height: 100vh;

  position: relative;

  z-index: 5;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 12px;

  color: #756b82;
}

.report-loading p {
  margin: 0;

  font-size: 13px;
}

.report-loader {
  width: 50px;
  height: 50px;

  border-radius: 18px;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(255,255,255,.55);

  border:
    1px solid
    rgba(255,255,255,.7);

  box-shadow:
    0 15px 40px
    rgba(95,75,130,.12);

  backdrop-filter: blur(18px);
}

.report-loader svg {
  width: 23px;
  height: 23px;

  color: #8c72bc;

  animation:
    reportSpin .8s linear infinite;
}

/* ============================================================
   HEADER
============================================================ */

.report-header {
  width: min(
    1050px,
    calc(100% - 32px)
  );

  min-height: 92px;

  margin: 0 auto;

  position: relative;

  z-index: 10;

  display: flex;

  align-items: center;

  gap: 14px;
}

.report-back-button,
.report-refresh-button {
  width: 44px;
  height: 44px;

  flex: 0 0 44px;

  border-radius: 50%;

  border:
    1px solid
    rgba(255,255,255,.65);

  background:
    rgba(255,255,255,.40);

  color: #302b38;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  backdrop-filter: blur(18px);

  -webkit-backdrop-filter: blur(18px);

  box-shadow:
    0 8px 25px
    rgba(80,60,110,.08);

  transition:
    .2s ease;
}

.report-back-button:hover,
.report-refresh-button:hover {
  background:
    rgba(255,255,255,.70);

  transform:
    translateY(-2px);
}

.report-back-button svg,
.report-refresh-button svg {
  width: 19px;
  height: 19px;
}

.report-title-area {
  flex: 1;

  display: flex;

  align-items: center;

  gap: 12px;
}

.report-title-icon {
  width: 46px;
  height: 46px;

  flex: 0 0 46px;

  border-radius: 15px;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(255,255,255,.45);

  border:
    1px solid
    rgba(255,255,255,.65);

  color: #8063b2;

  backdrop-filter: blur(16px);
}

.report-title-icon svg {
  width: 21px;
  height: 21px;
}

.report-title-area h1 {
  margin: 0;

  font-size: 27px;

  line-height: 1.1;

  font-weight: 750;

  letter-spacing: -.04em;

  color: #25202d;
}

.report-title-area p {
  margin: 5px 0 0;

  font-size: 11px;

  color: #746a81;
}

.report-refresh-button.report-refreshing svg {
  animation:
    reportSpin .8s linear infinite;
}

/* ============================================================
   CONTENT
============================================================ */

.report-content {
  width: min(
    1050px,
    calc(100% - 32px)
  );

  margin: 0 auto;

  position: relative;

  z-index: 5;
}

/* ============================================================
   ALERT
============================================================ */

.report-alert {
  width: 100%;

  min-height: 46px;

  padding: 10px 14px;

  margin-bottom: 14px;

  border-radius: 15px;

  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 12px;

  backdrop-filter: blur(18px);

  -webkit-backdrop-filter: blur(18px);
}

.report-success-alert {
  background:
    rgba(232,250,240,.72);

  border:
    1px solid
    rgba(78,173,113,.16);

  color: #287c4c;
}

.report-error-alert {
  background:
    rgba(255,241,244,.76);

  border:
    1px solid
    rgba(220,100,120,.15);

  color: #a14758;

  justify-content: space-between;
}

.report-alert button {
  border: none;

  background: transparent;

  color: inherit;

  cursor: pointer;

  display: flex;
}

/* ============================================================
   MAIN GLASS CARD
============================================================ */

.report-glass-card {
  width: 100%;

  padding: 18px;

  border-radius: 26px;

  background:
    rgba(255,255,255,.35);

  border:
    1px solid
    rgba(255,255,255,.45);

  backdrop-filter: blur(22px);

  -webkit-backdrop-filter: blur(22px);

  box-shadow:
    0 20px 55px
    rgba(85,65,120,.10);
}

/* ============================================================
   UPLOAD AREA
============================================================ */

.report-upload-area {
  position: relative;

  width: 100%;

  height: 220px;

  padding: 0;

  border: none;

  border-radius: 19px;

  overflow: hidden;

  background:
    rgba(255,255,255,.45);

  border:
    1px solid
    rgba(255,255,255,.50);

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  transition:
    .25s ease;
}

.report-upload-area:hover {
  background:
    rgba(255,255,255,.58);

  transform:
    translateY(-1px);
}

.report-upload-content {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.report-upload-icon {
  width: 60px;
  height: 60px;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(255,255,255,.70);

  color: #29252f;

  box-shadow:
    0 8px 25px
    rgba(80,60,110,.06);
}

.report-upload-icon svg {
  width: 27px;
  height: 27px;
}

.report-upload-content h3 {
  margin: 12px 0 4px;

  font-size: 15px;

  font-weight: 650;

  color: #29242f;
}

.report-upload-content p {
  margin: 0;

  font-size: 12px;

  color: #81788c;
}

/* ============================================================
   PREVIEW
============================================================ */

.report-upload-area.has-preview {
  cursor: pointer;
}

.report-preview-image {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.report-preview-overlay {
  position: absolute;

  inset: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  color: #fff;

  background:
    rgba(30,22,40,.35);

  opacity: 0;

  transition:
    opacity .2s ease;

  font-size: 12px;

  font-weight: 700;
}

.report-upload-area:hover
.report-preview-overlay {
  opacity: 1;
}

/* ============================================================
   SELECTED FILE
============================================================ */

.report-selected-file {
  margin-top: 10px;

  padding: 9px 11px;

  border-radius: 12px;

  background:
    rgba(255,255,255,.48);

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  border:
    1px solid
    rgba(255,255,255,.55);
}

.report-file-info {
  min-width: 0;

  display: flex;

  align-items: center;

  gap: 7px;

  color: #665d71;

  font-size: 11px;
}

.report-file-info span {
  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;
}

.report-selected-file button {
  width: 27px;
  height: 27px;

  flex: 0 0 27px;

  border: none;

  border-radius: 8px;

  background:
    rgba(255,255,255,.60);

  color: #756b80;

  display: flex;

  align-items: center;
  justify-content: center;

  cursor: pointer;
}

/* ============================================================
   MESSAGE
============================================================ */

.report-message-field {
  margin-top: 14px;
}

.report-field-label {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-bottom: 8px;

  color: #6d6378;

  font-size: 11px;

  font-weight: 700;
}

.report-field-label svg {
  width: 14px;
  height: 14px;
}

.report-field-label small {
  margin-left: auto;

  font-size: 10px;

  color: #92899c;

  font-weight: 500;
}

.report-message-field textarea {
  width: 100%;

  min-height: 145px;

  resize: vertical;

  padding: 15px;

  border: none;

  outline: none;

  border-radius: 15px;

  background:
    rgba(255,255,255,.60);

  color: #302b36;

  font-family: inherit;

  font-size: 13px;

  line-height: 1.6;

  box-shadow:
    inset 0 0 0 1px
    rgba(255,255,255,.30);

  transition:
    box-shadow .2s ease,
    background .2s ease;
}

.report-message-field textarea::placeholder {
  color: #9a92a2;
}

.report-message-field textarea:focus {
  background:
    rgba(255,255,255,.76);

  box-shadow:
    inset 0 0 0 1px
    rgba(147,117,193,.20);
}

/* ============================================================
   FORM BUTTONS
============================================================ */

.report-form-buttons {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 10px;

  margin-top: 10px;
}

.report-cancel-button,
.report-send-button {
  min-height: 46px;

  border-radius: 22px;

  border: none;

  font-family: inherit;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  transition:
    .2s ease;
}

.report-cancel-button {
  background:
    rgba(255,255,255,.55);

  color: #514a59;

  border:
    1px solid
    rgba(255,255,255,.60);
}

.report-cancel-button:hover {
  background:
    rgba(255,255,255,.75);
}

.report-send-button {
  background:
    rgb(217,207,250);

  color: #fff;

  box-shadow:
    0 10px 25px
    rgba(145,115,190,.13);
}

.report-send-button:hover:not(:disabled) {
  transform:
    translateY(-1px);

  background:
    rgb(205,192,244);
}

.report-send-button:disabled,
.report-cancel-button:disabled {
  opacity: .55;

  cursor: default;
}

.report-send-button svg {
  width: 15px;
  height: 15px;
}

/* ============================================================
   MY REPORTS HEADER
============================================================ */

.my-reports-heading {
  margin-top: 30px;

  margin-bottom: 13px;

  display: flex;

  align-items: center;

  justify-content: space-between;
}

.my-reports-heading h2 {
  margin: 0;

  font-size: 20px;

  font-weight: 750;

  letter-spacing: -.03em;

  color: #29242f;
}

.my-reports-heading p {
  margin: 4px 0 0;

  color: #80768b;

  font-size: 11px;
}

.report-count {
  min-width: 32px;

  height: 32px;

  padding: 0 9px;

  border-radius: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(255,255,255,.55);

  border:
    1px solid
    rgba(255,255,255,.65);

  color: #765aa2;

  font-size: 12px;

  font-weight: 750;
}

/* ============================================================
   EMPTY
============================================================ */

.report-empty-card {
  min-height: 220px;

  padding: 30px;

  border-radius: 22px;

  background:
    rgba(255,255,255,.35);

  border:
    1px solid
    rgba(255,255,255,.45);

  backdrop-filter: blur(18px);

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;
}

.report-empty-icon {
  width: 54px;
  height: 54px;

  border-radius: 17px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #8a6dbc;

  background:
    rgba(255,255,255,.55);

  margin-bottom: 12px;
}

.report-empty-icon svg {
  width: 22px;
  height: 22px;
}

.report-empty-card h3 {
  margin: 0 0 5px;

  font-size: 17px;
}

.report-empty-card p {
  margin: 0;

  color: #8b8296;

  font-size: 11px;
}

/* ============================================================
   REPORT LIST
============================================================ */

.my-reports-list {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 13px;
}

/* ============================================================
   REPORT CARD
============================================================ */

.my-report-card {
  min-width: 0;

  padding: 15px;

  border-radius: 19px;

  background:
    rgba(255,255,255,.35);

  border:
    1px solid
    rgba(255,255,255,.45);

  backdrop-filter: blur(16px);

  -webkit-backdrop-filter: blur(16px);

  box-shadow:
    0 12px 35px
    rgba(80,60,110,.06);

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.my-report-card:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 17px 42px
    rgba(80,60,110,.09);
}

/* ============================================================
   CARD TOP
============================================================ */

.my-report-top {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 12px;
}

.my-report-user {
  min-width: 0;

  display: flex;

  align-items: center;

  gap: 9px;
}

.my-report-avatar {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  border-radius: 12px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #8669b2;

  background:
    rgba(255,255,255,.50);
}

.my-report-avatar svg {
  width: 16px;
  height: 16px;
}

.my-report-user h3 {
  margin: 0;

  font-size: 12px;

  font-weight: 750;

  color: #332d3a;
}

.my-report-user span {
  display: block;

  margin-top: 3px;

  color: #978e9f;

  font-size: 9px;
}

/* ============================================================
   STATUS
============================================================ */

.my-report-status {
  display: inline-flex;

  align-items: center;

  gap: 5px;

  padding: 6px 9px;

  border-radius: 999px;

  font-size: 9px;

  font-weight: 750;

  white-space: nowrap;
}

.my-report-status svg {
  width: 11px;
  height: 11px;
}

.report-status-success {
  color: #2c8859;

  background:
    rgba(232,249,239,.80);
}

.report-status-pending {
  color: #b47720;

  background:
    rgba(255,245,224,.85);
}

.report-status-default {
  color: #6673b4;

  background:
    rgba(235,238,255,.85);
}

/* ============================================================
   REPORT MESSAGE
============================================================ */

.my-report-message {
  padding: 11px 12px;

  border-radius: 13px;

  background:
    rgba(255,255,255,.34);

  border:
    1px solid
    rgba(255,255,255,.35);
}

.my-report-message-label {
  display: flex;

  align-items: center;

  gap: 5px;

  margin-bottom: 6px;

  color: #887d93;

  font-size: 9px;

  font-weight: 750;

  text-transform: uppercase;

  letter-spacing: .06em;
}

.my-report-message-label svg {
  width: 11px;
  height: 11px;
}

.my-report-message p {
  margin: 0;

  color: #433c4a;

  font-size: 11px;

  line-height: 1.55;

  white-space: pre-wrap;

  overflow-wrap: anywhere;
}

/* ============================================================
   REPORT IMAGE
============================================================ */

.my-report-image {
  width: 100%;

  height: 160px;

  padding: 0;

  margin-top: 10px;

  border: none;

  border-radius: 13px;

  overflow: hidden;

  position: relative;

  display: block;

  cursor: zoom-in;

  background: #e9e3f2;
}

.my-report-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  transition:
    transform .3s ease;
}

.my-report-image:hover img {
  transform:
    scale(1.025);
}

.my-report-image span {
  position: absolute;

  inset: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 6px;

  color: #fff;

  background:
    rgba(30,23,38,.30);

  font-size: 11px;

  font-weight: 700;

  opacity: 0;

  transition:
    opacity .2s ease;
}

.my-report-image:hover span {
  opacity: 1;
}

.my-report-image span svg {
  width: 14px;
  height: 14px;
}

/* ============================================================
   FOOTER
============================================================ */

.my-report-footer {
  margin-top: 10px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  color: #978e9f;

  font-size: 9px;
}

.my-report-footer svg {
  width: 13px;
  height: 13px;

  color: #a18ac3;
}

/* ============================================================
   IMAGE MODAL
============================================================ */

.report-image-modal {
  position: fixed;

  inset: 0;

  z-index: 9999;

  padding: 25px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(15,11,22,.90);

  backdrop-filter: blur(14px);

  -webkit-backdrop-filter: blur(14px);
}

.report-image-modal img {
  max-width: 94vw;

  max-height: 90vh;

  width: auto;
  height: auto;

  object-fit: contain;

  border-radius: 15px;

  box-shadow:
    0 25px 80px
    rgba(0,0,0,.40);
}

.report-modal-close {
  position: fixed;

  top: 18px;

  right: 18px;

  width: 43px;
  height: 43px;

  border-radius: 50%;

  border:
    1px solid
    rgba(255,255,255,.16);

  background:
    rgba(255,255,255,.10);

  color: #fff;

  display: flex;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  z-index: 5;
}

.report-modal-close:hover {
  background:
    rgba(255,255,255,.18);
}

.report-modal-close svg {
  width: 20px;
  height: 20px;
}

/* ============================================================
   SPIN
============================================================ */

.report-spin {
  animation:
    reportSpin .8s linear infinite;
}

@keyframes reportSpin {
  to {
    transform: rotate(360deg);
  }
}

/* ============================================================
   TABLET
============================================================ */

@media (max-width: 850px) {
  .my-reports-list {
    grid-template-columns: 1fr;
  }
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 700px) {

  .report-page {
    padding-bottom: 40px;
  }

  .report-header {
    width: calc(100% - 24px);

    min-height: 76px;

    gap: 8px;
  }

  .report-content {
    width: calc(100% - 24px);
  }

  .report-back-button,
  .report-refresh-button {
    width: 40px;
    height: 40px;

    flex-basis: 40px;
  }

  .report-title-icon {
    width: 40px;
    height: 40px;

    flex-basis: 40px;

    border-radius: 12px;
  }

  .report-title-area h1 {
    font-size: 22px;
  }

  .report-title-area p {
    font-size: 9px;
  }

  .report-glass-card {
    padding: 14px;

    border-radius: 22px;
  }

  .report-upload-area {
    height: 185px;
  }

  .report-message-field textarea {
    min-height: 135px;
  }

  .my-reports-list {
    grid-template-columns: 1fr;
  }

  .my-report-image {
    height: 180px;
  }

  .report-image-modal {
    padding: 15px;
  }
}

/* ============================================================
   SMALL MOBILE
============================================================ */

@media (max-width: 480px) {

  .report-header {
    min-height: 70px;
  }

  .report-title-icon {
    display: none;
  }

  .report-title-area h1 {
    font-size: 20px;
  }

  .report-title-area p {
    display: none;
  }

  .report-glass-card {
    padding: 12px;

    border-radius: 20px;
  }

  .report-upload-area {
    height: 165px;

    border-radius: 16px;
  }

  .report-upload-icon {
    width: 52px;
    height: 52px;
  }

  .report-upload-content h3 {
    font-size: 14px;
  }

  .report-upload-content p {
    font-size: 10px;
  }

  .report-message-field textarea {
    min-height: 125px;

    padding: 13px;

    font-size: 12px;
  }

  .report-form-buttons {
    grid-template-columns: 1fr 1fr;
  }

  .report-cancel-button,
  .report-send-button {
    min-height: 44px;

    border-radius: 20px;

    font-size: 11px;
  }

  .my-reports-heading {
    margin-top: 24px;
  }

  .my-reports-heading h2 {
    font-size: 18px;
  }

  .my-reports-heading p {
    font-size: 9px;
  }

  .my-report-card {
    padding: 13px;

    border-radius: 17px;
  }

  .my-report-top {
    align-items: flex-start;
  }

  .my-report-status {
    padding: 5px 7px;

    font-size: 8px;
  }

  .my-report-image {
    height: 160px;
  }

  .report-image-modal img {
    max-width: 96vw;

    max-height: 82vh;
  }
}

`;