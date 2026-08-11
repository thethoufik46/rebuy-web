// src/auth/ProtectedRoute.jsx

import React, { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { getUserDetails } from "@/services/userApi";

/* =========================================================
   PROTECTED ROUTE
   ---------------------------------------------------------
   Login இல்லாமல் private pages open ஆகாது.
========================================================= */

export default function ProtectedRoute() {
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        /* =================================================
           1. CHECK TOKEN
        ================================================= */

        const token =
          localStorage.getItem("auth_token");

        if (!token) {
          if (mounted) {
            setAuthenticated(false);
            setChecking(false);
          }

          return;
        }

        /* =================================================
           2. VERIFY TOKEN WITH BACKEND
        ================================================= */

        const user =
          await getUserDetails();

        if (!mounted) {
          return;
        }

        if (user) {
          setAuthenticated(true);
        } else {
          /* ===============================================
             INVALID / EXPIRED TOKEN
          =============================================== */

          localStorage.removeItem(
            "auth_token"
          );

          localStorage.removeItem(
            "role"
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "accessToken"
          );

          localStorage.removeItem(
            "authToken"
          );

          localStorage.removeItem(
            "user"
          );

          sessionStorage.removeItem(
            "user"
          );

          sessionStorage.removeItem(
            "re2buy_user_profile"
          );

          setAuthenticated(false);
        }
      } catch (error) {
        console.error(
          "ProtectedRoute auth error:",
          error
        );

        if (!mounted) {
          return;
        }

        setAuthenticated(false);
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     AUTH CHECK LOADING
  ======================================================= */

  if (checking) {
    return (
      <div
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-white
        "
      >
        <div
          className="
            h-9
            w-9
            animate-spin
            rounded-full
            border-[3px]
            border-slate-200
            border-t-slate-900
          "
        />
      </div>
    );
  }

  /* =======================================================
     NOT LOGGED IN
  ======================================================= */

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  /* =======================================================
     LOGGED IN
  ======================================================= */

  return <Outlet />;
}