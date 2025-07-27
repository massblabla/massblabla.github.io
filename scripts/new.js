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
    document.getElementById("postNew").disabled = false;

    alert(`Welcome back, ${user.email.split("@")[0]}`);
  }
});

// Auto-resize textarea as user types
function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

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

document.getElementById("postNew").addEventListener("click", async (e) => {
  const title = document.getElementById("postTitle").value;
  const author =
    document.getElementById("postAuthor").value ||
    (auth.currentUser ? auth.currentUser.email.split("@")[0] : "Anonymous");
  const content = editor.value;
  const hide = document.getElementById("postHide").checked;

  if (!title || !content) {
    alert("Please fill in the title and content before submitting.");
    return;
  }

  try {
    const post = await postsRef.add({
      title: title,
      author: author,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      content: content,
      hide: hide,
    });
    alert(`Post created: "${title}"`);
    window.location.href = "/index.html";
    document.getElementById("postTitle").value = "";
    document.getElementById("postAuthor").value = "";
    editor.value = "";
    document.getElementById("postHide").checked = false;
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    alert(`Error creating post: ${error}`);
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
          if (authorMatch)
            document.getElementById("postAuthor").value = authorMatch[1].trim();
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
