import axios from "axios";
import { X, User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { serverUrl } from "../App";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: Props) => {
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  if (!isOpen) return null;

  

  // for signU
  const handleSubmit = async () => {
    if (!isLogin) {
      try {
        const result = await axios.post(
          `${serverUrl}/api/auth/signup`,
          { name, email, password },
          { withCredentials: true },
        );
        dispatch(setUserData(result.data));
        onClose();
      } catch (error: any) {
        setError(error.response?.data?.message || "Error signing up");
      }
    } else {
      try {
        const result = await axios.post(
          `${serverUrl}/api/auth/signin`,
          { email, password },
          { withCredentials: true },
        );
        dispatch(setUserData(result.data));
        onClose();
      } catch (error: any) {
        setError(error.response?.data?.message || "Invalid credentials");
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("FINAL URL:", `${serverUrl}/api/auth/google`);
      const res = await axios.post(
        `${serverUrl}/api/auth/googleAuth`,
        {
          name: user.displayName,
          email: user.email
        },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data));
      onClose();
    } catch (err: any) {
      console.error(err);
      setError("Failed to authenticate with Google.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0b1120] w-[500px] p-8 rounded-2xl border border-white/10 relative shadow-xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center">
          {isLogin ? "Welcome Back" : "Join JobTracker"}
        </h2>

        <p className="text-gray-400 text-center mt-2 mb-6">
          {isLogin
            ? "Login to track your applications"
            : "Create your account to start tracking jobs"}
        </p>

        {/* Signup Fields */}
        {!isLogin && (
          <div className=" mb-4">
            <div className="flex items-center bg-[#020617] border border-white/10 rounded-lg px-3">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-transparent outline-none"
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="flex items-center bg-[#020617] border border-white/10 rounded-lg px-3 mb-4">
          <Mail size={18} className="text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-transparent outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <div className="flex items-center bg-[#020617] border border-white/10 rounded-lg px-3 mb-3">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent outline-none"
            />
          </div>

          {!isLogin && (
            <div className="flex items-center bg-[#020617] border border-white/10 rounded-lg px-3">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-transparent outline-none"
              />
            </div>
          )}
        </div>

        {/* ❌ Error Message */}
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        {/* Terms */}
        {!isLogin && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <input type="checkbox" />
            <span>
              I agree to the <span className="text-amber-400">Terms</span> and{" "}
              <span className="text-amber-400">Privacy Policy</span>
            </span>
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-amber-400 text-black py-3 rounded-lg font-semibold mb-4"
        >
          {isLogin ? "Sign In" : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-[1px] bg-white/10"></div>
          <span className="text-gray-400 text-sm">or continue with</span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        {/* Google */}
        <button 
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 border border-white/20 py-3 rounded-lg hover:bg-white/10 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Toggle */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(""); // reset error
            }}
            className="text-amber-400 ml-2"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
