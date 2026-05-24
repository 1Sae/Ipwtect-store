"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setCredentials } from "@/src/store/auth/authSlice";
import { loginUser, registerUser } from "@/src/services/authService";
import { useRouter } from "next/navigation";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function AuthPage() {
    const t = useTheme();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { token } = useAppSelector((state) => state.auth);

    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // prevent logged users from seeing login page
    useEffect(() => {
        if (token) router.replace("/");
    }, [token, router]); // add router

    const handleSubmit = async () => {
        try {
        setLoading(true);
        setError("");

        let data;

        if (isLogin) {
            data = await loginUser(email, password);
        } else {
            data = await registerUser(name, email, password, companyName);
        }
        const { user, token } = data.data;

        dispatch(setCredentials({ user, token }));

        localStorage.setItem("user_token", token);
        localStorage.setItem("user", JSON.stringify(user));

        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || "/";

        router.push(redirect);
        } catch (err: any) {
        setError(err.response?.data?.message || "Something went wrong");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

        {/* CARD */}
        <div 
        style={{
            background: t.colors.headerBg,
        }}
        className="w-full max-w-md rounded-2xl p-8 shadow-xl">

            {/* TITLE */}
            <h1 className="font-bold text-center mb-6" style={{ color: t.colors.primary, fontSize: t.typography.h3 }}>
            {isLogin ? "Welcome Back" : "Create Account"}
            </h1>

            {/* TOGGLE */}
            <div className="flex bg-[#020617] rounded-lg p-1 mb-3">
            <button
                style={{
                    color : isLogin ? "#fff" : t.colors.primary,
                }}
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md text-sm transition font-bold ${
                isLogin
                    ? "bg-orange-500"
                    : "text-gray-400"
                }`}
            >
                Login
            </button>

            <button
                style={{
                    color : !isLogin ? "#fff" : t.colors.primary,
                }}
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md text-sm transition font-bold ${
                !isLogin
                    ? "bg-orange-500"
                    : "text-gray-400"
                }`}
            >
                Sign Up
            </button>
            </div>

            {/* ERROR */}
            {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-2 rounded-md">
                {error}
            </div>
            )}

            {/* FORM */}
            <div className="flex flex-col gap-4">

            {!isLogin && (
                <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-modern"
                />
            )}
            {!isLogin && (
                <input
                    type="text"
                    value={companyName}
                    placeholder="Company Name (Optional)"
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input-modern placeholder:text-orange-500/70"
                />
            )}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern"
            />

            {/* BUTTON */}
            <button
                onClick={handleSubmit}
                className="
                w-full py-2.5 rounded-lg
                bg-orange-500 text-white font-semibold
                transition
                disabled:opacity-50
                cursor-pointer
                "
            >
                { isLogin
                ? "Login"
                : "Create Account"}
            </button>

            </div>

            {/* FOOTER */}
            <p
            onClick={() => setIsLogin(!isLogin)}
            className="mt-5 text-center text-md cursor-pointer transition"
            style={{ color: t.colors.primary }}
            >
            {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </p>

        </div>
        </div>
    );
}