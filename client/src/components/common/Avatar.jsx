import React from "react";

const gradients = [
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-fuchsia-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

const pickGradient = (seed = "") => {
  const total = String(seed)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return gradients[total % gradients.length];
};

const initialsFrom = (name = "", email = "") => {
  const raw = name?.trim() || email?.trim() || "PM";
  const parts = raw.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return raw.slice(0, 2).toUpperCase();
};

export default function Avatar({
  src,
  name,
  email,
  seed,
  className = "size-9",
  textClassName = "text-xs",
  alt = "avatar",
}) {
  if (src) {
    return <img src={src} alt={alt} className={`${className} rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10`} />;
  }

  const bg = pickGradient(seed || name || email);
  return (
    <div
      className={`${className} rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-white font-semibold ${textClassName}`}
      aria-label={alt}
      title={name || email || "User"}
    >
      {initialsFrom(name, email)}
    </div>
  );
}
