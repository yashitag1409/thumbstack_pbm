"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState("login"); // 'login' or 'register'

  return (
    <Modal
      title={view === "login" ? "Welcome Back" : "Create Vault Account"}
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="py-2">
        {view === "login" ? (
          <>
            <LoginForm onClose={onClose} />
            <div className="mt-6 text-center border-t border-card-border pt-4">
              <p className="text-sm text-muted">
                Don't have an account?{" "}
                <button
                  onClick={() => setView("register")}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  Signup now
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <RegisterForm onSetLogin={() => setView("login")} />
            <div className="mt-6 text-center border-t border-card-border pt-4">
              <p className="text-sm text-muted">
                Already have a vault?{" "}
                <button
                  onClick={() => setView("login")}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
