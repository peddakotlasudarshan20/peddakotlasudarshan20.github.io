/* =====================================================
   PEDDAKOTLA SUDARSHAN — PORTFOLIO JS
   Three.js Hero | Typing | Scroll Reveals | Cursor||
   ===================================================== */

"use strict";

/* ── LOADER ── */
(function initLoader() {
  const el     = document.getElementById("loader");
  const bar    = document.getElementById("ldBar");
  const count  = document.getElementById("ldCount");
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 14 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(() => {
        el.classList.add("out");
        startReveal();
      }, 200);
    }
    bar.style.width = progress + "%";
    count.textContent = Math.floor(progress);
  }, 70);
})();

function startReveal() {
  // Hero elements are CSS-animated; kick off typing
  setTimeout(initTyping, 1400);
}

/* ── THREE.JS HERO ── */
(function initHero() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || typeof THREE === "undefined") return;

  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.z = 28;

  /* -- PARTICLES -- */
  const COUNT = 1200;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const palette   = [
    new THREE.Color(0x4DD0E1),  // teal
    new THREE.Color(0x60A5FA),  // electric blue
    new THREE.Color(0x2BB1BF),  // dark teal
    new THREE.Color(0x4DD0E1),  // more teal weight
    new THREE.Color(0x4DD0E1),
  ];

  for (let i = 0; i < COUNT; i++) {
    const s = 70;
    positions[i*3+0] = (Math.random()-0.5)*s;
    positions[i*3+1] = (Math.random()-0.5)*s;
    positions[i*3+2] = (Math.random()-0.5)*s * 0.4;
    const c = palette[Math.floor(Math.random()*palette.length)];
    colors[i*3+0] = c.r;
    colors[i*3+1] = c.g;
    colors[i*3+2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* -- WIREFRAME SHAPES -- */
  const mkWire = (geo, color, opacity) => {
    const m = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
    return new THREE.Mesh(geo, m);
  };

  const ico = mkWire(new THREE.IcosahedronGeometry(9, 1), 0x4DD0E1, 0.04);
  scene.add(ico);

  const oct = mkWire(new THREE.OctahedronGeometry(5, 0), 0x60A5FA, 0.05);
  oct.position.set(12, -3, -6);
  scene.add(oct);

  const torus = mkWire(new THREE.TorusGeometry(6, 1.5, 8, 24), 0x4DD0E1, 0.03);
  torus.position.set(-14, 4, -10);
  scene.add(torus);

  /* -- MOUSE -- */
  let mx = 0, my = 0;
  document.addEventListener("mousemove", e => {
    mx = (e.clientX/window.innerWidth  - 0.5) * 2;
    my = (e.clientY/window.innerHeight - 0.5) * 2;
  });

  /* -- RESIZE -- */
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* -- ANIMATE -- */
  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    t += 0.003;

    particles.rotation.y = t * 0.12 + mx * 0.0015;
    particles.rotation.x = t * 0.04 + my * 0.0015;

    ico.rotation.y   =  t * 0.35;
    ico.rotation.x   =  t * 0.18;
    oct.rotation.y   = -t * 0.55;
    oct.rotation.z   =  t * 0.28;
    torus.rotation.x =  t * 0.22;
    torus.rotation.z = -t * 0.18;

    renderer.render(scene, camera);
  })();
})();

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const dot    = document.getElementById("cur-dot");
  const ring   = document.getElementById("cur-ring");
  const label  = document.getElementById("cur-label");
  if (!dot) return;

  let cx = -100, cy = -100;
  let rx = -100, ry = -100;

  document.addEventListener("mousemove", e => {
    cx = e.clientX; cy = e.clientY;
    dot.style.left  = cx + "px";
    dot.style.top   = cy + "px";
    label.style.left = cx + "px";
    label.style.top  = cy + "px";
  });

  (function animRing() {
    rx += (cx - rx) * 0.10;
    ry += (cy - ry) * 0.10;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(animRing);
  })();

  // Hover targets
  document.querySelectorAll("[data-cursor-label], a, button").forEach(el => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-active");
      const lbl = el.getAttribute("data-cursor-label");
      if (lbl) label.textContent = lbl;
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-active");
      label.textContent = "";
    });
  });
})();

/* ── NAV ── */
(function initNav() {
  const nav  = document.getElementById("nav");
  const ham  = document.getElementById("navHam");
  const menu = document.getElementById("mobileMenu");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  ham.addEventListener("click", () => {
    const open = ham.classList.toggle("open");
    menu.classList.toggle("open", open);
  });

  menu.querySelectorAll(".mm-link").forEach(link => {
    link.addEventListener("click", () => {
      ham.classList.remove("open");
      menu.classList.remove("open");
    });
  });
})();

/* ── TYPING EFFECT ── */
function initTyping() {
  const el = document.getElementById("typed");
  if (!el) return;

  const phrases = [
    "Web Developer",
    "UI/UX Engineer",
    "MERN Stack Dev",
    "AI Tool Builder",
    "Problem Solver",
  ];
  let pi = 0, ci = 0, del = false;

  function tick() {
    const p = phrases[pi];
    if (!del) {
      el.textContent = p.slice(0, ++ci);
      if (ci === p.length) { del = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = p.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, del ? 42 : 72);
  }
  tick();
}

/* ── SCROLL REVEALS ── */
function initReveal() {
  const items = document.querySelectorAll(".reveal-item");

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = Number(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add("visible");
        el.style.transitionDelay = (delay / 1000) + "s";
      }, delay);
      io.unobserve(el);
    });
  }, { threshold: 0.08 });

  items.forEach(el => io.observe(el));

  /* Staggered reveals for list items */
  document.querySelectorAll(".tle-points li, .pi-stack span").forEach((item, idx) => {
    item.style.transitionDelay = (idx * 0.08) + "s";
  });

  /* Skill bar fills on reveal with easing */
  const sbObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(".sk-fill").forEach((fill, idx) => {
        setTimeout(() => { 
          fill.style.width = fill.dataset.w + "%";
          fill.style.transitionTimingFunction = "cubic-bezier(0.16, 1, 0.3, 1)";
        }, idx * 120);
      });
      sbObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".sk-group").forEach(g => sbObs.observe(g));
}

/* -------------------------------------------------
   SCROLL PROGRESS BAR
   ------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    bar.style.width = `${scrolled}%`;
  });
}

/* -------------------------------------------------
   SCROLL‑TO‑TOP BUTTON
   ------------------------------------------------- */
function initToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------------------------
   INITIALISE ALL
   ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // page load animation
  document.documentElement.classList.add('loaded');
  // existing init functions
  initReveal();
  initActiveNav();
  initScrollProgress();
  initToTop();
});

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const items = document.querySelectorAll(".ss-num[data-target]");

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = Number(el.dataset.target);
      const dur    = 1400;
      const step   = 16;
      let current  = 0;
      const inc    = target / (dur / step);

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current);
      }, step);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  items.forEach(el => io.observe(el));
})();

/* ── ACTIVE NAV ── */
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const links    = document.querySelectorAll(".nl");

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.nl[href="#${entry.target.id}"]`);
      if (active) active.classList.add("active");
    });
  }, { threshold: 0.45 });

  sections.forEach(s => io.observe(s));
}

/* ── SMOOTH SCROLL ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute("href"));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

/* ── CONTACT FORM ── */
(function initForm() {
  const form = document.getElementById("contactForm");
  const msg  = document.getElementById("cfMsg");
  const btn  = document.getElementById("cfSubmit");
  if (!form) return;

  // Ensure EmailJS is initialized (in case the HTML script tag hasn't run yet)
  if (typeof emailjs !== "undefined" && emailjs.init) {
    emailjs.init("pEMZnKQd0GYVXJw3V");
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const txt = btn.querySelector(".cfs-text");
    txt.textContent = "Sending…";
    btn.disabled = true;
    msg.classList.remove("show", "error");

    emailjs.sendForm("service_m41286a", "template_1idwrdx", form)
      .then(() => {
        msg.textContent = "✓ Message sent! I'll get back to you soon.";
        msg.classList.add("show");
        form.reset();
        txt.textContent = "Send Message";
        btn.disabled = false;
        setTimeout(() => msg.classList.remove("show"), 5000);
      })
      .catch(error => {
        msg.textContent = "Failed to send message. Please try again later.";
        msg.classList.add("show", "error");
        console.error(error);
        txt.textContent = "Send Message";
        btn.disabled = false;
      });
  });
})();

/* ── TILT ON PROJECT ITEMS ── */
(function initTilt() {
  document.querySelectorAll(".proj-item").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform     = `perspective(1000px) rotateY(${x*3}deg) rotateX(${-y*3}deg) translateZ(8px)`;
      card.style.transition    = "transform 0.04s linear";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform  = "";
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, background 0.4s";
    });
  });
})();
