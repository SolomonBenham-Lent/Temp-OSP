import { useState } from "react";
import "../Style/Popup.css";

const HandleSignUp = async (name, email, password) => {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
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
      alert("Sign Up Failed");
    } else {
      alert("Sign Up Success:" + data.message || "unknow error");
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

// Reuseable input function
function Input({
  inputName,
  value,
  setter,
  setErrorField,
  errorField,
  setErrorMessage,
  errorMessage,
  setCompleted,
}) {
  return (
    <>
      <input
        type={inputName}
        placeholder={inputName}
        value={value}
        onChange={(e) => {
          setCompleted(true);
          const newVal = e.target.value;
          setter(newVal);
          Validate({
            newVal,
            setErrorField,
            errorField,
            setErrorMessage,
            errorMessage,
            inputName,
          });
        }}
      />
    </>
  );
}

// Function to validate the inputs
function Validate({
  newVal,
  setErrorField,
  errorField,
  setErrorMessage,
  errorMessage,
  inputName,
}) {
  // Checks the length of name is greater than 0
  if (inputName == "name" && newVal.length == 0) {
    // Changes the error to true and the error message
    setErrorField({ ...errorField, name: true });
    setErrorMessage({ ...errorMessage, name: "Please enter a name." });
    // Removes the error message
  } else if (inputName == "name" && newVal.length > 0) {
    setErrorField({ ...errorField, name: "" });
    setErrorMessage({ ...errorMessage, name: "" });
  }
  // Checks the email is a valid email using regex e.g. "example@email.com"
  if (
    inputName == "email" &&
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newVal)
  ) {
    setErrorField({ ...errorField, email: true });
    setErrorMessage({ ...errorMessage, email: "Please enter a valid email." });
  } else if (
    inputName == "email" &&
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newVal)
  ) {
    setErrorField({ ...errorField, email: "" });
    setErrorMessage({ ...errorMessage, email: "" });
  }
  // Checks if the password is a valid password using regex
  if (
    inputName == "password" &&
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(
      newVal,
    )
  ) {
    setErrorField({ ...errorField, password: true });
    setErrorMessage({
      ...errorMessage,
      password:
        "Your password needs to have an upper and lower case letter, a number, a special character and be at least 12 characters,  .",
    });
  } else if (
    inputName == "password" &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(
      newVal,
    )
  ) {
    setErrorField({ ...errorField, password: "" });
    setErrorMessage({ ...errorMessage, password: "" });
  }
}

// Function to check if the password and password confirmation match
function PassMatch({
  password,
  newVal,
  setErrorField,
  errorField,
  setErrorMessage,
  errorMessage,
}) {
  if (password != newVal) {
    setErrorField({ ...errorField, confirmPass: true });
    setErrorMessage({
      ...errorMessage,
      confirmPass: "Your passwords must match.",
    });
  } else if (password == newVal) {
    setErrorField({ ...errorField, confirmPass: "" });
    setErrorMessage({ ...errorMessage, confirmPass: "" });
  }
}

// Popup function
function SignUpPopup({ setSignUpOpen }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [completed, setCompleted] = useState(true);

  const [errorField, setErrorField] = useState({
    name: false,
    email: false,
    password: false,
    confirmPass: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    name: ".",
    email: ".",
    password: ".",
    confirmPass: ".",
  });

  // The actual popup display
  return (
    <>
      <div className="popupContainer">
        <h2>Sign Up Popup</h2>
        <Input
          inputName="name"
          value={name}
          setter={setName}
          setErrorField={setErrorField}
          errorField={errorField}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          setCompleted={setCompleted}
        />
        {errorField.name && <div className="error">{errorMessage.name}</div>}
        <br />
        <Input
          inputName="email"
          value={email}
          setter={setEmail}
          setErrorField={setErrorField}
          errorField={errorField}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          setCompleted={setCompleted}
        />
        {errorField.email && <div className="error">{errorMessage.email}</div>}
        <br />
        <Input
          inputName="password"
          value={password}
          setter={setPassword}
          setErrorField={setErrorField}
          errorField={errorField}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          setCompleted={setCompleted}
        />
        {errorField.password && (
          <div className="error">{errorMessage.password}</div>
        )}
        <br />
        <input
          value={confirmPass}
          type="password"
          placeholder="Re-type password"
          onChange={(e) => {
            setCompleted(true);
            setConfirmPass(e.target.value);
            const newVal = e.target.value;
            PassMatch({
              password,
              newVal,
              setErrorField,
              errorField,
              setErrorMessage,
              errorMessage,
            });
          }}
        />
        {errorField.confirmPass && (
          <div className="error">{errorMessage.confirmPass}</div>
        )}

        <button
          className="login-button"
          onClick={(e) => {
            // Stops sign up if no values are inputted or the inputted values are not valid
            if (
              !errorMessage.name &&
              !errorMessage.email &&
              !errorMessage.password &&
              !errorMessage.confirmPass
            ) {
              HandleSignUp(name, email, password);
              setSignUpOpen(false);
            } else {
              setCompleted(false);
            }
          }}
        >
          Sign Up
        </button>
        {!completed && <div className="error">Please complete all inputs</div>}
      </div>
    </>
  );
}

export default SignUpPopup;
