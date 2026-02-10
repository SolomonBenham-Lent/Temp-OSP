import { useState, useEffect } from "react";
import "../Style/Popup.css";
import "../Style/Booking.css";

function Booking() {
  if (JSON.parse(sessionStorage.getItem("currentUser")) === null) {
    alert("Please log in to view your bookings.");
    return <h1>Please log in to view your bookings.</h1>;
  }

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const findBooking = async () => {
      try {
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

        const response = await fetch(
          `http://localhost:5000/api/bookings?userId=${currentUser.userId}`,
          {
            method: "GET",
            headers: { "content-type": "application/json" },
          },
        );

        const data = await response.json();

        if (data.success) {
          alert("booking fetch Successful");
          setBookings(data.bookings);
          if (!data.bookings) {
            alert("No bookings found for this user.");
            setBookings([]);
          }
        } else {
          alert("booking fetch Failed ", data.message || "unknow error");
        }
      } catch (err) {
        if (typeof currentUser === "undefined" || currentUser === null) {
          alert("No user logged in.");
          return;
        } else {
          console.log(err);
          alert("Server error");
        }
      }
    };
    findBooking();
  }, []);

  return (
    <>
      <h1>BOOKING PAGE</h1>

      <ul>
        {bookings.map((b) => (
          <>
            <div key={b.bookingId} className="booking-card">
              <span className="booking-info">
                {/* <strong>ID:</strong> {b.bookingId} <br />
                <strong>User:</strong> {b.userId} <br /> */}
                <strong className="option-display"> {b.option} </strong>
                <strong className="datetime-display">
                  {" "}
                  {b.schedule.replace("T", " ")}{" "}
                </strong>{" "}
                <br />
                <strong className="message-display">
                  {" "}
                  {b.message || "No message"}{" "}
                </strong>{" "}
                <br />
                <strong className="address-display"> {b.address} </strong>{" "}
                <br />
              </span>

              <div className="booking-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-cancel">Cancel</button>
              </div>
            </div>
          </>
        ))}
      </ul>
    </>
  );
}

export default Booking;
