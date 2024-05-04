import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const f_onchange = (e) => {
    setEmail(e.target.value);
  };

  const f_passchange = (e) => {
    setPassword(e.target.value);
  };

  async function f_onsubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:5000/login`, {
        email: email,
        password: password,
      });

      setLoading(false);
      // console.log(res);

      if (res.data && res.data.error) {
        toast.error(res.data.error, {
          position: "top-right",
          duration: 3000,
        });
      } else if (res.data) {
        const { token, redirectUrl } = res.data;
        localStorage.setItem("token", token);

        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          toast.error("An error occured", {
            position: "top-right",
            duration: 3000,
          });
        }
      }
    } catch (e) {
      setLoading(false);
      console.error(e); // Log the entire error object
      toast.error("An unexpected error occured", {
        position: "top-right",
        duration: 3000,
      });
    }
  }

  useEffect(() => {
    const loadScript = (src, callback) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;

      script.onload = callback;

      document.body.appendChild(script);
    };

    loadScript("/js/jquery.min.js", () => {
      loadScript("/js/popper.js", () => {
        loadScript("/js/bootstrap.min.js", () => {
          // All scripts are loaded
          setScriptsLoaded(true);
        });
      });
    });
  }, []);
  return (
    <>
      <head>
        <style>
          {`
      html {
  background-color: #58149f;
  color: #FFFFFF;
  font-family: 'Jost', sans-serif;
}
`}
        </style>
        <link rel="icon" type="image/png" href="/landing_page/rupee.png" />
        <title>MoneyMinder-Login</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css"
        />
        <link rel="stylesheet" href="/login/login.css" />
      </head>

      <body>
        <Toaster />
        <div className="container d-flex justify-content-center">
          <img
            className="login-image"
            src="/login/login.png"
            alt="login"
            style={{ marginTop: "100px" }}
          />
          <div className="login-container">
            <img
              className="MoneyMinder_logo"
              src="/landing_page/mm1.png"
              alt="MoneyMinder Logo"
            />
            <h2>Login to Continue</h2>
            <form onSubmit={f_onsubmit}>
              <div className="form-group">
                <label htmlFor="email-or-phone">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email-or-phone"
                  name="email"
                  value={email}
                  onChange={f_onchange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  onChange={f_passchange}
                  value={password}
                  required
                />
              </div>
              <button type="submit" className="btn btn-block btn-login">
                Login
              </button>
              <a href="/register" className="btn btn-block btn-create">
                Create Account
              </a>
            </form>
          </div>
        </div>
      </body>
    </>
  );
}

export default Login;
