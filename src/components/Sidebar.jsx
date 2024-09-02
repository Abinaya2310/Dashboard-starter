import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarData } from "../Data/data.js";
import Logo from "../imgs/logo.png";
import "./Sidebar.css";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpaned] = useState(true);
  const navigate = useNavigate();

  const sidebarVariants = {
    true: {
      left: '0'
    },
    false: {
      left: '-60%'
    }
  };

  // Helper function to handle navigation and state update
  const handleNavigation = (index, path) => {
    setSelected(index); // Update selected state
    navigate(path); // Trigger navigation
  };

  return (
    <>
      <div className="bars" style={expanded ? { left: '60%' } : { left: '5%' }} onClick={() => setExpaned(!expanded)}>
        <UilBars />
      </div>
      <motion.div className='sidebar'
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''}
      >
        {/* logo */}
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            M<span>o</span>ney
          </span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => {
            const path = index === 0 ? "/dashboard" : item.heading.toLowerCase().replace(/ /g, "-");
            return (
              <div
                key={index}
                className={selected === index ? "menuItem active" : "menuItem"}
                onClick={() => handleNavigation(index, path)}
              >
                <item.icon />
                <span>{item.heading}</span>
              </div>
            );
          })}
          {/* signoutIcon */}
          <div className="menuItem">
            {/* Additional functionality can go here */}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;


