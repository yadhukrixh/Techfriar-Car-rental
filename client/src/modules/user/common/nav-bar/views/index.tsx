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
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // Function to toggle the visibility of the navList
  const navControl = () => {
    setIsNavVisible((prev) => !prev);
  };

  // Listen for window resize to dynamically update window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

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
