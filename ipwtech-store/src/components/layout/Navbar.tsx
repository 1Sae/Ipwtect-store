"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "@/src/theme/ThemeProvider";
import { getCategories } from "@/src/services/categoryService";
import { Category } from "@/src/types/category";

export default function Navbar() {
  const t = useTheme();

  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      setDrawerVisible(true);
    } else {
      const timeout = setTimeout(
        () => setDrawerVisible(false),
        300 // match animation duration
      );
      return () => clearTimeout(timeout);
    }
  }, [mobileOpen]);
  

  // ================= Screen Resize =================
  useEffect(() => {
    const handleResize = () =>
      setScreenWidth(window.innerWidth);

    handleResize();

    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  // ================= Fetch Categories =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ================= Responsive Row Count =================
  const getRowCount = () => {
    if (screenWidth >= 1536) return 16;
    if (screenWidth >= 1280) return 12;
    if (screenWidth >= 1024) return 10;
    return 0;
  };

  const rowCategories = categories.slice(
    0,
    getRowCount()
  );

  return (
    <nav
      className="w-full relative"
      style={{ backgroundColor: t.colors.background }}
    >
      <div className="max-w-[1300px] mx-auto px-4">

        <div className="flex items-center gap-2 py-3">

          {/* ================= Categories Button ================= */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-1 font-medium"
              style={{ color: t.colors.primary }}
            >
              <FiMenu size={18} className="cursor-pointer"/>
              <span className="hidden lg:block cursor-pointer">
                Categories
              </span>
            </button>


            {/* ================= Desktop Mega Menu ================= */}
            {hovered && !loading && screenWidth >= 1024 && (
              <div
                className="
                  hidden
                  lg:flex
                  flex-col
                  absolute
                  left-0
                  top-full
                  w-[1000px]
                  h-[570px]
                  rounded-2xl
                  shadow-2xl
                  border
                  z-50
                  overflow-hidden
                "
                style={{
                  backgroundColor: t.colors.background,
                  borderColor: t.colors.borderColor,
                }}
              >

                {/* Header */}
                <div className="px-6 py-4 border-b"
                  style={{ borderColor: t.colors.borderColor }}
                >
                  <h2
                    className="text-lg font-bold"
                    style={{ color: t.colors.primary }}
                  >
                    Explore Categories
                  </h2>
                </div>



                {/* Responsive Grid */}
                <div
                  className="
                    p-6
                    overflow-y-auto
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    gap-4
                  "
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/shop?category=${cat._id}`}
                      className="
                        group
                        border
                        rounded-xl
                        p-4
                        flex
                        flex-col
                        items-center
                        text-center
                        gap-3
                        transition-all
                        ease-in-out
                        duration-400
                        hover:-translate-y-1
                        hover:shadow-lg
                      "
                      style={{
                        borderColor: t.colors.borderColor,
                      }}
                    >
                      <img
                        src={`https://ipwtech-backend.onrender.com${cat.image}`}
                        className="w-30 h-30 object-contain"
                      />

                      <span className="text-sm font-medium">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="hidden lg:block"
            style={{ borderColor: t.colors.borderColor }}
          >
              <div className="h-5 border-l border-1" style={{ borderColor: t.colors.primary }} />

          </div>

          {/* ================= Desktop Categories Row ================= */}
          <ul
          className="
            hidden
            lg:flex
            items-center
            gap-6
            font-medium
          "
        >
          {rowCategories.map((cat) => (
            <li key={cat._id}>

              <Link
                href={`/shop?category=${cat._id}`}
                onMouseEnter={() =>
                  setHoveredCat(cat._id)
                }
                onMouseLeave={() =>
                  setHoveredCat(null)
                }
                className="
                  relative
                  transition-all
                  duration-200
                  transform
                  hover:scale-105
                "
                style={{
                  color: hoveredCat === cat._id ? t.colors.primary : t.colors.textPrimary,
                  fontSize: t.typography.body,
                }}
              >
                {cat.name}

                {/* Optional underline indicator */}
                <span
                  className="
                    absolute
                    left-0
                    -bottom-1
                    h-[2px]
                    w-0
                    transition-all
                    duration-200
                  "
                  style={{
                    backgroundColor: t.colors.primary,
                    width:
                      hoveredCat === cat._id
                        ? "100%"
                        : "0%",
                  }}
                />

              </Link>

            </li>
          ))}
        </ul>


        </div>
      </div>



      {/* ================= Mobile Drawer ================= */}
{/* ================= Mobile Drawer ================= */}
    {drawerVisible && (
      <>
        {/* ===== Overlay ===== */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`
            fixed
            inset-0
            z-40
            transition-all
            duration-300
            ${
              mobileOpen
                ? "opacity-100 backdrop-blur-sm"
                : "opacity-0 backdrop-blur-0"
            }
          `}
          style={{
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        />



        {/* ===== Drawer Panel ===== */}
        <div
          className={`
            fixed
            top-0
            left-0
            h-full
            w-[280px]
            z-50
            shadow-2xl
            transform
            transition-all
            duration-300
            ease-in-out
            ${
              mobileOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }
          `}
          style={{
            backgroundColor: t.colors.surface,
            borderRight: `1px solid ${t.colors.borderColor}`,
          }}
        >

          {/* ===== Header ===== */}
          <div
            className="
              px-5
              py-4
              flex
              items-center
              justify-between
              border-b
            "
            style={{
              borderColor: t.colors.borderColor,
            }}
          >
            <span
              className="font-semibold text-sm"
              style={{ color: t.colors.primary }}
            >
              Browse Categories
            </span>

            <FiX
              size={20}
              onClick={() => setMobileOpen(false)}
              className="
                cursor-pointer
                transition-transform
                duration-200
                hover:scale-110
                hover:rotate-90
              "
              style={{ color: t.colors.textPrimary }}
            />
          </div>



          {/* ===== Categories ===== */}
          <div
            className="
              p-4
              space-y-1
              overflow-y-auto
              h-[calc(100%-70px)]
            "
          >
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/shop?category=${cat._id}`}
                onClick={() => setMobileOpen(false)}
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  transition-all
                  duration-200
                  hover:translate-x-1
                "
              >

                {/* Accent Bar */}
                <span
                  className="
                    absolute
                    left-0
                    top-0
                    h-full
                    w-[3px]
                    rounded-r
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                  "
                  style={{
                    backgroundColor: t.colors.primary,
                  }}
                />

                {/* Icon */}
                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    flex
                    items-center
                    justify-center
                  "
                  style={{
                    backgroundColor:
                      t.colors.primary + "15",
                    color: t.colors.primary,
                  }}
                >
                  <FiMenu size={16} />
                </div>

                {/* Name */}
                <span
                  className="
                    text-sm
                    font-medium
                  "
                  style={{
                    color: t.colors.textPrimary,
                  }}
                >
                  {cat.name}
                </span>

              </Link>
            ))}
          </div>

        </div>
      </>
    )}


    </nav>
  );
}
