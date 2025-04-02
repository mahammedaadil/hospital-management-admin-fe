import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { HiDocumentReport } from "react-icons/hi"; // Reports Icon
import { FaDatabase } from "react-icons/fa"; // Backup Icon
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigateTo("/login");
    toast.success("Admin Logged Out Successfully");
  };

  const handleNavigation = (path, message) => {
    navigateTo(path);
    toast.info(message);
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome onClick={() => handleNavigation("/", "Navigated to Home")} />
          <FaUserDoctor onClick={() => handleNavigation("/doctors", "Navigated to Doctors")} />
          <MdAddModerator onClick={() => handleNavigation("/admin/addnew", "Navigated to Add New Admin")} />
          <IoPersonAddSharp onClick={() => handleNavigation("/doctor/addnew", "Navigated to Add New Doctor")} />
          <AiFillMessage onClick={() => handleNavigation("/messages", "Navigated to Messages")} />
          <HiDocumentReport onClick={() => handleNavigation("/reports", "Navigated to Reports")} />
          <FaDatabase onClick={() => handleNavigation("/backup", "Navigated to Backup")} />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div
        className="wrapper"
        style={isAuthenticated ? { display: "flex" } : { display: "none" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
