"use client";
import ButtonComponent from "@/themes/button-component/button-component";
import React, { useState, useEffect } from "react";
import styles from "./auth-buttons.module.css";
import { CookieClass } from "@/utils/cookies";
import { ApolloClient, NormalizedCacheObject, useApolloClient } from "@apollo/client";
import { NavServices } from "../../services/nav-services";
import { UserProfilePic } from "@/interfaces/user/user-details";

const AuthButtons = () => {
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [user, setUser] = useState<UserProfilePic>();
  const [userLogedIn, setUserLogedIn] = useState(false);


  const navServices = new NavServices(client);

  useEffect(() => {
    const checkUserCookie = async () => {
      const cookieClass = new CookieClass();
      const hasUserIdCookie = await cookieClass.checkCookie("userId");
      if (hasUserIdCookie) {
        await navServices.fetchUserProfilePic(setUser);
        setUserLogedIn(true);
      }
    };

    checkUserCookie(); // Invoke the async function inside useEffect
  }, []); // Empty dependency array ensures this runs only once after component mount

  const handleLogout = async() =>{
    const cookieClass = new CookieClass();
    await cookieClass.removeCookie("userId");
    window.location.reload();
  }

  return (
    <div className={styles.authWrapper}>
      {userLogedIn && (
        <>
          <button className={styles.profileButton}>
            <img className={styles.profilePic} src={user?.profileUrl} alt="" />
          </button>
          <ButtonComponent
            value="Logout"
            className={styles.signUpButton}
            onClickFunction={handleLogout}
          />
        </>
      )}
      {!userLogedIn && (
        <>
          <ButtonComponent value="Login" className={styles.loginButton} 
            onClickFunction={() => {
              window.location.href = "/login";
            }}
          />
          <ButtonComponent
            value="Sign Up"
            className={styles.signUpButton}
            onClickFunction={() => {
              window.location.href = "/register";
            }}
          />
        </>
      )}
    </div>
  );
};

export default AuthButtons;
