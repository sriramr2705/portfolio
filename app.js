// Update this profile object as Sriram shares more details.
const profile = {
  skills: ["HTML", "CSS", "Java"],
  projects: [],
  email: "",
};

const skillList = document.querySelector("#skill-list");
const skillsNote = document.querySelector("#skills-note");
const projectGrid = document.querySelector("#project-grid");
const projectsNote = document.querySelector("#projects-note");
const projectCount = document.querySelector(".project-count");

if (profile.skills.length) {
  skillsNote.hidden = true;
  profile.skills.forEach((skill) => {
    const chip = document.createElement("span");
    chip.className = "skill-chip";
    chip.textContent = skill;
    skillList.append(chip);
  });
}

if (profile.projects.length) {
  projectsNote.hidden = true;
  projectCount.textContent = `[ 01 — ${String(profile.projects.length).padStart(2, "0")} ]`;
  profile.projects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card";
    const tags = (project.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    card.innerHTML = `<div class="project-top"><span>PROJECT / ${String(index + 1).padStart(2, "0")}</span><span class="project-arrow" aria-hidden="true">↗</span></div><div class="project-visual ${index % 2 ? "circle-art" : "grid-art"}" aria-hidden="true"></div><div><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.description)}</p><div class="project-tags">${tags}</div></div>`;
    projectGrid.append(card);
  });
}

if (profile.email) {
  const emailLink = document.querySelector("#email-link");
  emailLink.href = `mailto:${profile.email}`;
  emailLink.innerHTML = `Send me an email <span aria-hidden="true">↗</span>`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

// Mobile navigation
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  nav.classList.toggle("open", open);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}));

// Reveal page sections as they enter the viewport.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll(".section-heading, .about-copy, .skills-panel, .project-card, .education-card, .contact-card").forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

// Lightweight canvas constellation: pointer movement gently bends nearby points.
const canvas = document.querySelector("#constellation");
const context = canvas.getContext("2d");
const pointer = { x: -1000, y: -1000, active: false };
let width = 0;
let height = 0;
let points = [];
let animationFrame = 0;
const random = (min, max) => Math.random() * (max - min) + min;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const amount = Math.min(95, Math.max(28, Math.round((width * height) / 10500)));
  points = Array.from({ length: amount }, () => ({ x: random(0, width), y: random(0, height), ox: 0, oy: 0, vx: random(-0.13, 0.13), vy: random(-0.13, 0.13), r: random(0.7, 1.8) }));
  points.forEach((point) => { point.ox = point.x; point.oy = point.y; });
}

function draw() {
  context.clearRect(0, 0, width, height);
  const reach = width < 620 ? 92 : 135;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (!reduceMotion) {
      point.ox += point.vx;
      point.oy += point.vy;
      if (point.ox < 0 || point.ox > width) point.vx *= -1;
      if (point.oy < 0 || point.oy > height) point.vy *= -1;
    }
    let x = point.ox;
    let y = point.oy;
    if (pointer.active) {
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < reach && distance > 0) {
        const force = (1 - distance / reach) * (reduceMotion ? 8 : 19);
        x += (dx / distance) * force;
        y += (dy / distance) * force;
      }
    }
    point.x = x;
    point.y = y;
    for (let j = i + 1; j < points.length; j++) {
      const other = points[j];
      const distance = Math.hypot(x - other.x, y - other.y);
      if (distance < 92) {
        context.strokeStyle = `rgba(117,217,207,${(1 - distance / 92) * 0.14})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }
    context.fillStyle = pointer.active && Math.hypot(x - pointer.x, y - pointer.y) < reach ? "rgba(196,239,115,.8)" : "rgba(180,214,204,.46)";
    context.beginPath();
    context.arc(x, y, point.r, 0, Math.PI * 2);
    context.fill();
  }
  if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
}

function onPointerMove(event) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
  document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
  if (reduceMotion) draw();
}

window.addEventListener("pointermove", onPointerMove, { passive: true });
window.addEventListener("blur", () => { pointer.active = false; if (reduceMotion) draw(); });
window.addEventListener("resize", () => { cancelAnimationFrame(animationFrame); resizeCanvas(); draw(); });
resizeCanvas();
draw();
