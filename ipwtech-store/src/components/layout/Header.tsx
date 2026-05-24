"use client";

import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { logout } from "@/src/store/auth/authSlice";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiX,
  FiMenu,
  FiHeart,
  FiBox,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";
import { getCategories } from "@/src/services/categoryService";
import { Category } from "@/src/types/category";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Product } from "@/src/types/product";
import { searchProducts } from "@/src/services/productsService";

export default function Header() {

  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {items} = useAppSelector((state) => state.cart);
  const totalItems = Array.isArray(items)
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;
    
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTheme();
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
  
    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchProducts(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce
  
    return () => clearTimeout(delay);
  }, [query]);
  
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

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setHoveredMenu(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setHoveredMenu(false);
    }, 200);
  };

  const handleLogout = () => {
    dispatch(logout());
  
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
  
    router.push("/");
  };

  return (
    <header className="w-full bg-[#111827] text-white relative z-40">
      <div className="max-w-[1300px] mx-auto px-4 py-4 flex items-center gap-6">
        {/* ================= Left Side ================= */}
        <div
          className="flex items-center gap-3 relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden"
            aria-label="Open categories menu"
          >
            <FiMenu className="text-xl cursor-pointer hover:text-orange-500 transition-colors" />
          </button>

          {/* Desktop Menu Icon */}
          <FiMenu className="text-xl cursor-pointer hover:text-orange-500 transition-colors hidden lg:block" />

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-orange-500">IPW </span>Tech
          </Link>

          {/* ================= Desktop Mega Menu ================= */}
          {hoveredMenu && !loading && (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="
                absolute
                top-full
                left-0
                mt-6
                rounded-3xl
                overflow-hidden
                z-50
                hidden lg:flex
                animate-fadeIn

                w-[1150px]
                h-[580px]

                max-[1300px]:w-[980px]
                max-[1300px]:h-[500px]

                max-h-[1090px]:w-[980px]
                max-h-[1090px]:h-[500px]
              "
              style={{
                background: t.colors.headerBg,
              }}
            >
              {/* ================= LEFT FEATURE PANEL ================= */}
              <div
                className="
                  relative
                  flex
                  flex-col
                  justify-between
                  text-white
                  overflow-hidden
                  p-8
                  w-[320px]
                  max-[1300px]:w-[280px]
                  max-[1300px]:p-6
                  max-h-[1090px]:w-[280px]
                  max-h-[1090px]:p-6
                "
                style={{
                  background: t.colors.bodyBg,
                }}
              >
                <div
                  className="
                    absolute
                    -top-20
                    -right-20
                    w-60
                    h-60
                    rounded-full
                    opacity-30
                    blur-3xl
                  "
                  style={{ background: "#ff6a00" }}
                />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold leading-tight max-[1300px]:text-xl max-h-[1090px]:text-xl">
                    Discover <br />
                    <span className="text-orange-500">Innovation</span>
                  </h2>

                  <p className="text-sm mt-4 text-gray-300 max-[1300px]:text-xs max-h-[1090px]:text-xs">
                    Browse our premium tech collections and discover top-tier
                    devices and accessories.
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="
                    relative
                    z-10
                    bg-orange-500
                    hover:bg-orange-600
                    text-sm
                    px-5
                    py-2.5
                    rounded-full
                    transition-colors
                    cursor-pointer
                    text-white
                    font-semibold
                    flex
                    items-center
                    w-fit

                    max-[1300px]:text-xs
                    max-[1300px]:px-4
                    max-[1300px]:py-2

                    max-h-[1090px]:text-xs
                    max-h-[1090px]:px-4
                    max-h-[1090px]:py-2
                  "
                >
                  Explore All Products Catalogue
                </Link>
              </div>

              {/* ================= RIGHT GRID ================= */}
              <div
                className="
                  flex-1
                  relative
                  overflow-hidden
                  rounded-r-3xl
                "
                style={{
                  background: t.colors.bodyBg,
                }}
              >
                <div
                  className="
                    absolute
                    -top-20
                    -left-20
                    w-60
                    h-60
                    rounded-full
                    opacity-30
                    blur-3xl
                  "
                  style={{ background: "#ff6a00" }}
                />

                <div
                  className="
                    h-full
                    overflow-y-auto
                    px-10
                    py-10
                    pr-6
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    xl:grid-cols-4
                    gap-8
                    custom-scrollbar

                    max-[1300px]:px-6
                    max-[1300px]:py-6
                    max-[1300px]:pr-4
                    max-[1300px]:gap-5

                    max-h-[1090px]:px-6
                    max-h-[1090px]:py-6
                    max-h-[1090px]:pr-4
                    max-h-[1090px]:gap-5
                  "
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/shop/category/${cat.name}`}
                      className="
                        group
                        relative
                        h-[200px]
                        rounded-3xl
                        bg-[#0f172a]
                        border border-white/10
                        flex
                        flex-col
                        items-center
                        justify-center
                        transition-all
                        duration-500
                        hover:-translate-y-2
                        hover:border-orange-500
                        hover:shadow-[0_20px_40px_rgba(255,106,0,0.25)]

                        max-[1300px]:h-[160px]
                        max-[1300px]:rounded-2xl

                        max-h-[1090px]:h-[160px]
                        max-h-[1090px]:rounded-2xl
                      "
                    >
                      <div
                        className="
                          absolute
                          inset-0
                          rounded-3xl
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
                          duration-500

                          max-[1300px]:rounded-2xl
                          max-h-[1090px]:rounded-2xl
                        "
                        style={{
                          background:
                            "radial-gradient(circle at center, rgba(255,106,0,0.18), transparent 70%)",
                        }}
                      />

                      <div className="relative z-10 w-24 h-24 flex items-center justify-center max-[1300px]:w-20 max-[1300px]:h-20 max-h-[1090px]:w-20 max-h-[1090px]:h-20">
                        <img
                          src={`https://ipwtech-backend.onrender.com${cat.image}`}
                          alt={cat.name}
                          className="
                            max-w-full
                            max-h-full
                            object-contain
                            transition-transform
                            duration-500
                            group-hover:scale-110
                          "
                        />
                      </div>

                      <span
                        className="
                          relative
                          z-10
                          mt-4
                          text-sm
                          font-semibold
                          text-gray-200
                          group-hover:text-orange-500
                          transition-colors
                          duration-300

                          max-[1300px]:mt-3
                          max-[1300px]:text-xs

                          max-h-[1090px]:mt-3
                          max-h-[1090px]:text-xs
                        "
                      >
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= Middle Section ================= */}
        <div className="flex-1 relative h-[40px] flex items-center">
          <div
            className={`
              absolute left-0 right-0 flex items-center
              transition-all duration-300 ease-in-out
              ${
                searchOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3 pointer-events-none"
              }
            `}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
                  w-full bg-[#1F2937] border border-gray-700
                  rounded-full py-2 pl-5 pr-12 text-sm
                  focus:outline-none
                  transition-colors
                "
                style={{
                  color: t.colors.primary,
                  backgroundColor: t.colors.headerBg,
                }}
              />
              {query && (
              <div className="absolute top-full left-0 w-full border border-gray-700 rounded-xl mt-2 max-h-80 overflow-y-auto z-50" style={{backgroundColor: t.colors.headerBg}}>

                {loading && (
                  <div className="p-3 text-sm" style={{
                    color: t.colors.primary,
                  }}>Searching...</div>
                )}

                {!loading && results.length === 0 && (
                  <div className="p-3 text-sm"
                  style={{
                    color: t.colors.primary,
                  }}
                  >
                    No results found
                  </div>
                )}


                {results.map((item) => (
                  <Link
                    key={item._id}
                    href={`/product/${item._id}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer"
                  >
                    <img
                      src={`https://ipwtech-backend.onrender.com/${item.image}`}
                      className="w-10 h-10 object-contain"
                    />

                    <div className="flex flex-col">
                      <span className="text-sm text-white">
                        {item.name}
                      </span>

                      <span className="text-xs text-gray-400">
                        {item.brand?.name} • {item.category?.name}
                      </span>
                    </div>
                  </Link>
                ))}

              </div>
            )}
              <FiX
                onClick={() => setSearchOpen(false)}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                  cursor-pointer text-gray-400
                  hover:text-orange-500 transition
                "
              />
            </div>
            
          </div>
        </div>

        {/* ================= Icons ================= */}
        <div className="flex items-center gap-6 text-lg">
          <FiSearch
            onClick={() => setSearchOpen(true)}
            className="cursor-pointer hover:text-orange-500 transition-colors"
          />
          <div className="relative" ref={menuRef}>
          {/* ICON */}
          <FiUser
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="
              cursor-pointer text-xl
              transition-all duration-300
              hover:scale-110 hover:text-orange-400
            "
          />

          {/* DROPDOWN */}
          {userMenuOpen && (
            <div
              style={{ backgroundColor: t.colors.headerBg }}
              className="
                absolute right-0 mt-4 w-72
                h-auto
                rounded-2xl
                border border-white/10
                shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                backdrop-blur-xl
                overflow-hidden
                z-50
                animate-in fade-in zoom-in-95 duration-200
              "
            >
              {/* GLOW TOP BAR */}
              <div className="h-[3px] bg-orange-500" />

              {/* USER HEADER */}
              <div className="px-5 py-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="
                  w-10 h-10 rounded-full
                  bg-orange-500
                  flex items-center justify-center
                  text-white font-bold
                  shadow-lg
                ">
                  {user?.name?.[0] || "G"}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <span className="text-sm" style={{ color: t.colors.textPrimary }}>
                    Signed in as
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: t.colors.primary }}
                  >
                    {user?.name || "Guest"}
                  </span>
                </div>
              </div>

              {/* MENU */}
              <div className="flex flex-col py-2">

                {/* ITEM */}
                <Link
                  href="/account"
                  onClick={() => setUserMenuOpen(false)}
                  className="group flex items-center gap-3 px-5 py-3 relative overflow-hidden hover:text-orange-500 transition-colors"
                >
                  <FiUser className="text-lg opacity-70 group-hover:opacity-100 transition" />
                  <span className="relative z-10">My Account</span>

                  {/* hover bg */}
                  <div className="
                    absolute inset-0
                    bg-gradient-to-r from-orange-500/30 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition duration-300
                  " />

                  {/* slide effect */}
                  <div className="
                    absolute left-0 top-0 h-full w-[3px]
                    bg-orange-500
                    scale-y-0 group-hover:scale-y-100
                    transition-transform origin-top
                  " />
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setUserMenuOpen(false)}
                  className="group flex items-center gap-3 px-5 py-3 relative overflow-hidden hover:text-red-500 transition-colors"
                >
                  <FiHeart className="text-lg opacity-70 group-hover:opacity-100 transition" />
                  <span className="relative z-10">Wishlist</span>

                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setUserMenuOpen(false)}
                  className="group flex items-center gap-3 px-5 py-3 relative overflow-hidden hover:text-green-500 transition-colors"
                >
                  <FiBox className="text-lg opacity-70 group-hover:opacity-100 transition" />
                  <span className="relative z-10">My Orders</span>

                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-green-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                </Link>

                {/* DIVIDER */}
                <div className="my-2 h-px bg-white/10" />

                {/* AUTH */}
                {token ? (
                  <button
                    onClick={handleLogout}
                    className="group cursor-pointer flex items-center gap-3 px-5 py-3 relative overflow-hidden hover:text-red-400 transition-colors"
                  >
                    <FiLogOut className="text-lg group-hover:scale-110 transition" />
                    <span className="relative z-10">Logout</span>

                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition duration-300" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setUserMenuOpen(false)}
                    className="group flex items-center gap-3 px-5 py-3 relative overflow-hidden hover:text-green-400 transition-colors"
                  >
                    <FiLogIn className="text-lg group-hover:scale-110 transition" />
                    <span className="relative z-10">Login</span>

                    <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition duration-300" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

          <Link            
            href="/cart"
            className="relative"
          >
            <div className="relative cursor-pointer">
            <FiShoppingCart className="hover:text-orange-500 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          </div>
          </Link>
        </div>
      </div>

      {/* ================= Mobile / Tablet Drawer ================= */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-all duration-300 ${
          mobileDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute top-0 left-0 h-full w-[88%] sm:w-[75%] md:w-[60%] max-w-[420px]
            transition-transform duration-300 ease-in-out
            ${mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{
            background: "linear-gradient(160deg, #111827, #1f2937)",
          }}
        >
          <div
            className="
              absolute
              -top-20
              -right-20
              w-60
              h-60
              rounded-full
              opacity-30
              blur-3xl
            "
            style={{ background: "#ff6a00" }}
          />

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold">
                  Discover <span className="text-orange-500">Innovation</span>
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  Browse our premium categories
                </p>
              </div>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close drawer"
              >
                <FiX className="text-2xl hover:text-orange-500 transition-colors" />
              </button>
            </div>

            <div className="px-6 pt-5">
              <Link
                href="/shop"
                onClick={() => setMobileDrawerOpen(false)}
                className="
                  inline-flex
                  items-center
                  justify-center
                  bg-orange-500
                  hover:bg-orange-600
                  text-sm
                  px-5
                  py-3
                  rounded-full
                  transition-colors
                  text-white
                  font-semibold
                  w-full
                "
              >
                Explore All Products Catalogue
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loading ? (
                <p className="text-gray-300 text-sm">Loading categories...</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/shop?category=${cat._id}`}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="
                        group
                        relative
                        min-h-[150px]
                        rounded-2xl
                        bg-[#0f172a]
                        border border-white/10
                        flex
                        flex-col
                        items-center
                        justify-center
                        p-4
                        transition-all
                        duration-300
                        hover:border-orange-500
                        hover:shadow-[0_12px_30px_rgba(255,106,0,0.20)]
                      "
                    >
                      <div
                        className="
                          absolute
                          inset-0
                          rounded-2xl
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
                          duration-300
                        "
                        style={{
                          background:
                            "radial-gradient(circle at center, rgba(255,106,0,0.16), transparent 70%)",
                        }}
                      />

                      <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                        <img
                          src={`https://ipwtech-backend.onrender.com${cat.image}`}
                          alt={cat.name}
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <span className="relative z-10 mt-3 text-center text-sm font-semibold text-gray-200 group-hover:text-orange-500 transition-colors">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}