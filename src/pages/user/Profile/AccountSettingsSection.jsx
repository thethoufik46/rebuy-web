
// src/pages/user/Profile/AccountSettingsSection.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRoundPen,
  Car,
  ShoppingCart,
  FileText,
  PlusCircle,
  Package,
  Heart,
  KeyRound,
  LogOut,
  Trash2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

/* =========================================================
   ACCOUNT SETTINGS
========================================================= */

export default function AccountSettingsSection({
  onEditProfile,
  onChangePassword,
}) {
  const navigate = useNavigate();

  const [buySellOpen, setBuySellOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  /* =======================================================
     HELPERS
  ======================================================= */

  const go = (path) => {
    navigate(path);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    try {
      /*
       * If your existing UserApi is available,
       * you can replace this with:
       *
       * await UserApi.logout();
       */

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      navigate("/login", {
        replace: true,
      });
    }
  };

  /* =======================================================
     DELETE ACCOUNT
  ======================================================= */

  const handleDeleteAccount = async () => {
    if (deleting) return;

    setDeleting(true);

    try {
      /*
       * IMPORTANT:
       *
       * If your UserApi.js already has:
       *
       * deleteMyAccount()
       *
       * call it here.
       *
       * Example:
       *
       * const ok =
       *   await UserApi.deleteMyAccount();
       */

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          "https://rebuy-api.onrender.com/api/auth/delete-account",
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

      if (
        response.ok
      ) {
        localStorage.clear();
        sessionStorage.clear();

        navigate("/login", {
          replace: true,
        });

        return;
      }

      /*
       * If backend endpoint is different,
       * keep the user logged out locally.
       */

      localStorage.clear();
      sessionStorage.clear();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      /*
       * Don't silently delete local session on
       * network failure.
       */

      alert(
        "Unable to delete account. Please try again."
      );
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  /* =======================================================
     MENU ITEM
  ======================================================= */

  const MenuItem = ({
    icon: Icon,
    title,
    color = "text-slate-800",
    onClick,
    danger = false,
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          group

          flex
          w-full
          items-center

          gap-3

          px-4
          py-3.5

          text-left

          transition

          hover:bg-slate-50

          active:scale-[0.995]
        "
      >
        {/* Icon */}

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0

            items-center
            justify-center

            rounded-xl

            ${
              danger
                ? "bg-red-50"
                : "bg-black/[0.045]"
            }
          `}
        >
          <Icon
            size={19}
            strokeWidth={1.9}
            className={
              danger
                ? "text-red-500"
                : "text-slate-700"
            }
          />
        </div>

        {/* Title */}

        <span
          className={`
            flex-1

            text-sm
            font-semibold

            ${
              danger
                ? "text-red-500"
                : color
            }
          `}
        >
          {title}
        </span>

        <ChevronRight
          size={19}
          className="
            text-slate-400

            transition

            group-hover:translate-x-0.5
          "
        />
      </button>
    );
  };

  /* =======================================================
     QUICK ITEM
  ======================================================= */

  const QuickItem = ({
    icon: Icon,
    title,
    onClick,
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          flex
          min-h-[44px]
          w-full

          items-center
          justify-center

          gap-2

          rounded-full

          bg-slate-100

          px-3

          text-center

          transition

          hover:bg-slate-200

          active:scale-[0.98]
        "
      >
        <Icon
          size={17}
          strokeWidth={2}
          className="shrink-0"
        />

        <span
          className="
            truncate

            text-xs
            font-semibold
            text-slate-700
          "
        >
          {title}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* ===================================================
          MAIN CARD
      =================================================== */}

      <div
        className="
          w-full

          overflow-hidden

          rounded-[28px]

          border
          border-white/60

          bg-white/75

          shadow-[0_15px_45px_rgba(15,23,42,0.06)]

          backdrop-blur-xl
        "
      >

        {/* =================================================
            EDIT PROFILE
        ================================================= */}

        <MenuItem
          icon={UserRoundPen}
          title="Edit Profile"
          onClick={onEditProfile}
        />

        {/* =================================================
            BUY & SELL
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setBuySellOpen(
              (value) => !value
            )
          }
          className="
            flex
            w-full
            items-center

            gap-3

            px-4
            py-3.5

            text-left

            transition

            hover:bg-slate-50
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0

              items-center
              justify-center

              rounded-xl

              bg-black/[0.045]
            "
          >
            <Car
              size={19}
              strokeWidth={1.9}
              className="text-slate-700"
            />
          </div>

          <span
            className="
              flex-1

              text-sm
              font-semibold
              text-slate-800
            "
          >
            Buy & Sell
          </span>

          {buySellOpen ? (
            <ChevronDown
              size={20}
              className="
                rotate-180
                text-slate-400
                transition
              "
            />
          ) : (
            <ChevronDown
              size={20}
              className="
                text-slate-400
                transition
              "
            />
          )}
        </button>

        {/* =================================================
            BUY / SELL QUICK ACTIONS
        ================================================= */}

        {buySellOpen && (
          <div
            className="
              grid
              grid-cols-2

              gap-2.5

              px-4
              pb-4
            "
          >
            <QuickItem
              icon={ShoppingCart}
              title="Buy Car"
              onClick={() =>
                go("/need")
              }
            />

            <QuickItem
              icon={FileText}
              title="Buy Cars"
              onClick={() =>
                go("/need-list")
              }
            />

            <QuickItem
              icon={PlusCircle}
              title="Sell Car"
              onClick={() =>
                go("/my-cars")
              }
            />

            <QuickItem
              icon={FileText}
              title="Sell Cars"
              onClick={() =>
                go("/my-cars")
              }
            />
          </div>
        )}

        {/* =================================================
            ORDERS
        ================================================= */}

        <MenuItem
          icon={Package}
          title="My Orders"
          onClick={() =>
            go("/orders")
          }
        />

        {/* =================================================
            WISHLIST
        ================================================= */}

        <MenuItem
          icon={Heart}
          title="My Wishlist"
          onClick={() =>
            go("/wishlist")
          }
        />

        {/* =================================================
            CHANGE PASSWORD
        ================================================= */}

        <MenuItem
          icon={KeyRound}
          title="Change Password"
          onClick={
            onChangePassword
          }
        />

        {/* =================================================
            LOGOUT
        ================================================= */}

        <MenuItem
          icon={LogOut}
          title="Logout"
          danger
          onClick={
            handleLogout
          }
        />

        {/* =================================================
            DELETE ACCOUNT
        ================================================= */}

        <MenuItem
          icon={Trash2}
          title="Delete Account"
          danger
          onClick={() =>
            setDeleteOpen(true)
          }
        />
      </div>

      {/* =====================================================
          DELETE CONFIRM MODAL
      ===================================================== */}

      {deleteOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]

            flex
            items-center
            justify-center

            bg-black/40

            px-5

            backdrop-blur-md
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDeleteOpen(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-[390px]

              rounded-[28px]

              border
              border-white/70

              bg-white

              p-6

              shadow-2xl
            "
          >
            <div
              className="
                mx-auto
                mb-4

                flex
                h-14
                w-14

                items-center
                justify-center

                rounded-2xl

                bg-red-50
              "
            >
              <Trash2
                size={24}
                className="text-red-500"
              />
            </div>

            <h3
              className="
                text-center
                text-xl
                font-bold
                text-slate-900
              "
            >
              Delete Account?
            </h3>

            <p
              className="
                mt-3

                text-center

                text-sm
                leading-6

                text-slate-500
              "
            >
              This action is permanent.
              Your account will be
              deleted forever.
            </p>

            <div
              className="
                mt-6

                grid
                grid-cols-2

                gap-3
              "
            >
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setDeleteOpen(false)
                }
                className="
                  h-12

                  rounded-full

                  bg-slate-100

                  text-sm
                  font-semibold
                  text-slate-700

                  transition

                  hover:bg-slate-200
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={
                  handleDeleteAccount
                }
                className="
                  flex
                  h-12

                  items-center
                  justify-center

                  rounded-full

                  bg-red-500

                  text-sm
                  font-semibold
                  text-white

                  transition

                  hover:bg-red-600

                  disabled:opacity-60
                "
              >
                {deleting ? (
                  <span
                    className="
                      h-5
                      w-5

                      animate-spin

                      rounded-full

                      border-2
                      border-white/30
                      border-t-white
                    "
                  />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}