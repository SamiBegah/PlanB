import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase";

const Navbar = ({ title, links, userName }) => {
  const location = useLocation().pathname;
  return (
    <nav className=" w-full fixed z-10  text-white bg-blue-950 shadow ">
      <div className="max-w-[1920px] px-20 mx-auto flex items-center justify-between">
        <h2 className="tracking-wide"> {title} </h2>
        <div className="flex  w-1/2 justify-between   ">
          {links.map((link, index) => (
            <a
              className={` hover:underline-white h-full flex items-start px-1 py-5 hover:no-underline hover:text-white hover:font-bold  hover:border-b-2 hover:border-blue-500 hover:transition-all tracking-wide ${
                link.url === location
                  ? "font-bold  border-b-2 border-blue-500 "
                  : ""
              }`}
              href={link.url}
              key={index}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
