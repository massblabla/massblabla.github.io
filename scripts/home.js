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

/* Number of MOTDs: 88 (89 if you count the commented MOTD).
 * Kinda of a misnomer, but it's ok, also there's 18 special MOTDs.
 * The MOTDs listed are licensed under CC-BY-SA 4.0 International, otherwise noted.
 * To be honest I wouldn't know why would you license MOTDs with licenses that differ from anything else.
 * But why not.
 * Any other code, is licensed under the MIT License.
 */
function loadMotd() {
  const today = new Date();

  const month = today.getMonth() + 1;
  const day = today.getDate();
  const date = month + "/" + day;

  const motdList = [
    //"<em><del>&Topf;&aopf;&lopf;&iopf;&topf;&hopf;&aopf; &Zopf;&aopf;&lopf;&fopf;&aopf; &Nopf;&aopf;&iopf;&fopf;&aopf;&hopf;</del></em>",
    '<a href="/admin/" class="motdlinks">DO NOT CLICK!</a>',
    "Should I call this a posthouse or a blog?",
    "Welcome to the darkest dungeon of&nbsp;<em>massblabla</em>.",
    "Ever tried Linux? If not, try it out!",
    "What's older — Microshaft Winblows or Michaelsoft Binbows?",
    "I have no idea what to put. Sorry.",
    '<q cite="https://parade.com/living/shower-thoughts">Why aren\'t iPhone chargers called Apple juice?</q>',
    '<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" class="motdlinks">A blast from the past — click if you dare!</a>',
    "Yes, of course.",
    "It's okay. It's okay.",
    "Chauffeur, chauffeur.",
    "Hey! I have a question: is the Windows 95 startup sound copyrighted? If it is, I’d be sad.",
    "I moved e4. What would you move?",
    '<q cite="https://parade.com/living/shower-thoughts">Firefly is the opposite of waterfall.</q>',
    "Again, I have no idea what to put. Sorry.",
    "If today is the first of the month, well, that's cool!",
    "What will you choose: posthouse or blog?",
    "Hot take: The Earth is a cube. (I'm joking.)",
    "Hot take: I love the Java programming language. (I'm not joking.)",
    '<span class="emoji">🇵🇸</span>',
    "Do you know how huge the set on&nbsp;<em>The Truman Show</em>&nbsp;is? I don’t.",
    "I think using <code>archinstall</code> is blasphemy.",
    "&Topf;&hopf;&iopf;&sopf;&nbsp;&iopf;&sopf;&nbsp;&copf;&oopf;&oopf;&lopf;.",
    "If you look at the code, you'll see a hidden MOTD you weren’t supposed to see.",
    "<em>missingno</em>",
    "No.",
    "&lt;!DOCTYPE html&gt;",
    "Stop it. Get some help.",
    "BUT IF YOU CLOSE YOUR EYES...",
    "Schrödinger's MOTD: It both exists and doesn't — until you read it.",
    "Everything is a hack until proven elegant.",
    "Brain.exe has stopped working. Please restart your day.",
    "Trust me, I'm a compiler. (Just kidding. Don’t.)",
    "Overclocked thoughts detected. System overheating.",
    "If life had respawns, I’d still be stuck in the tutorial.",
    "Why is Minecraft called Minecraft? Because mining is a&nbsp;<em>blocky</em>&nbsp;business.",
    "Loading... Please wait. (Just like my social life.)",
    "Press F to pay respects to my productivity.",
    "Keep calm and blame the lag.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "There are 10 types of people in the world: those who understand binary and those who don't.",
    "<code>git push --force</code>: Because sometimes you have commitment issues.",
    "Segmentation fault: the developer’s “You shall not pass!”",
    "Why did the programmer quit his job? Because he didn’t get arrays.",
    "It’s not a bug — it’s an undocumented feature. Welcome to open source.",
    "In Java we trust — except when it throws <code>NullPointerException</code>.",
    "Remember, kids: semicolons save lives;",
    "Refresh again and I’ll CSS-transform your soul.",
    "Every time you load this, I gain a little more power.",
    "One more click, and we enter the forbidden branch.",
    "I know you're just here for the MOTDs. I see you.",
    "<em>massblabla</em>&nbsp;is watching. Always watching.",
    "I put “AI-generated” on my thoughts so no one questions me.",
    "Currently accepting bug reports, compliments, and soup.",
    "My opinions are valid because I shouted them into HTML.",
    "The button does nothing. I just like buttons.",
    "Welcome back. The blog missed you. It also rewrote itself.",
    "This site runs on hopes, dreams, and spaghetti code.",
    "Welcome. Please don't touch anything. Especially&nbsp;<em>that</em>.",
    "404 braincells not found.",
    "You thought this was deep. It's just CSS.",
    "This message will self-destruct in 5... oh wait, JavaScript broke.",
    "I read the source code. It read me back.",
    "This MOTD is sponsored by nobody.",
    "100% blog. 0% nutritional value.",
    "Did you know? Neither did I.",
    "I once tried to fix a bug. Now I live here.",
    "𝙷𝚎𝚕𝚕𝚘, 𝚠𝚘𝚛𝚕𝚍.𝙹𝚂",
    "𝘛𝘩𝘪𝘯𝘬 𝘖𝘶𝘵𝘴𝘪𝘥𝘦 𝘛𝘩𝘦 &lt;𝘋𝘪𝘷&gt;",
    "✧･ﾟ: *✧･ﾟ:* Welcome *:･ﾟ✧*:･ﾟ✧",
    "⟪⟦ΞΞΞ posthouse.exe ⟧⟫",
    "⧉ Reality not included.",
    "∿ Waiting for meaning...",
    "This is an MOTD. It doesn't&nbsp;<em>have</em>&nbsp;to make sense.",
    "If you're reading this, the site loaded. Congrats!",
    "This is where the cool content would go. Hypothetically.",
    "Welcome to posthouse. It’s like a blog, but more chaotic.",
    "Insert clever message here.",
    "I'm a string in a JavaScript array. Send help.",
    "Have you considered the void today?",
    "Just you, me, and this lonely little&nbsp;<code>&lt;div&gt;</code>.",
    "Are we in a blog, or is the blog inside us?",
    "Objects in mirror are less meaningful than they appear.",
    "The real post was the friends we made along the way.",
    "I speak fluent&nbsp;<code>404</code>.",
    "<code>Error 200</code>: Everything's fine. Probably.",
    "Welcome back. The code still hates you.",
    "0 bugs found. 12 new features accidentally created.",
    "Certified Arch Linux installation trauma survivor.",
    "You don't&nbsp;<em>run</em>&nbsp;the terminal. The terminal runs you.",
    '<span style="color: red; font-weight: bold;">WARNING: This site contains traces of your lost time. Proceed with caution.</span>',
    "This MOTD is brought to you by procrastination.",
  ];
  const specialDates = [
    "1/1",
    "1/2",
    "1/3",
    "1/7",
    "2/14",
    "2/29",
    "4/1",
    "4/22",
    "5/1",
    "6/19",
    "7/4",
    "7/20",
    "9/10",
    "9/11",
    "10/31",
    "11/1",
    "12/24",
    "12/25",
    "12/26",
  ];
  const specialMotds = [
    "happy gregorian new year!",
    "happy gregorian new year...!?",
    "happy gregorian new year.",
    "happy celebrating christmas..., to the orthodox christians!",
    "happy valentine's",
    "how rare are february 29 birthdays? anyways, happy leap year!!!!!",
    "hear me out, you shalln't be here",
    'HAPPY EARTH DAY!!! <span class="emoji">🌍🌍🌍🌍🌍</span>',
    "Workers of the world, unite! You have nothing to lose but your chains! &mdash; Karl Marx | it's mental health month!",
    "..., all slaves are free. ...",
    '<span class="emoji">🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅🦅</span>',
    "it's the moonlanding! yay!!!",
    'If you\'re struggling, please stay. Your life&nbsp;<em>still</em>&nbsp;matters. <span class="emoji">💜</span>',
    'remembering the lives lost at 9/11 <span class="emoji">🤍</span>',
    "wait for a day",
    "it's all saints' day!!!",
    "it's christmas eve! yay!!!",
    "happy celebrating christmas!!!!!!!!!!!!!!",
    '<a href="https://tiktok.com/@thaandus" class="motdlinks">it\'s boxing day alias christmas marrow</a>.',
  ];

  const index = specialDates.indexOf(date);
  let motd;

  if (index !== -1) {
    motd = specialMotds[index];
  } else {
    motd = motdList[Math.trunc(Math.random() * motdList.length)];
  }
  const welcomediv = document.querySelector("#motd");
  welcomediv.innerHTML = motd;
}

loadMotd();
