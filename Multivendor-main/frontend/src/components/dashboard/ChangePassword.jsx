// src/components/ChangePassword.jsx
import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import toast from "react-hot-toast";

const passwordStrength = (pwd) => {
  // simple scoring - increase as you add length, digits, upper, special
  let score = 0;
  if (!pwd) return { score: 0, label: "Very weak" };
  if (pwd.length >= 8) score += 2;
  if (pwd.length >= 12) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  const labels = ["Very weak", "Weak", "Okay", "Good", "Strong", "Very strong"];
  // score range 0..6 -> map to percent
  const percent = Math.min(100, Math.round((score / 6) * 100));
  const label = labels[Math.min(labels.length - 1, score)];
  return { score, percent, label };
};

const ChangePassword = ({ apiEndpoint = "/api/user/change-password", onSuccess } = {}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const strength = passwordStrength(newPassword);

  useEffect(() => {
    // live validation for confirm password mismatch
    setErrors((prev) => {
      const next = { ...prev };
      if (confirmPassword && newPassword !== confirmPassword) {
        next.confirmPassword = "New password and confirm password do not match.";
      } else {
        delete next.confirmPassword;
      }
      return next;
    });
  }, [newPassword, confirmPassword]);

  const validate = () => {
    const e = {};
    if (!oldPassword) e.oldPassword = "Please enter your old password.";
    if (!newPassword) e.newPassword = "Please enter a new password.";
    else if (newPassword.length < 8) e.newPassword = "New password must be at least 8 characters.";
    // optional: stronger rules
    if (!confirmPassword) e.confirmPassword = "Please confirm your new password.";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setSubmitting(true);
    try {
      // ===> Replace this fetch with your project's API call if different.
      // Keep headers / auth token as your app requires (e.g., Authorization Bearer ...)
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`, // uncomment if needed
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data?.message || `Server responded with status ${res.status}`;
        throw new Error(message);
      }

      // success
      toast.success("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      // friendly error messaging
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 bg-white rounded-2xl shadow-md animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <RiLockPasswordLine className="text-2xl text-emerald-600" />
        <h2 className="text-lg md:text-xl font-semibold text-slate-700">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Old Password */}
        <div className="mb-4">
          <label htmlFor="old_password" className="block text-sm font-medium text-slate-600 mb-1">
            Old Password
          </label>
          <div className="relative">
            <input
              id="old_password"
              name="old_password"
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`w-full pr-10 outline-none px-4 py-2 border rounded-lg transition-shadow duration-150 placeholder-slate-400 ${
                errors.oldPassword ? "border-rose-400 focus:ring-rose-200 shadow-sm" : "border-slate-200 focus:ring-emerald-100"
              }`}
              placeholder="Enter your current password"
              aria-invalid={errors.oldPassword ? "true" : "false"}
              aria-describedby={errors.oldPassword ? "old-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowOld((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-600 hover:text-slate-900 transition"
              aria-label={showOld ? "Hide old password" : "Show old password"}
            >
              {showOld ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p id="old-error" className="mt-1 text-xs text-rose-600">
              {errors.oldPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label htmlFor="new_password" className="block text-sm font-medium text-slate-600 mb-1">
            New Password
          </label>

          <div className="relative">
            <input
              id="new_password"
              name="new_password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full pr-10 outline-none px-4 py-2 border rounded-lg transition-shadow duration-150 placeholder-slate-400 ${
                errors.newPassword ? "border-rose-400 focus:ring-rose-200 shadow-sm" : "border-slate-200 focus:ring-emerald-100"
              }`}
              placeholder="Choose a strong password"
              aria-invalid={errors.newPassword ? "true" : "false"}
              aria-describedby={errors.newPassword ? "new-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-600 hover:text-slate-900 transition"
              aria-label={showNew ? "Hide new password" : "Show new password"}
            >
              {showNew ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {errors.newPassword ? (
            <p id="new-error" className="mt-1 text-xs text-rose-600">
              {errors.newPassword}
            </p>
          ) : (
            <>
              {/* Strength meter */}
              <div className="mt-2">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300`}
                    style={{
                      width: `${strength.percent}%`,
                      background:
                        strength.percent < 34 ? "#fb7185" /* rose */ : strength.percent < 67 ? "#f59e0b" /* amber */ : "#10b981" /* emerald */,
                    }}
                    aria-hidden
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                  <span>{strength.label}</span>
                  <span>{strength.percent}%</span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Password should be at least 8 characters. Use numbers, uppercase letters, and symbols for a stronger password.
              </p>
            </>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-600 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm_password"
              name="confirm_password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pr-10 outline-none px-4 py-2 border rounded-lg transition-shadow duration-150 placeholder-slate-400 ${
                errors.confirmPassword ? "border-rose-400 focus:ring-rose-200 shadow-sm" : "border-slate-200 focus:ring-emerald-100"
              }`}
              placeholder="Re-enter new password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-600 hover:text-slate-900 transition"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p id="confirm-error" className="mt-1 text-xs text-rose-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition transform active:scale-95 shadow-md
              ${submitting ? "bg-emerald-300 cursor-wait" : "bg-emerald-600 hover:bg-emerald-700"}`}
            aria-disabled={submitting}
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Updating...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setErrors({});
              toast("Cleared fields");
            }}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
