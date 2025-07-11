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

auth.onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("admin").style.display = "inline";
  } else {
    document.getElementById("admin").style.display = "none";
  }
});

const db = firebase.firestore();

const postsRef = db.collection("posts");

function timeAgo(timestamp) {
  const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 4.348125 * week; // average month
  const year = 12 * month;

  if (diff < 0) return `posted a post in the future`;

  if (diff < minute) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  if (diff < hour)
    return `${Math.floor(diff / minute)} minute${
      Math.floor(diff / minute) !== 1 ? "s" : ""
    } ago`;
  if (diff < day)
    return `${Math.floor(diff / hour)} hour${
      Math.floor(diff / hour) !== 1 ? "s" : ""
    } ago`;
  if (diff < week)
    return `${Math.floor(diff / day)} day${
      Math.floor(diff / day) !== 1 ? "s" : ""
    } ago`;
  if (diff < month)
    return `${Math.floor(diff / week)} week${
      Math.floor(diff / week) !== 1 ? "s" : ""
    } ago`;
  if (diff < year)
    return `${Math.floor(diff / month)} month${
      Math.floor(diff / month) !== 1 ? "s" : ""
    } ago`;
  return `${Math.floor(diff / year)} year${
    Math.floor(diff / year) !== 1 ? "s" : ""
  } ago`;
}

function markdownToHTML(content) {
  const converter = new showdown.Converter();

  /* setting options */
  converter.setOption("strikethrough", true);
  converter.setOption("tables", true);

  const text = content;
  const html = converter.makeHtml(text);

  return html;
}

function wrapEmojis(text) {
  const regex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  return text.replace(regex, (match) => {
    return `<span class="emoji">${match}</span>`;
  });
}

async function loadPage() {
  const contentDiv = document.querySelector("#content");
  const titleDiv = document.querySelector("#title");
  const authorDiv = document.querySelector("#author");
  const timestampDiv = document.querySelector("#timestamp");

  // Get post ID from query string
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("i");
  if (!postId) {
    titleDiv.textContent = "Post not found.";
    return;
  }

  // Fetch post from Firestore
  try {
    const doc = await postsRef.doc(postId).get();
    if (!doc.exists) {
      titleDiv.textContent = "Post not found.";
      return;
    }
    const post = doc.data();

    // Title
    const titleSpan = document.createElement("span");
    if (post.hide) {
      titleSpan.textContent = `${post.title || postId} [HIDDEN]`;
    } else {
      titleSpan.textContent = post.title || postId;
    }
    titleDiv.appendChild(titleSpan);

    // Author
    const authorSpan = document.createElement("span");
    authorSpan.textContent = post.author || "Anonymous";
    authorDiv.appendChild(authorSpan);

    // Date/time
    let timestamp =
      post.timestamp && post.timestamp.toDate
        ? post.timestamp.toDate()
        : new Date();
    const timestampAbbr = document.createElement("abbr");
    timestampAbbr.textContent = timeAgo(timestamp);
    timestampAbbr.title = timestamp;
    timestampDiv.appendChild(timestampAbbr);

    // Content
    const content = wrapEmojis(markdownToHTML(post.content || ""));
    contentDiv.innerHTML = content;

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

    if (post.hide) {
      document.title = `massblabla's posthouse - ${
        post.title || postId
      } [HIDDEN]`;
    } else {
      document.title = post.title || postId;
    }
  } catch (error) {
    titleDiv.textContent = "Error loading post.";
    console.error(error);
  }
}

loadPage();
