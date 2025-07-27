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
    document.getElementById("postDelete").disabled = false;

    alert(`Welcome back, ${user.email.split("@")[0]}`);
  }
});

function loadPosts() {
  document.getElementById("postSelect").innerHTML = ""; // Clear previous options
  postsRef
    .orderBy("timestamp", "desc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const post = doc.data();
        if (post.trashed) return; // Skip trashed posts
        const option = document.createElement("option");
        option.value = doc.id;
        if (post.hide) {
          option.textContent = `${post.title} [HIDDEN]`;
        } else {
          option.textContent = post.title;
        }
        document.getElementById("postSelect").appendChild(option);
      });
    });
}

loadPosts();

document.getElementById("postDelete").addEventListener("click", async (e) => {
  try {
    await postsRef.doc(document.getElementById("postSelect").value).set(
      {
        trashed: true,
        timeTrashed: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    alert(
      `Post deleted: "${
        (
          await postsRef.doc(document.getElementById("postSelect").value).get()
        ).data().title
      }"`
    );
    loadPosts();
  } catch (error) {
    console.error(`Error deleting post: ${error}`);
    alert(`Error deleting post: ${error}`);
  }
});
