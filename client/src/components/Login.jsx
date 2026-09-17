import { useState } from "react";
import { motion } from "framer-motion";
import { Boxes } from "lucide-react";
import { api } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();

    try {
      const data = await api(register ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: JSON.stringify(
          register ? { name, email, password } : { email, password },
        ),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="login">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
      >
        <div className="brand-mark">
          <Boxes />
        </div>
        <h1>Store  Inventory</h1>
        <p>Factory store, intelligently managed.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          {register && (
            <input
              placeholder="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="primary">
            {register ? "Create account" : "Sign in"}
          </button>
        </form>
        <button className="link" onClick={() => setRegister(!register)}>
          {register
            ? "Already have an account? Sign in"
            : "Create first admin account"}
        </button>
      </motion.div>
    </div>
  );
}
