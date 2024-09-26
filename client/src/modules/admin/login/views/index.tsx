// src/components/AdminLoginForm.tsx
"use client";

import { useState } from 'react';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { AdminLoginService } from '../services/login-service';
import { LoginFormState } from '@/interfaces/admin';

const AdminLoginForm: React.FC = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const router = useRouter();

  // Initialize the AdminLoginService class
  const loginService = new AdminLoginService(client, router, setError, setFormState, formState);

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={loginService.handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={loginService.handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formState.password}
            onChange={loginService.handleInputChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <style jsx>{`
        .login-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #f9f9f9;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
        }

        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        button {
          width: 100%;
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .error {
          color: red;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginForm;
