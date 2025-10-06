import React, { useState, useContext } from 'react'
import HERO_IMG from '../assets/hero-img.png'
import { APP_FEATURES } from "../utils/data"
import { useNavigate } from 'react-router-dom'
import { LuSparkles } from 'react-icons/lu'
import Login from './Auth/Login'
import SignUp from './Auth/SignUp'
import Modal from '../components/Modal'
import { UserContext } from '../context/userContext'
import ProfileInfoCard from '../components/cards/ProfileInfoCard'

const Landingpage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <>
      {/* Hero Section */}
      <div className="w-full min-h-full bg-[#FFFCEF] pb-24 relative overflow-hidden">
        <div className="w-[400px] h-[400px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />

        <div className="container mx-auto px-4 pt-6 pb-28 relative z-10">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="text-xl sm:text-2xl text-black font-bold">
              Interview Prep AI
            </div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm sm:text-base font-semibold text-white px-6 sm:px-7 py-2 sm:py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
                onClick={() => setOpenAuthModel(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Content */}
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Side - Text */}
            <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-8 md:mb-0">
              <div className="flex items-center mb-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <LuSparkles /> AI Powered
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl text-black font-medium mb-6 leading-tight">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
                  AI Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            {/* Right Side - Text + CTA */}
            <div className="w-full md:w-1/2">
              <p className="text-sm sm:text-base md:text-lg text-gray-900 mb-6 md:mr-12">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery – your ultimate interview toolkit is here.
              </p>
              <button
                className="bg-black text-sm sm:text-base font-semibold text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <section className="flex items-center justify-center -mt-28 relative z-10 px-4">
        <img
          src={HERO_IMG}
          alt="Hero-Image"
          className="w-full sm:w-[80vw] max-w-4xl rounded-lg shadow-lg"
        />
      </section>

      {/* Features Section */}
      <div className="w-full min-h-full bg-[#FFFCEF] mt-12">
        <div className="container mx-auto px-4 pt-12 pb-20">
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center mb-12">
              Features That Make You Shine
            </h2>

            <div className="flex flex-col items-center gap-8">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {APP_FEATURES.slice(3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs sm:text-sm bg-gray-50 text-secondary text-center p-4 mt-5">
        Made with ❤️ Happy Coding
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage('login');
        }}
        hideHeader
      >
        <div className="w-full max-w-md mx-auto">
          {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === 'signup' && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </>
  )
}

export default Landingpage
