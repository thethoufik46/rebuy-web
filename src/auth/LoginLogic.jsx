import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const API_BASE = "https://rebuy-api.onrender.com/api";

export default function LoginLogic() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [obscure, setObscure] = useState(true);

  // 🎵 Audio instances
  const mobileAudio = useRef(new Audio("/audio/mobile.mp3"));
  const passwordAudio = useRef(new Audio("/audio/password.mp3"));

  const playAudio = (type) => {
    try {
      if (type === "mobile") {
        mobileAudio.current.currentTime = 0;
        mobileAudio.current.play();
      } else {
        passwordAudio.current.currentTime = 0;
        passwordAudio.current.play();
      }
    } catch (e) {}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (loading) return;

    if (!form.identifier || !form.password) {
      alert("Please enter phone/email & password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: form.identifier.trim(),
          password: form.password.trim(),
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (!data.success || !data.token) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/home");
    } catch (err) {
      setLoading(false);
      alert("Server error");
    }
  };

  return (
    <Login
      form={form}
      loading={loading}
      obscure={obscure}
      setObscure={setObscure}
      handleChange={handleChange}
      handleLogin={handleLogin}
      playAudio={playAudio}
    />
  );
}