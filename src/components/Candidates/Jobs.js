import React, { useState, useEffect, useRef } from "react";
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
  arrayUnion,
} from "firebase/firestore";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
import refreshIcon from "../../media/refreshIcon.png";

import idIcon from "../../media/idIcon.png";

const Jobs = ({
  jobs,
  fields,
  locations,
  selectedField,
  setSelectedField,
  userData,
  scrollToJobs,
  setScrollToJobs,
  setPopUpMessage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobId, setJobId] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [field, setField] = useState("");
  const [schedule, setSchedule] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");

  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [filterMode, setFilterMode] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const [copyOpacity, setCopyOpacity] = useState("opacity-0");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldApplication, setFieldApplication] = useState("all");
  const [cvFile, setCvFile] = useState("");
  const [cvFileName, setCvFileName] = useState("");

  const uploadFile = async (file, type) => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `candidatures/${type}: Candidature libre - ${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} - ${email} `
    );
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleNewApplication = async (e) => {
    e.preventDefault();
    try {
      const cvFileURL = await uploadFile(cvFile, "CV");

      await setDoc(
        doc(
          db,
          "candidatures libres",
          `${email} - Candidature libre - ${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`
        ),
        {
          id: `${email} - Candidature libre - ${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`,
          firstName: firstName,
          lastName: lastName,
          email: email,
          field: field,
          cv: cvFileURL,
          cvName: cvFileName,
          createdAt: new Date().toDateString(),
          status: "Candidature libre",
        }
      );
      setPopUpMessage("Candidature soumise avec succès.");
      setCvFile("");
      setCvFileName("");
    } catch (e) {
      setPopUpMessage("Candidature non soumise. Erreur produite." + e.message);
    }
  };

  const postesDisponiblesRef = useRef(null);
  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

  const applyFilters = () => {
    let filtered = jobs;
    filtered = filtered.filter((job) => job.status.toLowerCase() === "open");

    if (filterKeyword) {
      filtered = filtered.filter(
        (job) =>
          job.id.toLowerCase().includes(filterKeyword) ||
          job.title.toLowerCase().includes(filterKeyword) ||
          job.description.toLowerCase().includes(filterKeyword)
      );
    }
    if (filterField !== "all") {
      filtered = filtered.filter(
        (job) => job.field.toLowerCase() === filterField.toLowerCase()
      );
    }
    if (filterMode !== "all") {
      filtered = filtered.filter(
        (job) => job.mode.toLowerCase() === filterMode.toLowerCase()
      );
    }
    if (filterLocation !== "all") {
      filtered = filtered.filter(
        (job) => job.location.toLowerCase() === filterLocation.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    if (jobs.length > 0) {
      applyFilters();
    }
  }, [jobs, filterKeyword, filterField, filterMode, filterLocation]);

  const handleFilterKeywordChange = (e) => {
    setFilterKeyword(e.target.value.toLowerCase());
  };

  const handleFilterFieldChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleFilterModeChange = (e) => {
    setFilterMode(e.target.value);
  };

  const handleFilterLocationChange = (e) => {
    setFilterLocation(e.target.value);
  };

  const handleRefresh = () => {
    setFilterKeyword("");
    setFilterField("all");
    setFilterMode("all");
    setFilterLocation("all");
    setSearchParams("");
    setJobId("");
  };

  useEffect(() => {
    const urlJobId = searchParams.get("jobId");
    console.log("URL Job ID:", urlJobId);
    if (urlJobId && jobId === "") {
      if (filteredJobs.length > 0) {
        const selectedJob = filteredJobs.find((job) => job.id === urlJobId);
        if (selectedJob) {
          setFilterKeyword(selectedJob.id);
          setJobId(selectedJob.id);
          setTitle(selectedJob.title);
          setLocation(selectedJob.location);
          setField(selectedJob.field);
          setSchedule(selectedJob.schedule);
          setExperience(selectedJob.experience);
          setMode(selectedJob.mode);
          setLanguage(selectedJob.language);
          setDescription(selectedJob.description);
          scrollToRef(postesDisponiblesRef);
        }
      }
    } else if (!urlJobId && filteredJobs.length > 0) {
      const selectedJob = filteredJobs[0];
      setJobId(selectedJob.id);
      setTitle(selectedJob.title);
      setLocation(selectedJob.location);
      setField(selectedJob.field);
      setSchedule(selectedJob.schedule);
      setExperience(selectedJob.experience);
      setMode(selectedJob.mode);
      setLanguage(selectedJob.language);
      setDescription(selectedJob.description);
    } else if (filteredJobs.length > 0) {
      const selectedJob = filteredJobs.find((job) => job.id === jobId);
      setTitle(selectedJob.title);
      setLocation(selectedJob.location);
      setField(selectedJob.field);
      setSchedule(selectedJob.schedule);
      setExperience(selectedJob.experience);
      setMode(selectedJob.mode);
      setLanguage(selectedJob.language);
      setDescription(selectedJob.description);
    }
  }, [filteredJobs, jobId]);

  useEffect(() => {
    fields.map((field) =>
      field.title === selectedField ? setFilterField(selectedField) : ""
    );

    setSelectedField("");

    if (scrollToJobs && postesDisponiblesRef.current) {
      scrollToRef(postesDisponiblesRef);
      setScrollToJobs(false);
    }

    if (selectedField && postesDisponiblesRef.current) {
      scrollToRef(postesDisponiblesRef);
    }
  }, [selectedField, scrollToJobs]);

  const handleJobSave = async (e) => {
    e.preventDefault();
    try {
      console.log(userData);
      const userRef = doc(db, "membres", userData.id); // Reference to the user document

      // Update the document
      await updateDoc(userRef, {
        savedJobs: arrayUnion(jobId), // Add jobId to the savedJobs array
      });

      setPopUpMessage("Poste enregistré.");
    } catch (error) {
      setPopUpMessage(
        "Erreur lors de la sauvegarde du poste. " + error.message
      );
    }
  };

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
    }
  }, [userData]);

  return (
    <main className="flex flex-col gap-5 h-full ">
      {/*  Lead Image */}
      <div className=" inset-0 w-full h-full bg-jobs-img  bg-cover bg-center  flex flex-col">
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
        <div className="text-center flex flex-col gap-10 w-full    ">
          <h2 className="text-center py-10 font-bold"> Nos services </h2>
          <div className="flex  justify-around gap-20 text-black">
            <div className="bg-blue-500 text-white  shadow-xl hover:scale-105 border-blue-500 border border-opacity-50 hover:border-opacity-100 transition-all rounded-lg p-5  ">
              <h5 className="font-bold "> Orientation professionnelle </h5>
              <p className="text-justify p-5">
                Nous vous guidons à travers le marché du travail avec des
                conseils sur mesure. Notre objectif est de cerner vos
                compétences et aspirations pour vous orienter vers des
                opportunités professionnelles alignées avec vos objectifs de
                carrière. Nous nous engageons à transformer votre potentiel en
                succès.
              </p>
            </div>

            <div className="bg-blue-950 text-white  shadow-xl hover:scale-105 border-blue-500 border border-opacity-50 hover:border-opacity-100 transition-all rounded-lg p-5  ">
              <h5 className="font-bold "> Rédaction et optimisation de CV </h5>
              <p className="text-justify p-5">
                Votre CV est votre première impression auprès des employeurs.
                Notre service de rédaction et d'optimisation de CV est conçu
                pour vous présenter sous votre meilleur jour. Avec une
                compréhension approfondie de vos expériences et compétences,
                vous aurez un CV percutant qui attire l'attention des
                recruteurs.
              </p>
            </div>
            <div className="bg-blue-500 text-white  shadow-xl hover:scale-105 border-blue-500 border border-opacity-50 hover:border-opacity-100 transition-all rounded-lg p-5  ">
              <h5 className="font-bold ">
                Accès aux offres d'emplois et placement
              </h5>
              <p className="text-justify p-5">
                Nous simplifions votre processus d'embauche. Nous sommes experts
                en alignant les talents disponibles avec les postes vacants dans
                les entreprises. En établissant une compréhension claire de vos
                besoins, nous vous présentons des offres ciblées et vous plaçons
                dans les entreprises partenaires.
              </p>
            </div>
          </div>
        </div>
        <div className="gap-5 flex flex-col  pb-20">
          <h2 className="text-center font-bold pt-10">Postes disponibles</h2>
          <div className="py-7" id="postes" ref={postesDisponiblesRef}></div>

          {/*  list filter */}
          <div className="flex flex-col rounded-xl">
            <div className="flex justify-around  gap-10 bg-blue-500 shadow-inner rounded-lg p-6 ">
              <div className="grid grid-cols-4 gap-10 flex-1 ">
                <input
                  placeholder="Titre de poste, mots clés"
                  className="w-full flex gap-5 text-center justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
                  value={filterKeyword}
                  onChange={handleFilterKeywordChange}
                ></input>

                <select
                  className="w-full flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
                  value={filterField}
                  onChange={handleFilterFieldChange}
                >
                  <option value="all">Tous les secteurs d'emploi</option>
                  {fields.map((field, index) => (
                    <option key={index} value={field.title}>
                      {field.title}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
                  onChange={handleFilterModeChange}
                  value={filterMode}
                >
                  <option value="all"> Tous les modes </option>
                  <option value={"présentiel"}> Présentiel</option>
                  <option value={"télétravail"}> Télétravail</option>
                  <option value={"hybride"}> Hybride</option>
                </select>

                <select
                  className="w-full flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
                  onChange={handleFilterLocationChange}
                  value={filterLocation}
                >
                  <option value="all"> Tout emplacement </option>
                  {locations.map((location, index) => {
                    return (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="w-fit">
                <button
                  className="w-fit flex gap-5 hover:scale-110 justify-around items-center whitespace-nowrap shadow-xl rounded-md bg-blue-950 hover:shadow-none  transition-all"
                  onClick={handleRefresh}
                >
                  <img
                    className="h-10 w-10 p-1"
                    src={refreshIcon}
                    alt="Rafraichir"
                  />
                </button>
              </div>
            </div>

            {/* Jobs container */}
            <div className=" w-full h-full gap-10 bg-black bg-opacity-10  shadow-inner rounded-lg grid grid-cols-3 mt-5 p-10 ">
              <ul className="flex flex-col h-[1000px] gap-5  overflow-y-scroll  ">
                {/* Jobs cards */}
                {filteredJobs.map((job, index) => (
                  <li
                    key={index}
                    className={`rounded-lg group mr-10 bg-[#fafafa] shadow-xl transition-all  ${
                      jobId === job.id ? "scale-100 " : "scale-95"
                    } hover:scale-100 transition-all`}
                  >
                    <div
                      onClick={() => {
                        setJobId(job.id);
                        setSearchParams({ jobId: job.id });
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
              {jobId !== null ? (
                <div className=" w-full h-[1000px] flex flex-col col-span-2 relative text-lg rounded-lg  text-black whitespace-pre-line  bg-[#fafafa] pb-10 shadow-xl">
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

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  window.location.href
                                );

                                setCopyOpacity("opacity-100");
                                setTimeout(
                                  () => setCopyOpacity("opacity-0"),
                                  3000
                                );
                              }}
                              className="flex items-center group text-blue-500 transition-all hover:scale-105"
                            >
                              <img
                                src={idIcon}
                                alt="Copier le lien de ce poste"
                                className="w-10 h-10 p-1 opacity-80 group-hover:opacity-100 transition-all"
                              />
                              <div className="flex gap-2 whitespace-nowrap">
                                <small className="whitespace-nowrap">
                                  {jobId}
                                </small>
                                <small
                                  className={`${copyOpacity} transition-all ease-in-out`}
                                >
                                  (Copié!)
                                </small>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end items-end  w-full  px-5 pb-10">
                      <div className="flex  items-end col-span-1 justify-start gap-5 w-1/2">
                        <button
                          onClick={handleJobSave}
                          className="h-fit w-full bg-blue-500  text-white hover:text-blue-950 shadow-xl  font-bold p-2 text-center rounded flex items-center justify-center  transition-all hover:font-bold"
                        >
                          <img
                            src={heartIcon}
                            alt="Nouvelle fenetre"
                            className="w-8 h-8 p-1"
                          ></img>
                          Enregistrer
                        </button>
                        <Link
                          className="h-full w-full relative gap-1 bg-blue-950   text-white hover:text-blue-500 shadow-xl  font-bold p-2 text-center rounded flex items-center justify-center  transition-all hover:font-bold"
                          target="_blank"
                          to={`../application/${jobId}`}
                          rel="noreferrer"
                        >
                          <img
                            src={newTabIcon}
                            alt="Nouvelle fenetre"
                            className="w-8 h-8 p-1 "
                          ></img>
                          <span className="">Postuler </span>
                        </Link>
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
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom page */}
      <div
        className=" bg-cover bg-center w-full h-full "
        style={{ backgroundImage: `url(${jobsEnd})` }}
      >
        <div className="flex  h-full w-full bg-gradient-to-b from-[#fafafa]  via-transparent to-blue-950 text-center pb-20 gap-40">
          <div className=" max-w-[1920px] mx-auto px-20 w-1/2 gap-40">
            <div className="grid rows-3  h-full gap-5">
              <div className="row-span-1">
                <h3 className="text-blue-950 font-bold pb-10">
                  Trouvez votre plan B.
                </h3>
              </div>
              {/*  Candidatures spontanées */}
              <form
                onSubmit={handleNewApplication}
                className="flex flex-col items-center transition-all justify-between rounded-lg  py-10 h-full  bg-white   hover:bg-opacity-100  shadow-xl group "
              >
                <h2 className=" font-bold  text-blue-500">
                  Candidature spontanée
                </h2>
                <p className="text-blue-500 p-10 text-justify [text-align-last:center]">
                  Rejoignez notre banque de talents et assurez-vous d'être vu
                  par les meilleurs employeurs. <br /> Nous vous mettons en
                  relation avec des entreprises qui valorisent vos compétences.
                </p>
                <div className="grid grid-rows-4  items-center gap-7  w-4/5">
                  <div className="grid grid-cols-2 gap-10 w-full justify-between text-lg items-center ">
                    <div className="flex flex-col gap-1">
                      <label className=" text-justify whitespace-nowrap">
                        Prénom
                      </label>
                      <input
                        className=" shadow-inner rounded p-2  text-black bg-[#fafafa] border border-gray-200"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className=" text-justify whitespace-nowrap">
                        Nom
                      </label>
                      <input
                        className=" shadow-inner rounded p-2  text-black bg-[#fafafa] border border-gray-200"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 items-start w-full justify-between  ">
                    <label className=" text-justify whitespace-nowrap">
                      Courriel
                    </label>
                    <input
                      className=" shadow-inner bg-[#fafafa]  rounded w-full p-2 border border-gray-200"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full justify-between items-start ">
                    <label className=" text-justify whitespace-nowrap">
                      Secteur
                    </label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="bg-[#fafafa]  rounded w-full p-2 border border-gray-200"
                      required
                    >
                      <option value="all"> Tous les secteurs </option>
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
                  <div className="flex flex-col gap-1 w-full justify-between items-start ">
                    <label className=" text-justify whitespace-nowrap">
                      Curriculum Vitae
                    </label>
                    <div className="rounded w-full flex gap-5">
                      <input
                        className=" shadow-inner bg-[#fafafa] text-sm rounded w-full border border-gray-200"
                        type="file"
                        onChange={(e) => (
                          setCvFile(e.target.files[0]),
                          setCvFileName(e.target.files[0].name)
                        )}
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
