import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axiosInstance.get("/appointment/getall", {
          withCredentials: true,
        });
        setAppointments(data.appointments);
        setTotalAppointments(data.appointments.length);
      } catch (error) {
        setAppointments([]);
        setTotalAppointments(0);
      }
    };

    const fetchDoctors = async () => {
      try {
        const { data } = await axiosInstance.get("/user/doctors", {
          withCredentials: true,
        });
        setDoctors(data.doctors);
      } catch (error) {
        setDoctors([]);
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axiosInstance.put(
        `/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleUpdatePresent = async (appointmentId, present) => {
    try {
      const { data } = await axiosInstance.put(
        `/appointment/update/${appointmentId}`,
        { present },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, present }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update present status");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.delete(
        `/appointment/delete/${appointmentId}`,
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      setTotalAppointments((prevTotal) => prevTotal - 1);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Filter appointments based on selected doctor, date, and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesDoctor = selectedDoctor === "All" || `${appointment.doctor.firstName} ${appointment.doctor.lastName}` === selectedDoctor;
    const matchesDate = selectedDate ? new Date(appointment.appointment_date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString() : true;
    const matchesSearchTerm =
      appointment.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDoctor && matchesDate && matchesSearchTerm;
  });

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>
                {admin && `${admin.firstName} ${admin.lastName}`.toUpperCase()}
              </h5>
            </div>
            <p>
              Welcome To Aadicare Admin Dashboard. Here You Can Change Status Of Appointment,
              Add New Doctors, Add New Patients, Add New Admins, Also Can Check Messages
              Inquiries From Different Users Of Website.
            </p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{totalAppointments}</h3>
        </div>
        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>{doctors.length}</h3>
        </div>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        {/* Doctor Filter Dropdown */}
        <div className="filter">
          <label htmlFor="doctorSelect">Filter by Doctor: </label>
          <select
            id="doctorSelect"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="All">All</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={`${doctor.firstName} ${doctor.lastName}`}>
                {`${doctor.firstName} ${doctor.lastName}`}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="filter search-bar">
          <label htmlFor="searchPatients">Search Patient: </label>
          <input
            type="text"
            id="searchPatients"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Date Filter */}
        <div className="filter">
          <label htmlFor="dateSelect">Filter by Date: </label>
          <input
            type="date"
            id="dateSelect"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="banner">
        <h5>Appointments</h5>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Visited</th>
              <th>Present</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{`${appointment.firstName.toUpperCase()} ${appointment.lastName.toUpperCase()}`}</td>
                  <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                  <td>{appointment.timeSlot}</td>
                  <td>{appointment.department}</td>
                  <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                  <td>
                    <select
                      className={
                        appointment.status === "Pending"
                          ? "value-pending"
                          : appointment.status === "Accepted"
                          ? "value-accepted"
                          : "value-rejected"
                      }
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateStatus(appointment._id, e.target.value)
                      }
                    >
                      <option value="Pending" className="value-pending">Pending</option>
                      <option value="Accepted" className="value-accepted">Accepted</option>
                      <option value="Rejected" className="value-rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    {appointment.hasVisited ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                  <td>
                    <select
                      value={appointment.present}
                      onChange={(e) =>
                        handleUpdatePresent(appointment._id, e.target.value)
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    <FaTrash
                      className="delete-icon"
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No Appointments Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
