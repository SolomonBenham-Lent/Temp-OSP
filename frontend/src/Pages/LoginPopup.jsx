import { useState } from "react";
import "../Style/Popup.css";
import SignUpPopup from "./SignUpPopup";
import loadingSymbol from "../../public/loading.png";

// Function to open the login popup and sign up popup
function OpenPopup() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  return (
    <>
      <div>
        {/*button to open and close the popup*/}
        <button
          onClick={(e) => {
            setLoginOpen(!loginOpen);
            setSignUpOpen(false);
          }}
        >
          Popup
        </button>
        {loginOpen && (
          <LoginPopup
            setLoginOpen={setLoginOpen}
            setSignUpOpen={setSignUpOpen}
          />
        )}
      </div>

      {signUpOpen && <SignUpPopup setSignUpOpen={setSignUpOpen} />}
    </>
  );
}

const HandleLogin = async ({
  name,
  email,
  password,
  setLoginOpen,
  setFoundAccount,
  setLoading,
}) => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setLoading(false);
      alert("Login Successful");
      sessionStorage.setItem("currentUser", JSON.stringify(data.user));
      setLoginOpen(false);
      window.location.href = "/profile";
    } else {
      setLoading(false);
      setFoundAccount(true);
      // alert("Login Failed ", data.message || "unknow error");
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

// Reuseable input function
function Input({ inputName, value, setter }) {
  return (
    <>
      <input
        type={inputName}
        placeholder={inputName}
        value={value}
        onChange={(e) => {
          const newVal = e.target.value;
          setter(newVal);
        }}
      />
    </>
  );
}

// Popup function
function LoginPopup({ setLoginOpen, setSignUpOpen }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [foundAccount, setFoundAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="popupContainer">
        <h2>Login Popup</h2>
        <Input inputName="name" value={name} setter={setName} />
        <br />
        <Input inputName="email" value={email} setter={setEmail} />
        <br />
        <Input inputName="password" value={password} setter={setPassword} />
        {foundAccount && (
          <div className="error">Email or password may be incorrect.</div>
        )}
        <br />
        <button
          className="login-button"
          onClick={(e) => {
            HandleLogin({
              name,
              email,
              password,
              setLoginOpen,
              setFoundAccount,
              setLoading,
            });
          }}
        >
          Log in
        </button>
        <br />
        {loading && <img src={loadingSymbol} className="loading" />}
        {/*links to the sign up popup*/}
        <br />
        <span>Don't have an account? </span>
        <button
          className="signIn-button"
          onClick={(e) => {
            setLoginOpen(false);
            setSignUpOpen(true);
          }}
        >
          Sign up
        </button>
      </div>
    </>
  );
}

export default OpenPopup;
