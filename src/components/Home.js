import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import entrepriseImg from "../media/entreprise.png";
import employeeImg from "../media/employee.png";
import contactBg from "../media/contactBg.jpg";
import reviewsBg from "../media/reviewsBg.jpg";
import locationIcon from "../media/locationIcon.png";
import fieldIcon from "../media/fieldIcon.png";
import scheduleIcon from "../media/scheduleIcon.png";
import salaryIcon from "../media/salaryIcon.png";
import logo from "../media/logo.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-uuid";

const Accueil = ({
  db,
  jobs,
  fields,
  userData,
  setSelectedField,
  setScrollToJobs,
  setPopUpMessage,
}) => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [field, setField] = useState("all");
  const [cvFile, setCvFile] = useState("");
  const [cvFileName, setCvFileName] = useState("");

  const openJobs = jobs.filter((job) => job.status === "open");
  const [filteredField, setfilteredField] = useState("");
  const [fileteredJobs, setFileteredJobs] = useState(openJobs);

  const [contactFullName, setContactFullName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    filteredField === ""
      ? setFileteredJobs(openJobs)
      : setFileteredJobs(openJobs.filter((job) => job.field === filteredField));
  }, [filteredField, jobs]);

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

  const handleNewMessage = async (e) => {
    e.preventDefault();
    try {
      await setDoc(
        doc(
          db,
          `${contactEmail} - messages envoyés`,
          `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De ${contactEmail} à Plan B Placement: ${contactTitle}`
        ),
        {
          id: `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De ${contactEmail} à Plan B Placement: ${contactTitle}`,
          to: "Plan B",
          title: contactTitle,
          content: contactMessage,
          from: contactEmail,
          createdAt: new Date().toDateString(),
        }
      );
      await setDoc(
        doc(
          db,
          `Plan B - messages reçues`,
          `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De ${contactEmail} à Plan B: ${contactTitle} `
        ),
        {
          id: `${new Date().toDateString()}-${uuid().substring(
            0,
            3
          )}- De ${contactEmail} à Plan B: ${contactTitle} `,
          to: "Plan B",
          title: contactTitle,
          content: contactMessage,
          from: contactEmail,
          createdAt: new Date().toDateString(),
        }
      );
      setContactTitle("");
      setContactMessage("");
      setPopUpMessage("Message envoyé.");
    } catch (e) {
      setPopUpMessage("Message non envoyé. Erreur produite. " + e.message);
    }
  };

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setContactFullName(userData.firstName + " " + userData.lastName);
      setEmail(userData.email);
      setContactEmail(userData.email);
    }
  }, [userData]);

  return (
    <main className="flex flex-col gap-5 h-full ">
      {/*  Lead Image */}
      <div className=" inset-0 w-full h-full bg-lead-img bg-cover bg-center flex flex-col">
        <div className=" flex py-40 justify-start items-center bg-gradient-to-b from-transparent to-[#fafafa] ">
          <div className="flex max-w-[1920px] w-full px-20 gap-20 mx-auto">
            <div className=" col-span-2 flex-1 h-full flex flex-col justify-start gap-8  ">
              <div className=" p-10 flex flex-col gap-5 t bg-blue-500 rounded-lg shadow-xl text-center text-white">
                <h2 className=" ">
                  À la recherche d'un emploi ou d'un candidat?
                </h2>
                <h1 className="   ">Trouvez votre plan B.</h1>
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
            <div className="backdrop-blur-sm bg-blue-950 rounded-full  shadow-xl ">
              <img className="" src={logo} alt="Icon Entreprise" />
            </div>
          </div>
        </div>
      </div>

      {/*  Company presentation */}

      <div className="flex flex-col gap-40  ">
        {/* Services */}
        <div className="px-20 max-w-[1920px] mx-auto">
          <h2 className="text-center py-10 font-bold">Un service pour tous</h2>
          <div className="grid grid-cols-2 gap-20 pt-10 justify-center items-center">
            <div className=" group bg-blue-500 text-white shadow-xl   flex flex-col h-full gap-10  text-center transition-all duration-1000 rounded-lg p-10">
              <h2 className="  font-bold">Vous recherchez un emploi?</h2>

              <div className="flex flex-col justify-between gap-5">
                <p>
                  Nous comprenons que la recherche d'emploi peut être parfois
                  longue et complexe. Notre équipe en placement est dédiée à
                  vous accompagner à chaque étape de votre parcours
                  professionnel. Nous travaillons avec un large réseau
                  d'entreprises dans divers secteurs d'activité, ce qui nous
                  permet de vous proposer des postes qui correspondent à votre
                  profil.
                </p>
                <div className="flex justify-center gap-5 items-center pt-5  whitespace-nowrap">
                  <div className=" flex justify-center items-center gap-1 font-bold text-base">
                    <span className="text-blue-950">✓</span>
                    <span className="text-start ">
                      Orientation professionnelle
                    </span>
                  </div>
                  <div className=" flex justify-center items-center gap-1 font-bold text-base">
                    <span className="text-blue-950">✓</span>
                    <span className="text-start ">
                      Rédaction et optimisation de CV
                    </span>
                  </div>
                </div>
                <div className=" flex justify-center items-center gap-1 font-bold text-base">
                  <span className="text-blue-950">✓</span>
                  <span className="text-start ">
                    Accès aux offres d'emplois et placement
                  </span>
                </div>
              </div>
              <a
                href="/emplois"
                className="inline-flex justify-center items-center shadow-xl m-auto w-1/2 px-5 py-3 mb-3 text-base font-semibold no-underline align-middle rounded cursor-pointer select-none bg-[#ffffff] hover:bg-blue-950 text-blue-500  hover:text-white hover:shadow-inner transition-all"
              >
                <span> Emplois →</span>
              </a>
            </div>

            <div className=" group bg-blue-950 text-white  shadow-xl  flex flex-col h-full gap-10  text-center transition-all duration-1000 rounded-lg p-10">
              <h2 className="  font-bold">Vous recherchez un candidat?</h2>

              <div className="flex flex-col h-full justify-between gap-5">
                <p>
                  Avec Plan B, accédez à un vivier de talents triés par notre
                  équipe et prêts à vous rejoindre. Nous comprenons les enjeux
                  de trouver la perle rare qui s'alignera avec les valeurs et
                  les besoins de votre entreprise. Découvrez nos services de
                  placement et enrichissez votre équipe avec des professionnels
                  qualifiés.
                </p>
                <div className="flex justify-center gap-5 items-center pt-10  whitespace-nowrap">
                  <div className=" flex justify-center items-center gap-1 font-bold text-base">
                    <span className="text-blue-500">✓</span>
                    <span> Recherche de candidat</span>
                  </div>
                  <div className=" flex justify-center items-center gap-1 font-bold text-base">
                    <span className="text-blue-500">✓</span>
                    <span> Formation</span>
                  </div>
                  <div className=" flex justify-center items-center gap-1 font-bold text-base">
                    <span className="text-blue-500">✓</span>
                    <span> Suivi post-embauche</span>
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
          <h2 className="text-center py-10 font-bold"> Poste récents</h2>
          <div className="w-full">
            <div>
              <div className="flex my-5 py-6 mt-10 justify-around items-center whitespace-nowrap bg-blue-500 rounded-lg shadow-inner  ">
                <button
                  onClick={() => {
                    setfilteredField("");
                  }}
                  className={`hover:scale-105 text-base  transition-all  w-fit shadow-xl text-center rounded-lg p-2 ${
                    filteredField === ""
                      ? "bg-[#ffffff] scale-105"
                      : "bg-blue-900 text-white"
                  }`}
                >
                  <span className="text-base">Tous les secteurs</span>
                </button>
                {fields.map((field, index) => (
                  <button
                    onClick={() => {
                      setfilteredField(field.title);
                    }}
                    key={index}
                    className={`hover:scale-105 text-base  transition-all  w-fit shadow-xl text-center rounded-lg p-2 ${
                      field.title === filteredField
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
              {fileteredJobs.slice(0, 5).map((job, index) => (
                <Link
                  to={`/emplois?jobId=${job.id}`}
                  key={index}
                  className="relative bg-[#ffffff] group overflow-hidden p-5 grid grid-rows-7 justify-center items-center w-full h-full shadow-xl group  rounded-lg scale-95 hover:scale-100 cursor-pointer transition-all "
                >
                  <h3 className=" p-2 group-hover:font-bold text-blue-500 font-bold group-hover:text-blue-950 transition-all">{`${job.title.slice(
                    0,
                    50
                  )}${job.title.length > 50 ? "..." : ""}`}</h3>

                  <div className="flex w-full  justify-between py-2 group-hover:text-black">
                    <p className=" flex items-center">
                      <img
                        src={scheduleIcon}
                        alt="Horaire"
                        className="w-7 h-7 opacity-80 group-hover:opacity-100 transition-all"
                      />
                      {job.schedule}
                    </p>
                    <p className=" flex items-center">
                      <img
                        src={locationIcon}
                        alt="Location"
                        className="w-7 h-7 opacity-80 group-hover:opacity-100 transition-all"
                      />
                      {job.mode === "Télétravail" ? job.mode : job.location}
                    </p>
                    <p className="flex items-center">
                      <img
                        src={salaryIcon}
                        alt="Salaire"
                        className="w-7 h-7 opacity-80 group-hover:opacity-100 transition-ll"
                      />
                      {job.salary === "" ? "À déterminer" : job.salary}
                    </p>
                  </div>

                  <div className="overflow-y-scroll row-span-2 px-2 group-hover:text-black">
                    <p> {job.description.slice(0, 300)}...</p>
                  </div>
                  <div className="w-full flex justify-center">
                    <div
                      className=" w-fit p-3 text-lg bg-blue-500 text-white
                      rounded-lg shadow-lg group-hover:bg-blue-950
                      group-hover:font-bold transition-all"
                    >
                      Voir le poste
                    </div>
                  </div>
                </Link>
              ))}

              <Link
                to={`/emplois`}
                onClick={() => setScrollToJobs(true)}
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
              </Link>
            </ul>
          </div>
        </div>

        {/*  Secteur */}
        <div className="flex flex-col px-20 max-w-[1920px] mx-auto ">
          <h2 className="text-center py-10 font-bold"> Secteurs</h2>
          <div className="grid grid-cols-4  gap-2 py-10 justify-center items-center">
            {fields.map((field, index) => (
              <Link
                onClick={() => {
                  setSelectedField(field.title);
                }}
                to="/emplois"
                key={index}
                className="relative text-lg flex flex-col shadow-xl text-center rounded-lg scale-90 hover:scale-100 group transition-all cursor-pointer "
              >
                <img
                  className="opacity-100 rounded-lg  "
                  src={field.picture}
                  alt={field.title}
                />

                <p className="absolute bottom-0 w-full text-white rounded-b-lg bg-blue-500 group-hover:bg-blue-950 bg-opacity-90 py-3 group-hover:bg-opacity-100 transition-all">
                  {field.title}
                </p>
              </Link>
            ))}
            <div className="relative text-lg flex flex-col justify-center items-center shadow-xl bg-blue-950 bg-opacity-90 h-full text-center rounded-lg scale-90 hover:scale-100 group transition-all ">
              <p className=" w-full text-white rounded-b-lg  bg-opacity-90 py-3 group-hover:bg-opacity-100 transition-all">
                Et davantage à venir.
              </p>
            </div>
          </div>
        </div>

        <div className=" max-w-[1920px] mx-auto grid grid-rows-2 w-1/2 gap-40">
          {/* Stats and reviews */}
          <div className="flex flex-col gap-10 ">
            <h3 className="text-blue-950 font-bold text-center  ">
              Plan B en quelques chiffres
            </h3>

            <div className="flex flex-col justify-center bg-blue-950 rounded-lg gap-5 p-10 flex-1  whitespace-nowrap px-10 shadow-xl text-white">
              <div className=" flex items-end gap-2">
                <h1 className=" font-bold ">23</h1>
                <h3 className=""> offres d'emploi,</h3>
              </div>
              <div className=" flex justify-center items-end gap-2 ">
                <h1 className=" font-bold  ">126</h1>
                <h3 className=""> candidatures, </h3>
              </div>

              <div className=" flex justify-end items-end gap-2">
                <h1 className=" font-bold  ">12</h1>
                <h3 className="">partenaires d'affaire.</h3>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 ">
            <h3 className="text-blue-500 font-bold text-center">
              L'avis de nos clients
            </h3>

            <Carousel
              autoPlay
              infiniteLoop
              emulateTouch
              interval={4000}
              showStatus={false}
              showArrows={false}
              showThumbs={false}
              className="flex-1"
            >
              <blockquote className="text-white  flex flex-col items-center justify-center p-1 cursor-grab">
                <q className=" pt-4 px-8 pb-8 font-bold">
                  En tant qu'employeur, je suis plus que satisfait par la
                  qualité des candidats que Plan B nous présente. Ils ont un
                  véritable truc pour dénicher les talents qui s'intègrent
                  parfaitement à notre culture d'entreprise.
                </q>
                <div className="flex flex-col gap-1 items-center">
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
                  <footer className=" pb-5">— Sophia D.</footer>
                </div>
              </blockquote>

              <blockquote className="text-white  flex flex-col items-center justify-center p-1 cursor-grab">
                <q className=" pt-4 px-8 pb-8 font-bold">
                  Plan B a transformé le processus de recrutement pour notre
                  entreprise grâce à leur capacité à comprendre nos besoins et à
                  y répondre dans les délais. Ils sont devenus notre partenaire
                  de confiance pour le recrutement.
                </q>
                <div className="flex flex-col gap-1 items-center">
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
                  <footer className=" pb-5">— Jeanne A.</footer>
                </div>
              </blockquote>

              <blockquote className="text-white  flex flex-col items-center justify-center p-1 cursor-grab">
                <q className=" pt-4 px-8 pb-8 font-bold">
                  L'approche personnalisée de Plan B a été un vrai game-changer
                  pour ma recherche d'emploi. L'équipe m'a écouté et a su
                  trouver le poste qui correspondait vraiment à ce que je
                  recherchais. Un grand merci !
                </q>
                <div className="flex flex-col gap-1 items-center">
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
                  <footer className=" pb-5">— Maxime L.</footer>
                </div>
              </blockquote>
            </Carousel>
          </div>
        </div>

        {/* Bottom page */}
        <div
          className="w-full h-full bg-cover "
          style={{ backgroundImage: `url(${contactBg})` }}
        >
          <div className="flex flex-col h-full w-full bg-gradient-to-b from-[#fafafa]  via-transparent to-blue-950 text-center gap-40 ">
            <h2 className=" font-bold pt-20 transition-all text-black">
              Travaillons ensemble dès maintenant.
            </h2>

            {/*  Candidature spontanée */}
            <div className=" max-w-[1920px] mx-auto grid grid-cols-2 justify-around w-full px-40  gap-40 pb-20">
              <form
                onSubmit={handleNewApplication}
                className="flex flex-col items-center transition-all justify-between rounded-lg  py-10 h-full  bg-white   hover:bg-opacity-100  shadow-xl group "
              >
                <h2 className=" font-bold  text-blue-500">
                  Candidature spontanée
                </h2>
                <p className="text-blue-500 p-10 text-justify [text-align-last:center]">
                  Rejoignez notre banque de talents et assurez-vous d'être vu
                  par les meilleurs employeurs. Nous vous mettons en relation
                  avec des entreprises qui valorisent vos compétences.
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
              {/* Contact */}
              <form
                onSubmit={handleNewMessage}
                className="flex flex-col items-center transition-all justify-between   rounded-lg  py-10 h-full  bg-white   hover:bg-opacity-100  shadow-xl group "
              >
                <h2 className=" font-bold text-blue-950 ">Contactez nous</h2>
                <p className="text-blue-950 p-10 text-justify [text-align-last:center]">
                  En quête de talents ou d'opportunités professionnelles ?
                  Contactez Plan B dès maintenant ! Nous connectons candidats et
                  entreprises pour des partenariats réussis.
                </p>
                <div className="grid grid-rows-4  items-center gap-7 px-10 w-full">
                  <div className="grid grid-cols-2 gap-10 justify-between row-span-1">
                    <div className="flex flex-col  gap-1">
                      <label className="text-start">Nom complet</label>
                      <input
                        className="shadow-inner rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200  "
                        type="text"
                        value={contactFullName}
                        onChange={(e) => setContactFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-start"> Courriel </label>
                      <input
                        className="shadow-inner rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200  "
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-1 items-start row-span-1">
                    <label className="text-start"> Sujet </label>
                    <input
                      className="shadow-inner rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200  "
                      type="text"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col items-center h-full w-full gap-1 row-span-2 ">
                    <label className="self-start"> Message </label>
                    <textarea
                      className="rounded w-full flex-1 text-black  bg-[#fafafa] border border-gray-200  "
                      type="text"
                      size={400}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
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
          </div>
        </div>
      </div>
    </main>
  );
};
export default Accueil;
