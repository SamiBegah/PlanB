import React, { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import Map from "react-map-gl";

const Footer = ({ title, setSelectedField, fields, jobs }) => {
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
                  <Link
                    onClick={() => {
                      setSelectedField(field.title);
                    }}
                    to="/emplois"
                    className="hover:text-white hover:font-bold hover:no-underline cursor-pointer"
                  >
                    {field.title}
                  </Link>
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
              {jobs.slice(0, 7).map((job, index) => (
                <div key={index} className="flex w-fit text-center p-1">
                  <Link
                    to={`/emplois?jobId=${job.id}`}
                    className="hover:text-white hover:font-bold hover:no-underline cursor-pointer"
                  >
                    {job.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-lg py-10">
          <div className="flex flex-col">
            <h3 className="text-xl pb-2 font-bold underline">À propos</h3>
            <p className="text-justify w-3/4">
              Avec une vision novatrice, Plan B Placement est plus qu'une simple
              agence de placement de personnel.
              <br /> Plan B s'engage à cultiver un environnement propice à
              l'épanouissement professionnel et personnel de ses candidats.
              <br /> Pour les employeurs, Plan B offre une source variée de
              talents prêts à relever les défis actuels et futurs de votre
              entreprise.
            </p>
          </div>
        </div>
      </div>

      <div className="relative  w-full m-0 p-5 flex justify-center items-center">
        <p> © Plan B Placement - 2023 </p>
      </div>
    </nav>
  );
};

export default Footer;
