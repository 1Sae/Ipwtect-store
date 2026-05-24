import React, { useContext, useEffect, useState } from "react";
import { LuUser, LuMail, LuPhone, LuLock } from "react-icons/lu";
import { useTheme } from "../../contexts/ThemeContexts";
import { useAlert } from "../../providers/AlertProvider";
import { AdminContext } from "../../providers/AdminProvider";

const SettingsPage = () => {
  const t = useTheme();
  const { showAlert } = useAlert();
  const {
    admin,
    updateAdminProfile,
    changeAdminPassword,
  } = useContext(AdminContext);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================== INIT ================== */
  useEffect(() => {
    if (admin) {
      setForm({
        name: admin.name || "",
        email: admin.email || "",
        phone: admin.phone || "",
      });
    }
  }, [admin]);

  /* ================== HANDLERS ================== */
  const handleProfileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!form.name || !form.email || !form.phone) {
      showAlert("All fields are required", "error");
      return;
    }
  
    setSavingProfile(true);
  
    const res = await updateAdminProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
    });
  
    if (res.success) {
      showAlert(res.message, "successfully updated profile");
    } else {
      showAlert(res.message, "error updating profile");
    }
  
    setSavingProfile(false);
  };
  

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    setSavingPassword(true);

    const res = await changeAdminPassword({
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (res.success) {
      showAlert(res.message, "successfully updated password");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      showAlert(res.message, "error in updating password");
    }

    setSavingPassword(false);
  };

  return (
    <div className="h-screen flex flex-col">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-2 py-2 shrink-0">
        <div>
          <h1
            className="font-bold"
            style={{ color: t.colors.primary, fontSize: t.typography.h3 }}
          >
            Manage Profile
          </h1>
          <p
            style={{ color: t.colors.secondColor, fontSize: t.typography.small }}
          >
            Update admin information or change password
          </p>
        </div>

        {/* Avatar */}
        <div
          className="flex items-center gap-2 px-2 py-2 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${t.colors.surface} 0%, #fff 70%)`,
            border: `1px solid ${t.colors.borderColor}`,
            boxShadow: "0 10px 25px -12px rgba(0,0,0,0.15)",
          }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center relative"
            style={{
              background: `radial-gradient(circle at top left,#fff 0%,${t.colors.primary}22 70%)`,
              border: `1px solid ${t.colors.primary}55`,
            }}
          >
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500" />
            <LuUser size={22} style={{ color: t.colors.primary }} />
          </div>

          <div className="flex flex-col leading-tight">
            <span
              className="text-xs uppercase"
              style={{ color: t.colors.textSecondary }}
            >
              Admin
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: t.colors.textPrimary }}
            >
              {admin?.name}
            </span>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

          {/* ===== PROFILE CARD ===== */}
          <div
            className="rounded-2xl p-3"
            style={{
              background: t.colors.surface,
              border: `1px solid ${t.colors.borderColor}`,
              boxShadow: "0 10px 25px -15px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              className="font-semibold mb-3"
              style={{ color: t.colors.textPrimary }}
            >
              Profile Information
            </h3>

            <div className="space-y-2">
              {[
                { label: "Name", name: "name", icon: <LuUser /> },
                { label: "Email", name: "email", icon: <LuMail /> },
                { label: "Phone", name: "phone", icon: <LuPhone /> },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span style={{ color: t.colors.primary }}>{item.icon}</span>
                  <input
                    type="text"
                    name={item.name}
                    value={form[item.name]}
                    onChange={handleProfileChange}
                    placeholder={item.label}
                    className="w-full px-3 py-2 rounded-xl outline-none"
                    style={{
                      background: t.colors.inputBackground,
                      border: `1px solid ${t.colors.borderColor}`,
                      color: t.colors.textPrimary,
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60"
              style={{
                background: t.colors.primary,
                color: "#fff",
              }}
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* ===== PASSWORD CARD ===== */}
          <div
            className="rounded-2xl p-3"
            style={{
              background: t.colors.surface,
              border: `1px solid ${t.colors.borderColor}`,
              boxShadow: "0 10px 25px -15px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              className="font-semibold mb-3"
              style={{ color: t.colors.textPrimary }}
            >
              Change Password
            </h3>

            <div className="space-y-2">
              {[
                { label: "Current Password", name: "currentPassword" },
                { label: "New Password", name: "newPassword" },
                { label: "Confirm Password", name: "confirmPassword" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <LuLock style={{ color: t.colors.primary }} />
                  <input
                    type="password"
                    name={item.name}
                    value={passwordForm[item.name]}
                    onChange={handlePasswordChange}
                    placeholder={item.label}
                    className="w-full px-3 py-2 rounded-xl outline-none"
                    style={{
                      background: t.colors.inputBackground,
                      border: `1px solid ${t.colors.borderColor}`,
                      color: t.colors.textPrimary,
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60"
              style={{
                background: t.colors.primary,
                color: "#fff",
              }}
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
