"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sportsData, setSportsData] = useState([]);
  
  const slides = [
    { src: "/ichigo.jpg", alt: "Slide 1" },
    { src: "/bg.avif", alt: "Slide 2" },
    { src: "/ichigo.jpg", alt: "Slide 3" },
  ];

  const galleryImages = [
    { src: "/cat-1.jpg", alt: "Gallery Image 1" },
    { src: "/dog-1.jpg", alt: "Gallery Image 2" },
    { src: "/goat-1.jpg", alt: "Gallery Image 3" },
    { src: "/cow-1.jpg", alt: "Gallery Image 4" },
    { src: "/cat-2.jpg", alt: "Gallery Image 5" },
    { src: "/dog-2.jpg", alt: "Gallery Image 6" },
    { src: "/goat-2.jpg", alt: "Gallery Image 7" },
    { src: "/cow-2.jpg", alt: "Gallery Image 8" },
  ];

  const fetchSportsData = async () => {
    try {
      const response = await fetch("/api/sports");
      const data = await response.json();
      setSportsData(data);
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }
  };

  useEffect(() => {
    fetchSportsData();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-[79vh] relative bg-gray-100">
        <div id="carousel" className="relative w-full">
          <div className="relative h-56 overflow-hidden md:h-96">
            <AnimatePresence>
              {slides.map((slide, index) => (
                index === currentSlide && (
                  <motion.div
                    key={index}
                    className="absolute w-full h-full"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <Image
                      src={slide.src}
                      className="block w-full h-full object-cover"
                      alt={slide.alt}
                      width={500}
                      height={300}
                    />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-blue-600" : "bg-gray-300"}`}
                  onClick={() => setCurrentSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-gray-700 relative py-10 lg:py-20 z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-50"></div>
          <div className="relative z-10 px-4 mx-auto max-w-screen-xl text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              Welcome to PetGle
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
              At SportyIndia, we make the efforts of Athletes get recognized!
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
              <a
                href="/home"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
              >
                Get started
              </a>
              <a
                href="/about"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
              >
                Learn more
              </a>
            </div>
          </div>
        </section>

        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-full overflow-hidden"
            >
              <Image
                className="h-40 w-full object-cover rounded-lg"
                src={image.src}
                alt={image.alt}
                width={400}
                height={200}
              />
            </motion.div>
          ))}
        </div> */}

        <div className="flex flex-wrap items-center justify-center pt-6">
          {sportsData.map((sport, index) => (
            <motion.div
              key={index}
              className="max-w-sm w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h5 className="mb-2 text-2xl font-bold text-gray-900">{sport.name}</h5>
              <p className="mb-2 text-sm text-gray-500">Category: {sport.category}</p>
              <p className="mb-3 text-gray-700">Explore resources tailored for {sport.category} sports.</p>
              <a
                href="#"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none"
              >
                Learn more
              </a>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
