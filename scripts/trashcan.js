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

function updateActionButtonsState() {
  const checkboxes = document.querySelectorAll("#list input[type='checkbox']");
  const checked = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
  const count = checked.length;

  const deleteBtn = document.getElementById("deleteSelected");
  const restoreBtn = document.getElementById("restoreSelected");

  deleteBtn.disabled = count === 0;
  restoreBtn.disabled = count === 0;

  document.getElementById("deleteCount1").textContent = count;
  document.getElementById("deleteCount2").textContent = count;
}

async function loadList() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";

  postsRef
    .orderBy("timeTrashed", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        if (!post.trashed) return; // Skip not trashed posts
        const li = document.createElement("li");

        const checkInput = document.createElement("input");
        checkInput.type = "checkbox";
        checkInput.value = doc.id;
        checkInput.id = `${doc.id}`;
        checkInput.addEventListener("change", updateActionButtonsState); // ✅ Watch for changes

        const label = document.createElement("label");
        label.htmlFor = checkInput.id;

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
        title.textContent = post.title || doc.id;

        label.appendChild(title);
        label.appendChild(data);
        label.appendChild(document.createElement("br"));

        li.appendChild(checkInput);
        li.appendChild(document.createTextNode(" "));
        li.appendChild(label);

        ul.appendChild(li);
      });

      updateActionButtonsState(); // ✅ Refresh button state after loading
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}

loadList();

document.getElementById("emptyTrash").addEventListener("click", async () => {
  if (
    confirm(
      "Are you sure you want to empty the trash can? This action cannot be undone."
    )
  ) {
    const batch = db.batch();
    postsRef
      .where("trashed", "==", true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .then(() => {
        alert("Trash can emptied.");
        loadList(); // Reload the list after emptying
      })
      .catch((error) => {
        console.error("Error emptying trash can: ", error);
        alert(`Error emptying trash can: ${error}`);
      });
  }
});

document.getElementById("restoreAll").addEventListener("click", async () => {
  if (confirm("Restore all trashed posts?")) {
    const batch = db.batch();
    postsRef
      .where("trashed", "==", true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          batch.set(
            doc.ref,
            { trashed: false, timeTrashed: null },
            { merge: true }
          );
        });
        return batch.commit();
      })
      .then(() => {
        alert("All trashed posts restored.");
        loadList();
      })
      .catch((error) => {
        console.error("Error restoring posts: ", error);
        alert(`Error restoring posts: ${error}`);
      });
  }
});

document
  .getElementById("deleteSelected")
  .addEventListener("click", async () => {
    const checkboxes = document.querySelectorAll(
      "#list input[type='checkbox']"
    );
    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        try {
          const postDoc = await postsRef.doc(checkbox.value).get();
          const title = postDoc.exists ? postDoc.data().title : checkbox.value;
          await postsRef.doc(checkbox.value).delete();
          alert(`Post deleted: "${title}"`);
        } catch (error) {
          console.error(`Error deleting post: ${error}`);
          alert(`Error deleting post: ${error}`);
        }
      }
    }
    loadList(); // Reload the list after deletion
  });

document
  .getElementById("restoreSelected")
  .addEventListener("click", async () => {
    const checkboxes = document.querySelectorAll(
      "#list input[type='checkbox']"
    );
    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        try {
          await postsRef.doc(checkbox.value).set(
            {
              trashed: false,
              timeTrashed: null,
            },
            { merge: true }
          );

          const postDoc = await postsRef.doc(checkbox.value).get();
          const title = postDoc.exists ? postDoc.data().title : checkbox.value;

          alert(`Post restored: "${title}"`);
        } catch (error) {
          console.error(`Error restoring post: ${error}`);
          alert(`Error restoring post: ${error}`);
        }
      }
    }
    loadList(); // Reload the list after restoration
  });
