"use client";

import fetchImageData from "@/utils/fetchImageData";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Carousel({ events }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const indicators = document.querySelectorAll('[data-carousel-slide-to]');
    const carouselItems = document.querySelectorAll('[data-carousel-item]');
    const nextButton = document.querySelector('[data-carousel-next]');
    const prevButton = document.querySelector('[data-carousel-prev]');

    const updateCarousel = () => {
      carouselItems.forEach((item, index) => {
        item.classList.add('hidden');
        if (index === currentIndex) {
          item.classList.remove('hidden');
        }
      });

      indicators.forEach((indicator, index) => {
        indicator.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
      });
    };

    const nextSlide = () => {
      setIsUserInteracting(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    };

    const prevSlide = () => {
      setIsUserInteracting(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    };

    const goToSlide = (index) => {
      setIsUserInteracting(true);
      setCurrentIndex(index);
    };

    if (nextButton) nextButton.addEventListener('click', nextSlide);
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => goToSlide(index));
    });

    updateCarousel();

    // Set up auto-slide functionality every 4 seconds
    const autoSlideInterval = setInterval(() => {
      if (!isUserInteracting) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }
    }, 4000); // 4000 ms (4 seconds)

    // Reset the interval and user interaction flag if the user interacts
    const resetAutoSlide = () => {
      setIsUserInteracting(false); // Reset user interaction flag
    };

    // Clear the interval on unmount or when there's user interaction
    return () => {
      clearInterval(autoSlideInterval);
      if (nextButton) nextButton.removeEventListener('click', nextSlide);
      if (prevButton) prevButton.removeEventListener('click', prevSlide);
      indicators.forEach((indicator) => {
        indicator.removeEventListener('click', () => goToSlide(index));
      });
    };
  }, [currentIndex, events.length, isUserInteracting]);

  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {events.map((event, index) => (
          <div
            key={index}
            className={`hidden duration-700 ease-in-out ${index === currentIndex ? '' : 'hidden'}`}
            data-carousel-item
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 p-4 z-10">
              <h2 className="text-white text-xl font-bold">{event.EventName}</h2>
              <p className="text-white">{formatDate(event.Date)}</p>
              <p className="text-white">{event.Venue}</p>
              <p className="text-white">{event.EventTime}</p>
              <p className="text-white">{event.Description}</p>
            </div>
            <Image
              src={event.EventImage}
              alt={event.EventName}
              className="absolute block w-full h-full object-cover"
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {events.map((_, index) => (
          <button
            key={index}
            type="button"
            className="w-3 h-3 rounded-full"
            aria-current={index === currentIndex ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            data-carousel-slide-to={index}
          ></button>
        ))}
      </div>
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}
