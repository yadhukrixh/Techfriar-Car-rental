"use client";

import React, { useState, useEffect } from "react";
import AuthButtons from "../components/auth-buttons/auth-buttons";
import NavList from "../components/nav-list/nav-list";
import styles from "./index.module.css";
import Logo from "../components/logo/logo";
import NavController from "../components/nav-controller/nav-controller";

const NavBar = () => {
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false); // New state for scroll

  // Toggle visibility of navList
  const navControl = () => {
    setIsNavVisible((prev) => !prev);
  };

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Monitor scroll to apply box-shadow when scrollY > 50
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${styles.navBarWrapper} ${isScrolled ? styles.scrolled : ""}`}
    >
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
