// src/components/AdminLoginForm.tsx
"use client";

import { useState } from "react";
import styles from "./login.module.css";
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { useRouter } from "next/navigation";
import { AdminLoginService } from "../services/login-service";
import { LoginFormState } from "@/interfaces/admin";

const AdminLoginForm: React.FC = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const router = useRouter();

  // Initialize the AdminLoginService class
  const loginService = new AdminLoginService(
    client,
    router,
    setError,
    setFormState,
    formState
  );

  return (
    <form className={styles.form} onSubmit={loginService.handleSubmit}>
        <h2>Admin Login</h2>
        
      <div className={styles.flexColumn}>
        <label>Email</label>
      </div>
      <div className={styles.inputForm}>
        <i className="ri-mail-line"></i>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter your Email"
          id="email"
          name="email"
          value={formState.email}
          onChange={loginService.handleInputChange}
          required
        />
      </div>
      <div className={styles.flexColumn}>
        <label>Password</label>
      </div>
      <div className={styles.inputForm}>
        <i className="ri-lock-2-line"></i>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter your Password"
          id="password"
          name="password"
          value={formState.password}
          onChange={loginService.handleInputChange}
          required
        />
      </div>
      <div className={styles.flexRow}>
        <span className={styles.span}>Forgot password?</span>
      </div>
      <p className={styles.error}>{error}</p>
      <button type="submit" className={styles.buttonSubmit}>
        Sign In
      </button>
    </form>
  );
};

export default AdminLoginForm;
