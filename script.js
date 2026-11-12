if (!window.__phaladiAppInitialized) {
  window.__phaladiAppInitialized = true;

  document.addEventListener("DOMContentLoaded", () => {
    /* 1. STICKY HEADER */
    const header = document.getElementById("header") || document.querySelector("header");
    if (header) {
      const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* 2. 3-LINE MENU TOGGLE */
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    if (menuBtn && nav) {
      const setMenuOpen = (open) => {
        nav.classList.toggle("active", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        const icon = menuBtn.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-bars", !open);
          icon.classList.toggle("fa-xmark", open);
        }
      };

      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setMenuOpen(!nav.classList.contains("active"));
      });

      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
      });

      document.addEventListener("click", (e) => {
        if (nav.classList.contains("active") && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
          setMenuOpen(false);
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && nav.classList.contains("active")) {
          setMenuOpen(false);
        }
      });
    }

    /* 3. ACTIVE LINK HIGHLIGHT */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav a").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === currentPage);
    });

    /* 4. ANIMATED COUNTERS */
    const counters = document.querySelectorAll(".counter");
    if (counters.length > 0 && "IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            const target = Number(counter.dataset.target) || 0;
            const duration = 1600;
            const startTime = performance.now();

            const tick = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              counter.innerText = Math.floor(eased * target).toLocaleString();
              if (progress < 1) requestAnimationFrame(tick);
              else counter.innerText = target.toLocaleString();
            };

            requestAnimationFrame(tick);
            obs.unobserve(counter);
          });
        },
        { threshold: 0.35 }
      );
      counters.forEach((c) => counterObserver.observe(c));
    }

    /* 5. FORMSPREE CONTACT FORM */
    const form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let valid = true;

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const message = document.getElementById("message");
        const alertBox = document.getElementById("form-alert");
        const submitBtn = document.getElementById("submitBtn");

        document.getElementById("nameError").innerText = "";
        document.getElementById("emailError").innerText = "";
        document.getElementById("messageError").innerText = "";
        alertBox.innerHTML = "";

        if (!name || name.value.trim().length < 3) {
          document.getElementById("nameError").innerText = "Please enter your full name.";
          valid = false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          document.getElementById("emailError").innerText = "Please enter a valid email address.";
          valid = false;
        }
        if (!message || message.value.trim().length < 10) {
          document.getElementById("messageError").innerText = "Please enter at least 10 characters.";
          valid = false;
        }

        if (!valid) return;

        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

        try {
          const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" }
          });

          if (response.ok) {
            form.reset();
            alertBox.style.color = "#34D399";
            alertBox.innerText = "✓ Thank you. Your inquiry has been sent.";
          } else {
            alertBox.style.color = "#F87171";
            alertBox.innerText = "✕ Submission failed. Please verify your Formspree ID.";
          }
        } catch {
          alertBox.style.color = "#F87171";
          alertBox.innerText = "✕ Network error. Please check your connection.";
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }
      });
    }
  });
}

/* 6. MODALS */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

window.addEventListener("click", (e) => {
  document.querySelectorAll(".modal.show").forEach((modal) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.show").forEach((modal) => {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    });
  }
});