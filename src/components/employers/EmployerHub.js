import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "mapbox-gl/dist/mapbox-gl.css";
import jobsEnd from "../../media/jobsEnd.jpg";
import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";
import employerEnd from "../../media/employerEnd.jpg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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

const EmployertHub = ({ db, userData, setPopUpMessage }) => {
  const [contactFullName, setContactFullName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactMessage, setContactMessage] = useState("");

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

  const advantages = [
    "Accès à un vaste réseau de candidats dans une variété d'industries.",
    "Réduction de votre temps consacré au processus de recrutement.",
    "Garantie de la qualité des candidats grâce à notre processus de sélection rigoureux.",
    "Adaptation personnalisée aux besoins spécifiques de votre entreprise et du poste.",
    "Soutien continu tout au long du processus.",
    "Réduction de vos coûts de recrutement.",
    "Accès à des conseils d'experts sur les tendances et les meilleures pratiques du marché du travail.",
    "Flexibilité dans les options de recrutement ; permanents, temporaires, contractuels et occasionnel.",
  ];

  useEffect(() => {
    if (userData) {
      setContactFullName(userData.firstName + " " + userData.lastName);

      setContactEmail(userData.email);
    }
  }, [userData]);

  return (
    <main className="flex flex-col  h-full ">
      {/*  Lead Image */}
      <div className=" inset-0 w-full h-full bg-employer-img  bg-cover  flex flex-col ">
        <div className=" flex  flex-col justify-start gap-40 py-40 items-center bg-gradient-to-b from-transparent  to-[#fafafa]">
          <div className=" w-full max-w-[1920px] mx-auto  flex flex-col justify-center items-start gap-5 px-20">
            <div className="p-10 rounded-lg shadow w-2/3 gap-5 flex flex-col text-white  bg-blue-500  ">
              <h3 className="  ">
                À la recherche d'un ou plusieurs candidats?
              </h3>
              <h1 className=" whitespace-nowrap text-center ">
                Plan B – votre partenaire de recrutement.
              </h1>
            </div>
            <div className=" text-center flex flex-col gap-10 justify-center bg-blue-950  shadow-lg items-center w-2/3  rounded-lg p-10  ">
              <h4 className=" text-white text-center">
                Chez Plan B, nous comprenons l&#39;importance de constituer une
                équipe solide pour faire avancer votre entreprise. Notre agence
                de placement de personnel se consacre à identifier et à engager
                les talents qui correspondent à vos besoins spécifiques.
              </h4>

              <div className="flex flex-col w-full h-full justify-center items-between w-fullbackdrop-blur-s rounded-lg">
                <div className="flex justify-between w-full h-full gap-10">
                  <div className=" flex flex-col w-fit whitespace-nowrap h-fit ">
                    <p className="p-4  text-center rounded shadow-xl bg-white bg-clip-padding backdrop-filter backdrop-blur-sm ">
                      ✔ Placement permanent et temporaire
                    </p>
                  </div>
                  <div className=" flex flex-col w-fit whitespace-nowrap   h-fit ">
                    <p className="p-4  text-center rounded shadow-xl bg-white bg-clip-padding backdrop-filter backdrop-blur-sm ">
                      ✔ Temps plein et partiel
                    </p>
                  </div>
                  <div className=" flex flex-col w-1/4  h-fit ">
                    <p className="p-4  text-center rounded shadow-xl bg-white bg-clip-padding backdrop-filter backdrop-blur-sm ">
                      ✔ Contractuel
                    </p>
                  </div>
                  <div className=" flex flex-col w-1/4  h-fit ">
                    <p className="p-4  text-center rounded shadow-xl bg-white bg-clip-padding backdrop-filter backdrop-blur-sm ">
                      ✔ Occasionnel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-20 text-2xl w-full flex flex-col justify-between gap-40 max-w-[1920px] mx-auto ">
        <div className=" px-10  flex flex-col gap-5  text-black">
          <div className="flex flex-col w-full  gap-40">
            <div className="text-center flex flex-col gap-10  w-full    ">
              <h2 className="text-center py-10 font-bold"> Nos services </h2>
              <div className="grid grid-cols-3  justify-around gap-20 text-black">
                <div className="bg-blue-950 text-white shadow-xl flex flex-col justify-around  scale-100 hover:scale-105  transition-all rounded-lg p-5  ">
                  <h5 className="font-bold ">Recherche de candidat</h5>
                  <p className="text-justify p-5">
                    Notre savoir-faire principal est l'acquisition de talents.
                    Ce service sur mesure inclus une recherche minutieuse qui
                    cible les profils les plus adaptés à vos besoins.
                  </p>
                </div>
                <div className="bg-blue-500 text-white shadow-xl flex flex-col justify-around  scale-100 hover:scale-105 transition-all rounded-lg p-5  ">
                  <h5 className="font-bold "> Formation </h5>
                  <p className="text-justify p-5">
                    Plan B créé et délivre des formations générales ou adaptées
                    à votre domaine d'expertise pour vos employés actuels ou
                    pour les nouvelles recrues.
                  </p>
                </div>

                <div className="bg-blue-950 text-white shadow-xl flex flex-col justify-around  scale-100 hover:scale-105 transition-all rounded-lg p-5  ">
                  <h5 className="font-bold "> Suivi post-embauche </h5>
                  <p className="text-justify p-5">
                    Notre engagement ne s'arrête pas à l'embauche. Avec notre
                    suivi post-embauche, nous accompagnons l'intégration de vos
                    nouvelles recrues pour assurer une transition fluide et une
                    performance optimale au sein de votre équipe.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center flex flex-col gap-10  w-full    ">
              <h2 className="text-center py-10 font-bold"> Nos avantages </h2>
              <ul className="grid grid-cols-2 grid-rows-4 bg-white shadow-xl border border-gray-200    rounded-lg p-10  transition-all ">
                {advantages.map((advantage, index) => {
                  return (
                    <li className={`text-start px-10    p-3 `}>
                      <h6>
                        <span className="text-blue-500"> ✓ </span> {advantage}
                      </h6>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        {/* Processus d'embauche */}
        <div className="max-w-[1920px] mx-auto pb-40">
          <h2 className="text-center py-10 font-bold">
            Processus de recrutement
          </h2>
          <div className="w-full p-10   flex flex-col justify-center items-center  rounded-lg">
            <div className=" flex flex-col gap-10   items-center  ">
              <blockquote className=" w-3/4 text-center py-10 font-bold text-blue-950 ">
                Notre processus de recrutement assure que chacun de nos
                candidats possède les compétences, l&#39;expérience et les
                valeurs nécessaires pour contribuer à la croissance et au succès
                de votre entreprise. Vous bénéficiez d&#39;un accès privilégié à
                un vaste réseau de candidats qualifiés dans des domaines variés.
              </blockquote>

              <div className="flex flex-col items-center px-20  py-10  bg-[#f2f2f2]   rounded-lg shadow-inner  transition-all  m-auto ">
                <div className="overflow-y-scroll mx-auto w-full px-20 py-10 ">
                  <VerticalTimeline
                    layout="1-column-left"
                    lineColor={"#172554"}
                  >
                    <VerticalTimelineElement
                      contentStyle={{ color: "black" }}
                      iconStyle={{
                        background: "#3F83F8",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                      }}
                      icon={1}
                      contentArrowStyle={{ visibility: "hidden" }}
                    >
                      <h2 className="pb-2 pt-5  px-10 font-bold">
                        Évaluation des besoins et culture de l&#39;entreprise
                      </h2>
                      <p className="px-10 pb-5 text-justify shadow-xl">
                        Nous commençons par comprendre vos besoins spécifiques
                        en matière de recrutement, ainsi que la culture et les
                        valeurs de votre entreprise. Cela nous permet de cibler
                        des candidats qui possèdent les compétences nécessaires
                        et qui conviennent à votre environnement de travail.
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      contentStyle={{ color: "black" }}
                      iconStyle={{
                        background: "#3F83F8",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                      }}
                      icon={2}
                      contentArrowStyle={{ visibility: "hidden" }}
                    >
                      <h2 className="pb-2 pt-5  px-10 font-bold">
                        Recherche et sélection de candidats
                      </h2>
                      <p className="px-10 pb-5 text-justify  ">
                        Nous effectuons une recherche et une sélection à travers
                        notre vaste réseau, en utilisant des méthodes de
                        recrutement ciblées. Chaque candidat est soigneusement
                        évalué sur la base de critères préétablis, garantissant
                        que seuls les talents correspondants à vos besoins, vous
                        sont proposés.
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      contentStyle={{ color: "black" }}
                      iconStyle={{
                        background: "#3F83F8",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                      }}
                      icon={3}
                      contentArrowStyle={{ visibility: "hidden" }}
                    >
                      <h2 className="pb-2 pt-5  px-10 font-bold">
                        Présélection et entretiens approfondis
                      </h2>
                      <p className="px-10 pb-5 text-justify shadow-xl">
                        Nous menons des entretiens avec les candidats
                        présélectionnés, évaluant leurs compétences techniques,
                        leur expérience professionnelle et leur compatibilité
                        avec votre entreprise. Nous prenons en compte vos
                        commentaires tout au long du processus pour affiner
                        notre sélection.
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      contentStyle={{ color: "black" }}
                      iconStyle={{
                        background: "#3F83F8",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                      }}
                      icon={4}
                      contentArrowStyle={{ visibility: "hidden" }}
                    >
                      <h2 className="pb-2 pt-5  px-10 font-bold">
                        Présentation des candidats et organisation des
                        entretiens
                      </h2>
                      <p className="px-10 pb-5 text-justify shadow-xl">
                        Nous vous présentons les candidats les plus adaptés,
                        accompagnés de leurs profils et évaluations. Nous vous
                        facilitons la coordination des entretiens entre vous et
                        les candidats, garantissant ainsi que le processus est
                        transparent et efficace.
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      contentStyle={{ color: "black" }}
                      iconStyle={{
                        background: "#3F83F8",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                      }}
                      icon={5}
                      contentArrowStyle={{ visibility: "hidden" }}
                    >
                      <h2 className="pb-2 pt-5  px-10 font-bold">
                        Surveillance continue et feedback
                      </h2>
                      <p className="px-10 pb-5 text-justify shadow-xl">
                        Nous surveillons de près le processus d&#39;entretien et
                        recueillons vos commentaires après chaque entretien.
                        Votre rétroaction est essentielle pour raffiner
                        davantage notre recherche et s’assurer que nous
                        répondons à vos besoins spécifiques.
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      contentStyle={{ color: "black" }}
                      iconStyle={{
                        background: "#3F83F8",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                      }}
                      icon={6}
                      contentArrowStyle={{ visibility: "hidden" }}
                    >
                      <h2 className="pb-2 pt-5  px-10 font-bold">
                        Embauche et intégration
                      </h2>
                      <p className="px-10 pb-5 text-justify shadow-xl">
                        Une fois la décision prise, nous facilitons le processus
                        d’embauche et d&#39;intégration pour assurer une
                        transition fluide pour le nouveau membre de votre
                        équipe. Nous restons disponibles pour vous soutenir à
                        chaque étape, assurant ainsi une intégration réussie et
                        une productivité rapide du nouvel employé.
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      contentStyle={{ color: "black" }}
                      iconStyle={{
                        background: "#3F83F8",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                      }}
                      icon={7}
                      contentArrowStyle={{ visibility: "hidden" }}
                    >
                      <h2 className="pb-2 pt-5  px-10 font-bold">
                        Suivi continu et satisfaction
                      </h2>
                      <p className="px-10 pb-5 text-justify shadow-xl">
                        Nous entretenons des relations continues avec les
                        employeurs et les candidats pour garantir leur
                        satisfaction à long terme. Notre objectif est de devenir
                        votre partenaire de confiance dans tous vos besoins en
                        matière de recrutement et de vous assurer une expérience
                        positive à chaque interaction.
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                      contentStyle={{ color: "black" }}
                      iconStyle={{
                        background: "#172554",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                      }}
                      contentArrowStyle={{ visibility: "hidden" }}
                    >
                      <h4 className="px-10 py-1 text-justify shadow-xl font-bold text-blue-950 ">
                        Trouvez votre plan B.
                      </h4>
                    </VerticalTimelineElement>
                  </VerticalTimeline>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10 mx-auto w-1/2 ">
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
              En tant qu'employeur, je suis plus que satisfait par la qualité
              des candidats que Plan B nous présente. Ils ont un véritable truc
              pour dénicher les talents qui s'intègrent parfaitement à notre
              culture d'entreprise.
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
              entreprise grâce à leur capacité à comprendre nos besoins et à y
              répondre dans les délais. Ils sont devenus notre partenaire de
              confiance pour le recrutement.
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
              L'approche personnalisée de Plan B a été un vrai game-changer pour
              ma recherche d'emploi. L'équipe m'a écouté et a su trouver le
              poste qui correspondait vraiment à ce que je recherchais. Un grand
              merci !
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
      {/* Bottom page */}
      <div className="w-full h-full bg-reviews-img bg-cover bg-center  ">
        <div className="flex  h-full w-full bg-gradient-to-b from-[#fafafa]  via-transparent to-blue-950 text-center py-40 ">
          <div className=" max-w-[1920px] mx-auto px-20 w-1/2 gap-40 flex flex-col ">
            {/*  Contact */}
            <div className=" h-full rounded-lg flex flex-col gap-10">
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
export default EmployertHub;
