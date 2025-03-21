import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../axios";

const AddNewAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // Stores DD/MM/YYYY format for UI
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigateTo = useNavigate();

  // Convert DD/MM/YYYY to YYYY-MM-DD for backend
  const convertToISO = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
  };

  // Handle Date Input Formatting (DD/MM/YYYY)
  const handleDobChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (input.length > 8) input = input.slice(0, 8); // Restrict to 8 digits (DDMMYYYY)

    // Format as DD/MM/YYYY
    let formatted = input;
    if (input.length > 2) formatted = `${input.slice(0, 2)}/${input.slice(2)}`;
    if (input.length > 4) formatted = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4)}`;

    setDob(formatted);
  };

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const isoDob = convertToISO(dob); // Convert DD/MM/YYYY to YYYY-MM-DD for backend

      await axiosInstance
        .post(
          "user/admin/addnew",
          { firstName, lastName, email, phone, dob: isoDob, gender, password, confirmPassword },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");

          // Reset form
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setDob("");
          setGender("");
          setPassword("");
          setConfirmPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="form-title">ADD NEW ADMIN</h1>
        <form onSubmit={handleAddNewAdmin}>
          <div>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="number" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <input
              type="text"
              placeholder="Date of Birth (DD/MM/YYYY)"
              value={dob}
              onChange={handleDobChange}
              maxLength="10"
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Your Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">ADD NEW ADMIN</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewAdmin;
