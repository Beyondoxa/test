"use strict";

/* =========================================================
   DYATI
   Site JavaScript
   ========================================================= */


/* =========================================================
   SHARED HEADER
   ========================================================= */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    if (this.hasChildNodes()) {
      return;
    }

    this.innerHTML = `
      <header class="site-header" id="site-header">
        <div class="site-header-inner">
          <a
            class="site-brand"
            href="#main-content"
            aria-label="Dyati home"
          >
            Dyati
          </a>

          <nav
            class="site-navigation"
            aria-label="Primary navigation"
          >
            <a href="#art">Art</a>
            <a href="#literature">Literature</a>
          </nav>
        </div>
      </header>
    `;
  }
}

if (!customElements.get("site-header")) {
  customElements.define("site-header", SiteHeader);
}


/* =========================================================
   SHARED FOOTER
   ========================================================= */

class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.hasChildNodes()) {
      return;
    }

    this.innerHTML = `
      <footer class="site-footer" id="site-footer">
        <nav aria-label="Footer navigation">
          <a href="#main-content">Back to top</a>
          <a href="#art">Art</a>
          <a href="#literature">Literature</a>
        </nav>
      </footer>
    `;
  }
}

if (!customElements.get("site-footer")) {
  customElements.define("site-footer", SiteFooter);
}


/* =========================================================
   LITERATURE ACCORDIONS
   ========================================================= */

function initializeAccordions() {
  const buttons = document.querySelectorAll(
    ".toggle-section-button, .toggle-article-button"
  );

  buttons.forEach((button) => {
    const targetId = button.getAttribute("aria-controls");

    if (!targetId) {
      return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    if (button.dataset.accordionInitialized === "true") {
      return;
    }

    button.dataset.accordionInitialized = "true";

    const initiallyExpanded =
      button.getAttribute("aria-expanded") === "true";

    target.hidden = !initiallyExpanded;

    button.addEventListener("click", () => {
      const isExpanded =
        button.getAttribute("aria-expanded") === "true";

      const nextState = !isExpanded;

      button.setAttribute(
        "aria-expanded",
        String(nextState)
      );

      target.hidden = !nextState;
    });
  });
}


/* =========================================================
   ARTWORK LIGHTBOX
   ========================================================= */

function initializeLightbox() {
  const lightbox = document.getElementById(
    "artwork-lightbox"
  );

  const image = document.getElementById(
    "lightbox-image"
  );

  const closeButton = document.querySelector(
    ".lightbox-close"
  );

  const triggers = document.querySelectorAll(
    ".artwork-trigger"
  );

  if (
    !lightbox ||
    !image ||
    !closeButton ||
    !triggers.length
  ) {
    return;
  }

  let lastTrigger = null;
  let previousBodyOverflow = "";
  let previousHtmlOverflow = "";

  function openLightbox(trigger) {
    const source = trigger.dataset.lightboxSrc;

    if (!source) {
      return;
    }

    lastTrigger = trigger;

    image.src = source;
    image.alt = trigger.dataset.lightboxAlt || "";

    previousBodyOverflow =
      document.body.style.overflow;

    previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");

    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow =
      previousBodyOverflow;

    document.documentElement.style.overflow =
      previousHtmlOverflow;

    window.setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) {
        image.removeAttribute("src");
        image.alt = "";
      }
    }, 200);

    if (
      lastTrigger &&
      document.contains(lastTrigger)
    ) {
      lastTrigger.focus();
    }

    lastTrigger = null;
  }

  triggers.forEach((trigger) => {
    if (
      trigger.dataset.lightboxInitialized === "true"
    ) {
      return;
    }

    trigger.dataset.lightboxInitialized = "true";

    trigger.addEventListener("click", () => {
      openLightbox(trigger);
    });
  });

  closeButton.addEventListener(
    "click",
    closeLightbox
  );

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      lightbox.classList.contains("is-open")
    ) {
      event.preventDefault();
      closeLightbox();
    }
  });
}


/* =========================================================
   HOME TITLE ROTATION
   ========================================================= */

function initializeHomeTitleRotation() {
  const titleElement = document.getElementById(
    "home-title-cycle"
  );

  if (!titleElement) {
    return;
  }

  const titles = [
    "Artist",
    "Author",
    "Teacher",
    "Philosopher",
    "Research Scholar",
    "Indie Game Developer",
  ];

  const fadeDuration = 250;
  const displayDuration = 1250;
  const intervalDuration =
    fadeDuration * 2 + displayDuration;

  let titleIndex = 0;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function showNextTitle() {
    titleElement.textContent =
      titles[titleIndex];

    if (reducedMotion.matches) {
      titleIndex =
        (titleIndex + 1) % titles.length;

      window.setTimeout(
        showNextTitle,
        intervalDuration
      );

      return;
    }

    titleElement.style.opacity = "1";

    window.setTimeout(() => {
      titleElement.style.opacity = "0";
    }, displayDuration);

    window.setTimeout(() => {
      titleIndex =
        (titleIndex + 1) % titles.length;

      showNextTitle();
    }, displayDuration + fadeDuration);
  }

  titleElement.style.transition =
    `opacity ${fadeDuration}ms ease`;

  showNextTitle();
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeSite() {
  initializeAccordions();
  initializeLightbox();
  initializeHomeTitleRotation();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeSite,
    { once: true }
  );
} else {
  initializeSite();
}