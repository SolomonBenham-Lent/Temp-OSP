import { useEffect, useState } from "react";
import "../Style/AddBooking.css";

function SelectProduct({ options, setOptions }) {
  return (
    <>
      <button
        className="option1"
        id="option1"
        onClick={() => {
          if (!options.option1) {
            setOptions({ ...options, option1: true });
            option1.classList.toggle("active");
          } else {
            setOptions({ ...options, option1: false });
            option1.classList.toggle("active");
          }
        }}
      >
        option1
      </button>
      <button
        className="option2"
        id="option2"
        onClick={() => {
          if (!options.option2) {
            setOptions({ ...options, option2: true });
            option2.classList.toggle("active");
          } else {
            setOptions({ ...options, option2: false });
            option2.classList.toggle("active");
          }
        }}
      >
        option2
      </button>
      <button
        className="option3"
        id="option3"
        onClick={() => {
          if (!options.option3) {
            setOptions({ ...options, option3: true });
            option3.classList.toggle("active");
          } else {
            setOptions({ ...options, option3: false });
            option3.classList.toggle("active");
          }
        }}
      >
        option3
      </button>
    </>
  );
}

function Schedule({ date, setDate, time, setTime }) {
  const today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <input
        className="dateInput"
        type="date"
        value={date}
        min={tomorrow}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        className="timeInput"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
    </>
  );
}

function AddressInput({ address, setAddress, setErrorCheck }) {
  return (
    <>
      <input
        className="addressInput"
        type="text"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          const regex =
            /\d+[ ](?:[A-Za-z0-9.-]+[ ]?)+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Park|Ave|Dr|Rd|Blvd|Ln|St|Pk)\.?/i;
        }}
      />
    </>
  );
}

function MessageInput({ message, setMessage }) {
  return (
    <>
      <input
        className="messageInput"
        type="text"
        placeholder="Enter an optional message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </>
  );
}

function validateBooking({ options, date, time, address, setErrorCheck }) {
  const addressRegex =
    /\d+[ ](?:[A-Za-z0-9.-]+[ ]?)+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Park|Ave|Dr|Rd|Blvd|Ln|St|Pk)\.?/i;
  if (!options.option1 && !options.option2 && !options.option3) {
    setErrorCheck((prev) => ({ ...prev, options: true }));
    var optionsError = true;
  } else {
    setErrorCheck((prev) => ({ ...prev, options: false }));
  }
  if (date === "") {
    setErrorCheck((prev) => ({ ...prev, date: true }));
    var dateError = true;
  } else {
    setErrorCheck((prev) => ({ ...prev, date: false }));
  }
  if (time === "") {
    setErrorCheck((prev) => ({ ...prev, time: true }));
    var timeError = true;
  } else {
    setErrorCheck((prev) => ({ ...prev, time: false }));
  }
  if (!addressRegex.test(address)) {
    setErrorCheck((prev) => ({ ...prev, address: true }));
    var addressError = true;
  } else {
    setErrorCheck((prev) => ({ ...prev, address: false }));
  }

  if (optionsError || dateError || timeError || addressError) {
    return false;
  } else {
    alert("Booking submitted successfully!");
    return true;
  }
}

function AddBooking() {
  if (JSON.parse(sessionStorage.getItem("currentUser")) === null) {
    alert("Please log in to add a booking.");
    return (
      <>
        <h1>Please log in to add a booking.</h1>
      </>
    );
  }
  const addNewBooking = async () => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    try {
      const response = await fetch(`http://localhost:5000/api/bookings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.userId,
          option: options,
          schedule: `${date}T${time}`,
          address: address,
          message: message,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        alert("Booking added successfully");
      } else {
        alert("Add booking status:" + data.message || "unknown error");
      }
    } catch (err) {
      if (currentUser === "undefined" || currentUser === null) {
        alert("No user logged in.");
        return;
      } else {
        console.log(err);
        alert("Server error");
      }
    }
  };

  const [options, setOptions] = useState({
    option1: false,
    option2: false,
    option3: false,
  });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [errorCheck, setErrorCheck] = useState({
    options: false,
    date: false,
    time: false,
    address: false,
  });
  return (
    <>
      <h1>Add Booking Page</h1>

      <h2 className="productTitle">Select a Product</h2>
      <SelectProduct options={options} setOptions={setOptions} />
      {errorCheck.options && (
        <div className="error">Please select at least one product option</div>
      )}
      <br />
      <h2 className="scheduleTitle">Select a Date and Time</h2>
      <Schedule date={date} setDate={setDate} time={time} setTime={setTime} />
      {errorCheck.date && (
        <div className="error">Please select a valid date</div>
      )}
      {errorCheck.time && (
        <div className="error">Please enter a valid time</div>
      )}
      <h2 className="addressTitle">Enter your address</h2>
      <AddressInput
        address={address}
        setAddress={setAddress}
        setErrorCheck={setErrorCheck}
      />
      {errorCheck.address && (
        <div className="error">Please enter a valid address</div>
      )}
      <h2 className="messageTitle">Enter an optional message here</h2>
      <MessageInput message={message} setMessage={setMessage} />
      <button
        className="submitBookingButton"
        onClick={(e) => {
          if (
            validateBooking({
              options,
              date,
              time,
              address,
              setErrorCheck,
            })
          ) {
            addNewBooking();
          }
        }}
      >
        Submit Booking
      </button>
    </>
  );
}

export default AddBooking;
