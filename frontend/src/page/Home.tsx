import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { Briefcase, Brain, BarChart3 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* Navbar */}
      <Nav />

      {/* 🔹 Hero Section */}
      <div className="pt-24 px-10 grid md:grid-cols-2 gap-10 items-center">

        {/* Left */}
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            AI Powered <br />
            <span className="text-amber-400">Job Tracker</span>
          </h1>

          <p className="text-gray-400 mt-6 max-w-md">
            Track your job applications smartly using AI. Automatically extract job details,
            manage your progress, and improve your resume with intelligent suggestions.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={()=>navigate("/dashboard")}
            className=" cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
              Let’s Track
            </button>

            <button 
            onClick={()=>navigate("/dashboard")}
            className=" cursor-pointer border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Card UI */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/10 shadow-xl">
          <p className="text-gray-400 text-sm mb-4">AI Parsed Job</p>

          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Company:</span> Google</p>
            <p><span className="text-gray-500">Role:</span> Software Engineer</p>
            <p><span className="text-gray-500">Skills:</span> React, Node, MongoDB</p>
          </div>

          <div className="mt-5 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-xs">
              Resume Suggestions Generated ✔
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Features Section */}
      <div className="px-10 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Smart Features for Job Tracking
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-[#0f172a] p-8 rounded-2xl border border-white/10 hover:scale-105 transition">
            <Briefcase className="text-amber-400 mb-4" size={28} />
            <h3 className="text-xl font-bold mb-3">Application Tracking</h3>
            <p className="text-gray-400">
              Organize all your job applications with a clean Kanban board.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0f172a] p-8 rounded-2xl border border-white/10 hover:scale-105 transition">
            <Brain className="text-blue-400 mb-4" size={28} />
            <h3 className="text-xl font-bold mb-3">AI Job Parsing</h3>
            <p className="text-gray-400">
              Extract company, role, and required skills automatically from job descriptions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0f172a] p-8 rounded-2xl border border-white/10 hover:scale-105 transition">
            <BarChart3 className="text-green-400 mb-4" size={28} />
            <h3 className="text-xl font-bold mb-3">Resume Suggestions</h3>
            <p className="text-gray-400">
              Get AI-powered resume points tailored for each job you apply to.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;