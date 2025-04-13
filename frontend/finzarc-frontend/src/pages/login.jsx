import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../css/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [login, setLogin] = useState({
    username: "",
    password: ""
  })
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleLoginValue = (e) => {
    setLogin({...login, [e.target.name]: e.target.value})
  }

  const handleLogin = async () => {
    try {
        const res = await fetch("http://localhost:4000/api/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: login.username, password: login.password }),
        });

        console.log(res)

        const data = await res.json();

        if (data.success === true) {
            navigate("/home", { replace: true });
        } else {
            alert(data.message);
        }

    } catch (e) {
        console.error()
    }
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async () => {
    try {
        const res = await fetch("http://localhost:4000/api/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username: signupData.username, email: signupData.email, password: signupData.password})
        })

        const data = await res.json()

        if (data.success === true) {
            navigate("/home", { replace: true });
        } else {
            alert(data.message);
        }
    } catch (e) {
        console.error(e)
    }
    console.log("User Registered:", signupData);
    setShowModal(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Task Manager by Finzarc</h2>
        <p className="login-description">
          Manage your tasks seamlessly with Finzarc's intuitive platform.
        </p>

        <input type="text" className="login-input" placeholder="Username" name="username" value={login.username} onChange={handleLoginValue} />
        <input type="password" className="login-input" placeholder="Password" name="password" value={login.password} onChange={handleLoginValue} />

        <p className="signup-link">
          New user?{" "}
          <span className="join-link" onClick={() => setShowModal(true)}>
            Join Here
          </span>
        </p>

        <button className="login-button" onClick={handleLogin}>
          Submit
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="signup-modal">
            <h3>Create Account</h3>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="login-input"
              value={signupData.username}
              onChange={handleSignupChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="login-input"
              value={signupData.email}
              onChange={handleSignupChange}
            />
            <input
              type="password"
              name="password"
              placeholder="New Password"
              className="login-input"
              value={signupData.password}
              onChange={handleSignupChange}
            />

            <button className="login-button" onClick={handleSignupSubmit}>
              Register
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
