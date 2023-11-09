import React from "react";
import { Link } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "mapbox-gl/dist/mapbox-gl.css";
import jobsEnd from "../../media/jobsEnd.jpg";
import Map from "react-map-gl";
import locationIcon from "../../media/locationIcon.png";
import fieldIcon from "../../media/fieldIcon.png";
import scheduleIcon from "../../media/scheduleIcon.png";
import salaryIcon from "../../media/salaryIcon.png";
import employerEnd from "../../media/employerEnd.jpg";

const EmployertHub = ({ fields }) => {
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
              <h3 className="text-start"> Nos services </h3>
              <div className="flex  justify-around gap-20 text-black">
                <div className="bg-blue-950 text-white shadow-xl  border border-gray-200 scale-95 hover:scale-100  transition-all rounded-lg p-5  ">
                  <h5 className="font-bold ">Recherche de candidat</h5>
                  <p className="text-justify p-5">
                    Nous nous efforçons d&#39;établir des partenariats solides
                    avec nos clients, en nous assurant de bien comprendre leurs
                    besoins en matière de personnel.
                  </p>
                </div>

                <div className="bg-blue-500 text-white shadow-xl  border border-gray-200 scale-95 hover:scale-100 transition-all rounded-lg p-5  ">
                  <h5 className="font-bold "> Référencement </h5>
                  <p className="text-justify p-5">
                    Nous nous efforçons d&#39;établir des partenariats solides
                    avec nos clients, en nous assurant de bien comprendre leurs
                    besoins en matière de personnel.
                  </p>
                </div>
                <div className="bg-blue-950 text-white shadow-xl  border border-gray-200 scale-95 hover:scale-100 transition-all rounded-lg p-5  ">
                  <h5 className="font-bold ">Recherche de candidat</h5>
                  <p className="text-justify p-5">
                    Nous nous efforçons d&#39;établir des partenariats solides
                    avec nos clients, en nous assurant de bien comprendre leurs
                    besoins en matière de personnel.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center flex flex-col gap-10  w-full    ">
              <h3 className="text-start"> Nos avantages </h3>
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
          <h2 className="text-start text-3xl px-10">
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

      {/* Bottom page */}
      <div className="w-full h-full bg-reviews-img bg-cover bg-center  ">
        <div className=" bg-opacity-50  bg-gradient-to-t from-blue-950 via-transparent to-[#fafafa] text-center pb-20">
          <div className=" max-w-[1920px] mx-auto grid grid-cols-2 px-40  gap-60">
            {/* Map */}
            <div className=" h-full rounded-lg flex flex-col gap-10">
              <div className="flex flex-col gap-10 ">
                <h3 className="text-blue-500 font-bold ">
                  Faites nous confiance.
                </h3>
                <div className="flex flex-col bg-blue-500 rounded-lg gap-5  p-8  px-10 shadow-xl text-white">
                  <h4>
                    Nous nous efforçons d&#39;établir des partenariats solides
                    avec nos clients, en nous assurant de bien comprendre leurs
                    besoins en matière de personnel.
                  </h4>
                </div>
              </div>
              <div className="relative h-[600px] text-transparent  bg-white p-1 rounded-xl transition-all shadow-lg shadow-blue-950">
                <div className="absolute  text-blue-950  right-1/3 bottom-0 p-2 z-10  rounded-lg">
                  <small className="font-bold">
                    Zone couverte: Grand Montréal.
                  </small>
                </div>

                <Map
                  mapboxAccessToken="pk.eyJ1IjoiYXNhbTgyIiwiYSI6ImNsbnRhand5eDAxeHcycW83MGV2dDNycm4ifQ.26PgD9spxcsC0W1LxxNFOQ"
                  initialViewState={{
                    longitude: -73.567256,
                    latitude: 45.5016889,
                    zoom: 9,
                  }}
                  mapStyle="mapbox://styles/asam82/clntasx8200e501p7elezdobu"
                  boxZoom={false}
                  scrollZoom={false}
                  dragRotate={false}
                  dragPan={false}
                  doubleClickZoom={false}
                />
              </div>
            </div>

            {/*  Contact */}
            <div className=" h-full rounded-lg flex flex-col gap-10">
              <div className="flex flex-col gap-10 ">
                <h3 className="text-blue-950 font-bold ">
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
                        className="rounded w-full p-2 text-black bg-[#f2f2f2] border border-gray-200 shadow-inner "
                        type="text"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/2 gap-2">
                      <label className="text-start"> Courriel </label>
                      <input
                        className="rounded w-full p-2 text-black bg-[#f2f2f2] border border-gray-200 shadow-inner "
                        type="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center h-full w-full gap-4 ">
                    <label className="self-start"> Message </label>
                    <textarea
                      className="rounded w-full h-32 text-black  bg-[#f2f2f2] border border-gray-200 shadow-inner "
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
          </div>
        </div>
      </div>
    </main>
  );
};
export default EmployertHub;
