import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  //   const [formData, setFormData] = useState({
  //     username: '',
  //     email: '',
  //     password: '',
  //     confirm_password: '',
  //   });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm_password, setCPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const navigate = useNavigate();

  //   const handleChange = (e) => {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //   };

  const f_emailchange = (e) => {
    setEmail(e.target.value);
  };

  const f_passchange = (e) => {
    setPassword(e.target.value);
  };

  const f_usernamechange = (e) => {
    setUsername(e.target.value);
  };

  const f_cpasschange = (e) => {
    setCPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:5000/register`, {
        email: email,
        username: username,
        password: password,
        confirm_password: confirm_password,
      });

      setLoading(false);
      // console.log(res);

      if (res.data && res.data.error) {
        // console.log(res.data);
        // console.log(res.data.error);
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
          toast.error("An error occurred", {
            position: "top-right",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error); // Log the entire error object
      toast.error("An unexpected error occurred", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

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
        <title>MoneyMinder-Register</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css"
        />
        <link rel="stylesheet" href="./register.css" />
      </head>
      <body>
        <Toaster />
        <div className="container d-flex justify-content-center">
          <img
            class="register-image"
            src="/register/register.png"
            alt="register"
          />
          <div class="register-container">
            <img class="MoneyMinder_logo" src="/landing_page/mm1.png" />
            <h2>Register to Continue</h2>
            <form className="" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="username"
                  value={username}
                  onChange={f_usernamechange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email-or-phone"
                  name="email"
                  value={email}
                  onChange={f_emailchange}
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
                  value={password}
                  onChange={f_passchange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirm-password"
                  name="confirm_password"
                  value={confirm_password}
                  onChange={f_cpasschange}
                />
              </div>
              <button type="submit" className="btn btn-block btn-register">
                Register
              </button>
              <a href="/login" className="login-link">
                Already have an account? Login here.
              </a>
            </form>
          </div>
        </div>
      </body>
    </>
  );
}

export default Register;
