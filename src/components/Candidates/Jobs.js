import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  addDoc,
  getDoc,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  FirestoreDataConverter,
  setDoc,
} from "firebase/firestore";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import jobsEnd from "../../media/jobsEnd.jpg";
import newTabIcon from "../../media/newTabIcon.png";
import heartIcon from "../../media/heartIcon.png";
import expIcon from "../../media/expIcon.png";
import languageIcon from "../../media/languageIcon.png";
import modeIcon from "../../media/modeIcon.png";

import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";

import idIcon from "../../media/idIcon.png";

const Jobs = ({ jobs, fields }) => {
  const [jobSelected, setJobSelected] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [title, setTitle] = useState(null);
  const [location, setLocation] = useState(null);
  const [field, setField] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [experience, setExperience] = useState(null);
  const [mode, setMode] = useState(null);
  const [language, setLanguage] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    if (jobs.length > 0 && jobId === null) {
      setJobId(jobs[0].id);
    }
  }, [jobs, jobId]);

  useEffect(() => {
    if (jobs.length > 0 && jobId !== null) {
      const selectedJob = jobs.find((job) => job.id === jobId);
      setTitle(selectedJob.title);
      setLocation(selectedJob.location);
      setField(selectedJob.field);
      setSchedule(selectedJob.schedule);
      setExperience(selectedJob.experience);
      setMode(selectedJob.mode);
      setLanguage(selectedJob.language);
      setDescription(selectedJob.description);
    }
  }, [jobs, jobId]);

  return (
    <main className="flex flex-col gap-5 h-full ">
      {/*  Lead Image */}
      <div className=" inset-0 w-full h-full bg-jobs-img  bg-cover  flex flex-col">
        <div className=" flex py-40 justify-start items-center bg-gradient-to-b from-transparent via-transparent to-[#fafafa]">
          <div className=" w-full  max-w-[1920px] mx-auto flex flex-col justify-center items-start gap-5 px-20">
            <div className="p-10 rounded-lg  w-2/3 gap-5 flex flex-col text-white  bg-blue-500  ">
              <h3 className=" ">À la recherche d'un emploi? </h3>
              <h1 className=" whitespace-nowrap text-center ">
                Trouvez votre plan B.
              </h1>
            </div>
            <div className=" text-center flex  flex-col gap-10 justify-center bg-blue-950  shadow-lg items-center w-2/3  rounded-lg p-10  ">
              <div className="flex gap-10 w-full">
                <div className=" flex flex-col gap-5 p-5 w-1/3 h-fit shadow-lg rounded text-black  bg-white">
                  <h2 className="text-xl text-center  font-bold  text-blue-500">
                    1. Appliquer
                  </h2>
                  <p className="  text-center text-blue-950 ">
                    Choisir un poste qui vous correspond.
                  </p>
                </div>
                <div className=" flex flex-col gap-5 p-5 w-1/3 h-fit shadow-lg rounded text-black  bg-white">
                  <h2 className="text-xl text-center  font-bold  text-blue-500">
                    2. Passer l'entrevue
                  </h2>
                  <p className="  text-center text-blue-950 ">
                    Réussir l'entrevue de préemploi.
                  </p>
                </div>
                <div className=" flex flex-col gap-5 p-5 w-1/3 h-fit shadow-lg rounded text-black  bg-white">
                  <h2 className="text-xl text-center  font-bold  text-blue-500">
                    3. Être embauché
                  </h2>
                  <p className="  text-center text-blue-950 ">
                    Démarrez votre plan B.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-20 pb-10 gap-40 max-w-[1920px] mx-auto">
        <div className="gap-10 flex flex-col">
          <h3 className="">Postes disponibles</h3>
          {/*  list filter */}
          <div className=" rounded-xl">
            <div className="grid grid-cols-4 justify-around gap-10 bg-blue-500 shadow-inner rounded-lg p-6 ">
              <input
                placeholder="Titre de poste, mots clés"
                className="flex gap-5 text-center justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
              ></input>
              <select className="flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 ">
                <option defaultValue={"All"}>Tous les secteurs d'emploi</option>
                {fields.map((field, index) => (
                  <option key={index} value={field.title}>
                    {field.title}
                  </option>
                ))}
              </select>
              <select className="flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 ">
                <option defaultValue={"All"}> Tous types de poste </option>
                {fields.map((field, index) => (
                  <option key={index} value={field.title}>
                    {field.title}
                  </option>
                ))}
              </select>
              <select className="flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 ">
                <option defaultValue={"All"}> Tout emplacement </option>
                {fields.map((field, index) => (
                  <option key={index} value={field.title}>
                    {field.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Jobs container */}
            <div className=" w-full h-full gap-10 bg-black bg-opacity-10  shadow-inner rounded-lg grid grid-cols-3  mt-10 p-10 ">
              <ul className="flex flex-col h-[1200px] gap-5  overflow-y-scroll  ">
                {/* Jobs cards */}
                {jobs.map((job, index) => (
                  <li
                    key={index}
                    className={`rounded-lg group mr-10 bg-[#fafafa] shadow-xl transition-all  ${
                      jobId === job.id ? "scale-100 " : "scale-95"
                    } hover:scale-100 transition-all`}
                  >
                    <div
                      onClick={() => {
                        setJobId(job.id);
                      }}
                      className="  flex flex-col justify-between w-full h-full rounded-lg cursor-pointer "
                    >
                      <div className=" relative flex flex-col p-5 py-10    ">
                        <div className="flex flex-1 flex-col gap-5 pb-5 justify-between">
                          <h3
                            className={` group-hover:text-blue-950 font-bold ${
                              jobId === job.id
                                ? "text-blue-950"
                                : "text-blue-500"
                            }`}
                          >{`${job.title.slice(0, 50)}${
                            job.title.length > 50 ? "..." : ""
                          }`}</h3>
                          <div className="flex justify-between px-1 ">
                            <span className="text-lg flex items-center">
                              <img
                                src={locationIcon}
                                alt="Location"
                                className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-all"
                              />
                              {job.mode === "Télétravail"
                                ? job.mode
                                : job.location}
                            </span>
                            <span className="text-lg flex items-center">
                              <img
                                src={scheduleIcon}
                                alt="Horaire"
                                className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-all"
                              />
                              {job.schedule}
                            </span>

                            <span
                              className={` flex items-center ${
                                job.salary === "" ? "text-lg" : "text-lg"
                              }`}
                            >
                              <img
                                src={salaryIcon}
                                alt="Salaire"
                                className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-all"
                              />
                              {job.salary === "" ? "À déterminer" : job.salary}
                            </span>
                          </div>
                        </div>
                        <hr />
                        <p className="text-justify pt-5 px-2">
                          {`${
                            job.title.length > 50
                              ? job.description.slice(0, 100)
                              : job.description.slice(0, 200)
                          }...`}
                        </p>
                      </div>

                      <div
                        className={`p-2 right-0 w-full flex items-center justify-between text-white
                         rounded-b group-hover:bg-blue-950 transition-all ${
                           jobId === job.id ? "bg-blue-950" : "bg-blue-500"
                         }`}
                      >
                        <span className="w-1/2 ml-2  text-base flex items-center">
                          {job.field}
                        </span>
                        <span className="text-xs mr-2 top-2 right-2 text-end">
                          {job.id}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Job selected */}
              <div className=" w-full h-[1200px] flex flex-col col-span-2 relative text-lg rounded-lg  text-black whitespace-pre-line  bg-[#fafafa] pb-10 shadow-xl">
                <div className="flex flex-col items-center w-full h-full p-10 rounded-t-lg ">
                  <div className=" w-full h- flex flex-col   gap-5  ">
                    <div className="flex flex-col gap-10 py-10 col-span-3 ">
                      <h2 className=" font-bold text-blue-950">{title}</h2>
                      <div className=" w-full grid grid-rows-2  gap-10 pr-10">
                        <div className="grid grid-cols-4 w-full text-lg">
                          <div className=" h-full rounded-l-xl flex items-center gap-2">
                            <img
                              src={locationIcon}
                              className="w-10 h-10 p-1"
                              alt="location icon"
                            />
                            <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                              {location}
                            </span>
                          </div>

                          <div className=" h-full rounded-l-xl flex items-center gap-2 ">
                            <img
                              src={scheduleIcon}
                              className="w-10 h-10 p-1 "
                              alt="location icon"
                            />
                            <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                              {schedule}
                            </span>
                          </div>
                          <div className=" h-full rounded-l-xl flex items-center">
                            <img
                              src={salaryIcon}
                              className="w-10 h-10 p-1"
                              alt="location icon"
                            />
                            <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                              18$/h
                            </span>
                          </div>

                          <div className=" h-full rounded-l-xl flex items-center gap-2">
                            <img
                              src={fieldIcon}
                              className="w-10 h-10 p-1"
                              alt="location icon"
                            />
                            <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                              {field}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 w-full text-lg">
                          {experience === "" ? (
                            ""
                          ) : (
                            <div className=" h-full rounded-l-xl flex items-center">
                              <img
                                src={expIcon}
                                className="w-10 h-10 p-1"
                                alt="location icon"
                              />
                              <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                                {experience}
                              </span>
                            </div>
                          )}
                          {mode === "" ? (
                            ""
                          ) : (
                            <div className=" h-full rounded-l-xl flex items-center">
                              <img
                                src={modeIcon}
                                className="w-10 h-10 p-1"
                                alt="location icon"
                              />
                              <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                                {mode}
                              </span>
                            </div>
                          )}
                          {language === "" ? (
                            ""
                          ) : (
                            <div className=" h-full rounded-l-xl flex items-center">
                              <img
                                src={languageIcon}
                                className="w-10 h-10 p-1"
                                alt="location icon"
                              />
                              <span className="h-full  rounded-r-xl flex items-center whitespace-nowrap">
                                {language}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end items-end  w-full  px-5 pb-10">
                    <div className="flex  items-end col-span-1 justify-start gap-5 w-1/2">
                      <a
                        className="h-full w-full relative gap-1 bg-blue-950   text-white hover:text-blue-500 shadow-xl  font-bold p-2 text-center rounded flex items-center justify-center  transition-all hover:font-bold"
                        target="_blank"
                        href={`emplois/${jobId}`}
                        rel="noreferrer"
                      >
                        <img
                          src={newTabIcon}
                          alt="Nouvelle fenetre"
                          className="w-8 h-8 p-1 "
                        ></img>
                        <span className="">Postuler </span>
                      </a>
                      <a
                        className="h-fit w-full bg-blue-500  text-white hover:text-blue-950 shadow-xl  font-bold p-2 text-center rounded flex items-center justify-center  transition-all hover:font-bold"
                        target="_blank"
                        href={`emplois/${jobId}`}
                        rel="noreferrer"
                      >
                        <img
                          src={heartIcon}
                          alt="Nouvelle fenetre"
                          className="w-8 h-8 p-1"
                        ></img>
                        Enregistrer
                      </a>
                    </div>
                    <div className="absolute top-0 right-0 p-10 text-xs flex justify-center items-center">
                      {jobId}
                    </div>
                  </div>
                  <hr className="w-11/12 px-10 py-2" />
                  <div className=" flex flex-col gap-10 h-3/4 w-full  overflow-y-scroll">
                    <div className=" pr-10 rounded py-5  h-full  text-black whitespace-pre-line relative">
                      <p>{description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center flex flex-col gap-10 pb-20 w-full    ">
          <h3 className="text-start"> Nos services </h3>
          <div className="flex  justify-around gap-20 text-black">
            <div className="bg-blue-500 text-white  shadow-xl hover:scale-105 border-blue-500 border border-opacity-50 hover:border-opacity-100 transition-all rounded-lg p-5  ">
              <h5 className="font-bold "> Orientation </h5>
              <p className="text-justify p-5">
                Nous nous efforçons d&#39;établir des partenariats solides avec
                nos clients, en nous assurant de bien comprendre leurs besoins
                en matière de personnel.
              </p>
            </div>

            <div className="bg-blue-950 text-white  shadow-xl hover:scale-105 border-blue-500 border border-opacity-50 hover:border-opacity-100 transition-all rounded-lg p-5  ">
              <h5 className="font-bold "> Rédaction de CV </h5>
              <p className="text-justify p-5">
                Nous nous efforçons d&#39;établir des partenariats solides avec
                nos clients, en nous assurant de bien comprendre leurs besoins
                en matière de personnel.
              </p>
            </div>
            <div className="bg-blue-500 text-white  shadow-xl hover:scale-105 border-blue-500 border border-opacity-50 hover:border-opacity-100 transition-all rounded-lg p-5  ">
              <h5 className="font-bold "> Embauche </h5>
              <p className="text-justify p-5">
                Nous nous efforçons d&#39;établir des partenariats solides avec
                nos clients, en nous assurant de bien comprendre leurs besoins
                en matière de personnel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom page */}
      <div
        className=" bg-cover bg-end w-full h-full "
        style={{ backgroundImage: `url(${jobsEnd})` }}
      >
        <div className="flex  h-full w-full bg-gradient-to-b from-[#fafafa]  via-transparent to-blue-950 text-center pb-20 gap-40">
          <div className=" max-w-[1920px] mx-auto grid grid-cols-2 px-40  gap-60">
            {/* Stats and reviews */}
            <div className=" h-full rounded-lg flex flex-col gap-10">
              <div className="flex flex-col gap-10 ">
                <h3 className="text-blue-950 font-bold">
                  Travaillons ensemble dès aujourd'hui.
                </h3>
                <div className="flex flex-col bg-blue-950 rounded-lg gap-5  p-8  px-10 shadow-xl text-white">
                  <h4>
                    Nous nous efforçons d&#39;établir des partenariats solides
                    avec nos clients, en nous assurant de bien comprendre leurs
                    besoins en matière de personnel.
                  </h4>
                </div>
              </div>
              <form className="flex flex-col items-center flex-1 justify-center rounded-lg py-10 gap-10   bg-white shadow-xl group ">
                <h2 className="text-3xl font-bold pb-5  text-blue-950 ">
                  Contactez nous
                </h2>
                <div className="flex flex-col justify-center items-center gap-10 w-4/5 ">
                  <div className="flex w-full gap-10">
                    <div className="flex flex-col w-1/2 gap-2">
                      <label className="text-start">Nom complet</label>
                      <input
                        className=" shadow-inner rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200  "
                        type="text"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/2 gap-2">
                      <label className="text-start"> Courriel </label>
                      <input
                        className=" shadow-inner rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200  "
                        type="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center h-full w-full gap-4 ">
                    <label className="self-start"> Message </label>
                    <textarea
                      className="rounded w-full h-32 text-black  bg-[#fafafa] border border-gray-200  "
                      type="text"
                      size={400}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center m-auto w-full px-5 py-3 shadow-xl text-base font-semibold no-underline align-middle hover:bg-blue-500 text-white  rounded cursor-pointer select-none bg-blue-950 transition-colors"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>

            {/*  Contact */}
            <div className="flex flex-col h-full gap-10 ">
              <div>
                <h3 className="text-blue-500 font-bold pb-10">
                  Trouvez votre plan B.
                </h3>
                <div className="flex flex-col bg-blue-500 rounded-lg gap-5  p-8  px-10 shadow-xl text-white">
                  <h4>
                    Nous nous efforçons d&#39;établir des partenariats solides
                    avec nos clients, en nous assurant de bien comprendre leurs
                    besoins en matière de personnel.
                  </h4>
                </div>
              </div>
              <form className="flex flex-col items-center transition-all justify-center rounded-lg py-10 gap-10  bg-white   hover:bg-opacity-100  shadow-xl group ">
                <h2 className="text-3xl font-bold pb-5 transition-all text-blue-500">
                  Candidature instantanée
                </h2>
                <div className="flex flex-col justify-center items-center gap-10 w-4/5">
                  <div className="flex gap-7 w-full justify-between text-lg items-center ">
                    <label className="w-1/6 text-justify whitespace-nowrap">
                      Prenom :
                    </label>
                    <input
                      className=" shadow-inner rounded p-2 w-1/2 text-black bg-[#fafafa] border border-gray-200"
                      type="text"
                      required
                    />
                    <label className="w-1/6 text-justify whitespace-nowrap">
                      Nom :
                    </label>
                    <input
                      className=" shadow-inner rounded p-2 w-1/2 text-black bg-[#fafafa] border border-gray-200"
                      type="text"
                      required
                    />
                  </div>

                  <div className="flex gap-5 w-full justify-between text-lg items-center ">
                    <label className="w-1/6 text-justify whitespace-nowrap">
                      Courriel :
                    </label>
                    <input
                      className=" shadow-inner bg-[#fafafa]  rounded w-full p-2 border border-gray-200"
                      type="email"
                      required
                    />
                  </div>

                  <div className="flex gap-5 w-full justify-between text-lg items-center ">
                    <label className="w-1/6 text-justify whitespace-nowrap">
                      Secteur :
                    </label>
                    <select className="bg-[#fafafa]  rounded w-full p-2 border border-gray-200">
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
                    <div className="rounded w-full flex gap-5">
                      <input
                        className=" shadow-inner bg-[#fafafa] text-sm rounded w-full border border-gray-200"
                        type="file"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center m-auto w-full px-5 py-3 shadow-xl text-base font-semibold text-white no-underline align-middle hover:bg-blue-950 hover:shadow-inner  rounded cursor-pointer select-none bg-blue-500 transition-colors"
                  >
                    Postuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Jobs;
