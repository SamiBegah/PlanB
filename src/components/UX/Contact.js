import React from "react";
import Map from "react-map-gl";

const Contact = () => {
  return (
    <div className=" inset-0 w-full h-full bg-cover  bg-contact-img  flex flex-col ">
      <div className=" flex justify-center items-center bg-gradient-to-b py-40 from-transparent via-transparent to-blue-950">
        <div className=" max-w-[1920px] mx-auto grid grid-cols-2 px-40 gap-60 w-full">
          {/* Map */}
          <div className="h-full rounded-lg flex flex-col gap-10">
            <div className="flex flex-col gap-10 ">
              <div className="flex flex-col bg-blue-500 rounded-lg gap-5  p-8  px-10 shadow-xl text-white">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1 ">
                    <h5 className=" pb-2 font-bold underline">Coordonnées</h5>
                    <p> (514) XXX - XXXX </p>
                    <p>
                      <a href="mailto:contact@planbplacement.ca">
                        contact@planbplacement.ca
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <h5 className=" pb-2 font-bold underline">
                      Heures d'ouverture
                    </h5>
                    <p> Lundi au vendredi</p>
                    <p> De 8h à 20h</p>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <h5 className=" pb-2 font-bold underline">
                      Zone d'opération
                    </h5>
                    <p> Grand-Montréal </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[600px] text-transparent  bg-white p-1 rounded-xl transition-all shadow-lg shadow-blue-950">
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
              <div className="flex flex-col bg-blue-950 rounded-lg gap-2  p-8  px-10 shadow-xl text-white">
                <h4 className="font-bold">
                  Des questions pour votre emploi ou entreprise?
                </h4>
                <h5> Envoyez nous un message! </h5>
                <p> Nous répondons en moins de 48 heures. </p>
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
                      className="rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200 shadow-inner  "
                      type="text"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-1/2 gap-2">
                    <label className="text-start"> Courriel </label>
                    <input
                      className="rounded w-full p-2 text-black bg-[#fafafa] border border-gray-200 shadow-inner  "
                      type="email"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center h-full w-full gap-4 ">
                  <label className="self-start"> Message </label>
                  <textarea
                    className="rounded w-full h-32 text-black  bg-[#fafafa] border border-gray-200 shadow-inner  "
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
        </div>
      </div>
    </div>
  );
};

export default Contact;
