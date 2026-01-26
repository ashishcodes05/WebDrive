import {
    User,
    Mail,
    Upload,
    Eye,
    EyeOff,
    Lock,
    ShieldAlert,
    Trash2,
    Cloud
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router";

const PasswordInput = ({ label, description, value, onChange }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-white">{label}</label>
            {description && (
                <p className="text-xs text-[var(--color-text-secondary)]">
                    {description}
                </p>
            )}
            <div className="relative mt-1">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-xl bg-white/5 backdrop-blur-xl px-4 py-3 pr-11 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
};

const ProfileSettingsPage = () => {
    const { user } = useAppContext();
    const [name, setName] = useState(user?.name || "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const hasPassword = user?.hasPassword;

    return (
        <div className="relative min-h-screen bg-[var(--color-background)] px-6 py-14 text-white overflow-hidden">

            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[var(--color-primary)] opacity-20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[var(--color-secondary)] opacity-20 blur-3xl" />

            <div className="relative mx-auto max-w-5xl flex flex-col gap-8">
                <Link to="/" className="flex items-center">
                    <Cloud className="text-primary-accent fill-current" size={40} />
                    <span className="text-2xl text-primary font-bold ml-2">
                        <i>Web</i>
                        <span className="text-secondary-accent">
                            <i>Drive</i>
                        </span>
                    </span>
                </Link>
                <div>
                    <h1 className="text-3xl font-semibold">Account Settings</h1>
                    <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
                        Update your personal information, manage your login credentials,
                        and control account-level actions. Changes are applied immediately
                        after saving.
                    </p>
                </div>

                <section className="flex flex-col gap-6 rounded-2xl bg-white/5 backdrop-blur-xl p-6 ring-1 ring-white/10 shadow-xl">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-medium">Profile Information</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            This information is visible across your account and used to
                            personalize your experience.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-2xl font-semibold">
                            {user.picture ? (
                                <img
                                    src={user.picture}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                user?.name?.[0]?.toUpperCase() || "U"
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium">Profile photo</p>
                            <p className="text-xs text-[var(--color-text-secondary)]">
                                Upload a square image for best results. JPG or PNG, up to 2MB.
                            </p>
                            <label className="inline-flex w-fit items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm cursor-pointer hover:bg-white/15">
                                <Upload size={16} />
                                Upload image
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => setAvatar(e.target.files[0])}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-sm flex items-center gap-2">
                                <User size={14} /> Name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-xl bg-white/5 backdrop-blur-xl px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-sm flex items-center gap-2">
                                <Mail size={14} /> Email address
                            </label>
                            <input
                                value={user?.email}
                                disabled
                                className="rounded-xl bg-white/5 px-4 py-3 text-sm text-gray-400 ring-1 ring-white/5 cursor-not-allowed"
                            />
                            <p className="text-xs text-[var(--color-text-secondary)]">
                                Email addresses cannot be changed after account creation.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium shadow-lg shadow-blue-500/20 hover:bg-[var(--color-primary-accent)]">
                            Save changes
                        </button>
                    </div>
                </section>

                <section className="flex flex-col gap-6 rounded-2xl bg-white/5 backdrop-blur-xl p-6 ring-1 ring-white/10 shadow-xl">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-medium flex items-center gap-2">
                            <Lock size={18} /> Security
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            Keep your account secure by maintaining a strong password. You
                            will be asked to re-authenticate after updating it.
                        </p>
                    </div>

                    <div className="flex flex-col gap-5 max-w-xl">
                        {hasPassword && (
                            <PasswordInput
                                label="Current password"
                                description="Required to confirm your identity before changing your password."
                                value={currentPassword}
                                onChange={setCurrentPassword}
                            />
                        )}

                        <PasswordInput
                            label={hasPassword ? "New password" : "Create a password"}
                            description="Use at least 8 characters. Avoid reused or compromised passwords."
                            value={newPassword}
                            onChange={setNewPassword}
                        />

                        <PasswordInput
                            label="Confirm password"
                            description="Re-enter the new password to prevent mistakes."
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button className="rounded-xl bg-[var(--color-secondary)] px-6 py-2.5 text-sm font-medium shadow-lg shadow-purple-500/20 hover:bg-[var(--color-secondary-accent)]">
                            Update password
                        </button>
                    </div>
                </section>

                <section className="flex flex-col gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-2 text-red-400">
                        <ShieldAlert size={18} />
                        <h2 className="font-medium">Danger zone</h2>
                    </div>

                    <p className="text-sm text-red-300/80 max-w-2xl">
                        These actions affect your entire account. Disabling your account
                        will restrict access, while deleting it will permanently remove all
                        data. These operations cannot be undone.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button className="flex items-center justify-center gap-2 rounded-xl border border-red-500/40 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
                            <Lock size={16} />
                            Disable account
                        </button>

                        <button className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700">
                            <Trash2 size={16} />
                            Delete account
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;