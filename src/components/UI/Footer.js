import React from "react";
import { Outlet, Link } from "react-router-dom";
import Map from "react-map-gl";

const Footer = ({ title, links, fields }) => {
  return (
    <nav className="flex flex-col justify-between gap-5 pt-20 bg-blue-950 text-white">
      <div className="grid grid-cols-4 px-20 gap-20 items-start justify-center max-w-[1920px] mx-auto">
        <div className="flex items-center justify-center text-lg py-10">
          <div className="flex flex-col  ">
            <h1 className=" pb-10 font-bold ">{title}</h1>

            <h3 className="text-2xl pb-2 font-bold"> Contactez-nous!</h3>

            <div className="flex flex-col gap-1 ">
              <span> (514) XXX - XXXX </span>
              <a href="mailto:contact@planbplacement.ca" className="">
                contact@planbplacement.ca
              </a>
            </div>
            <div className="flex flex-col py-10 ">
              <h3 className="text-lg pb-2 font-bold">Heures d'ouverture:</h3>
              <div className="flex flex-col gap-1 ">
                <ul>
                  <li> Lundi au vendredi - de 8h à 20h</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center text-lg py-10">
          <div className="flex flex-col  ">
            <h3 className="text-xl pb-2 font-bold underline"> Secteurs</h3>
            <div className="flex flex-col gap-1 ">
              {fields.map((field, index) => (
                <div key={index} className="flex w-fit text-start p-1 ">
                  <a className="hover:text-white hover:font-bold hover:no-underline cursor-pointer">
                    {field.title}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-lg py-10">
          <div className="flex flex-col ">
            <h3 className="text-xl pb-2 font-bold underline">
              Emplois récents
            </h3>
            <div className="flex flex-col gap-1">
              {fields.map((field, index) => (
                <div key={index} className="flex w-fit text-center p-1">
                  <a className="hover:text-white hover:font-bold hover:no-underline cursor-pointer">
                    {field.title}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-lg py-10">
          <div className="flex flex-col">
            <h3 className="text-xl pb-2 font-bold underline">À propos</h3>
            <p className="text-justify w-3/4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
              lobortis purus sed risus euismod, ac accumsan lectus congue.
              Interdum et malesuada fames ac ante ipsum primis in faucibus.
              <br /> Duis lobortis purus sed risus euismod, ac accumsan lectus
              congue. Duis lobortis purus sed risus euismod, ac accumsan lectus
              congue.
            </p>
          </div>
        </div>
      </div>

      <div className="relative  w-full m-0 p-5 flex justify-center items-center">
        <p> © Plan B Placement - 2023 </p>
        <a href="/portailAdmin" className="absolute right-0 text-gray-500">
          Portail Admin →
        </a>
      </div>
    </nav>
  );
};

export default Footer;
