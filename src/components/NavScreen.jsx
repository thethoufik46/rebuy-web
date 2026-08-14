import logo from "@/assets/logo/logo_1.webp";

// src/screens/NavScreen.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/apiService";


export default function NavScreen() {
  const navigate = useNavigate();

  const go = (path) => navigate(path);

  const handleLogout = () => {
    logout();
    go("/");
  };

  return (
    <div className="nav-screen">

      {/* =====================================================
          SOFT LAVENDER BACKGROUND
      ===================================================== */}

      <div className="nav-background">
        <motion.div
          className="lavender-orb orb-one"
          animate={{
            x: [0, 35, 0],
            y: [0, -25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="lavender-orb orb-two"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="nav-header">

        {/* BACK */}

        <GlassIcon onClick={() => navigate(-1)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="header-svg"
          >
            <path
              d="M19 12H5"
              strokeLinecap="round"
            />

            <path
              d="M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </GlassIcon>


        {/* LOGO */}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => go("/")}
          className="logo-button"
        >
          <img
            src={logo}
            alt="Re2buy"
          />
        </motion.button>


        {/* RIGHT ICONS */}

        <div className="header-actions">

          <TopIcon
            onClick={() => go("/testimonials")}
            title="Testimonials"
          >
            <span className="star-symbol">★</span>
          </TopIcon>

          <TopIcon
            onClick={() => go("/wishlist")}
            title="Wishlist"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="top-svg"
            >
              <path
                d="M20.8 8.8c0 5.5-8.8 10.4-8.8 10.4S3.2 14.3 3.2 8.8A4.8 4.8 0 018 4a4.9 4.9 0 014 2.1A4.9 4.9 0 0116 4a4.8 4.8 0 014.8 4.8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </TopIcon>

          <TopIcon
            onClick={() => go("/chat")}
            title="Chat"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="top-svg"
            >
              <path
                d="M20 11.5a7.5 7.5 0 01-8 7.5 8.5 8.5 0 01-3.5-.75L4 20l1.75-4A7.5 7.5 0 1112 4a7.5 7.5 0 018 7.5z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </TopIcon>

          <TopIcon
            onClick={() => go("/profile")}
            title="Profile"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="top-svg"
            >
              <circle cx="12" cy="8" r="3.5" />

              <path
                d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5"
                strokeLinecap="round"
              />
            </svg>
          </TopIcon>


          {/* DESKTOP LOGOUT */}

          <div className="desktop-logout">
            <TopIcon
              onClick={handleLogout}
              title="Logout"
              danger
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="top-svg"
              >
                <path
                  d="M17 16l4-4-4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M21 12H8"
                  strokeLinecap="round"
                />

                <path
                  d="M13 19H6a2 2 0 01-2-2V7a2 2 0 012-2h7"
                  strokeLinecap="round"
                />
              </svg>
            </TopIcon>
          </div>

        </div>
      </div>


      {/* =====================================================
          DESKTOP VERSION
      ===================================================== */}

      <main className="desktop-navigation">

        {/* LABEL */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="desktop-label"
        >
          <span />
          RE2BUY / MENU
        </motion.div>


        {/* =================================================
            BIG MENU
        ================================================= */}

        <div className="desktop-menu-grid">

          {/* COLUMN 1 */}

          <div className="desktop-menu-column">

            <DesktopMenuItem
              number="01"
              label="My Profile"
              onClick={() => go("/profile")}
              delay={0.05}
            />

            <DesktopMenuItem
              number="02"
              label="My Orders"
              tamil="ஆர்டர்"
              onClick={() => go("/orders")}
              delay={0.1}
            />

            <DesktopMenuItem
              number="03"
              label="Finance"
              tamil="பைனான்ஸ்"
              onClick={() => go("/finance")}
              delay={0.15}
            />


            <DesktopDivider />


            <DesktopHeading>
              Services
            </DesktopHeading>


         <DesktopMenuItem
  number="04"
  label="Need"
  tamil="கார் வாங்க"
  onClick={() => go("/needs")}
  delay={0.2}
/>

            <DesktopMenuItem
              number="05"
              label="Car Sell"
              tamil="கார் விற்க"
              onClick={() => go("/my-cars")}
              delay={0.25}
            />

            <DesktopMenuItem
              number="06"
              label="Filter Cars"
              tamil="தேடவும்"
              onClick={() => go("/filter")}
              delay={0.3}
            />

          </div>


          {/* COLUMN 2 */}

          <div className="desktop-menu-column">

            <DesktopMenuItem
              number="07"
              label="Buy Property"
              tamil="வீடு வாங்க"
              onClick={() => go("/buy-property")}
              delay={0.35}
            />

            <DesktopMenuItem
              number="08"
              label="Sell Property"
              tamil="வீடு விற்க"
              onClick={() => go("/sell-property")}
              delay={0.4}
            />


            <DesktopDivider />


            <DesktopHeading>
              Support
            </DesktopHeading>


            <DesktopMenuItem
              number="09"
              label="Cashback"
              onClick={() => go("/cashback")}
              delay={0.45}
            />

            <DesktopMenuItem
              number="10"
              label="Partners"
              onClick={() => go("/partners")}
              delay={0.5}
            />

            <DesktopMenuItem
              number="11"
              label="FAQ"
              tamil="கேள்வி & பதில்"
              onClick={() => go("/faq")}
              delay={0.55}
            />

            <DesktopMenuItem
              number="12"
              label="Help & Support"
              tamil="உதவி"
              onClick={() => go("/help")}
              delay={0.6}
            />

          </div>


          {/* COLUMN 3 */}

          <div className="desktop-menu-column desktop-legal-column">

            <DesktopHeading>
              Company
            </DesktopHeading>


            <DesktopMenuItem
              number="13"
              label="Company"
              onClick={() => go("/company")}
              delay={0.65}
            />

            <DesktopMenuItem
              number="14"
              label="Careers"
              onClick={() => go("/careers")}
              delay={0.7}
            />

          <DesktopMenuItem
  number="15"
  label="Privacy Policy"
  onClick={() => go("/privacy-policy")}
  delay={0.75}
/>

<DesktopMenuItem
  number="16"
  label="Terms & Conditions"
  onClick={() => go("/terms-conditions")}
  delay={0.8}
/>

<DesktopMenuItem
  number="17"
  label="Refund & Cancellation"
  onClick={() => go("/refund-policy")}
  delay={0.85}
/>

          </div>

        </div>


        {/* =================================================
            DESKTOP FOOTER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.9,
            duration: 0.6,
          }}
          className="desktop-footer"
        >

          <div className="desktop-footer-line" />

          <div className="desktop-footer-content">

            <div>
              <strong>Re2buy</strong>
              <span>Buy • Sell • Discover</span>
            </div>

            <div className="desktop-footer-center">
              <span>Your trusted marketplace</span>

              <button
                onClick={() => go("/help")}
              >
                Need help? ↗
              </button>
            </div>

            <div className="desktop-social">
              <SocialButton label="IG" />
              <SocialButton label="FB" />
              <SocialButton label="IN" />
            </div>

          </div>

          <p className="desktop-copyright">
            © {new Date().getFullYear()} Re2buy. All rights reserved.
          </p>

        </motion.div>

      </main>


      {/* =====================================================
          MOBILE VERSION — OLD DESIGN
          DO NOT CHANGE
      ===================================================== */}

      <main className="mobile-navigation">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mobile-glass-panel"
        >

          <div className="mobile-sections">

            {/* =============================================
                SECTION 1
            ============================================= */}

            <MobileSection>

              <SectionTitle title="Account" />

              <NavItem
                label="My Profile"
                onClick={() => go("/profile")}
              />

              <NavItem
                label="My Orders (ஆர்டர்)"
                onClick={() => go("/orders")}
              />

              <NavItem
                label="Finance (பைனான்ஸ்)"
                onClick={() => go("/finance")}
              />

            </MobileSection>


            {/* =============================================
                SECTION 2
            ============================================= */}

            <MobileSection>

              <SectionTitle title="Services" />

              <SubTitle text="Car Services" />

              <NavItem
                label="Car Need (கார் வாங்க)"
                onClick={() => go("/buy-car")}
              />

              <NavItem
                label="Car Sell (கார் விற்க)"
                onClick={() => go("/my-cars")}
              />

              <NavItem
                label="Filter Cars (தேடவும்)"
                onClick={() => go("/filter")}
              />

              <Divider />

              <SubTitle text="Property Services" />

              <NavItem
                label="Buy (வீடு வாங்க)"
                onClick={() => go("/buy-property")}
              />

              <NavItem
                label="Sell (வீடு விற்க)"
                onClick={() => go("/sell-property")}
              />

            </MobileSection>


            {/* =============================================
                SECTION 3
            ============================================= */}

            <MobileSection>

              <SectionTitle title="Support" />

              <NavItem
                label="Cashback"
                onClick={() => go("/cashback")}
              />

              <NavItem
                label="Partners"
                onClick={() => go("/partners")}
              />

              <NavItem
                label="FAQ (கேள்வி & பதில்)"
                onClick={() => go("/faq")}
              />

              <NavItem
                label="Help & Support (உதவி)"
                onClick={() => go("/help")}
              />

            </MobileSection>


            {/* =============================================
                SECTION 4
            ============================================= */}

            <MobileSection>

              <SectionTitle title="Legal" />

              <NavItem
                label="Company"
                onClick={() => go("/company")}
              />

              <NavItem
                label="Careers"
                onClick={() => go("/careers")}
              />

              <NavItem
                label="Privacy Policy"
                onClick={() => go("/privacy")}
              />

              <NavItem
                label="Terms & Conditions"
                onClick={() => go("/terms")}
              />

              <NavItem
                label="Refund & Cancellation"
                onClick={() => go("/refund")}
              />

            </MobileSection>

          </div>


          {/* =============================================
              MOBILE LOGOUT
          ============================================= */}

          <div className="mobile-logout-area">

            <Divider />

            <NavItem
              label="Logout"
              danger
              onClick={handleLogout}
            />

          </div>

        </motion.div>

      </main>

    </div>
  );
}


/* =============================================================
   DESKTOP MENU ITEM
============================================================= */

function DesktopMenuItem({
  number,
  label,
  tamil,
  onClick,
  delay = 0,
}) {
  return (
    <motion.button
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      className="desktop-menu-item"
    >

      <span className="desktop-number">
        {number}
      </span>

      <span className="desktop-item-text">

        {label}

        {tamil && (
          <span className="desktop-tamil">
            ({tamil})
          </span>
        )}

      </span>

      <span className="desktop-arrow">
        ↗
      </span>

    </motion.button>
  );
}


/* =============================================================
   DESKTOP HEADING
============================================================= */

function DesktopHeading({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="desktop-heading"
    >
      {children}
    </motion.div>
  );
}


/* =============================================================
   DESKTOP DIVIDER
============================================================= */

function DesktopDivider() {
  return (
    <div className="desktop-divider" />
  );
}


/* =============================================================
   DESKTOP SOCIAL
============================================================= */

function SocialButton({ label }) {
  return (
    <motion.button
      whileHover={{
        y: -4,
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.92,
      }}
      className="social-button"
    >
      {label}
    </motion.button>
  );
}


/* =============================================================
   MOBILE — ORIGINAL COMPONENTS
============================================================= */

function MobileSection({ children }) {
  return (
    <div className="mobile-section">
      {children}
    </div>
  );
}


function SectionTitle({ title }) {
  return (
    <h2 className="mobile-section-title">
      {title}
    </h2>
  );
}


function SubTitle({ text }) {
  return (
    <p className="mobile-sub-title">
      {text}
    </p>
  );
}


function NavItem({
  label,
  onClick,
  danger,
}) {
  return (
    <motion.button
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className={`mobile-nav-item ${
        danger
          ? "mobile-nav-danger"
          : ""
      }`}
    >
      <span>
        {label}
      </span>

      <span className="mobile-nav-arrow">
        ›
      </span>
    </motion.button>
  );
}


function Divider() {
  return (
    <div className="mobile-divider" />
  );
}


/* =============================================================
   GLASS ICON
============================================================= */

function GlassIcon({
  children,
  onClick,
}) {
  return (
    <motion.button
      whileTap={{
        scale: 0.9,
      }}
      whileHover={{
        scale: 1.04,
      }}
      onClick={onClick}
      className="glass-icon"
    >
      {children}
    </motion.button>
  );
}


/* =============================================================
   TOP ICON
============================================================= */

function TopIcon({
  children,
  onClick,
  title,
  danger = false,
}) {
  return (
    <motion.button
      whileTap={{
        scale: 0.9,
      }}
      whileHover={{
        y: -2,
      }}
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`top-icon ${
        danger
          ? "top-icon-danger"
          : ""
      }`}
    >
      {children}
    </motion.button>
  );
}


/* =============================================================
   STYLES
============================================================= */

const styles = `
`;

/* =============================================================
   GLOBAL STYLE INJECTION
============================================================= */

const styleElement = document.createElement("style");

styleElement.innerHTML = `

/* ============================================================
   ROOT
============================================================ */

.nav-screen {
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;

  background:
    linear-gradient(
      135deg,
      #fbfaff 0%,
      #f7f3ff 48%,
      #fcfbff 100%
    );

  color: #17151c;

  font-family:
    Arial,
    Helvetica,
    sans-serif;
}


/* ============================================================
   BACKGROUND
============================================================ */

.nav-background {
  position: fixed;
  inset: 0;

  overflow: hidden;

  pointer-events: none;

  z-index: 0;
}


.lavender-orb {
  position: absolute;

  width: 540px;
  height: 540px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(191, 163, 255, 0.24),
      rgba(220, 204, 255, 0.10) 45%,
      transparent 72%
    );

  filter: blur(18px);
}


.orb-one {
  top: -300px;
  left: -200px;
}


.orb-two {
  right: -280px;
  bottom: -280px;
}


/* ============================================================
   HEADER
============================================================ */

.nav-header {
  position: relative;
  z-index: 20;

  height: 92px;

  width: 100%;

  padding:
    20px
    clamp(20px, 4vw, 64px);

  display: flex;

  align-items: center;

  justify-content: space-between;
}


.glass-icon {
  width: 48px;
  height: 48px;

  border-radius: 50%;

  border: 1px solid
    rgba(255,255,255,.9);

  background:
    rgba(255,255,255,.62);

  backdrop-filter: blur(20px);

  -webkit-backdrop-filter: blur(20px);

  box-shadow:
    0 8px 30px
    rgba(100,80,130,.07);

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  color: #29252f;
}


.header-svg {
  width: 21px;
  height: 21px;
}


.logo-button {
  position: absolute;

  left: 50%;

  transform:
    translateX(-50%);

  border: none;

  background: transparent;

  padding: 5px 10px;

  cursor: pointer;
}


.logo-button img {
  height: 38px;

  width: auto;

  object-fit: contain;
}


.header-actions {
  display: flex;

  align-items: center;

  gap: 8px;
}


.top-icon {
  width: 44px;
  height: 44px;

  border-radius: 50%;

  border: 1px solid
    rgba(255,255,255,.9);

  background:
    rgba(255,255,255,.60);

  backdrop-filter: blur(18px);

  -webkit-backdrop-filter: blur(18px);

  box-shadow:
    0 6px 24px
    rgba(100,80,130,.06);

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  color: #5f5869;
}


.top-icon:hover {
  background: #fff;
}


.top-icon-danger {
  color: #d66a6a;

  background:
    rgba(255,245,245,.72);
}


.top-svg {
  width: 18px;
  height: 18px;
}


.star-symbol {
  font-size: 17px;
}


/* ============================================================
   DESKTOP NAVIGATION
============================================================ */

.desktop-navigation {
  position: relative;

  z-index: 5;

  width:
    min(
      1500px,
      calc(100% - 48px)
    );

  box-sizing: border-box;

  margin: 0 auto;

  padding:
    42px
    0
    55px;
}


.desktop-label {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 34px;

  color: #968ea1;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: .23em;
}


.desktop-label span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #a98ce7;

  box-shadow:
    0 0 0 5px
    rgba(169,140,231,.10);
}


/* ============================================================
   DESKTOP GRID
============================================================ */

.desktop-menu-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr)
    minmax(0, 0.82fr);

  gap: clamp(24px, 4vw, 72px);

  width: 100%;
  max-width: 100%;

  align-items: start;
  min-width: 0;
}


.desktop-menu-column {
  min-width: 0;
}


.desktop-legal-column {
  padding-left: 0;
  min-width: 0;
  overflow: hidden;
}


/* ============================================================
   DESKTOP ITEM
============================================================ */

.desktop-menu-item {
  position: relative;

  width: 100%;
  max-width: 100%;
  min-width: 0;

  border: none;

  background: transparent;

  padding:
    5px
    0;

  display: flex;

  align-items: baseline;

  gap: 12px;

  text-align: left;

  cursor: pointer;

  overflow: hidden;
  box-sizing: border-box;

  color: #17151b;
}


.desktop-number {
  flex: 0 0 auto;

  color: #b9b1c1;

  font-size: 9px;

  font-weight: 600;

  transform:
    translateY(-6px);
}


.desktop-item-text {
  display: block;

  font-size: clamp(
    30px,
    3.25vw,
    58px
  );

  line-height: 1.02;

  font-weight: 750;

  letter-spacing: -0.055em;

  white-space: normal;

  overflow-wrap: anywhere;
  word-break: normal;

  max-width: 100%;
  min-width: 0;
}


.desktop-tamil {
  display: inline-block;

  margin-left: 9px;

  color: #aaa3b2;

  font-size: 13px;

  font-weight: 400;

  letter-spacing: 0;
}


.desktop-arrow {
  position: absolute;

  right: 0;

  top: 50%;

  transform:
    translateY(-50%)
    translateX(18px);

  opacity: 0;

  color: #9b7ad1;

  font-size: 30px;

  transition:
    opacity .25s ease,
    transform .45s
    cubic-bezier(.22,1,.36,1);
}


.desktop-menu-item:hover
.desktop-item-text {
  color: #9a79d1;

  transform:
    translateX(8px);
}


.desktop-menu-item:hover
.desktop-arrow {
  opacity: 1;

  transform:
    translateY(-50%)
    translateX(0);
}


.desktop-menu-item:active
.desktop-item-text {
  transform:
    translateX(12px)
    scale(.98);
}


/* ============================================================
   DESKTOP HEADING
============================================================ */

.desktop-heading {
  margin:
    24px
    0
    12px;

  color: #a284d4;

  font-size:
    clamp(
      17px,
      1.4vw,
      22px
    );

  font-weight: 700;

  letter-spacing:
    -.025em;
}


/* ============================================================
   DESKTOP DIVIDER
============================================================ */

.desktop-divider {
  width: 100%;

  height: 1px;

  margin:
    28px
    0
    8px;

  background:
    linear-gradient(
      90deg,
      rgba(175,160,200,.38),
      rgba(175,160,200,.04)
    );
}


/* ============================================================
   DESKTOP FOOTER
============================================================ */

.desktop-footer {
  margin-top: 68px;
}


.desktop-footer-line {
  width: 100%;

  height: 1px;

  background:
    rgba(30,25,40,.12);
}


.desktop-footer-content {
  display: grid;

  grid-template-columns:
    1fr
    1fr
    1fr;

  align-items: center;

  padding:
    24px
    0
    16px;
}


.desktop-footer-content > div:first-child {
  display: flex;

  flex-direction: column;

  gap: 3px;

  color: #7c7485;

  font-size: 12px;
}


.desktop-footer-content strong {
  color: #28232f;

  font-size: 14px;
}


.desktop-footer-center {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 4px;

  color: #8b8392;

  font-size: 12px;
}


.desktop-footer-center button {
  border: none;

  background: transparent;

  color: #9978ce;

  cursor: pointer;

  font-size: 12px;

  font-weight: 600;
}


.desktop-social {
  display: flex;

  justify-content: flex-end;

  gap: 9px;
}


.social-button {
  width: 44px;
  height: 44px;

  border-radius: 50%;

  border: 1px solid
    rgba(255,255,255,.95);

  background:
    rgba(255,255,255,.68);

  color: #696173;

  font-size: 10px;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 5px 20px
    rgba(100,80,130,.05);
}


.social-button:hover {
  background:
    #e9ddff;

  color:
    #8464bd;
}


.desktop-copyright {
  margin: 0;

  color: #aaa3b0;

  font-size: 10px;
}


/* ============================================================
   MOBILE NAVIGATION
============================================================ */

.mobile-navigation {
  display: none;
}


/* ============================================================
   TABLET
============================================================ */

@media (max-width: 1100px) {

  .desktop-navigation {
    width:
      calc(100% - 48px);
  }


  .desktop-menu-grid {
    gap: 30px;
  }


  .desktop-item-text {
    font-size:
      clamp(
        30px,
        4vw,
        50px
      );
  }

}


/* ============================================================
   MOBILE — ORIGINAL DESIGN
============================================================ */

@media (max-width: 768px) {

  /* -----------------------------------------
     KEEP ORIGINAL MOBILE BACKGROUND
  ----------------------------------------- */

  .nav-screen {
    min-height: 100vh;

    background:
      linear-gradient(
        135deg,
        #f7f5ff 0%,
        #f2efff 100%
      );
  }


  /* -----------------------------------------
     ORIGINAL MOBILE HEADER
  ----------------------------------------- */

  .nav-header {
    height: auto;

    padding:
      8px
      8px
      0;
  }


  .glass-icon {
    width: 40px;
    height: 40px;

    border-radius: 12px;

    background:
      rgba(255,255,255,.70);

    box-shadow:
      0 2px 8px
      rgba(0,0,0,.04);
  }


  .header-svg {
    width: 20px;
    height: 20px;
  }


  .logo-button {
    position: static;

    transform: none;

    padding: 0;
  }


  .logo-button img {
    height: 28px;
  }


  .header-actions {
    gap: 6px;
  }


  .top-icon {
    width: 36px;
    height: 36px;

    background:
      rgba(255,255,255,.70);

    box-shadow:
      0 2px 8px
      rgba(0,0,0,.04);
  }


  .top-svg {
    width: 16px;
    height: 16px;
  }


  .star-symbol {
    font-size: 14px;
  }


  .desktop-logout {
    display: none;
  }


  /* -----------------------------------------
     HIDE NEW DESKTOP DESIGN
  ----------------------------------------- */

  .desktop-navigation {
    display: none;
  }


  /* -----------------------------------------
     SHOW OLD MOBILE DESIGN
  ----------------------------------------- */

  .mobile-navigation {
    display: block;

    width: 100%;

    padding:
      0
      8px
      20px;
  }


  .mobile-glass-panel {
    margin-top: 16px;

    border-radius: 24px;

    background:
      rgba(255,255,255,.60);

    backdrop-filter:
      blur(24px);

    -webkit-backdrop-filter:
      blur(24px);

    border:
      1px solid
      rgba(255,255,255,.45);

    box-shadow:
      0 12px 40px
      rgba(50,40,80,.08);

    padding:
      16px;
  }


  .mobile-sections {
    display: grid;

    grid-template-columns: 1fr;

    gap: 24px;
  }


  .mobile-section {
    width: 100%;
  }


  .mobile-section-title {
    margin:
      0
      0
      7px;

    font-size:
      18px;

    line-height: 1.2;

    font-weight: 700;

    color:
      #26222e;
  }


  .mobile-sub-title {
    margin:
      13px
      0
      4px;

    font-size:
      11px;

    font-weight: 700;

    color:
      #948ba2;
  }


  .mobile-nav-item {
    width: 100%;

    min-height: 46px;

    padding:
      11px
      10px;

    border: none;

    border-radius: 12px;

    background:
      transparent;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 10px;

    color:
      #30303a;

    font-size:
      14px;

    font-weight: 500;

    text-align: left;

    cursor: pointer;

    transition:
      background .25s ease,
      color .25s ease;
  }


  .mobile-nav-item:hover {
    background:
      rgba(255,255,255,.65);

    color:
      #8062b5;
  }


  .mobile-nav-arrow {
    font-size: 21px;

    line-height: 1;

    color:
      #aaa2b0;
  }


  .mobile-divider {
    width: 100%;

    height: 1px;

    margin:
      8px
      0;

    background:
      rgba(120,110,135,.10);
  }


  .mobile-nav-danger {
    color:
      #d65f6b;

    background:
      rgba(255,240,242,.45);
  }


  .mobile-logout-area {
    margin-top: 8px;
  }


  /* -----------------------------------------
     KEEP MOBILE BACKGROUND SOFT
  ----------------------------------------- */

  .lavender-orb {
    width: 300px;
    height: 300px;

    opacity: .45;
  }


  .orb-one {
    top: -150px;
    left: -150px;
  }


  .orb-two {
    right: -150px;
    bottom: -150px;
  }

}


/* ============================================================
   SMALL MOBILE
============================================================ */

@media (max-width: 480px) {

  .nav-header {
    padding:
      8px
      6px
      0;
  }


  .mobile-navigation {
    padding:
      0
      6px
      15px;
  }


  .mobile-glass-panel {
    margin-top: 14px;

    border-radius: 22px;

    padding:
      14px;
  }


  .mobile-sections {
    gap: 20px;
  }


  .mobile-section-title {
    font-size:
      17px;
  }


  .mobile-nav-item {
    min-height:
      44px;

    font-size:
      13px;
  }


  .logo-button img {
    height:
      26px;
  }


  .top-icon {
    width:
      34px;

    height:
      34px;
  }


  .glass-icon {
    width:
      38px;

    height:
      38px;
  }

}

`;

if (!document.head.querySelector("[data-nav-screen-style]")) {
  styleElement.setAttribute(
    "data-nav-screen-style",
    "true"
  );

  document.head.appendChild(styleElement);


  
}

