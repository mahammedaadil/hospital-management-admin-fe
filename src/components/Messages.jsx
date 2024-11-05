import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Import the delete icon
import axiosInstance from "../axios";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(Context);

  // Fetch all messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axiosInstance.get(
          "message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error(error.response?.data?.message || "Error fetching messages");
        toast.error("Failed to fetch messages");
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Delete a message by id
  const deleteMessage = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this message?");
  
    if (!isConfirmed) {
      return; // If the user clicks "Cancel", do nothing
    }
  
    try {
      await axiosInstance.delete(`delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Message deleted successfully");
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== id)
      );
    } catch (error) {
      console.error(error.response?.data?.message || "Error deleting message");
      toast.error("Failed to delete message");
    }
  };
  

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGES</h1>

      {loading ? (
        <h2>Loading messages...</h2>
      ) : (
        <div className="banner">
          {messages && messages.length > 0 ? (
            messages.map((element) => (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    First Name: <span>{element.firstName.toUpperCase()}</span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastName.toUpperCase()}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
                  </p>
                </div>
                <button
                  className="delete-button"
                  onClick={() => deleteMessage(element._id)}
                >
                  <FaTrash /> {/* Render the delete icon */}
                </button>
              </div>
            ))
          ) : (
            <h2>No Messages!</h2>
          )}
        </div>
      )}
    </section>
  );
};

export default Messages;
