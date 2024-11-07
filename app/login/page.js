"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Navbar from "../navbar/navbar";

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [passVisible1, setPassVisible1] = useState(true);
  const [passVisible2, setPassVisible2] = useState(true);

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setErrorMessage("");
  };

  const toggleEye1 = () => {
    setPassVisible1(!passVisible1);
  };

  const toggleEye2 = () => {
    setPassVisible2(!passVisible2);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const alphanumeric = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    return password.length >= minLength && alphanumeric.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? "/api/signup" : "/api/login";
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    if (isSignUp) {
      if (!validatePassword(data.password)) {
        setErrorMessage("Password must be at least 8 characters long and contain both letters and numbers.");
        return;
      }
  
      if (data.password !== data.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log(result);
      if (result.success) {
        const loginInfo = {
          email: data.email,
          userId: result.user.id,
        };
        console.log(loginInfo);
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        
        router.push("/user");
      } else {
        setErrorMessage(result.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error in login/signup process:", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <ul className="circles">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li>
      </ul>
      <motion.div
        className="loginContainer bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "login"}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-center mb-6">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
              {isSignUp && (
                <div>
                  <label className="block text-sm text-gray-400">User Name</label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Enter your User Name"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-400">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm text-gray-400">Password</label>
                <input
                  name="password"
                  type={!passVisible1 ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className='absolute right-2 top-7 z-1' onClick={toggleEye1}>
                  {!passVisible1 ? <IoEye className='text-3xl' /> : <IoEyeOff className='text-3xl' />}
                </span>
              </div>
              {isSignUp && (
                <div className="relative">
                  <label className="block text-sm text-gray-400">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type={!passVisible2 ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className='absolute right-2 top-7 z-1' onClick={toggleEye2}>
                    {!passVisible2 ? <IoEye className='text-3xl' /> : <IoEyeOff className='text-3xl' />}
                  </span>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition duration-200 shadow-md hover:shadow-lg"
              >
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>
            {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={toggleMode}
              className="text-blue-500 hover:underline ml-2 font-semibold"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
      <style jsx>{`
        .circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .loginContainer {
          position: relative; 
          z-index: 1;
        }
        .circles li {
          position: absolute;
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, .5);
          animation: 25s linear infinite animate;
          bottom: -150px;
        }
        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
        .circles li:nth-child(1) {
          left: 25%;
          width: 120px;
          height: 120px;
          animation-delay: 0s;
        }
        .circles li:nth-child(2) {
          left: 10%;
          width: 30px;
          height: 30px;
          animation-delay: 2s;
          animation-duration: 12s;
        }
        .circles li:nth-child(3) {
          left: 70%;
          width: 30px;
          height: 30px;
          animation-delay: 4s;
        }
        .circles li:nth-child(4) {
          left: 40%;
          width: 90px;
          height: 90px;
          animation-delay: 0s;
          animation-duration: 18s;
        }
        .circles li:nth-child(5) {
          left: 65%;
          width: 30px;
          height: 30px;
          animation-delay: 0s;
        }
        .circles li:nth-child(6) {
          left: 85%;
          width: 45px;
          height: 45px;
          animation-delay: 0s;
        }
        .circles li:nth-child(7) {
          left: 15%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }
        .circles li:nth-child(8) {
          left: 50%;
          width: 70px;
          height: 70px;
          animation-delay: 0s;
          animation-duration: 16s;
        }
        .circles li:nth-child(9) {
          left: 5%;
          width: 60px;
          height: 60px;
          animation-delay: 2s;
          animation-duration: 22s;
        }
        .circles li:nth-child(10) {
          left: 90%;
          width: 50px;
          height: 50px;
          animation-delay: 0s;
        }
      `}</style>
    </div>
  );
};

export default LoginSignup;
