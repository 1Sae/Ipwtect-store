import React, { useState, useContext } from "react"; 
import { useTheme } from "../../contexts/ThemeContexts.jsx";
import { useNavigate } from "react-router-dom"; 
import { AdminContext } from "../../providers/AdminProvider"; 
import { useAlert } from "../../providers/AlertProvider"; 
import logo from "../../assets/logo.png";

const AuthPage = () => {
    const t = useTheme();

    const navigate = useNavigate(); 
    const { loginAdmin, registerAdmin } = useContext(AdminContext); 
    const { showAlert } = useAlert(); 
    const [mode, setMode] = useState("login");
    const isLogin = mode === "login";

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.email || !form.password || (!isLogin && !form.name)) {
        showAlert("warning", "Please fill all required fields");
        setLoading(false);
        return;
        }

        const action = isLogin ? loginAdmin : registerAdmin;
        const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

        const res = await action(payload);

        if (res.success) {
        showAlert(
            "success",
            isLogin ? "Logged in successfully" : "Account created successfully"
        );
        navigate("/dashboard", { replace: true });
        } else {
        showAlert("error", res.message || "Authentication failed");
        }

        setLoading(false);
    };

    return (
        <div
        className="min-h-screen w-screen flex items-center justify-center px-4"
        style={{ background: t.colors.background }}
        >
        <div
            className="w-full max-w-7xl overflow-hidden shadow-xl border"
            style={{
            borderColor: t.colors.borderColor,
            borderRadius: t.radius.lg,
            background: t.colors.surface,
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="p-10 md:p-20 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-2">
                <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                <div>
                    <div
                    className="font-semibold"
                    style={{ fontSize: t.typography.h3 }}
                    >
                    IPW Tech
                    </div>
                    <div
                    style={{
                        color: t.colors.textSecondary,
                        fontSize: t.typography.small,
                    }}
                    >
                    Admin Portal
                    </div>
                </div>
                </div>

                <h1
                className="font-semibold"
                style={{ fontSize: t.typography.h1 }}
                >
                Welcome To{" "}
                <span style={{ color: t.colors.primary }}>IPW Tech</span>
                </h1>

                <p className="mt-3" style={{ color: t.colors.textSecondary }}>
                Take full control of your platform by managing orders, customers,
                and products through a powerful admin dashboard.
                </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-8 md:p-12 flex items-center justify-center">
                <div
                className="w-full max-w-md border shadow-lg"
                style={{
                    borderColor: t.colors.borderColor,
                    borderRadius: t.radius.lg,
                    background: t.colors.surface,
                }}
                >
                <div className="p-6">
                    <h2
                    className="font-semibold"
                    style={{ fontSize: t.typography.h2, color : t.colors.primary }}
                    >
                    {isLogin ? "Welcome Back Admin" : "Create Admin Account"}
                    </h2>
                    <h2
                    className="font-medium"
                    style={{ fontSize: t.typography.small, color: t.colors.textSecondary }}
                    >
                    {isLogin ? "please enter your credentials to Login" : "Please enter your details to sign up"}
                    </h2>

                    {/* Tabs */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="py-2 text-sm font-semibold border"
                        style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.primary,
                        background:
                            mode === "signup"
                            ? t.colors.primary
                            : "transparent",
                        color:
                            mode === "signup"
                            ? "white"
                            : t.colors.primary,
                        }}
                    >
                        Sign Up
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="py-2 text-sm font-semibold border"
                        style={{
                        borderRadius: t.radius.md,
                        borderColor: t.colors.primary,
                        background:
                            mode === "login"
                            ? t.colors.primary
                            : "transparent",
                        color:
                            mode === "login"
                            ? "white"
                            : t.colors.primary,
                        }}
                    >
                        Login
                    </button>
                    </div>

                    {/* FORM */}
                    <form
                    className="mt-6 space-y-4"
                    onSubmit={handleSubmit} 
                    >
                    {!isLogin && (
                        <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange} 
                        mode={mode}
                        />
                    )}

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange} 
                        mode={mode}
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange} 
                        mode={mode}
                    />

                    <button
                        type="submit"
                        disabled={loading} 
                        className="w-full py-2.5 font-semibold"
                        style={{
                        borderRadius: t.radius.md,
                        background: t.colors.primary,
                        color: "white",
                        opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading
                        ? "Please wait..."
                        : isLogin
                        ? "Login"
                        : "Sign Up"}
                    </button>
                    </form>
                </div>
                </div>
            </div>
            {/* END RIGHT */}
            </div>
        </div>
        </div>
    );
};

function Input({ label, mode, ...props }) {
    const t = useTheme();
    
    return (
        <div>
            <label className="block font-medium mb-1" style={{ fontSize: t.typography.small }}>
            {label}
            </label>
    
            <input
            {...props}
            className="w-full px-3 py-2 border outline-none"
            style={{
                borderRadius: t.radius.md,
                borderColor: t.colors.primary, 
                background: t.colors.inputBackground,
            }}
            />
        </div>
    );
}  

export default AuthPage;
