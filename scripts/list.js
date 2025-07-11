/* SPDX-License-Identifier: MIT */
const db = firebase.firestore();
const postsRef = db.collection('posts');

function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'week', seconds: 604800 },
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
  const count = Math.floor(seconds / interval.seconds);
  if(count >= 1) {
    return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
  } else if(count <= -1) {
    return `in ${count} ${interval.label}${futureCount !== 1 ? 's' : ''}`;
  }
  }

  return 'just now';
}

async function loadList() {
  const ul = document.getElementById('list');
  ul.innerHTML = '';

  postsRef.orderBy('timestamp', 'desc')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        if(post.hide) return; // Skip hidden posts
        const li = document.createElement('li');

        const data = document.createElement('span');
        data.className = 'data';

        const timestamp = post.timestamp && post.timestamp.toDate ? post.timestamp.toDate() : new Date();
        const timestampAbbr = document.createElement('abbr');
        timestampAbbr.textContent = timeAgo(timestamp);
        timestampAbbr.title = timestamp;

        const author = document.createElement('span');
        author.textContent = post.author || 'Anonymous';
        author.className = 'author';

        data.appendChild(author);
        data.appendChild(document.createTextNode(' - '));
        data.appendChild(timestampAbbr);

        const title = document.createElement('span');
        title.className = 'title';

        const a = document.createElement('a');
        a.href = `post.html?i=${doc.id}`;
        a.textContent = post.title || doc.id;
        title.appendChild(a);

        li.appendChild(data);
        li.appendChild(title);
        li.appendChild(document.createElement('br'));

        ul.appendChild(li);
      });
    })
    .catch((error) => {
      console.error('Error getting documents: ', error);
    });
}

loadList();
