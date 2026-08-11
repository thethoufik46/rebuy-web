import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  Home,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getUserDetails,
  updateUserDetails,
  uploadProfileImage,
  profileImageUrl,
} from "@/services/userApi";

import districtsData from "@/assets/data/tamilnadu_locations.json";

import AccountSettingsSection from "./AccountSettingsSection";

import desktopBg from "@/assets/images/desktop_bg.jpeg";


/* =========================================================
   CACHE
========================================================= */

const CACHE_KEY = "re2buy_user_profile";


/* =========================================================
   HELPERS
========================================================= */

const safeString = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
};


/* =========================================================
   DISTRICTS
========================================================= */

const getDistrictList = () => {
  try {
    if (
      districtsData &&
      typeof districtsData === "object" &&
      !Array.isArray(districtsData)
    ) {
      return Object.keys(
        districtsData
      ).filter(Boolean);
    }

    return [];
  } catch (error) {
    console.error(
      "District JSON error:",
      error
    );

    return [];
  }
};


/* =========================================================
   USER PROFILE
========================================================= */

export default function UserProfile() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);


  /* =======================================================
     STATE
  ======================================================= */

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [toast, setToast] =
    useState(null);


  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    address: "",
  });


  /* =======================================================
     DISTRICTS
  ======================================================= */

  const districts = useMemo(
    () => getDistrictList(),
    []
  );


  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = useCallback(
    (
      message,
      type = "success"
    ) => {
      setToast({
        message,
        type,
      });

      window.setTimeout(() => {
        setToast(null);
      }, 3000);
    },
    []
  );


  /* =======================================================
     IMAGE URL
  ======================================================= */

  const getImageUrl = useCallback(
    (key) => {
      if (!key) {
        return "";
      }

      if (
        typeof key === "string" &&
        (
          key.startsWith("http://") ||
          key.startsWith("https://") ||
          key.startsWith("data:")
        )
      ) {
        return key;
      }

      try {
        return profileImageUrl(key);
      } catch {
        return "";
      }
    },
    []
  );


  /* =======================================================
     APPLY USER
  ======================================================= */

  const applyUserToForm = useCallback(
    (data) => {
      if (!data) {
        return;
      }

      setForm({
        name: safeString(
          data.name
        ),

        phone: safeString(
          data.phone
        ),

        email: safeString(
          data.email
        ),

        district: safeString(
          data.district
        ),

        address: safeString(
          data.address
        ),
      });
    },
    []
  );


  /* =======================================================
     LOAD USER
  ======================================================= */

  const loadUser = useCallback(
    async (useCache = true) => {
      setLoading(true);

      try {
        /* CACHE */

        if (useCache) {
          const cached =
            sessionStorage.getItem(
              CACHE_KEY
            );

          if (cached) {
            try {
              const parsed =
                JSON.parse(cached);

              if (
                parsed &&
                typeof parsed ===
                  "object"
              ) {
                setUser(parsed);

                applyUserToForm(
                  parsed
                );

                if (
                  parsed.profileImage
                ) {
                  setImagePreview(
                    getImageUrl(
                      parsed.profileImage
                    )
                  );
                }

                setLoading(false);
              }
            } catch {
              sessionStorage.removeItem(
                CACHE_KEY
              );
            }
          }
        }


        /* API */

        const actualUser =
          await getUserDetails();

        if (!actualUser) {
          throw new Error(
            "Unable to load user"
          );
        }


        setUser(
          actualUser
        );

        applyUserToForm(
          actualUser
        );


        if (
          actualUser.profileImage
        ) {
          setImagePreview(
            getImageUrl(
              actualUser.profileImage
            )
          );
        } else {
          setImagePreview("");
        }


        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify(
            actualUser
          )
        );
      } catch (error) {
        console.error(
          "Profile load error:",
          error
        );

        if (!user) {
          showToast(
            "Unable to load profile",
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [
      applyUserToForm,
      getImageUrl,
      showToast,
      user,
    ]
  );


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadUser(true);
  }, []);


  /* =======================================================
     IMAGE
  ======================================================= */

  const displayImage = useMemo(() => {
    if (imagePreview) {
      return imagePreview;
    }

    if (
      user?.profileImage
    ) {
      return getImageUrl(
        user.profileImage
      );
    }

    return "";
  }, [
    imagePreview,
    user,
    getImageUrl,
  ]);


  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEdit = () => {
    if (!user) {
      return;
    }

    setForm({
      name: safeString(
        user.name
      ),

      phone: safeString(
        user.phone
      ),

      email: safeString(
        user.email
      ),

      district: safeString(
        user.district
      ),

      address: safeString(
        user.address
      ),
    });

    setImageFile(null);

    if (
      user.profileImage
    ) {
      setImagePreview(
        getImageUrl(
          user.profileImage
        )
      );
    } else {
      setImagePreview("");
    }

    setEditOpen(true);
  };


  /* =======================================================
     CLOSE EDIT
  ======================================================= */

  const closeEdit = () => {
    if (saving) {
      return;
    }

    setEditOpen(false);
  };


  /* =======================================================
     INPUT
  ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  /* =======================================================
     IMAGE SELECT
  ======================================================= */

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      showToast(
        "Please select an image",
        "error"
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      8 * 1024 * 1024
    ) {
      showToast(
        "Image must be below 8MB",
        "error"
      );

      event.target.value = "";

      return;
    }

    setImageFile(file);

    const reader =
      new FileReader();

    reader.onload = () => {
      setImagePreview(
        String(
          reader.result || ""
        )
      );
    };

    reader.readAsDataURL(
      file
    );
  };


  /* =======================================================
     REMOVE SELECTED IMAGE
  ======================================================= */

  const removeSelectedImage = () => {
    setImageFile(null);

    if (
      user?.profileImage
    ) {
      setImagePreview(
        getImageUrl(
          user.profileImage
        )
      );
    } else {
      setImagePreview("");
    }

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  };


  /* =======================================================
     SAVE
  ======================================================= */

  const saveProfile = async (
    event
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const name =
      form.name.trim();

    if (!name) {
      showToast(
        "Please enter your name",
        "error"
      );

      return;
    }

    setSaving(true);

    try {
      const updated =
        await updateUserDetails({
          name,

          phone:
            form.phone.trim(),

          email:
            form.email.trim(),

          district:
            form.district.trim(),

          address:
            form.address.trim(),
        });


      if (!updated) {
        throw new Error(
          "Profile update failed"
        );
      }


      if (imageFile) {
        const uploaded =
          await uploadProfileImage({
            imageFile,
          });

        if (!uploaded) {
          showToast(
            "Profile saved, image upload failed",
            "error"
          );
        }
      }


      sessionStorage.removeItem(
        CACHE_KEY
      );

      setImageFile(null);

      setEditOpen(false);

      await loadUser(false);

      showToast(
        "Profile updated successfully"
      );
    } catch (error) {
      console.error(
        "Save profile error:",
        error
      );

      showToast(
        error?.message ||
          "Failed to update profile",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading &&
    !user
  ) {
    return (
      <LoadingScreen />
    );
  }


  /* =======================================================
     VALUES
  ======================================================= */

  const name =
    safeString(
      user?.name
    ) || "User";

  const phone =
    safeString(
      user?.phone
    );

  const email =
    safeString(
      user?.email
    );

  const district =
    safeString(
      user?.district
    );

  const address =
    safeString(
      user?.address
    );

  const verification =
    safeString(
      user?.verification
    );


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="profile-page">


      {/* =================================================
          BACKGROUND IMAGE
      ================================================= */}

      <img
        src={desktopBg}
        alt=""
        className="profile-background"
      />


      {/* =================================================
          ONLY ONE GLASS LAYER
      ================================================= */}

      <div className="profile-glass">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="profile-topbar">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="back-button"
          >
            <ArrowLeft
              size={17}
            />

            <span>
              Back
            </span>
          </button>







        </div>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="profile-layout">


          {/* =================================================
              LEFT
          ================================================= */}

          <aside className="profile-left">

            <div className="section-label">
              ACCOUNT
            </div>

            <h2>
              My Profile
            </h2>


            {/* PROFILE IMAGE */}

            <div className="profile-image-wrap">

              <div className="profile-image">

                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={name}
                    onError={() =>
                      setImagePreview("")
                    }
                  />
                ) : (
                  <UserRound
                    size={58}
                    strokeWidth={1.4}
                  />
                )}

              </div>

              <span className="online-dot" />

            </div>


            <h1 className="profile-name">
              {name}
            </h1>


            {verification && (
              <div className="verification">
                <ShieldCheck
                  size={13}
                />

                {verification}
              </div>
            )}


            <button
              type="button"
              onClick={openEdit}
              className="edit-button"
            >
              <Pencil
                size={14}
              />

              Edit Profile
            </button>


          </aside>


          {/* =================================================
              RIGHT
          ================================================= */}

          <section className="profile-right">


            {/* PERSONAL */}

            <div className="personal-section">

              <div className="section-header">

                <div>
                  <div className="section-label">
                    PERSONAL
                  </div>

                  <h2>
                    Profile Information
                  </h2>
                </div>

                <div className="active-status">
                  <span />
                  ACTIVE
                </div>

              </div>


              <div className="info-grid">

                <InfoBox
                  icon={UserRound}
                  label="FULL NAME"
                  value={name}
                />

                <InfoBox
                  icon={Phone}
                  label="PHONE NUMBER"
                  value={
                    phone ||
                    "Not added"
                  }
                />

                <InfoBox
                  icon={Mail}
                  label="EMAIL"
                  value={
                    email ||
                    "Not added"
                  }
                />

                <InfoBox
                  icon={MapPin}
                  label="DISTRICT"
                  value={
                    district ||
                    "Not added"
                  }
                />

                <InfoBox
                  icon={Home}
                  label="ADDRESS"
                  value={
                    address ||
                    "Not added"
                  }
                  wide
                />

              </div>

            </div>


            {/* SETTINGS */}

            <div className="settings-section">

              <div className="section-label">
                SETTINGS
              </div>

              <h2>
                Account Settings
              </h2>


              {/* 
                  IMPORTANT:
                  AccountSettingsSection should be
                  FLAT — no glass/background wrapper.
              */}

              <AccountSettingsSection
                onEditProfile={
                  openEdit
                }
                onChangePassword={() =>
                  navigate(
                    "/change-password"
                  )
                }
              />

            </div>

          </section>

        </div>

      </div>


      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editOpen && (
        <div className="edit-overlay">

          <div className="edit-modal">

            <button
              type="button"
              disabled={saving}
              onClick={
                closeEdit
              }
              className="modal-close"
            >
              <X
                size={18}
              />
            </button>


            <div className="section-label">
              ACCOUNT
            </div>

            <h2>
              Edit Profile
            </h2>

            <p>
              Update your personal information
            </p>


            {/* IMAGE */}

            <div className="edit-photo">

              <div className="edit-photo-inner">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                  />
                ) : (
                  <UserRound
                    size={48}
                  />
                )}

              </div>


              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="camera-button"
              >
                <Camera
                  size={16}
                />
              </button>


              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/*"
                className="hidden"
                onChange={
                  handleImageChange
                }
              />

            </div>


            {imageFile && (
              <div className="selected-image">

                <span>
                  {imageFile.name}
                </span>

                <button
                  type="button"
                  onClick={
                    removeSelectedImage
                  }
                >
                  Remove
                </button>

              </div>
            )}


            {/* FORM */}

            <form
              onSubmit={
                saveProfile
              }
              className="edit-form"
            >

              <ProfileInput
                label="Full Name"
                name="name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                icon={
                  UserRound
                }
                disabled={
                  saving
                }
                required
              />


              <ProfileInput
                label="Phone"
                name="phone"
                type="tel"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
                icon={
                  Phone
                }
                disabled={
                  saving
                }
              />


              <ProfileInput
                label="Email"
                name="email"
                type="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                icon={
                  Mail
                }
                disabled={
                  saving
                }
              />


              {/* DISTRICT */}

              <div>

                <label>
                  District
                </label>

                <div className="select-wrap">

                  <MapPin
                    size={17}
                  />

                  <select
                    name="district"
                    value={
                      form.district ||
                      ""
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      saving
                    }
                  >

                    <option value="">
                      Select District
                    </option>

                    {districts.map(
                      (
                        item
                      ) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown
                    size={17}
                  />

                </div>

              </div>


              <ProfileInput
                label="Address"
                name="address"
                value={
                  form.address
                }
                onChange={
                  handleChange
                }
                icon={
                  Home
                }
                disabled={
                  saving
                }
              />


              <button
                type="submit"
                disabled={
                  saving
                }
                className="save-button"
              >

                {saving ? (
                  <>
                    <span className="spinner" />

                    SAVING...
                  </>
                ) : (
                  <>
                    <Save
                      size={17}
                    />

                    SAVE CHANGES
                  </>
                )}

              </button>

            </form>

          </div>

        </div>
      )}


      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div className="profile-toast">

          {toast.type ===
          "error" ? (
            <X
              size={15}
              className="toast-error"
            />
          ) : (
            <Check
              size={15}
              className="toast-success"
            />
          )}

          {toast.message}

        </div>
      )}


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* ===================================================
           PAGE
        =================================================== */

        .profile-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          color: #172033;
          font-family: Inter, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }


        /* ===================================================
           BACKGROUND
        =================================================== */

        .profile-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }


        /* ===================================================
           ONE AND ONLY GLASS LAYER
        =================================================== */

        .profile-glass {
          position: relative;
          z-index: 2;

          width: min(
            1180px,
            calc(100% - 32px)
          );

          min-height: calc(100vh - 40px);

          margin: 20px auto;

          padding: 22px;

          border-radius: 34px;

          background: rgba(
            255,
            255,
            255,
            0.30
          );

          border: 1px solid rgba(
            255,
            255,
            255,
            0.68
          );

          box-shadow:
            0 30px 100px
            rgba(30, 40, 55, 0.18);

          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }


        /* ===================================================
           TOP BAR
           NO GLASS HERE
        =================================================== */

        .profile-topbar {
          position: relative;

          height: 58px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 2px;
        }


        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;

          height: 40px;

          padding: 0 15px;

          border: 0;
          border-radius: 999px;

          background: rgba(
            255,
            255,
            255,
            0.45
          );

          color: #334155;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .back-button:hover {
          background: rgba(
            255,
            255,
            255,
            0.70
          );

          transform: translateX(-2px);
        }


        /* ===================================================
           MAIN
        =================================================== */

        .profile-layout {
          display: grid;

          grid-template-columns:
            330px minmax(0, 1fr);

          gap: 30px;

          padding-top: 18px;
        }


        /* ===================================================
           LEFT
           NO GLASS
        =================================================== */

        .profile-left {
          padding: 20px 22px;
        }


        .section-label {
          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.22em;

          color: #91a0b5;
        }


        .profile-left h2,
        .profile-right h2,
        .settings-section h2 {
          margin: 5px 0 0;

          color: #182337;

          font-size: 19px;
          font-weight: 900;
        }


        .profile-image-wrap {
          position: relative;

          width: 145px;
          height: 145px;

          margin: 32px auto 0;
        }


        .profile-image {
          width: 145px;
          height: 145px;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          border-radius: 38px;

          background: rgba(
            255,
            255,
            255,
            0.58
          );

          color: #91a1b8;

          box-shadow:
            0 18px 40px
            rgba(40, 50, 65, 0.14);
        }


        .profile-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }


        .online-dot {
          position: absolute;

          right: 0;
          bottom: 2px;

          width: 22px;
          height: 22px;

          border-radius: 50%;

          background: #35d49b;

          border: 5px solid white;
        }


        .profile-name {
          margin: 22px 0 0;

          text-align: center;

          font-size: 25px;
          font-weight: 950;

          color: #172033;
        }


        .verification {
          width: fit-content;

          display: flex;
          align-items: center;
          gap: 5px;

          margin: 7px auto 0;

          padding: 5px 11px;

          border-radius: 999px;

          color: #14966c;

          background: rgba(
            236,
            253,
            245,
            0.70
          );

          font-size: 9px;
          font-weight: 800;
        }


        .edit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          height: 43px;

          margin: 18px auto 0;

          padding: 0 22px;

          border: 0;
          border-radius: 999px;

          background: #172033;
          color: white;

          font-size: 11px;
          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 12px 25px
            rgba(23, 32, 51, 0.20);

          transition: 0.2s ease;
        }

        .edit-button:hover {
          transform: translateY(-2px);
        }






        /* ===================================================
           RIGHT
        =================================================== */

        .profile-right {
          min-width: 0;
        }


        .personal-section {
          padding: 20px 4px;
        }


        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 20px;
        }


        .active-status {
          display: flex;
          align-items: center;
          gap: 7px;

          padding: 10px 15px;

          border-radius: 999px;

          background: rgba(
            255,
            255,
            255,
            0.42
          );

          color: #607086;

          font-size: 9px;
          font-weight: 800;
        }

        .active-status span {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #35d49b;
        }


        /* ===================================================
           INFO GRID
           NO BLUR
        =================================================== */

        .info-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 10px;
        }


        .info-box {
          display: flex;
          align-items: center;
          gap: 13px;

          min-width: 0;

          min-height: 70px;

          padding: 12px 15px;

          border-radius: 20px;

          background: rgba(
            255,
            255,
            255,
            0.48
          );

          box-shadow:
            0 8px 25px
            rgba(70, 80, 95, 0.05);
        }


        .info-box.wide {
          grid-column: span 2;
        }


        .info-icon {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 14px;

          background: rgba(
            255,
            255,
            255,
            0.55
          );

          color: #64748b;
        }


        .info-content {
          min-width: 0;
        }


        .info-label {
          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.13em;

          color: #91a0b5;
        }


        .info-value {
          margin-top: 4px;

          overflow: hidden;
          text-overflow: ellipsis;

          font-size: 12px;
          font-weight: 800;

          color: #334155;

          word-break: break-word;
        }


        /* ===================================================
           STATS
        =================================================== */




        /* ===================================================
           SETTINGS
        =================================================== */

        .settings-section {
          margin-top: 12px;

          padding: 20px 4px 0;

          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              0.50
            );
        }


        /* ===================================================
           EDIT MODAL
        =================================================== */

        .edit-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 18px;

          background:
            rgba(
              20,
              28,
              40,
              0.28
            );

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }


        .edit-modal {
          position: relative;

          width: min(
            540px,
            100%
          );

          max-height: 94vh;

          overflow-y: auto;

          padding: 28px;

          border-radius: 30px;

          background: rgba(
            255,
            255,
            255,
            0.92
          );

          box-shadow:
            0 35px 100px
            rgba(20, 30, 45, 0.30);
        }


        .edit-modal h2 {
          margin: 5px 0 0;

          font-size: 25px;
          font-weight: 950;

          color: #172033;
        }


        .edit-modal > p {
          margin: 4px 0 0;

          color: #8b98a9;

          font-size: 12px;
        }


        .modal-close {
          position: absolute;

          right: 16px;
          top: 16px;

          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 50%;

          background: #f1f4f7;

          color: #64748b;

          cursor: pointer;
        }


        .edit-photo {
          position: relative;

          width: 110px;
          height: 110px;

          margin: 25px auto 0;
        }


        .edit-photo-inner {
          width: 110px;
          height: 110px;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          border-radius: 30px;

          background: #f1f4f7;

          color: #94a3b8;
        }


        .edit-photo-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }


        .camera-button {
          position: absolute;

          right: -3px;
          bottom: -3px;

          width: 36px;
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 3px solid white;
          border-radius: 50%;

          background: #172033;
          color: white;

          cursor: pointer;
        }


        .selected-image {
          width: fit-content;
          max-width: 100%;

          display: flex;
          align-items: center;
          gap: 10px;

          margin: 10px auto 0;

          padding: 7px 11px;

          border-radius: 999px;

          background: #f4f6f8;

          font-size: 10px;
          color: #64748b;
        }


        .selected-image span {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }


        .selected-image button {
          border: 0;
          background: transparent;

          color: #ef4444;

          font-size: 10px;
          font-weight: 800;

          cursor: pointer;
        }


        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 14px;

          margin-top: 24px;
        }


        .edit-form label {
          display: block;

          margin-bottom: 7px;

          font-size: 10px;
          font-weight: 800;

          color: #64748b;
        }


        .input-wrap,
        .select-wrap {
          position: relative;
        }


        .input-wrap svg,
        .select-wrap > svg:first-child {
          position: absolute;

          left: 15px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #94a3b8;

          pointer-events: none;
        }


        .input-wrap input,
        .select-wrap select {
          width: 100%;
          height: 52px;

          border: 1px solid #e7ebef;

          border-radius: 16px;

          background: #f8fafb;

          padding: 0 15px 0 43px;

          outline: none;

          color: #334155;

          font-size: 13px;
          font-weight: 600;
        }


        .select-wrap select {
          appearance: none;

          padding-right: 42px;

          cursor: pointer;
        }


        .select-wrap > svg:last-child {
          position: absolute;

          right: 14px;
          top: 50%;

          transform:
            translateY(-50%);

          pointer-events: none;

          color: #94a3b8;
        }


        .input-wrap input:focus,
        .select-wrap select:focus {
          border-color: #cbd5e1;

          background: white;
        }


        .save-button {
          height: 53px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          margin-top: 4px;

          border: 0;
          border-radius: 16px;

          background: #172033;
          color: white;

          font-size: 12px;
          font-weight: 800;

          cursor: pointer;
        }


        .save-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }


        .spinner {
          width: 18px;
          height: 18px;

          border: 2px solid
            rgba(255,255,255,0.25);

          border-top-color: white;

          border-radius: 50%;

          animation:
            profileSpin
            0.7s
            linear
            infinite;
        }


        @keyframes profileSpin {
          to {
            transform: rotate(360deg);
          }
        }


        /* ===================================================
           TOAST
        =================================================== */

        .profile-toast {
          position: fixed;

          left: 50%;
          bottom: 22px;

          z-index: 200;

          transform:
            translateX(-50%);

          display: flex;
          align-items: center;
          gap: 8px;

          max-width:
            calc(100vw - 28px);

          padding: 12px 18px;

          border-radius: 999px;

          background: #172033;
          color: white;

          font-size: 11px;
          font-weight: 700;

          box-shadow:
            0 15px 40px
            rgba(20, 30, 45, 0.25);
        }


        .toast-success {
          color: #34d399;
        }

        .toast-error {
          color: #fb7185;
        }


        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 900px) {

          .profile-glass {
            width:
              calc(100% - 18px);

            min-height:
              calc(100vh - 18px);

            margin: 9px auto;

            padding: 12px;

            border-radius: 26px;

            backdrop-filter:
              blur(18px);

            -webkit-backdrop-filter:
              blur(18px);
          }


          .profile-layout {
            grid-template-columns: 1fr;

            gap: 4px;

            padding-top: 5px;
          }


          .profile-left {
            padding: 18px 10px 8px;

            text-align: center;
          }


          .profile-left h2 {
            font-size: 17px;
          }


          .profile-image-wrap {
            margin-top: 20px;
          }


          .profile-right {
            width: 100%;
          }


          .personal-section {
            padding:
              14px 4px 10px;
          }


          .section-header {
            align-items: flex-start;
          }


          .section-header h2 {
            font-size: 17px;
          }


          .active-status {
            padding:
              8px 11px;

            font-size: 8px;
          }


          .info-grid {
            grid-template-columns: 1fr;
          }


          .info-box.wide {
            grid-column: span 1;
          }




          .settings-section {
            padding:
              17px 4px 0;
          }


          .settings-section h2 {
            font-size: 17px;
          }

        }


        /* ===================================================
           SMALL MOBILE
        =================================================== */

        @media (max-width: 480px) {

          .profile-background {
            object-position:
              center center;
          }


          .profile-glass {
            width:
              calc(100% - 10px);

            margin: 5px auto;

            padding: 9px;

            border-radius: 23px;
          }


          .profile-topbar {
            height: 52px;
          }


          .back-button {
            width: 39px;
            height: 39px;

            justify-content: center;

            padding: 0;
          }


          .back-button span {
            display: none;
          }


          .profile-image-wrap,
          .profile-image {
            width: 125px;
            height: 125px;
          }


          .profile-name {
            font-size: 22px;
          }


          .info-box {
            min-height: 65px;

            padding: 10px 12px;

            border-radius: 17px;
          }


          .info-icon {
            width: 36px;
            height: 36px;
          }


          .info-value {
            font-size: 11px;
          }


          .edit-modal {
            padding: 22px 17px;

            border-radius:
              25px;
          }

        }


        /* ===================================================
           REDUCE MOTION
        =================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }

        }

      `}</style>

    </div>
  );
}


/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  icon: Icon,
  label,
  value,
  wide = false,
}) {
  return (
    <div
      className={
        wide
          ? "info-box wide"
          : "info-box"
      }
    >

      <div className="info-icon">
        <Icon
          size={17}
        />
      </div>

      <div className="info-content">

        <div className="info-label">
          {label}
        </div>

        <div className="info-value">
          {value}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   PROFILE INPUT
========================================================= */

function ProfileInput({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  type = "text",
  disabled = false,
  required = false,
}) {
  return (
    <div>

      <label>
        {label}
      </label>

      <div className="input-wrap">

        <Icon
          size={17}
        />

        <input
          type={type}
          name={name}
          value={
            value || ""
          }
          onChange={
            onChange
          }
          disabled={
            disabled
          }
          required={
            required
          }
        />

      </div>

    </div>
  );
}


/* =========================================================
   LOADING
========================================================= */

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <img
        src={desktopBg}
        alt=""
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "rgba(255,255,255,.30)",
          backdropFilter:
            "blur(18px)",
        }}
      >

        <div
          style={{
            width: 35,
            height: 35,
            border:
              "3px solid rgba(255,255,255,.45)",
            borderTopColor:
              "#172033",
            borderRadius: "50%",
            animation:
              "profileSpin .7s linear infinite",
          }}
        />

      </div>

    </div>
  );
}