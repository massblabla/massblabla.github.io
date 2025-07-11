/* SPDX-License-Identifier: MIT */
const firebaseConfig = {
  apiKey: "AIzaSyA5ye1Jc7ELkWy3T_NkYCRzdfo-av0AZJ0",
  authDomain: "posthouse-3e8d5.firebaseapp.com",
  projectId: "posthouse-3e8d5",
  storageBucket: "posthouse-3e8d5.firebasestorage.app",
  messagingSenderId: "194283407290",
  appId: "1:194283407290:web:69212788bccdfbba3eff83",
  measurementId: "G-4TSSFBYEW8",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
});

auth.onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("login").disabled = true;
    document.getElementById("logout").disabled = false;
    document.getElementById("loginLink").textContent = "Logout";
    document.getElementById("newPost").textContent = "New post";
    document.getElementById("editPost").textContent = "Edit post";
    document.getElementById("deletePost").textContent = "Delete post";
    console.log("User is logged in:", user.email);

    alert(`Welcome back, ${user.email.split("@")[0]}`);
  } else {
    document.getElementById("login").disabled = false;
    document.getElementById("logout").disabled = true;
    console.log("No user is logged in.");
  }
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful!");
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      console.log("User:", userCredential.user);
      window.location.href = "/admin/postlist.html";
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
      console.error(`Login Error: ${error}`);
    });
});

document.getElementById("logout").addEventListener("click", function (e) {
  e.preventDefault();
  auth
    .signOut()
    .then(() => {
      alert("Logout successful!");
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      console.log("User logged out.");
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
      console.error(`Login Error: ${error}`);
    });
});
