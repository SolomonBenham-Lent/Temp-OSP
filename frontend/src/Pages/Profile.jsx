import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Profile() {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

        if (currentUser) {
          setUserId(currentUser.userId);
          setName(currentUser.name);
          setEmail(currentUser.email);
        }
      } catch (error) {
        console.log("ERROR");
      }
    };
    fetchdata();
  }, []);

  return (
    <>
      <h1>PROFILE PAGE</h1>
      <div>userId: {userId}</div>
      <div>name: {name}</div>
      <div>email: {email}</div>
    </>
  );
}

export default Profile;
