import axiosInstance from "../axios"; 
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom"; 

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [updatedDoctorData, setUpdatedDoctorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    doctorDepartment: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axiosInstance.get("user/doctors");
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching doctors");
      }
    };
    fetchDoctors();
  }, []);

  const deleteDoctor = async (id) => {
    try {
      await axiosInstance.delete(`/user/doctor/${id}`);
      toast.success("Doctor deleted successfully");
      setDoctors(doctors.filter((doctor) => doctor._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  const startEditing = (doctor) => {
    setEditingDoctorId(doctor._id);
    setUpdatedDoctorData(doctor);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/user/doctor/update/${editingDoctorId}`,
        updatedDoctorData
      );

      if (response.data.success) {
        toast.success("Doctor updated successfully!");
        setDoctors((prev) =>
          prev.map((doc) =>
            doc._id === editingDoctorId ? { ...doc, ...updatedDoctorData } : doc
          )
        );
        setEditingDoctorId(null); // Close the editing modal
        setUpdatedDoctorData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dob: "",
          gender: "",
          doctorDepartment: "",
        }); // Reset form data after successful update
      } else {
        toast.error("Update failed: " + response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating doctor.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDoctorData((prevData) => ({ ...prevData, [name]: value }));
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => {
            return (
              <div className="doctor-card" key={element._id}>
                <img
                  src={element.docAvatar && element.docAvatar.url}
                  alt="doctor avatar"
                />
                <h4>{`${element.firstName} ${element.lastName}`.toUpperCase()}</h4>
                <div className="doctor-details">
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    DOB: <span>{element.dob.substring(0, 10)}</span>
                  </p>
                  <p>
                    Department: <span>{element.doctorDepartment}</span>
                  </p>
                  <p>
                    Gender: <span>{element.gender}</span>
                  </p>
                </div>
                <div className="actions">
                  <button
                    className="btn btn-update"
                    onClick={() => startEditing(element)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteDoctor(element._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>

      {/* Update Doctor Modal */}
      {editingDoctorId && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setEditingDoctorId(null)}>
              &times;
            </span>
            <h2>Update Doctor</h2>
            <form onSubmit={handleUpdateDoctor}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={updatedDoctorData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={updatedDoctorData.lastName}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={updatedDoctorData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={updatedDoctorData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="dob"
                value={updatedDoctorData.dob.substring(0, 10)} // Ensure date is formatted correctly
                onChange={handleInputChange}
                required
              />
              <select
                name="gender"
                value={updatedDoctorData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                name="doctorDepartment"
                value={updatedDoctorData.doctorDepartment}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {[
                  "Pediatrics",
                  "Orthopedics",
                  "Cardiology",
                  "Neurology",
                  "Oncology",
                  "Radiology",
                  "Physical Therapy",
                  "Dermatology",
                  "ENT",
                ].map((depart, index) => (
                  <option key={index} value={depart}>
                    {depart}
                  </option>
                ))}
              </select>
              <button type="submit" className="update-button">Update Doctor</button>
              <button type="button" className="cancel-button" onClick={() => setEditingDoctorId(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Doctors;
