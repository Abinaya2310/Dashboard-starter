import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { SidebarData } from "../Data/data.js";
import Logo from "../imgs/logo.png";
import "./Sidebar.css";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpaned] = useState(true);

  const sidebarVariants = {
    true: {
      left: '0'
    },
    false: {
      left: '-60%'
    }
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
            return (
              <Link 
                to={
                  index === 0
                    ? "/dashboard"
                    : item.heading.toLowerCase().replace(/ /g, "-")
                }
                key={index}
                className={selected === index ? "menuItem active" : "menuItem"}
                onClick={() => setSelected(index)}
              >
                <item.icon />
                <span>{item.heading}</span>
              </Link>
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
