"use client";

import { useTheme } from "@/src/theme/ThemeProvider";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Props {
  images: string[];
}

export default function ProductImagesGallery({ images }: Props) {
  const productImages = images?.length ? images : [];
  const t = useTheme();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrent((prev) =>
      prev < productImages.length - 1 ? prev + 1 : prev
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev > 0 ? prev - 1 : prev
    );
  };

  useEffect(() => {
    if (productImages.length <= 1) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrent((prev) =>
          prev < productImages.length - 1 ? prev + 1 : prev
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [productImages.length, isPaused]);

  return (
    <div className="flex flex-col gap-4">

      {/* MAIN IMAGE */}
      <div className="w-full h-[400px] flex items-center justify-center mt-4">

        <div
          className="group relative w-full h-full overflow-hidden rounded-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* SLIDER */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {productImages.map((img, index) => (
              <div
                key={index}
                className="min-w-full h-full flex items-center justify-center"
              >
                <img
                  src={`http://localhost:3000/${img}`}
                  className="max-h-full object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* LEFT BUTTON */}
          {current > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}
              style={{
                color: t.colors.primary,
              }}
              className="absolute cursor-pointer left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <IoIosArrowBack size={18} />
            </button>
          )}

          {/* RIGHT BUTTON */}
          {current < productImages.length - 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}
              style={{
                color: t.colors.primary,
              }}
              className="absolute cursor-pointer right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <IoIosArrowForward size={18} />
            </button>
          )}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto">
        {productImages.map((img, i) => (
          <img
            key={i}
            src={`http://localhost:3000/${img}`}
            onClick={() => setCurrent(i)}
            className={`
              w-20 h-20 object-contain rounded-lg cursor-pointer border transition
              border-2
              ${current === i ? "border-orange-500" : "border-white/20"}
            `}
          />
        ))}
      </div>

    </div>
  );
}