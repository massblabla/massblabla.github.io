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
const db = firebase.firestore();

const postsRef = db.collection("posts");

auth.onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("loginLink").textContent = "Logout";
    document.getElementById("newPost").textContent = "New post";
    document.getElementById("editPost").textContent = "Edit post";
    document.getElementById("deletePost").textContent = "Delete post";

    alert(`Welcome back, ${user.email.split("@")[0]}`);
  }
});

async function loadList() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";

  postsRef
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const li = document.createElement("li");

        const data = document.createElement("span");
        data.className = "data";

        const timestamp =
          post.timestamp && post.timestamp.toDate
            ? post.timestamp.toDate()
            : new Date();
        const timestampSpan = document.createElement("span");
        timestampSpan.textContent = timestamp;

        const author = document.createElement("span");
        author.textContent = post.author || "Anonymous";
        author.className = "author";

        data.appendChild(author);
        data.appendChild(document.createTextNode(" - "));
        data.appendChild(timestampSpan);

        const title = document.createElement("span");
        title.className = "title";

        const a = document.createElement("a");
        a.href = `/post.html?i=${doc.id}`;
        a.textContent = post.title || doc.id;
        title.appendChild(a);

        li.appendChild(data);
        li.appendChild(title);
        li.appendChild(document.createElement("br"));
        if (post.hide) {
          li.classList.add("hiddenPost");
        }

        ul.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}

loadList();
