import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import AdminPortal from "../admin/AdminPortal";

function Account({ userName, userEmail }) {
  const navigate = useNavigate();

  const signOutHandler = async () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="p-10">
      <div>
        <h2> Bienvenue {userName}, </h2>
        <div className="p-10">
          <button
            onClick={signOutHandler}
            className="bg-red-500 p-2 rounded-xl text-white"
          >
            Deconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
