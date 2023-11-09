import React, { useEffect } from "react";
import entrepriseImg from "../media/entreprise.png";
import employeeImg from "../media/employee.png";
import Connection from "./login/Connection";
import contactBg from "../media/contactBg.jpg";
import reviewsBg from "../media/reviewsBg.jpg";
import locationIcon from "../media/locationIcon.png";
import fieldIcon from "../media/fieldIcon.png";
import scheduleIcon from "../media/scheduleIcon.png";
import salaryIcon from "../media/salaryIcon.png";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { collection, query, where } from "firebase/firestore";
import { Carousel } from "react-responsive-carousel";

import { useState } from "react";

const Accueil = ({ jobs, fields }) => {
  const [selectedField, setSelectedField] = useState("");
  const [fileteredJobs, setFileteredJobs] = useState(jobs);

  // Create a query against the collection.
  useEffect(() => {
    selectedField === ""
      ? setFileteredJobs(jobs)
      : setFileteredJobs(jobs.filter((job) => job.field === selectedField));
    console.log(fileteredJobs, selectedField);
  }, [jobs, selectedField]);

  return (
    <main className="flex flex-col gap-5 h-full ">
      {/*  Lead Image */}
      <div className=" inset-0 w-full h-full bg-lead-img bg-cover  flex flex-col">
        <div className=" flex py-40 justify-start items-center bg-gradient-to-b from-transparent via-transparent to-[#fafafa] ">
          <div className="grid grid-cols-3 items-between max-w-[1920px] w-full px-20 gap-20 mx-auto">
            <div className=" col-span-2 w-full h-full flex flex-col justify-start gap-8  ">
              <div className=" p-10 flex flex-col gap-5 t bg-blue-500 rounded-lg shadow-xl ">
                <h2 className=" text-white">
                  À la recherche d'un emploi ou d'un candidat?
                </h2>
                <h1 className=" text-center text-white ">
                  Trouvez votre plan B.
                </h1>
              </div>
              <div className="p-10 flex flex-col text-white leading-10 h-1/2 bg-blue-950 flex-1 rounded-lg shadow-xl  ">
                <h3 className="font-bold ">
                  Bienvenue chez Plan B, votre partenaire en recrutement.
                </h3>
                <br />
                <p className="">
                  Nous vous aidons à trouver votre voie vers le succès
                  professionnel. <br /> Rejoignez-nous dès aujourd'hui et
                  découvrez de nouvelles opportunités de carrière.
                </p>

                <div className="flex items-center justify-center gap-5 pt-10 text-lg">
                  <a
                    href="emplois"
                    className="px-5 py-3 flex-1 relative rounded group hover:bg-blue-500 transition-all overflow-hidden hover:shadow-inner bg-white shadow-xl text-blue-950  decoration-white"
                  >
                    <div className="flex items-center w-full justify-center relative group-hover:text-white  gap-2 transition-all font-bold ">
                      <p> Trouver un emploi</p>
                      <img
                        className="w-8"
                        src={employeeImg}
                        alt="Icon Emploi"
                      />
                    </div>
                  </a>

                  <a
                    href="employeur"
                    className="px-5 py-3 flex-1 relative rounded group hover:bg-blue-500 transition-all overflow-hidden hover:shadow-inner bg-white shadow-xl text-blue-950 inline-block"
                  >
                    <div className="flex items-center w-full justify-center relative group-hover:text-white gap-2 transition-all font-bold">
                      <p> Trouver un candidat </p>
                      <img
                        className="w-8"
                        src={entrepriseImg}
                        alt="Icon Entreprise"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <Connection />
          </div>
        </div>
      </div>

      {/*  Company presentation */}

      <div className="flex flex-col gap-40  ">
        {/* Services */}
        <div className="px-20 max-w-[1920px] mx-auto">
          <h3 className=""> Un service pour tous.</h3>
          <div className="flex  pt-10 items-center">
            <div className=" group bg-blue-500 text-white shadow-xl   flex flex-col h-full gap-10  text-center transition-all duration-1000 rounded-lg p-10">
              <h2 className="  font-bold">Vous recherchez un emploi?</h2>

              <div className="flex flex-col justify-between gap-5">
                <p className="text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  lobortis purus sed risus euismod, ac accumsan lectus congue.
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                </p>
                <div className="grid grid-cols-3 justify-between text-center items-start  text-lg">
                  <div className="p-5 flex justify-center items-center gap-1 font-bold">
                    <span className="text-blue-950">✓</span>
                    <span> Orientation</span>
                  </div>
                  <div className="p-5 flex justify-center items-center gap-1 font-bold">
                    <span className="text-blue-950">✓</span>{" "}
                    <span> Rédaction de CV</span>
                  </div>
                  <div className="p-5 flex justify-center items-center gap-1 font-bold">
                    <span className="text-blue-950">✓</span>{" "}
                    <span> Embauche</span>
                  </div>
                </div>
                <a
                  href="/emplois"
                  className="inline-flex justify-center items-center shadow-xl m-auto w-1/2 px-5 py-3 mb-3 text-base font-semibold no-underline align-middle rounded cursor-pointer select-none bg-[#ffffff] hover:bg-blue-950 text-blue-500  hover:text-white hover:shadow-inner transition-all"
                >
                  <span> Emplois →</span>
                </a>
              </div>
            </div>
            <h5 className="text-blue-950 mx-10"> ou</h5>
            <div className=" group bg-blue-950 text-white  shadow-xl  flex flex-col h-full gap-10  text-center transition-all duration-1000 rounded-lg p-10">
              <h2 className="  font-bold">Vous recherchez un candidat?</h2>

              <div className="flex flex-col justify-between gap-5">
                <p className="text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  lobortis purus sed risus euismod, ac accumsan lectus congue.
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                </p>
                <div className="grid grid-cols-2 justify-around text-center items-start  text-lg">
                  <div className="p-5 flex justify-center items-center gap-1 font-bold">
                    <span className="text-blue-500">✓</span>
                    <span> Recherche de candidat</span>
                  </div>
                  <div className="p-5 flex justify-center items-center gap-1 font-bold">
                    <span className="text-blue-500">✓</span>
                    <span> Référencements</span>
                  </div>
                </div>
                <a
                  href="/employeur"
                  className="inline-flex justify-center items-center shadow-xl m-auto w-1/2 px-5 py-3 mb-3 text-base font-semibold no-underline align-middle rounded cursor-pointer select-none bg-[#ffffff] hover:bg-blue-500 text-blue-950  hover:text-white hover:shadow-inner transition-all"
                >
                  <span> Employeur → </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/*  Recent jobs listing */}
        <div className="flex flex-col px-20 max-w-[1920px] mx-auto w-full">
          <h3 className=""> Poste récents</h3>
          <div className="w-full">
            <div>
              <div className="flex my-5 py-6 mt-10 justify-around items-center whitespace-nowrap bg-blue-500 rounded-lg shadow-inner  ">
                <button
                  onClick={() => {
                    setSelectedField("");
                  }}
                  className={`hover:scale-105 text-base  transition-all  w-fit shadow-xl text-center rounded-lg p-2 ${
                    selectedField === ""
                      ? "bg-[#ffffff] scale-105"
                      : "bg-blue-900 text-white"
                  }`}
                >
                  <span className="text-base">Tous les secteurs</span>
                </button>
                {fields.map((field, index) => (
                  <button
                    onClick={() => {
                      setSelectedField(field.title);
                    }}
                    key={index}
                    className={`hover:scale-105 text-base  transition-all  w-fit shadow-xl text-center rounded-lg p-2 ${
                      field.title === selectedField
                        ? "bg-[#ffffff] scale-105"
                        : "bg-blue-900 text-white"
                    }`}
                  >
                    <span>{field.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <ul className="grid grid-cols-3 grid-rows-2 gap-10 p-10 bg-black bg-opacity-10 w-full rounded-lg shadow-inner h-[900px]">
              {fileteredJobs.map((job, index) => (
                <li
                  key={index}
                  className="relative bg-[#ffffff] overflow-hidden py-5 flex flex-col text-base justify-between items-center w-full h-full shadow-xl group  rounded-lg scale-95 hover:scale-100 cursor-pointer transition-all "
                >
                  <div className="flex flex-col h-full gap-5 p-5">
                    <h3 className=" p-2 group-hover:font-bold text-blue-500 font-bold group-hover:text-blue-950 transition-all">{`${job.title.slice(
                      0,
                      50
                    )}${job.title.length > 50 ? "..." : ""}`}</h3>

                    <div className="flex w-full  justify-between">
                      <span className=" flex items-center">
                        <img
                          src={scheduleIcon}
                          alt="Horaire"
                          className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-all"
                        />
                        {job.schedule}
                      </span>
                      <span className=" flex items-center">
                        <img
                          src={locationIcon}
                          alt="Location"
                          className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-all"
                        />
                        {job.mode === "Télétravail" ? job.mode : job.location}
                      </span>
                      <span className="flex items-center">
                        <img
                          src={salaryIcon}
                          alt="Salaire"
                          className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-ll"
                        />
                        {job.salary === "" ? "À déterminer" : job.salary}
                      </span>
                    </div>

                    <p className="  px-2">
                      {job.description.slice(0, 200)} ...
                    </p>
                  </div>

                  <button className=" w-fit absolute bottom-0 m-5 p-3 text-lg bg-blue-500 text-white rounded-lg shadow-lg  group-hover:bg-blue-950 group-hover:font-bold transition-all">
                    Voir le poste
                  </button>
                </li>
              ))}

              <a
                href="emplois"
                className="bg-blue-500 text-white text-xl flex justify-center items-center w-full shadow-xl group  rounded-lg scale-95 hover:scale-100 hover:bg-blue-950 hover:text-white cursor-pointer transition-all "
              >
                <span> Voir tous les postes </span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </a>
            </ul>
          </div>
        </div>

        {/*  Secteur */}
        <div className="flex flex-col px-20 max-w-[1920px] mx-auto ">
          <h3 className=""> Secteurs</h3>
          <div className="grid grid-cols-4 gap-2 py-10 justify-center items-center">
            {fields.map((field, index) => (
              <div
                key={index}
                className="relative text-lg flex flex-col shadow-xl text-center rounded-lg scale-90 hover:scale-100 group transition-all cursor-pointer"
              >
                <img
                  className="opacity-100 rounded-lg object-cover  "
                  src={field.picture}
                  alt={field.title}
                />

                <p className="absolute bottom-0 w-full text-white rounded-b-lg bg-blue-500 group-hover:bg-blue-950 bg-opacity-90 py-3 group-hover:bg-opacity-100 transition-all">
                  {field.title}
                </p>
              </div>
            ))}
            <div className="relative text-lg flex flex-col justify-center items-center shadow-xl bg-blue-950 bg-opacity-90 h-full text-center rounded-lg scale-90 hover:scale-100 group transition-all ">
              <p className=" w-full text-white rounded-b-lg  bg-opacity-90 py-3 group-hover:bg-opacity-100 transition-all">
                Et davantage à venir.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom page */}
        <div
          className="w-full h-full bg-cover "
          style={{ backgroundImage: `url(${contactBg})` }}
        >
          <div className="flex  h-full w-full bg-gradient-to-b from-[#fafafa]  via-transparent to-blue-950 text-center gap-40">
            <div className=" max-w-[1920px] mx-auto grid grid-cols-2 px-40 gap-60">
              {/* Stats and reviews */}
              <div className="  rounded-lg grid grid-rows-3 gap-10">
                <div className="flex flex-col gap-10 ">
                  <h3 className="text-blue-950 font-bold  ">
                    Travaillons ensemble dès aujourd'hui.
                  </h3>
                  <div className="flex flex-col bg-blue-950 rounded-lg gap-5 p-5  whitespace-nowrap px-10 shadow-xl text-white">
                    <h4> Plan B en quelques chiffres :</h4>
                    <div className=" flex items-end gap-2">
                      <h2 className=" font-bold ">23</h2>
                      <h4 className=""> offres d'emploi,</h4>
                    </div>
                    <div className=" flex justify-center items-end gap-2 ">
                      <h2 className=" font-bold  ">126</h2>
                      <h4 className=""> candidatures, </h4>
                    </div>

                    <div className=" flex justify-end items-end gap-2">
                      <h2 className=" font-bold  ">12</h2>
                      <h4 className="">partenaires d'affaire.</h4>
                    </div>
                  </div>
                </div>
                <form className="flex flex-col items-center row-span-2 justify-center rounded-lg py-10 gap-10 h-fit   bg-white shadow-xl group ">
                  <h2 className=" font-bold pb-5  text-blue-950 ">
                    Contactez nous
                  </h2>
                  <div className="flex flex-col justify-center items-center gap-10 w-4/5 ">
                    <div className="flex w-full gap-10">
                      <div className="flex flex-col w-1/2 gap-2">
                        <label className="text-start">Nom complet</label>
                        <input
                          className="shadow-inner rounded w-full p-2 text-black bg-[#f2f2f2] border border-gray-200  "
                          type="text"
                          required
                        />
                      </div>
                      <div className="flex flex-col w-1/2 gap-2">
                        <label className="text-start"> Courriel </label>
                        <input
                          className="shadow-inner rounded w-full p-2 text-black bg-[#f2f2f2] border border-gray-200  "
                          type="email"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center h-full w-full gap-4 ">
                      <label className="self-start"> Message </label>
                      <textarea
                        className="rounded w-full h-32 text-black  bg-[#f2f2f2] border border-gray-200  "
                        type="text"
                        size={400}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex shadow-xl justify-center items-center m-auto w-full px-5 py-3 text-base font-semibold no-underline align-middle hover:bg-blue-500 text-white  rounded cursor-pointer select-none bg-blue-950 transition-colors"
                    >
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>

              {/*  Contact */}
              <div className="flex flex-col h-full ">
                <div>
                  <h3 className="text-blue-500 pb-10 font-bold">
                    L'avis de nos clients.
                  </h3>
                  <Carousel
                    autoPlay
                    infiniteLoop
                    emulateTouch
                    interval={4000}
                    showStatus={false}
                    showArrows={false}
                    showThumbs={false}
                  >
                    <blockquote className=" flex flex-col items-center justify-center p-1 ">
                      <div className="pt-5 flex flex-col gap-5 justify-between bg-blue-500 mb-10 px-5  text-xl cursor-grab rounded-lg  shadow-xl text-white">
                        <q className="text-xl p-5">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Duis lobortis purus sed risus euismod, ac
                          accumsan lectus congue. Interdum et malesuada fames ac
                          ante ipsum primis in faucibus.
                        </q>
                        <div className="flex flex-col gap-2 items-center">
                          <div className="flex gap-2 justify-center">
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          </div>
                          <footer className="text-xl pb-5">— John Artur</footer>
                        </div>
                      </div>
                    </blockquote>

                    <blockquote className=" flex flex-col items-center justify-center p-1 ">
                      <div className="pt-5 flex flex-col gap-5 justify-between bg-blue-500 mb-10 px-5  text-xl cursor-grab rounded-lg  shadow-xl text-white">
                        <q className="text-justify  p-5">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Duis lobortis purus sed risus euismod, ac
                          accumsan lectus congue. Interdum et malesuada fames ac
                          ante ipsum primis in faucibus.
                        </q>
                        <div className="flex flex-col gap-2 items-center">
                          <div className="flex gap-2 justify-center">
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          </div>
                          <footer className="text-xl pb-5">— John Artur</footer>
                        </div>
                      </div>
                    </blockquote>

                    <blockquote className=" flex flex-col items-center justify-center p-1 ">
                      <div className="pt-5 flex flex-col gap-5 justify-between bg-blue-500 mb-10 px-5  text-xl cursor-grab rounded-lg  shadow-xl text-white">
                        <q className="text-justify  p-5">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Duis lobortis purus sed risus euismod, ac
                          accumsan lectus congue. Interdum et malesuada fames ac
                          ante ipsum primis in faucibus.
                        </q>
                        <div className="flex flex-col gap-2 items-center">
                          <div className="flex gap-2 justify-center">
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          </div>
                          <footer className="text-xl pb-5">— John Artur</footer>
                        </div>
                      </div>
                    </blockquote>
                  </Carousel>
                </div>
                <form className="flex flex-col items-center transition-all justify-center rounded-lg py-10 gap-10  bg-white text-  hover:bg-opacity-100  shadow-xl group ">
                  <h2 className=" font-bold pb-5 transition-all text-blue-500">
                    Candidature instantanée
                  </h2>
                  <div className="flex flex-col justify-center items-center gap-10 w-4/5">
                    <div className="flex gap-7 w-full justify-between text-lg items-center ">
                      <label className="w-1/6 text-justify whitespace-nowrap">
                        Prenom :
                      </label>
                      <input
                        className="rounded p-2 w-1/2 shadow-inner text-black bg-[#f2f2f2] border border-gray-200"
                        type="text"
                        required
                      />
                      <label className="w-1/6 text-justify whitespace-nowrap">
                        Nom :
                      </label>
                      <input
                        className="rounded p-2 w-1/2 shadow-inner text-black bg-[#f2f2f2] border border-gray-200"
                        type="text"
                        required
                      />
                    </div>

                    <div className="flex gap-5 w-full justify-between text-lg items-center ">
                      <label className="w-1/6 text-justify whitespace-nowrap">
                        Courriel :
                      </label>
                      <input
                        className="bg-[#f2f2f2] shadow-inner rounded w-full p-2 border border-gray-200"
                        type="email"
                        required
                      />
                    </div>

                    <div className="flex gap-5 w-full justify-between text-lg items-center ">
                      <label className="w-1/6 text-justify whitespace-nowrap">
                        Secteur :
                      </label>
                      <select className="bg-[#f2f2f2] shadow-inner rounded w-full p-2 border border-gray-200">
                        {fields.map((field, index) => (
                          <option
                            key={index}
                            className="relative flex flex-col shadow-xl text-black rounded hover:scale-105 group transition-all cursor-pointer"
                          >
                            {field.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-5 w-full justify-between text-lg items-center ">
                      <label className="w-1/6 text-justify whitespace-nowrap">
                        C.V. :
                      </label>
                      <div className="rounded w-full flex gap-5 border  border-gray-200 shadow-inner">
                        <input
                          className="shadow-inner bg-[#f2f2f2] text-sm rounded w-full border  border-gray-200  shadow-inner"
                          type="file"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center items-center shadow-xl m-auto w-full px-5 py-3 text-base font-semibold text-white no-underline align-middle hover:bg-blue-950   rounded cursor-pointer select-none bg-blue-500 transition-colors"
                    >
                      Postuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Accueil;
