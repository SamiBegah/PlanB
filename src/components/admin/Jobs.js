import React, { useState, useEffect } from "react";
import {
  addDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  FirestoreDataConverter,
  where,
  setDoc,
} from "firebase/firestore";
import { useSearchParams, useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";
import idIcon from "../../media/idIcon.png";
import addIcon from "../../media/addIcon.png";
import refreshIcon from "../../media/refreshIcon.png";
import seeIcon from "../../media/seeIcon.png";
import downloadIcon from "../../media/downloadIcon.png";

import Applications from "./Applications";

const Jobs = ({ db, jobs, fetchJobs, fields, locations }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [title, setTitle] = useState("");
  const [employer, setEmployer] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [field, setField] = useState("");
  const [schedule, setSchedule] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");

  const [subMenu, setSubMenu] = useState("add");

  const [selectedId, setselectedId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editEmployer, setEditEmployer] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editField, setEditField] = useState("");
  const [editSchedule, setEditSchedule] = useState("");
  const [editExperience, setEditExperience] = useState("");
  const [editMode, setEditMode] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [filterStatus, setFilterStatus] = useState("open");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState();

  const [candidatesJob, setCandidatesJob] = useState("");

  const handleFilterKeywordChange = (e) => {
    setFilterKeyword(e.target.value.toLowerCase());
  };

  const handleFilterFieldChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterLocationChange = (e) => {
    setFilterLocation(e.target.value);
  };

  const handleRefresh = () => {
    setFilterKeyword("");
    setFilterField("all");
    setFilterStatus("open");
    setFilterLocation("all");
    setSearchParams("");
    setselectedId("");
    setSubMenu("add");
  };
  const applyFilters = () => {
    let filtered = jobs;
    filtered = filtered.filter(
      (job) => job.status.toLowerCase() === filterStatus.toLowerCase()
    );
    console.log(filtered);
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

    if (filterLocation !== "all") {
      filtered = filtered.filter(
        (job) => job.location.toLowerCase() === filterLocation.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [jobs, filterKeyword, filterField, filterStatus, filterLocation]);

  useEffect(() => {
    if (candidatesJob) {
      setselectedId(candidatesJob.id);
    }
    if (selectedId) {
      setCandidatesJob(jobs.filter((job) => job.id === selectedId)[0]);
    }
  }, [candidatesJob, selectedId]);

  /////////////////////////////////////////////////* JOBS MANAGEMENT *////////////////////////////////////////////////////////

  const [applicationsList, setApplicationsList] = useState([]);

  // Applications list fetch
  const fetchApplications = async (id) => {
    const applicationsQuery = query(collection(db, "candidatures"));
    const querySnapshot = await getDocs(applicationsQuery);

    const updatedApplicationsList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setApplicationsList(updatedApplicationsList);
  };

  // New job form
  const handleNewJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(
        doc(
          db,
          "postes",
          `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}-${title
            .replace(/ /g, "-")
            .toLowerCase()
            .substring(0, 15)}-${uuid().substring(0, 3)}`
        ),
        {
          id: `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}-${title
            .replace(/ /g, "-")
            .toLowerCase()
            .substring(0, 15)}-${uuid().substring(0, 3)}`,
          title: title,
          employer: employer,
          location: location,
          salary: salary,
          field: field,
          schedule: schedule,
          experience: experience,
          mode: mode,
          language: language,
          description: description,
          createdAt: new Date().toDateString(),
        }
      );

      setTitle("");
      setEmployer("");
      setLocation("");
      setSalary("");
      setField("");
      setSchedule("");
      setMode("");
      setExperience("");
      setLanguage("");
      setDescription("");
    } catch (e) {
      alert("Poste non ajouté. Erreur produite." + e);
    }
  };

  // Job deletion
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "postes", id));
      alert("Poste d'emploi supprimé.");
      setCandidatesJob("");
    } catch (id) {
      alert("Erreur, poste d'emploi non supprimé. Id: " + id);
    }
  };

  const handleEdit = (job) => {
    setSubMenu("edit");
    setselectedId(job.id);
    setEditTitle(job.title);
    setEditEmployer(job.employer);
    setEditLocation(job.location);
    setEditSalary(job.salary);
    setEditField(job.field);
    setEditSchedule(job.schedule);
    setEditMode(job.mode);
    setEditExperience(job.experience);
    setEditLanguage(job.language);
    setEditDescription(job.description);
    setCandidatesJob("");
  };

  const handleJobPostEdit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "postes", selectedId), {
        title: editTitle,
        employer: editEmployer,
        location: editLocation,
        salary: editSalary,
        field: editField,
        schedule: editSchedule,
        experience: editExperience,
        mode: editMode,
        language: editLanguage,
        description: editDescription,
        lastModifiedAt: new Date(),
      });
      alert("Poste mise à jour.");
      setSubMenu("add");

      setselectedId("");
      setEditTitle("");
      setEditEmployer("");
      setEditLocation("");
      setEditField("");
      setEditSchedule("");
      setEditMode("");
      setEditExperience("");
      setEditLanguage("");
      setEditDescription("");
    } catch (id) {
      alert("Erreur, poste non mis à jour.Id: " + id);
    }
  };

  const handleEditCancel = () => {
    setSubMenu("add");
    setselectedId("");
    setEditTitle("");
    setEditEmployer("");
    setEditLocation("");
    setEditSalary("");
    setEditField("");
    setEditSchedule("");
    setEditMode("");
    setEditExperience("");
    setEditLanguage("");
    setEditDescription("");
  };

  useEffect(() => {
    fetchApplications();
    setFilterStatus("open");
  }, []);

  return (
    <div>
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
              onChange={handleFilterStatusChange}
              value={filterStatus}
              className="w-full flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100 "
            >
              <option value="open"> Postes ouverts </option>
              <option value="closed">Postes fermés</option>
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
          <div className="flex gap-5">
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
            <button
              className="w-fit flex gap-5 hover:scale-110 justify-around items-center whitespace-nowrap shadow-xl rounded-md bg-blue-950 hover:shadow-none  transition-all"
              onClick={() => (setSubMenu("add"), setselectedId(""))}
            >
              <img
                className="h-10 w-10 p-1"
                src={addIcon}
                alt="Ajouter un poste"
              />
            </button>
          </div>
        </div>
      </div>
      {/* Jobs List */}
      <div className="w-full h-full grid grid-cols-3 py-5 gap-10 items-start">
        <div className=" h-full flex flex-col gap-20 col-span-1">
          <div className="  h-[900px] gap-10 bg-black bg-opacity-10 shadow-inner rounded-lg  p-2 ">
            <ul className="flex flex-col h-full  overflow-y-scroll p-10 gap-5 ">
              {filteredJobs?.map((job) => (
                <li
                  key={job.id}
                  className={`rounded-lg group h-fit bg-[#fafafa] shadow-xl transition-all  ${
                    selectedId === job.id ? "scale-100  " : "scale-95"
                  } hover:scale-100 transition-all`}
                >
                  <div
                    className={`p-3 flex items-center justify-between w-full text-white whitespace-nowrap
                  ] bg-blue-500 rounded-t-lg transition-all ${
                    selectedId === job.id ? "bg-blue-950  " : ""
                  }`}
                  >
                    <small className="w-3/4 ">{job.field}</small>
                    <small className=" top-2 right-2 text-end ">{job.id}</small>
                  </div>
                  <div className="flex flex-1 flex-col gap-5 p-5 justify-between">
                    <h4
                      className={` text-blue-500 font-bold transition-all  ${
                        selectedId === job.id ? "text-blue-950  " : ""
                      }`}
                    >
                      {job.title}
                    </h4>

                    <div className="flex justify-between w-full whitespace-nowrap ">
                      <div className=" flex items-center justify-center">
                        <img
                          src={locationIcon}
                          alt="Location"
                          className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-all"
                        />
                        {job.mode === "Télétravail" ? job.mode : job.location}
                      </div>
                      <div className=" flex items-center justify-center">
                        <img
                          src={scheduleIcon}
                          alt="Horaire"
                          className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-all"
                        />
                        {job.schedule}
                      </div>

                      <div
                        className={` flex items-center justify-center ${
                          job.salary === "" ? "invisible" : ""
                        }`}
                      >
                        <img
                          src={salaryIcon}
                          alt="Salaire"
                          className="w-10 h-10 p-2 opacity-80 group-hover:opacity-100 transition-all"
                        />
                        {job.salary === "" ? "À déterminer" : job.salary}
                      </div>
                    </div>
                    <hr />
                    <p className="text-justify  px-2">
                      {`${
                        job.title.length > 50
                          ? job.description.slice(0, 100)
                          : job.description.slice(0, 200)
                      }...`}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center items-center w-full pb-5 text-white">
                    <button
                      onClick={() => (
                        setselectedId(job.id),
                        setCandidatesJob(job),
                        setSubMenu("candidates")
                      )}
                      className="p-2 px-5   bg-blue-950 rounded shadow-xl  hover:scale-105 transition-all"
                    >
                      Candidatures (
                      {applicationsList
                        ? applicationsList.filter(
                            (application) => application.jobId === job.id
                          ).length
                        : 0}
                      )
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 px-5  bg-blue-500 rounded shadow-xl  hover:scale-105 transition-all"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 px-5  bg-gray-500 rounded shadow-xl  hover:scale-105 transition-all"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full h-full sticky top-40 flex flex-col justify-around gap-10 col-span-2">
          {subMenu === "add" ? (
            <form
              className="flex flex-col items-center flex-1 justify-center rounded-lg py-10 gap-10 bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] group "
              onSubmit={handleNewJobSubmit}
            >
              <h3 className="text-2xl text-center p-5 font-bold text-blue-950">
                Ajouter un poste
              </h3>
              <div className="grid grid-cols-3 gap-10 w-4/5 whitespace-nowrap ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="title">
                    Titre
                  </label>
                  <input
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="employer">
                    Employeur
                  </label>
                  <input
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    type="text"
                    name="employer"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="location">
                    Emplacement
                  </label>
                  <input
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    type="text"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3  gap-10 w-4/5 ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="salary">
                    Salaire
                  </label>
                  <input
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    type="text"
                    name="salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="field">
                    Secteur
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="field"
                    onChange={(e) => setField(e.target.value)}
                    value={field}
                    required
                  >
                    <option value="" defaultValue={""}></option>
                    {fields.map((field, index) => (
                      <option key={index} value={field.title}>
                        {field.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="schedule">
                    Horaire
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="schedule"
                    onChange={(e) => setSchedule(e.target.value)}
                    value={schedule}
                    required
                  >
                    <option value="" defaultValue={""}></option>
                    <option value="Temps partiel">Temps partiel</option>
                    <option value="Temps plein">Temps plein</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contractuel">Contractuel</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3  gap-10 w-4/5 ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="mode">
                    Mode
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="mode"
                    onChange={(e) => setMode(e.target.value)}
                    value={mode}
                    required
                  >
                    <option value="" defaultValue={""}></option>
                    <option value="Présentiel">Présentiel</option>
                    <option value="Télétravail">Télétravail</option>
                    <option value="Permanent">Hybride</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="experience">
                    Experience
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="experience"
                    onChange={(e) => setExperience(e.target.value)}
                    value={experience}
                  >
                    <option value="" defaultValue={""}></option>
                    <option value="0 à 1 ans">0 à 1 ans</option>
                    <option value="1 à 3 ans">1 à 3 ans</option>
                    <option value="3 à 5 ans">3 à 5 ans</option>
                    <option value="5 et plus">5 ans et +</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="language">
                    Langue(s)
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="language"
                    onChange={(e) => setLanguage(e.target.value)}
                    value={language}
                  >
                    <option value="" defaultValue={""}></option>
                    <option value="Francais">Francais</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Bilingue">Bilingue</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-1 w-4/5 flex-col gap-2">
                <label htmlFor="description"> Description </label>
                <textarea
                  name="description"
                  className="flex-1 border border-gray-200 shadow-inner overflow-y-scroll bg-[#fafafa]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="p-3 px-5  bg-blue-950 rounded shadow-xl text-white hover:bg-blue-500 transition-all"
              >
                Ajouter ce poste
              </button>
            </form>
          ) : (
            ""
          )}

          {subMenu === "edit" ? (
            <form
              className="flex flex-col items-center flex-1 justify-center rounded-lg py-10 gap-10 bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] "
              onSubmit={handleJobPostEdit}
            >
              <div className="flex flex-col w-full ">
                <h3 className="text-2xl text-center p-5 font-bold text-blue-500">
                  Modifier un poste
                </h3>
                <div className="flex gap-2 items-center justify-center group hover:scale-105 transition-all cursor-pointer">
                  <button>
                    <img
                      src={idIcon}
                      alt="ID"
                      className="w-10 h-10 p-2 opacity-50 transition-all group-hover:opacity-100"
                    />
                  </button>
                  <small className="text-blue-500 text-center">
                    ID: {selectedId}
                  </small>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-10 w-4/5 whitespace-nowrap ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="title">
                    Titre
                  </label>
                  <input
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    type="text"
                    name="editTitle"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="editEmployer">
                    Employeur
                  </label>
                  <input
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    type="text"
                    name="editEmployer"
                    value={editEmployer}
                    onChange={(e) => setEditEmployer(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="editLocation">
                    Emplacement
                  </label>
                  <input
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    type="text"
                    name="editLocation"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-10 w-4/5 whitespace-nowrap ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="editSalary">
                    Salaire
                  </label>
                  <input
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    type="text"
                    name="editSalary"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="editField">
                    Secteur
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="editField"
                    onChange={(e) => setEditField(e.target.value)}
                    value={editField}
                    required
                  >
                    {fields.map((field, index) => (
                      <option key={index} value={field.title}>
                        {field.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="editSchedule">
                    Horaire
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="editSchedule"
                    onChange={(e) => setEditSchedule(e.target.value)}
                    value={editSchedule}
                    required
                  >
                    <option value="Temps partiel">Temps partiel</option>
                    <option value="Permanent">Permanent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-10 w-4/5 whitespace-nowrap ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="editMode">
                    Mode
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="editMode"
                    onChange={(e) => setEditMode(e.target.value)}
                    value={editMode}
                    required
                  >
                    <option value="" defaultValue={""}></option>
                    <option value="Présentiel">Présentiel</option>
                    <option value="Télétravail">Télétravail</option>
                    <option value="Hybride">Hybride</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="editExperience">
                    Experience
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="editExperience"
                    onChange={(e) => setEditExperience(e.target.value)}
                    value={editExperience}
                  >
                    <option value="" defaultValue={""}></option>
                    <option value="0 à 1 ans">0 à 1 ans</option>
                    <option value="1 à 3 ans">1 à 3 ans</option>
                    <option value="3 à 5 ans">3 à 5 ans</option>
                    <option value="5 et plus">5 ans et +</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" htmlFor="editLanguage">
                    Langue(s)
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="editLanguage"
                    onChange={(e) => setEditLanguage(e.target.value)}
                    value={editLanguage}
                  >
                    <option value="" defaultValue={""}></option>
                    <option value="Francais">Francais</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Bilingue">Bilingue</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-1 w-4/5 flex-col gap-2 ">
                <label htmlFor="editDescription"> Description </label>
                <textarea
                  name="editDescription"
                  className="flex-1 border border-gray-200 shadow-inner overflow-y-scroll bg-[#fafafa]"
                  value={editDescription}
                  maxLength={1000}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-around gap-10 text-white">
                <button
                  type="submit"
                  className="p-3 px-5  bg-blue-500 rounded shadow-xl  hover:bg-blue-950 transition-all"
                >
                  Mettre à jour
                </button>
                <button
                  onClick={handleEditCancel}
                  className="p-3 px-5  bg-gray-500 rounded shadow-xl hover:bg-gray-800 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            ""
          )}
          {subMenu === "candidates" ? (
            <Applications
              db={db}
              jobs={jobs}
              setFilterStatus={setFilterStatus}
              candidatesJob={candidatesJob}
              setCandidatesJob={setCandidatesJob}
              fetchJobs={fetchJobs}
              setSubMenu={setSubMenu}
              fetchApplications={fetchApplications}
              setselectedId={setselectedId}
              selectedId={selectedId}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
