"use client";

import React, { FC, useState } from "react";
import styles from "./nav-controller.module.css";

interface NavControllerProps{
    onclickFunction:()=>void;
}

const NavController:FC<NavControllerProps> = ({onclickFunction}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleNavBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      className={styles.navControllerButton}
      onClick={() => {
        handleNavBar(); 
        onclickFunction(); // Corrected: Add parentheses to invoke the function
      }}
      aria-expanded={isOpen}   // Accessibility improvement to indicate state
    >
      {isOpen ? '✕' : '☰'}
    </button>
  );
};

export default NavController;
