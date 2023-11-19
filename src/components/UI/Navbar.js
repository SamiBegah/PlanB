import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const Navbar = ({ title, userData }) => {
  const [connexionLink, setConnexionLink] = useState({
    label: "Connexion",
    url: "/connexion",
  });

  const location = useLocation().pathname;
  const navbarLinks = [
    { label: "Accueil", url: "/" },
    { label: "Emplois", url: "/emplois" },
    { label: "Employeur", url: "/employeur" },
    { label: "Contact", url: "/contact" },
  ];

  useEffect(() => {
    if (userData) {
      if (userData.status === "Admin") {
        setConnexionLink({
          label: "Portail admin",
          url: "/portailAdmin",
        });
      } else {
        setConnexionLink({
          label: `Mon plan B (${userData.firstName})`,
          url: "/compte",
        });
      }
    } else {
      setConnexionLink({
        label: "Connexion",
        url: "/connexion",
      });
    }
  }, [userData]);

  return (
    <nav className=" w-full fixed z-10  text-white bg-blue-950 shadow ">
      <div className="max-w-[1920px] px-20 mx-auto flex items-center justify-between">
        <a href="/">
          <h2 className="tracking-wide"> {title} </h2>{" "}
        </a>
        <div className="flex  w-1/2 justify-between   ">
          {navbarLinks.map((link, index) => (
            <Link
              className={` hover:underline-white h-full flex items-start px-1 py-5 hover:no-underline hover:text-white hover:font-bold  hover:border-b-2 hover:border-blue-500 hover:transition-all tracking-wide ${
                link.url === location
                  ? "font-bold  border-b-2 border-blue-500 "
                  : ""
              }`}
              to={link.url}
              key={index}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className={` hover:underline-white h-full flex items-start px-1 py-5 hover:no-underline hover:text-white hover:font-bold  hover:border-b-2 hover:border-blue-500 hover:transition-all tracking-wide ${
              connexionLink.url === location
                ? "font-bold  border-b-2 border-blue-500 "
                : ""
            }`}
            to={connexionLink.url}
          >
            {" "}
            {connexionLink.label}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
