/* SPDX-License-Identifier: MIT */
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  } else if (savedTheme === "dark") {
    document.documentElement.classList.remove("light-theme");
  } else {
    // Optional: Match system preference if no user preference
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    if (prefersLight) {
      document.documentElement.classList.add("light-theme");
    }
  }

  document.getElementById("toggleTheme").addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");

    // Optional: save user preference to localStorage
    if (document.documentElement.classList.contains("light-theme")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  });
});
