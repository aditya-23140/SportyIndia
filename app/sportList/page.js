"use client";
import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import { IoFootball, IoBasketball, IoBaseball, IoTennisball } from "react-icons/io5";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sports, setSports] = useState([]);
  const slideInterval = useRef(null);

  const getSportIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'football':
        return <IoFootball />;
      case 'basketball':
        return <IoBasketball />;
      case 'baseball':
        return <IoBaseball />;
      case 'tennis':
        return <IoTennisball />;
      default:
        return <IoFootball />;
    }
  };
  
  useEffect(() => {
    const fetchSports = async () => {
      const response = await fetch('/api/sports');
      const result = await response.json();
      setSports(result);
    };

    fetchSports();
  }, []);

  useEffect(() => {
    startSlideTimer();
    return () => clearInterval(slideInterval.current);
  }, [currentSlide]);

  const startSlideTimer = () => {
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (slides.length - 1)); 
    }, 3000);
  };

  const handleManualSlideChange = (index) => {
    setCurrentSlide(index);
    startSlideTimer();
  };

  const slides = sports.map((sport, index) => ({
    src: '/default.jpg', // Fallback image as there is no image data in the response
    name: sport.name,
    icon: getSportIcon(sport.category), // Updated to use category for icon
    info: `Sport: ${sport.name}, Category: ${sport.category}`
  }));

  return (
    <div>
      <Navbar />
      <main className='min-h-[79vh]'>
        <div className='w-[70vw] h-[40vh] relative mx-auto mt-4 flex items-center'>
          <div className='overflow-hidden h-full flex transition-transform duration-700 ease-in-out' style={{ transform: `translateX(${-currentSlide * 50}%)` }}>
            {slides.map((slide, index) => (
              <div key={index} className='w-1/2 flex-shrink-0'>
                <img
                  src={slide.src}
                  alt={slide.name}
                  className='w-full h-full object-cover'
                />
                <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white">
                  {slide.icon}
                  <p>{slide.info}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 right-0 flex space-x-2 p-4">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() => handleManualSlideChange(index)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
