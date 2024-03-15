import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
function Landing() {
  const [user, setUser] = useState("");
  const [AuthUser, setAuthUser] = useState(false);
  const [Loading, setLoading] = useState(true);

  const handleFetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://localhost:5000/:user/dashboard/`,
          {
            headers,
          }
        );
        console.log(response.data);
        setUser(response.data.user);

        setAuthUser(true);
      } else {
        console.error("Token not found");
        setAuthUser(false);
        // Handle the case where the token is not available or not valid
      }
    } catch (error) {
      setAuthUser(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    handleFetchData();
    setLoading(false);
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <link rel="stylesheet" href="/landing_page/landing.css" />

      <main>
        <Navbar user={user} />
        <section
          class="home-section home-fade home-full-height bg-dark-60 landing-header"
          id="home"
          data-background="/landing_page/landing_bg.png"
          style={{
            height: "746px",
            backgroundImage: `url("/landing_page/landing_bg.png")`,
          }}
        >
          <div class="titan-caption">
            <div class="caption-content">
              <div class="container">
                <div class="font-alt titan-title-size-4">
                  <img class="logo_moneyminder" src="/landing_page/mm1.png" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="main">
          <section
            class="module pb-0 bg-dark landing-reason parallax-bg"
            data-background="/landing_page/landing_bg.png"
          >
            <div class="container">
              <div class="row">
                <div class="col-sm-6">
                  <img src="/landing_page/header_Clip.png" alt="" />
                </div>
                <div class="col-sm-6">
                  <h2 class="module-title font-alt align-left">
                    Welcome to MoneyMinder
                  </h2>
                  <p>
                    Introducing MoneyMinder, an Expense Tracker designed to
                    change the way you manage your expenses. In today's
                    fast-paced world, keeping track of expenses can be
                    challenging and time-consuming. That's where MoneyMinder
                    comes in. With its sleek & intuitive design, MoneyMinder
                    simplifies expense tracking, making it effortless &
                    efficient.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section class="module" id="alt-features">
            <div class="container">
              <div class="row d-flex justify-content-center">
                <div class="text-center">
                  <h2 class="module-title font-alt">Our features</h2>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6 col-md-3 col-lg-3 d-flex flex-column  justify-content-around">
                  <div class="alt-features-item">
                    <div class="alt-features-icon">
                      <span class="icon-strategy"></span>
                    </div>
                    <h3
                      class="alt-features-title font-alt"
                      style={{ fontSize: "20px" }}
                    >
                      MANAGE DAY TO DAY EXPENSES
                    </h3>
                    With MoneyMinder, users can store their expense data in the
                    database by manually entering the expenses
                  </div>
                  <div class="alt-features-item">
                    <div class="alt-features-icon">
                      <span class="icon-tools-2"></span>
                    </div>
                    <h3
                      class="alt-features-title font-alt"
                      style={{ fontSize: "20px" }}
                    >
                      VIEW EXPENSE HISTORY
                    </h3>
                    With MoneyMinder, users can view their expense history date
                    wise & users can also filter & sort out their expense data
                  </div>
                </div>
                <div class="col-md-6 col-lg-6 hidden-xs hidden-sm">
                  <div class="alt-services-image align-center">
                    <img
                      src="/landing_page\feature-icon.png"
                      alt="Feature Image"
                    />
                  </div>
                </div>
                <div class="col-sm-6 col-md-3 col-lg-3  d-flex flex-column  justify-content-around">
                  {/*<div class="alt-features-item">
                    <div class="alt-features-icon">
                      <span class="icon-camera"></span>
                    </div>
                    <h3
                      class="alt-features-title font-alt"
                      style={{ fontSize: "20px" }}
                    >
                      MANAGE YOUR LOANS{" "}
                    </h3>
                    With MoneyMinder, users can store their loan data in the
                    database & users can also track all the loans at one place
                  </div>*/}
                  <div class="alt-features-item">
                    <div class="alt-features-icon">
                      <span class="icon-mobile"></span>
                    </div>
                    <h3
                      class="alt-features-title font-alt"
                      style={{ fontSize: "20px" }}
                    >
                      GRAPHICAL INSIGHTS
                    </h3>
                    With MoneyMinder, users can view their category wise
                    spending and month wise breakup of all the expenses sweet
                    mornings.
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="module-small free-trial">
            {user ? (
              <div class="container text-center">
                <div class="row">
                  <div class="col-sm-12 col-sm-offset-0">
                    <h3 class="font-alt">
                      <span class="color-golden">
                        Start managing your expense
                      </span>{" "}
                    </h3>
                  </div>
                </div>
                <div class="btn btn-lg btn-warning btn-circle">
                  <NavLink
                    style={({ isActive, isPending }) => {
                      return {
                        fontWeight: isActive ? "bold" : "",
                        color: isPending ? "red" : "white",
                      };
                    }}
                    to="/:user/dashboard/"
                  >
                    <div>Dashboard</div>
                  </NavLink>
                </div>
              </div>
            ) : (
              <div class="container text-center">
                <div class="row">
                  <div class="col-sm-12 col-sm-offset-0">
                    <h3 class="font-alt">
                      Do not have an account yet?
                      <br />
                      <span class="color-golden">
                        Click the register button
                        <br /> to get started
                      </span>{" "}
                    </h3>
                  </div>
                </div>
                <div class="btn btn-lg btn-warning btn-circle">
                  <NavLink
                    style={({ isActive, isPending }) => {
                      return {
                        fontWeight: isActive ? "bold" : "",
                        color: isPending ? "red" : "white",
                      };
                    }}
                    to="/register/"
                  >
                    <div>Register</div>
                  </NavLink>
                </div>
              </div>
            )}
          </section>

          <footer class="footer bg-dark" id="contact">
            <div class="container">
              <div class="row">
                <div class="col-sm-6">
                  <p class="copyright font-alt">
                    © 2024 MoneyMinder, All Rights Reserved
                  </p>
                </div>
                {/* <div class="col-sm-6">
                <div class="footer-social-links">
                  <a href="https://github.com/sammedcjain/pennywise">
                    <i class="fa-brands fa-github fa-xl"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/sammed-jain-663572203/">
                    <i class="fa-brands fa-linkedin fa-xl"></i>
                  </a>
                  <a href="https://pennywise-uecs.onrender.com/">
                    <i class="fa-solid fa-globe fa-xl"></i>
                  </a>
                </div>
              </div> */}
              </div>
            </div>
          </footer>
        </div>
        <div class="scroll-up">
          <a href="#">
            <i class="fa fa-angle-double-up"></i>
          </a>
        </div>
      </main>
    </>
  );
}

export default Landing;
