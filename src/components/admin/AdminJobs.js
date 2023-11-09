import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import uuid from "react-uuid";
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
  setDoc,
} from "firebase/firestore";
import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";
import copyIcon from "../../media/copyIcon.png";

const AdminJobs = ({ fields }) => {
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

  const [isEditing, setIsEditing] = useState(false);
  const [activeMenu, setActiveMenu] = useState("jobs");

  const [editId, setEditId] = useState("");
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

  const [jobPostings, setJobPostings] = useState([]);
  const [membersList, setMembersList] = useState([]);

  // Job list fetch
  const fetchJobs = async () => {
    await getDocs(collection(db, "postes")).then((querySnapshot) => {
      const updatedJobList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setJobPostings(updatedJobList);
    });
  };

  const fetchMembers = async () => {
    await getDocs(collection(db, "membres")).then((querySnapshot) => {
      const updatedMembersList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMembersList(updatedMembersList);
    });
  };

  useEffect(() => {
    fetchJobs();
    fetchMembers();
  }, []);

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
          createdAt: new Date(),
        }
      );
      fetchJobs();
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
      fetchJobs();
    } catch (id) {
      alert("Erreur, poste d'emploi non supprimé. Id: " + id);
    }
  };

  const handleEdit = (job) => {
    setIsEditing(true);
    setEditId(job.id);
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
  };

  const handleJobPostEdit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "postes", editId), {
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
      setIsEditing(false);
      fetchJobs();
      setEditId("");
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
    setIsEditing(false);
    setEditId("");
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

  return (
    <div className="">
      {/* Jobs filter */}
      <div className="grid grid-cols-4 justify-around gap-10 bg-blue-500 rounded-lg p-5 shadow-inner">
        <input
          placeholder="Titre de poste, mots clés"
          className="flex gap-5 text-center justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100"
        ></input>
        <select className="flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100">
          <option defaultValue={"All"}>Tous les secteurs d'emploi </option>
          {fields.map((field, index) => (
            <option key={index} value={field.title}>
              {field.title}
            </option>
          ))}
        </select>
        <select className="flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100">
          <option defaultValue={"All"}> Tous types de poste </option>
          {fields.map((field, index) => (
            <option key={index} value={field.title}>
              {field.title}
            </option>
          ))}
        </select>
        <select className="flex gap-5  justify-around items-center whitespace-nowrap shadow-xl rounded-md py-2 border border-gray-100">
          <option defaultValue={"All"}> Tout emplacement </option>
          {fields.map((field, index) => (
            <option key={index} value={field.title}>
              {field.title}
            </option>
          ))}
        </select>
      </div>
      {/* Jobs List */}
      <div className="w-full h-full grid grid-cols-3 py-5 gap-10 items-start">
        <div className=" h-full flex flex-col gap-20 col-span-1">
          <div className="  h-full gap-10 bg-black bg-opacity-10 shadow-inner rounded-lg  p-2 ">
            <ul className="flex flex-col h-full  overflow-y-scroll p-10 gap-5 ">
              {jobPostings?.map((job) => (
                <li
                  key={job.id}
                  className={`rounded-lg group h-full bg-[#fafafa] shadow-xl transition-all  ${
                    editId === job.id ? "scale-100  " : "scale-95"
                  } hover:scale-100 transition-all`}
                >
                  <div
                    className={`p-3 flex items-center justify-between w-full text-white whitespace-nowrap
                        ] bg-blue-500 rounded-t-lg transition-all ${
                          editId === job.id ? "bg-blue-950  " : ""
                        }`}
                  >
                    <small className="w-3/4 ">{job.field}</small>
                    <small className=" top-2 right-2 text-end ">{job.id}</small>
                  </div>
                  <div className="flex flex-1 flex-col gap-5 p-5 justify-between">
                    <h4
                      className={` text-blue-500 font-bold transition-all  ${
                        editId === job.id ? "text-blue-950  " : ""
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
                      onClick={() => handleEdit(job)}
                      className="p-2 px-5 hover:font-bold  bg-blue-950 rounded shadow-xl  hover:scale-105 transition-all"
                    >
                      Candidatures
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 px-5 hover:font-bold bg-blue-500 rounded shadow-xl  hover:scale-105 transition-all"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 px-5 hover:font-bold bg-gray-500 rounded shadow-xl  hover:scale-105 transition-all"
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
          {!isEditing ? (
            <form
              className="flex flex-col items-center flex-1 justify-center rounded-lg py-10 gap-10 bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] group "
              onSubmit={handleNewJobSubmit}
            >
              <h3 className="text-2xl text-center p-5 font-bold text-blue-950">
                Ajouter un poste
              </h3>
              <div className="grid grid-cols-3 gap-10 w-4/5 whitespace-nowrap ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" for="title">
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
                  <label className="col-span-1" for="employer">
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
                  <label className="col-span-1" for="location">
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
                  <label className="col-span-1" for="salary">
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
                  <label className="col-span-1" for="field">
                    Secteur
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="field"
                    onChange={(e) => setField(e.target.value)}
                    value={field}
                    required
                  >
                    <option value="" selected></option>
                    {fields.map((field, index) => (
                      <option key={index} value={field.title}>
                        {field.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" for="schedule">
                    Horaire
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="schedule"
                    onChange={(e) => setSchedule(e.target.value)}
                    value={schedule}
                    required
                  >
                    <option value="" selected></option>
                    <option value="Temps partiel">Temps partiel</option>
                    <option value="Temps plein">Temps plein</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contractuel">Contractuel</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3  gap-10 w-4/5 ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" for="mode">
                    Mode
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="mode"
                    onChange={(e) => setMode(e.target.value)}
                    value={mode}
                    required
                  >
                    <option value="" selected></option>
                    <option value="Présentiel">Présentiel</option>
                    <option value="Télétravail">Télétravail</option>
                    <option value="Permanent">Hybride</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" for="experience">
                    Experience
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="experience"
                    onChange={(e) => setExperience(e.target.value)}
                    value={experience}
                  >
                    <option value="" selected></option>
                    <option value="0 à 1 ans">0 à 1 ans</option>
                    <option value="1 à 3 ans">1 à 3 ans</option>
                    <option value="3 à 5 ans">3 à 5 ans</option>
                    <option value="5 et plus">5 ans et +</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" for="language">
                    Langue(s)
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="language"
                    onChange={(e) => setLanguage(e.target.value)}
                    value={language}
                  >
                    <option value="" selected></option>
                    <option value="Francais">Francais</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Bilingue">Bilingue</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-1 w-4/5 flex-col gap-2">
                <label for="description"> Description </label>
                <textarea
                  name="description"
                  className="flex-1 border border-gray-200 shadow-inner overflow-y-scroll bg-[#fafafa]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="p-3 px-5 hover:font-bold bg-blue-950 rounded shadow-xl text-white hover:bg-blue-500 transition-all"
              >
                Ajouter ce poste
              </button>
            </form>
          ) : (
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
                      src={copyIcon}
                      alt="Copy"
                      className="w-10 h-10 p-2 opacity-50 transition-all group-hover:opacity-100"
                    />
                  </button>
                  <small className="text-blue-500 text-center">
                    ID: {editId}
                  </small>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-10 w-4/5 whitespace-nowrap ">
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" for="title">
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
                  <label className="col-span-1" for="editEmployer">
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
                  <label className="col-span-1" for="editLocation">
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
                  <label className="col-span-1" for="editSalary">
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
                  <label className="col-span-1" for="editField">
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
                  <label className="col-span-1" for="editSchedule">
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
                  <label className="col-span-1" for="editMode">
                    Mode
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="editMode"
                    onChange={(e) => setEditMode(e.target.value)}
                    value={editMode}
                    required
                  >
                    <option value="" selected></option>
                    <option value="Présentiel">Présentiel</option>
                    <option value="Télétravail">Télétravail</option>
                    <option value="Hybride">Hybride</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" for="editExperience">
                    Experience
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="editExperience"
                    onChange={(e) => setEditExperience(e.target.value)}
                    value={editExperience}
                  >
                    <option value="" selected></option>
                    <option value="0 à 1 ans">0 à 1 ans</option>
                    <option value="1 à 3 ans">1 à 3 ans</option>
                    <option value="3 à 5 ans">3 à 5 ans</option>
                    <option value="5 et plus">5 ans et +</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 ">
                  <label className="col-span-1" for="editLanguage">
                    Langue(s)
                  </label>
                  <select
                    className="shadow-inner bg-[#fafafa] border border-gray-200 col-span-3"
                    name="editLanguage"
                    onChange={(e) => setEditLanguage(e.target.value)}
                    value={editLanguage}
                  >
                    <option value="" selected></option>
                    <option value="Francais">Francais</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Bilingue">Bilingue</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-1 w-4/5 flex-col gap-2 ">
                <label for="editDescription"> Description </label>
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
                  className="p-3 px-5 hover:font-bold bg-blue-500 rounded shadow-xl  hover:bg-blue-950 transition-all"
                >
                  Mettre à jour
                </button>
                <button
                  onClick={handleEditCancel}
                  className="p-3 px-5 hover:font-bold bg-gray-500 rounded shadow-xl hover:bg-gray-800 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
