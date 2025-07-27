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

const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const converter = new showdown.Converter();

converter.setOption("strikethrough", true);
converter.setOption("tables", true);

auth.onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("loginLink").textContent = "Logout";
    document.getElementById("newPost").textContent = "New post";
    document.getElementById("editPost").textContent = "Edit post";
    document.getElementById("deletePost").textContent = "Delete post";
    document.getElementById("postEdit").disabled = false;

    alert(`Welcome back, ${user.email.split("@")[0]}`);
  }
});

// Auto-resize textarea as user types
function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function loadPosts() {
  postsRef
    .orderBy("timestamp", "desc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const post = doc.data();
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

editor.addEventListener("input", () => {
  preview.innerHTML = converter.makeHtml(editor.value);
  hljs.highlightAll();
  document.querySelectorAll(".content img").forEach((img) => {
    // Prevent wrapping if already inside a <figure>
    if (img.parentElement.tagName.toLowerCase() === "figure") return;

    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");

    figcaption.textContent = img.alt || ""; // or use img.title or a custom attribute
    img.parentNode.insertBefore(figure, img); // insert <figure> before <img>
    figure.appendChild(img); // move <img> inside <figure>
    figure.appendChild(figcaption); // add <figcaption> after <img>
  });
  autoResizeTextarea(editor);
});

// Optional: Trigger preview and auto-resize on page load
editor.dispatchEvent(new Event("input"));

document.getElementById("postEdit").addEventListener("click", async (e) => {
  const title = document.getElementById("postTitle").value;
  const content = editor.value;
  const hide = document.getElementById("postHide").checked;

  if (!title || !content) {
    alert("Please fill in the title and content before submitting.");
    return;
  }

  try {
    await postsRef.doc(document.getElementById("postSelect").value).set(
      {
        title: title,
        lastEdited: firebase.firestore.FieldValue.serverTimestamp(),
        content: content,
        hide: hide,
      },
      { merge: true }
    );
    alert(`Post edited: "${title}"`);
    window.location.href = "/index.html";
    document.getElementById("postTitle").value = "";
    editor.value = "";
    document.getElementById("postHide").checked = false;
  } catch (error) {
    console.error(`Error editing post: ${error}`);
    alert(`Error editing post: ${error}`);
  }
});
document.getElementById("downloadMd").addEventListener("click", () => {
  const userEmail = auth.currentUser.email || "Anonymous";

  const postTitle = document.getElementById("postTitle").value;
  const postAuthor =
    document.getElementById("postAuthor").value || userEmail.split("@")[0];
  const postContent = editor.value;
  const postHide = document.getElementById("postHide").checked;

  if (!postTitle || !postContent) {
    alert("Please fill in the title and content before downloading.");
    return;
  }

  const markdownContent = `<!-- Title: ${postTitle} -->\n<!-- Author: ${postAuthor} -->\n<!-- Hide: ${postHide} -->\n${postContent}`;
  const blob = new Blob([markdownContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${postTitle.replace(/ /g, "_")}-${Math.random()
    .toString(36)
    .slice(2, 7)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
document.getElementById("postSelect").addEventListener("change", async (e) => {
  const postId = e.target.value;
  if (!postId) return;
  try {
    const postDoc = await postsRef.doc(postId).get();
    if (postDoc.exists) {
      const post = postDoc.data();
      document.getElementById("postTitle").value = post.title || "";
      editor.value = post.content || "";
      document.getElementById("postHide").checked = post.hide || false;

      // Update preview
      preview.innerHTML = converter.makeHtml(editor.value);
      hljs.highlightAll();
      document.querySelectorAll(".content img").forEach((img) => {
        // Prevent wrapping if already inside a <figure>
        if (img.parentElement.tagName.toLowerCase() === "figure") return;

        const figure = document.createElement("figure");
        const figcaption = document.createElement("figcaption");

        figcaption.textContent = img.alt || ""; // or use img.title or a custom attribute
        img.parentNode.insertBefore(figure, img); // insert <figure> before <img>
        figure.appendChild(img); // move <img> inside <figure>
        figure.appendChild(figcaption); // add <figcaption> after <img>
      });
      autoResizeTextarea(editor);
    } else {
      alert("Post not found.");
    }
  } catch (error) {
    console.error(`Error loading post: ${error}`);
    alert(`Error loading post: ${error}`);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const mdFileInput = document.getElementById("mdFile");
  if (mdFileInput) {
    mdFileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const text = e.target.result;

          // Parse metadata
          const titleMatch = text.match(/<!--\s*Title:\s*([^-]+?)\s*-->/i);
          const authorMatch = text.match(/<!--\s*Author:\s*([^-]+?)\s*-->/i);
          const hideMatch = text.match(/<!--\s*Hide:\s*(true|false)\s*-->/i);

          if (titleMatch)
            document.getElementById("postTitle").value = titleMatch[1].trim();
          if (hideMatch)
            document.getElementById("postHide").checked =
              hideMatch[1].trim().toLowerCase() === "true";

          // Remove metadata from content for editor
          const content = text.replace(/<!--[\s\S]*?-->\s*/g, "").trim();
          editor.value = content;

          // Update preview and auto-resize
          preview.innerHTML = converter.makeHtml(editor.value);
          hljs.highlightAll();
          autoResizeTextarea(editor);
        };
        reader.readAsText(file);
      }
    });
  }
});
