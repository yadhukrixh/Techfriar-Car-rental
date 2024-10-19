"use client";

import React, { useState, useEffect } from "react";
import AuthButtons from "../components/auth-buttons/auth-buttons";
import NavList from "../components/nav-list/nav-list";
import styles from "./index.module.css";
import Logo from "../components/logo/logo";
import NavController from "../components/nav-controller/nav-controller";

const NavBar = () => {
  // State to manage the visibility of the navList
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0); // Initialize to 0

  // Function to toggle the visibility of the navList
  const navControl = () => {
    setIsNavVisible((prev) => !prev);
  };

  // Set the window width only on the client side
  useEffect(() => {
    // Function to update the window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial window width on component mount
    setWindowWidth(window.innerWidth);

    // Listen for window resize to dynamically update window width
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Conditionally render based on windowWidth
  return (
    <div className={styles.navBarWrapper}>
      <Logo />
      {windowWidth <= 900 ? (
        <>
          <NavController onclickFunction={navControl} />
          <div
            className={styles.navList}
            style={{ display: isNavVisible ? "flex" : "none" }}
          >
            <NavList />
            <AuthButtons />
          </div>
        </>
      ) : (
        <>
          <NavList />
          <AuthButtons />
        </>
      )}
    </div>
  );
};

export default NavBar;
