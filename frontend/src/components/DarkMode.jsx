import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const DarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    document.documentElement.setAttribute("data-theme", savedTheme || "dark");
    setIsDark(savedTheme === "Dark");
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className=" flex top-4 gap-4 btn btn-circle text-lg transition-all">
      {isDark ? <Sun size={22} className="hover:animate-spin"/> : <Moon size={22} className="hover:animate-pulse"/>}
    </button>
  );
};

export default DarkMode;
