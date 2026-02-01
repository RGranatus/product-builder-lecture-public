// main.js

// Theme toggle function
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem('theme', newTheme); // Save theme preference
}

// Initial theme setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Default to dark theme if no preference is saved
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Expose functions globally for onclicks from HTML that are not inlined in the HTML
    window.toggleTheme = toggleTheme;
    window.generate = generate;
    window.handleSubmit = handleSubmit;
});


function getColorClass(n) {
  if (n <= 10) return "yellow";
  if (n <= 20) return "blue";
  if (n <= 30) return "red";
  if (n <= 40) return "gray";
  return "green";
}



function generateOneSet() {
  const set = new Set();
  while (set.size < 6) set.add(Math.floor(Math.random() * 45) + 1);
  return [...set].sort((a, b) => a - b);
}



function generate() {
  const result = document.getElementById("result");
  result.innerHTML = "";



  for (let i = 0; i < 5; i++) {
    const nums = generateOneSet();



    const card = document.createElement("div");
    card.className = "set-card";
    card.style.animationDelay = `${i * 0.15}s`;



    card.innerHTML = `

      <div class="set-header">

        <div class="set-badge">SET ${String(i + 1).padStart(2, "0")}</div>

      </div>

      <div class="set">

        ${nums.map(n => `<div class="ball ${getColorClass(n)}">${n}</div>`).join("")}

      </div>

    `;



    result.appendChild(card);
  }
}



// Formspree Submission

const form = document.getElementById('contact-form');

const formStatus =
 document.getElementById('form-status');



async function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  try {
    const response = await fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    });
    if (response.ok) {
      formStatus.innerHTML = "문의가 성공적으로 전송되었습니다. 감사합니다!";
      form.reset();
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
        } else {
          formStatus.innerHTML = "おっと！フォームの送信で問題が発生しました。";
        }
      })
    }
  } catch (error) {
    formStatus.innerHTML = "おっと！フォームの送信で問題が発生しました。";
  }
}

form.addEventListener("submit", handleSubmit)