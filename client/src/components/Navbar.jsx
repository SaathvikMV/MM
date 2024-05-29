import { IoMdLogOut } from "react-icons/io";
import { NavLink } from "react-router-dom";
import "./Dashboard.css";
function Navbar(props) {
  const { user } = props;
  return (
    <>
      <nav className="navbar navbar-expand-md">
        <a className="navbar-brand" href="localhost:3000">
          <img
            style={{ width: "auto", minHeight: "43px" }}
            src="/landing_page/mm2.png"
            alt="logo"
          />{" "}
          <span style={{ fontFamily: "'Dancing Script', cursive" }}>
            MoneyMinder
          </span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
        >
          <i
            className="fa-solid fa-grip-lines"
            style={{ color: "#ffffff" }}
          ></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                style={({ isActive, isPending }) => {
                  return {
                    fontSize: "1.2em",
                    fontWeight: isActive ? "bold" : "lighter",
                    color: isPending ? "red" : "white",
                  };
                }}
                to="/"
              >
                <div>Home</div>
              </NavLink>
            </li>
            <li className="nav-item">
              {!user ? (
                <></>
              ) : (
                <NavLink
                  style={({ isActive, isPending }) => {
                    return {
                      fontSize: "1.2em",
                      fontWeight: isActive ? "bold" : "normal",
                      color: isPending ? "red" : "white",
                    };
                  }}
                  to={`/${user}/dashboard`}
                >
                  <div>Dashboard</div>
                </NavLink>
              )}
            </li>
            <li className="nav-item">
              {!user ? (
                <></>
              ) : (
                <NavLink
                  style={({ isActive, isPending }) => {
                    return {
                      fontSize: "1.2em",
                      fontWeight: isActive ? "bold" : "lighter",
                      color: isPending ? "red" : "white",
                    };
                  }}
                  to={`/${user}/insights`}
                >
                  <div>Insights</div>
                </NavLink>
              )}
            </li>

            {/* <li className="nav-item mobile_only">
              {" "}
              <h5>
                <a href="/logout">
                  {" "}
                  <button
                    style={{ color: "white" }}
                    className="btn-dark dropdown-item"
                  >
                    Logout
                  </button>{" "}
                </a>{" "}
              </h5>{" "}
            </li> */}
          </ul>
          <ul
            className="navbar-nav last_nav"
            style={{ marginRight: "0px", marginLeft: "65px" }}
          >
            <li className="nav-item">
              <NavLink
                style={({ isActive, isPending }) => {
                  return {
                    fontWeight: isActive ? "bold" : "",
                    color: isPending ? "red" : "white",
                  };
                }}
                to={user ? `/logout` : `/login`}
              >
                <div>{user ? "Logout" : "Login"}</div>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
