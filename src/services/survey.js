// ============================================================
// src/services/survey.js
// RE2BUY - FINAL USER SURVEY API
// ============================================================

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

const SURVEY_URL = `${BASE_URL}/survey`;


/* ============================================================
   TOKEN
============================================================ */

export function getToken() {
  return (
    localStorage.getItem("auth_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}


/* ============================================================
   AUTH HEADERS
============================================================ */

function authHeaders(json = false) {
  const token = getToken();

  const headers = {
    Accept: "application/json",
  };

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}


/* ============================================================
   SAFE JSON
============================================================ */

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}


/* ============================================================
   ADD SURVEY
   POST /api/survey/add

   LOGIN REQUIRED
============================================================ */

export async function addSurvey(
  surveyData = {}
) {
  try {
    const token = getToken();

    if (!token) {
      return {
        success: false,
        message:
          "Please login to submit a survey.",
        survey: null,
      };
    }

    const body = {
      name:
        String(
          surveyData.name || ""
        ).trim(),

      phone:
        String(
          surveyData.phone || ""
        ).trim(),

      district:
        String(
          surveyData.district || ""
        ).trim(),

      latitude:
        surveyData.latitude !== "" &&
        surveyData.latitude !== null &&
        surveyData.latitude !== undefined
          ? Number(
              surveyData.latitude
            )
          : null,

      longitude:
        surveyData.longitude !== "" &&
        surveyData.longitude !== null &&
        surveyData.longitude !== undefined
          ? Number(
              surveyData.longitude
            )
          : null,

      propertyType:
        String(
          surveyData.propertyType || ""
        ).trim() || null,

      surveyType:
        String(
          surveyData.surveyType || ""
        ).trim() || null,

      approximateArea:
        surveyData.approximateArea !== "" &&
        surveyData.approximateArea !== null &&
        surveyData.approximateArea !== undefined
          ? Number(
              surveyData.approximateArea
            )
          : null,

      areaUnit:
        String(
          surveyData.areaUnit || ""
        ).trim() || null,

      surveyNumber:
        String(
          surveyData.surveyNumber || ""
        ).trim(),

      subdivisionNumber:
        String(
          surveyData.subdivisionNumber || ""
        ).trim(),

      pattaNumber:
        String(
          surveyData.pattaNumber || ""
        ).trim(),

      boundaryStatus:
        String(
          surveyData.boundaryStatus || ""
        ).trim() ||
        "Not Sure - தெரியவில்லை",

      requirement:
        String(
          surveyData.requirement || ""
        ).trim() ||
        "General Measurement - பொதுவான அளவீடு",

      description:
        String(
          surveyData.description || ""
        ).trim(),

      preferredDate:
        surveyData.preferredDate ||
        null,

      preferredTime:
        String(
          surveyData.preferredTime || ""
        ).trim(),
    };


    /* ========================================================
       CLIENT VALIDATION
    ======================================================== */

    if (!body.name) {
      return {
        success: false,
        message:
          "Please enter your name. / உங்கள் பெயரை உள்ளிடவும்.",
        survey: null,
      };
    }

    if (
      !/^[6-9]\d{9}$/.test(
        body.phone
      )
    ) {
      return {
        success: false,
        message:
          "Please enter a valid 10 digit phone number. / சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.",
        survey: null,
      };
    }

    if (!body.district) {
      return {
        success: false,
        message:
          "District is required. / மாவட்டத்தை தேர்வு செய்யவும்.",
        survey: null,
      };
    }


    /* ========================================================
       API
    ======================================================== */

    const response =
      await fetch(
        `${SURVEY_URL}/add`,
        {
          method: "POST",
          headers:
            authHeaders(true),
          body:
            JSON.stringify(body),
        }
      );


    const data =
      await parseResponse(
        response
      );


    if (!response.ok) {
      return {
        success: false,
        message:
          data?.message ||
          data?.error ||
          "Survey request failed. Please try again.",
        survey: null,
      };
    }


    const survey =
      data?.survey ||
      data?.data ||
      null;


    /* ========================================================
       LOCAL CACHE
       Useful for instant UI after submit
    ======================================================== */

    if (survey) {
      saveLocalSurvey({
        ...survey,

        _id:
          survey?._id ||
          survey?.id ||
          `local-${Date.now()}`,

        createdAt:
          survey?.createdAt ||
          new Date().toISOString(),

        name:
          survey?.name ||
          body.name,

        phone:
          survey?.phone ||
          body.phone,

        district:
          survey?.district ||
          body.district,

        latitude:
          survey?.latitude ??
          body.latitude,

        longitude:
          survey?.longitude ??
          body.longitude,

        propertyType:
          survey?.propertyType ??
          body.propertyType,

        surveyType:
          survey?.surveyType ??
          body.surveyType,

        approximateArea:
          survey?.approximateArea ??
          body.approximateArea,

        areaUnit:
          survey?.areaUnit ??
          body.areaUnit,

        surveyNumber:
          survey?.surveyNumber ||
          body.surveyNumber,

        subdivisionNumber:
          survey?.subdivisionNumber ||
          body.subdivisionNumber,

        pattaNumber:
          survey?.pattaNumber ||
          body.pattaNumber,

        boundaryStatus:
          survey?.boundaryStatus ||
          body.boundaryStatus,

        requirement:
          survey?.requirement ||
          body.requirement,

        description:
          survey?.description ||
          body.description,

        preferredDate:
          survey?.preferredDate ||
          body.preferredDate,

        preferredTime:
          survey?.preferredTime ||
          body.preferredTime,

        status:
          survey?.status ||
          "pending",
      });
    }


    return {
      success:
        data?.success !== false,

      message:
        data?.message ||
        "Survey request submitted successfully.",

      survey,
    };

  } catch (error) {

    console.error(
      "ADD SURVEY ERROR:",
      error
    );

    return {
      success: false,
      message:
        "Unable to connect to server. Please try again.",
      survey: null,
    };
  }
}


/* ============================================================
   GET CURRENT USER SURVEYS

   IMPORTANT:
   USER API

   GET /api/survey/my

   NOT /api/survey
============================================================ */

export async function getSurveys(
  params = {}
) {
  try {

    const token =
      getToken();

    if (!token) {
      return {
        success: false,
        message:
          "Please login to view your surveys.",
        surveys: [],
      };
    }


    const query =
      new URLSearchParams();


    Object.entries(
      params || {}
    ).forEach(
      ([key, value]) => {

        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          query.append(
            key,
            value
          );
        }

      }
    );


    const url =
      query.toString()
        ? `${SURVEY_URL}/my?${query.toString()}`
        : `${SURVEY_URL}/my`;


    const response =
      await fetch(
        url,
        {
          method: "GET",
          headers:
            authHeaders(),
        }
      );


    const data =
      await parseResponse(
        response
      );


    if (!response.ok) {

      return {
        success: false,
        message:
          data?.message ||
          "Unable to load your survey requests.",
        surveys: [],
      };
    }


    const surveys =
      Array.isArray(
        data?.surveys
      )
        ? data.surveys
        : Array.isArray(
            data?.data
          )
          ? data.data
          : Array.isArray(data)
            ? data
            : [];


    return {
      success: true,
      surveys,
      total:
        data?.total ??
        surveys.length,
    };

  } catch (error) {

    console.error(
      "GET MY SURVEYS ERROR:",
      error
    );


    const local =
      getLocalSurveys();


    if (local.length) {
      return {
        success: true,
        surveys: local,
        total: local.length,
        local: true,
      };
    }


    return {
      success: false,
      message:
        "Unable to connect to server.",
      surveys: [],
    };
  }
}


/* ============================================================
   LOCAL SURVEYS
============================================================ */

export function getLocalSurveys() {
  try {

    const data =
      JSON.parse(
        localStorage.getItem(
          "re2buy_user_surveys"
        ) || "[]"
      );


    return Array.isArray(data)
      ? data
      : [];

  } catch {
    return [];
  }
}


function saveLocalSurvey(
  survey
) {
  try {

    const old =
      getLocalSurveys();


    const id =
      getSurveyId(
        survey
      );


    const filtered =
      old.filter(
        (item) =>
          String(
            getSurveyId(item)
          ) !== String(id)
      );


    localStorage.setItem(
      "re2buy_user_surveys",
      JSON.stringify([
        survey,
        ...filtered,
      ])
    );

  } catch (error) {

    console.warn(
      "LOCAL SURVEY SAVE ERROR:",
      error
    );
  }
}


/* ============================================================
   GET SINGLE SURVEY
============================================================ */

export async function getSurveyById(
  id
) {
  try {

    if (!id) {
      return {
        success: false,
        message:
          "Survey ID is required.",
        survey: null,
      };
    }


    const response =
      await fetch(
        `${SURVEY_URL}/${encodeURIComponent(
          id
        )}`,
        {
          method: "GET",
          headers:
            authHeaders(),
        }
      );


    const data =
      await parseResponse(
        response
      );


    if (!response.ok) {

      const local =
        getLocalSurveys().find(
          (item) =>
            String(
              getSurveyId(item)
            ) === String(id)
        );


      if (local) {
        return {
          success: true,
          survey: local,
          local: true,
        };
      }


      return {
        success: false,
        message:
          data?.message ||
          "Survey not found.",
        survey: null,
      };
    }


    return {
      success: true,
      survey:
        data?.survey ||
        data?.data ||
        null,
    };

  } catch {

    const local =
      getLocalSurveys().find(
        (item) =>
          String(
            getSurveyId(item)
          ) === String(id)
      );


    return {
      success:
        Boolean(local),
      survey:
        local || null,
    };
  }
}


/* ============================================================
   DELETE
============================================================ */

export async function deleteSurvey(
  id
) {
  try {

    if (!id) {
      return {
        success: false,
        message:
          "Survey ID is required.",
      };
    }


    const response =
      await fetch(
        `${SURVEY_URL}/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
          headers:
            authHeaders(),
        }
      );


    const data =
      await parseResponse(
        response
      );


    if (!response.ok) {
      return {
        success: false,
        message:
          data?.message ||
          "Unable to delete survey.",
      };
    }


    removeLocalSurvey(
      id
    );


    return {
      success: true,
      message:
        data?.message ||
        "Survey deleted successfully.",
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.message ||
        "Unable to delete survey.",
    };
  }
}


/* ============================================================
   RESTORE
============================================================ */

export async function restoreSurvey(
  id
) {
  try {

    const response =
      await fetch(
        `${SURVEY_URL}/${encodeURIComponent(
          id
        )}/restore`,
        {
          method: "PUT",
          headers:
            authHeaders(),
        }
      );


    const data =
      await parseResponse(
        response
      );


    return {
      success:
        response.ok,

      message:
        data?.message ||
        "Survey restored successfully.",

      survey:
        data?.survey ||
        data?.data ||
        null,
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.message ||
        "Unable to restore survey.",
    };
  }
}


/* ============================================================
   UPDATE
============================================================ */

export async function updateSurvey(
  id,
  surveyData = {}
) {
  try {

    const response =
      await fetch(
        `${SURVEY_URL}/${encodeURIComponent(
          id
        )}`,
        {
          method: "PUT",
          headers:
            authHeaders(true),
          body:
            JSON.stringify(
              surveyData
            ),
        }
      );


    const data =
      await parseResponse(
        response
      );


    return {
      success:
        response.ok,

      message:
        data?.message ||
        "Survey updated successfully.",

      survey:
        data?.survey ||
        data?.data ||
        null,
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.message ||
        "Unable to update survey.",
      survey: null,
    };
  }
}


/* ============================================================
   UPDATE STATUS
============================================================ */

export async function updateSurveyStatus(
  id,
  status,
  adminNote = ""
) {
  try {

    const response =
      await fetch(
        `${SURVEY_URL}/${encodeURIComponent(
          id
        )}/status`,
        {
          method: "PUT",
          headers:
            authHeaders(true),
          body:
            JSON.stringify({
              status,
              adminNote,
            }),
        }
      );


    const data =
      await parseResponse(
        response
      );


    return {
      success:
        response.ok,

      message:
        data?.message ||
        "Survey status updated.",

      survey:
        data?.survey ||
        data?.data ||
        null,
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.message ||
        "Unable to update status.",
    };
  }
}


/* ============================================================
   PERMANENT DELETE
============================================================ */

export async function permanentlyDeleteSurvey(
  id
) {
  try {

    const response =
      await fetch(
        `${SURVEY_URL}/${encodeURIComponent(
          id
        )}/permanent`,
        {
          method: "DELETE",
          headers:
            authHeaders(),
        }
      );


    const data =
      await parseResponse(
        response
      );


    return {
      success:
        response.ok,

      message:
        data?.message ||
        "Survey permanently deleted.",
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.message ||
        "Unable to permanently delete survey.",
    };
  }
}


/* ============================================================
   REMOVE LOCAL
============================================================ */

function removeLocalSurvey(
  id
) {
  try {

    const list =
      getLocalSurveys().filter(
        (item) =>
          String(
            getSurveyId(item)
          ) !== String(id)
      );


    localStorage.setItem(
      "re2buy_user_surveys",
      JSON.stringify(list)
    );

  } catch {}
}


/* ============================================================
   HELPERS
============================================================ */

export function getSurveyId(
  survey
) {
  if (!survey) {
    return "";
  }


  if (
    typeof survey._id ===
      "object" &&
    survey._id?.$oid
  ) {
    return String(
      survey._id.$oid
    );
  }


  if (survey._id) {
    return String(
      survey._id
    );
  }


  if (survey.id) {
    return String(
      survey.id
    );
  }


  return "";
}


export function getSurveyStatus(
  survey
) {
  return String(
    survey?.status ||
      "pending"
  ).toLowerCase();
}


export function getSurveyStatusLabel(
  status
) {
  switch (
    String(
      status || "pending"
    ).toLowerCase()
  ) {

    case "approved":
      return "Approved / அங்கீகரிக்கப்பட்டது";

    case "completed":
      return "Completed / முடிக்கப்பட்டது";

    case "rejected":
      return "Rejected / நிராகரிக்கப்பட்டது";

    default:
      return "Pending / நிலுவையில்";
  }
}


export function getSurveyCoordinates(
  survey
) {
  const latitude =
    Number(
      survey?.latitude
    );

  const longitude =
    Number(
      survey?.longitude
    );


  if (
    !Number.isFinite(
      latitude
    ) ||
    !Number.isFinite(
      longitude
    )
  ) {
    return null;
  }


  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }


  return {
    latitude,
    longitude,
  };
}


export function hasSurveyLocation(
  survey
) {
  return Boolean(
    getSurveyCoordinates(
      survey
    )
  );
}


export function getSurveyCreatedAt(
  survey
) {
  if (!survey?.createdAt) {
    return null;
  }


  const date =
    new Date(
      survey.createdAt
    );


  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}


/* ============================================================
   DEFAULT
============================================================ */

export default {
  addSurvey,
  getSurveys,
  getLocalSurveys,
  getSurveyById,
  updateSurvey,
  updateSurveyStatus,
  deleteSurvey,
  restoreSurvey,
  permanentlyDeleteSurvey,
  getSurveyId,
  getSurveyStatus,
  getSurveyStatusLabel,
  getSurveyCoordinates,
  hasSurveyLocation,
  getSurveyCreatedAt,
};