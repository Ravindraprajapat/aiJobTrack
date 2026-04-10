import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { LogOut, User as UserIcon } from "lucide-react";
import type { RootState } from "../redux/store";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/signout`, {}, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-[#020617]/70 border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
          {/* Logo */}
          <Link to={userData ? "/dashboard" : "/"}>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors cursor-pointer">
              Job<span className="text-amber-500 dark:text-amber-400">Tracker</span>
            </h1>
          </Link>

          {/* Buttons or User Profile */}
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <div className="bg-amber-100 dark:bg-slate-800 p-2 rounded-full text-amber-600 dark:text-amber-400">
                    <UserIcon size={18} />
                  </div>
                  <span className="hidden sm:inline">Hi, {userData.name}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-rose-400 font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-300"
                >
                  <LogOut size={16} /> 
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setOpen(true)}
                  className="px-5 py-2 rounded-xl font-medium text-slate-600 dark:text-white border border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="px-5 py-2 rounded-xl font-medium bg-amber-400 text-black shadow-sm hover:bg-amber-500 transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Nav;
