// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";

// import HomeIcon from "@mui/icons-material/HomeRounded";
// import FavoriteIcon from "@mui/icons-material/FavoriteRounded";
// import CategoryIcon from "@mui/icons-material/AppsRounded";
// import ChatIcon from "@mui/icons-material/ChatBubbleRounded";
// import PersonIcon from "@mui/icons-material/PersonRounded";

// // import { getUnreadCount } from "@/services/chatApi";

// export default function BottomMenu() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [unreadCount, setUnreadCount] = useState(0);

//   /* ================= CURRENT INDEX ================= */

//   const getIndex = () => {
//     if (location.pathname.includes("/home")) return 0;
//     if (location.pathname.includes("/wishlist")) return 1;
//     if (location.pathname.includes("/category")) return 2;
//     if (location.pathname.includes("/chat")) return 3;
//     if (location.pathname.includes("/profile")) return 4;
//     return 0;
//   };

//   const currentIndex = getIndex();

//   /* ================= UNREAD COUNT ================= */

//   const loadUnread = async () => {
//     try {
//       const count = await getUnreadCount();
//       setUnreadCount(count || 0);
//     } catch (e) {
//       console.log("Unread error 👉", e);
//     }
//   };

//   useEffect(() => {
//     loadUnread();
//   }, []);

//   useEffect(() => {
//     loadUnread(); // refresh on route change (Flutter didChangeDependencies equivalent)
//   }, [location.pathname]);

//   /* ================= NAVIGATION ================= */

//   const navItem = (index, path, IconComp) => {
//     const active = currentIndex === index;

//     return (
//       <div
//         onClick={() => !active && navigate(path)}
//         className={`
//           relative cursor-pointer
//           transition-all duration-200
//         `}
//       >
//         <div
//           className={`
//             w-10 h-10 rounded-full flex items-center justify-center
//             transition-all duration-300
//             ${
//               active
//                 ? "bg-[#B497F8] scale-110"
//                 : "bg-[#DFD2FD] hover:scale-105"
//             }
//           `}
//           style={{
//             border: active
//               ? "1.5px solid #B497F8"
//               : "1.5px solid rgba(223,159,248,0.15)",
//           }}
//         >
//           <IconComp style={{ fontSize: 20, color: "white" }} />
//         </div>
//       </div>
//     );
//   };

//   /* ================= CHAT ICON WITH BADGE ================= */

//   const chatItem = () => {
//     const active = currentIndex === 3;

//     return (
//       <div
//         onClick={() => navigate("/chat")}
//         className="relative cursor-pointer"
//       >
//         <div
//           className={`
//             w-10 h-10 rounded-full flex items-center justify-center
//             transition-all duration-300
//             ${
//               active
//                 ? "bg-[#B497F8] scale-110"
//                 : "bg-[#DFD2FD] hover:scale-105"
//             }
//           `}
//           style={{
//             border: active
//               ? "1.5px solid #B497F8"
//               : "1.5px solid rgba(223,159,248,0.15)",
//           }}
//         >
//           <ChatIcon style={{ fontSize: 20, color: "white" }} />
//         </div>

//         {unreadCount > 0 && (
//           <div
//             className="
//               absolute -top-1 -right-1
//               min-w-[18px] h-[18px]
//               bg-red-500 rounded-full
//               flex items-center justify-center
//               text-white text-[10px] font-bold
//               px-[5px]
//             "
//           >
//             {unreadCount}
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="fixed bottom-3 left-0 right-0 flex justify-center z-50">
//       <div
//         className="
//           w-[90%] max-w-md h-[60px]
//           rounded-full
//           backdrop-blur-xl
//           bg-white/20
//           border border-white/30
//           shadow-lg
//           flex items-center justify-evenly
//         "
//         style={{
//           boxShadow: "0 10px 25px rgba(214,174,247,0.12)",
//         }}
//       >
//         {navItem(0, "/home", HomeIcon)}
//         {navItem(1, "/wishlist", FavoriteIcon)}
//         {navItem(2, "/category", CategoryIcon)}
//         {chatItem()}
//         {navItem(4, "/profile", PersonIcon)}
//       </div>
//     </div>
//   );
// }