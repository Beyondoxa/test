/* =========================================================
   DYATI — COMMON SITE JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   GOATCOUNTER
   ========================================================= */

class GoatCounter extends HTMLElement {
  connectedCallback() {
    if (document.head.querySelector("script[data-goatcounter]")) {
      this.remove();
      return;
    }

    const script = document.createElement("script");

    script.dataset.goatcounter =
      "https://epicsteme.goatcounter.com/count";

    script.src = "https://gc.zgo.at/count.js";
    script.async = true;

    document.head.appendChild(script);

    this.remove();
  }
}

if (!customElements.get("goat-counter")) {
  customElements.define("goat-counter", GoatCounter);
}


/* =========================================================
   SHARED HEADER
   ========================================================= */

class MyHeader extends HTMLElement {
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
            class="site-nav"
            aria-label="Primary navigation"
          >
            <a href="#art">Art</a>
            <a href="#literature">Literature</a>
            <a href="#site-footer">Contact</a>
          </nav>

        </div>
      </header>
    `;
  }
}

if (!customElements.get("my-header")) {
  customElements.define("my-header", MyHeader);
}


/* =========================================================
   SHARED FOOTER
   ========================================================= */

class FooterNav extends HTMLElement {
  connectedCallback() {
    if (this.hasChildNodes()) {
      return;
    }

    this.innerHTML = `
      <footer
        class="site-footer"
        id="site-footer"
      >

        <p>
          Contact me on
          <a
            href="https://signal.org/download/"
            rel="noopener noreferrer"
          >
            Signal
          </a>
          @ klm.95
        </p>

        <nav aria-label="Footer navigation">
          <a href="#main-content">Back to top</a>
          <a href="#art">Art</a>
          <a href="#literature">Literature</a>
        </nav>

      </footer>
    `;
  }
}

if (!customElements.get("footer-nav")) {
  customElements.define("footer-nav", FooterNav);
}


/* =========================================================
   ACCORDIONS
   ========================================================= */

function initializeAccordions() {
  const buttons = document.querySelectorAll(
    ".toggle-section-btn, .toggle-article-btn"
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

    /*
     * Respect the initial aria-expanded value
     * already present in the HTML.
     */
    const initiallyExpanded =
      button.getAttribute("aria-expanded") === "true";

    target.hidden = !initiallyExpanded;

    /*
     * Prevent duplicate initialization if this function
     * is ever called again.
     */
    if (button.dataset.accordionInitialized === "true") {
      return;
    }

    button.dataset.accordionInitialized = "true";

    button.addEventListener("click", () => {
      const expanded =
        button.getAttribute("aria-expanded") === "true";

      const nextState = !expanded;

      button.setAttribute(
        "aria-expanded",
        String(nextState)
      );

      target.hidden = !nextState;
    });
  });
}


/* =========================================================
   SECTION NAVIGATION
   ========================================================= */

function initializeSectionNavigation() {
  const links = document.querySelectorAll(
    'a[href^="#"]'
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  links.forEach((link) => {
    if (link.dataset.navigationInitialized === "true") {
      return;
    }

    link.dataset.navigationInitialized = "true";

    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") {
        return;
      }

      const target = document.querySelector(id);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion.matches
          ? "auto"
          : "smooth",

        block: "start"
      });

      /*
       * pushState is avoided here.
       *
       * replaceState can interfere with browser navigation
       * expectations on mobile.
       */
      history.pushState(
        null,
        "",
        id
      );
    });
  });
}


/* =========================================================
   LIGHTBOX
   ========================================================= */

function initializeLightbox() {
  const lightbox =
    document.getElementById("lightbox");

  const image =
    document.getElementById("lightbox-image");

  const closeButton =
    document.querySelector(".lightbox-close");

  const triggers =
    document.querySelectorAll(".artwork-trigger");

  if (
    !lightbox ||
    !image ||
    !closeButton ||
    !triggers.length
  ) {
    return;
  }

  let lastTrigger = null;
  let previousOverflow = "";
  let previousHtmlOverflow = "";


  /* ---------- Open ---------- */

  function open(trigger) {
    const source =
      trigger.dataset.lightboxSrc;

    if (!source) {
      return;
    }

    lastTrigger = trigger;

    image.src = source;

    image.alt =
      trigger.dataset.lightboxAlt || "";

    previousOverflow =
      document.body.style.overflow;

    previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    lightbox.classList.add("is-open");

    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    closeButton.focus();
  }


  /* ---------- Close ---------- */

  function close() {
    lightbox.classList.remove("is-open");

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      previousOverflow;

    document.documentElement.style.overflow =
      previousHtmlOverflow;

    /*
     * Do not remove src immediately.
     * Firefox can visibly flash while the close
     * transition is happening.
     */
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


  /* ---------- Artwork buttons ---------- */

  triggers.forEach((trigger) => {
    if (
      trigger.dataset.lightboxInitialized === "true"
    ) {
      return;
    }

    trigger.dataset.lightboxInitialized = "true";

    trigger.addEventListener("click", () => {
      open(trigger);
    });
  });


  /* ---------- Close button ---------- */

  closeButton.addEventListener(
    "click",
    close
  );


  /* ---------- Background click ---------- */

  lightbox.addEventListener(
    "click",
    (event) => {
      if (event.target === lightbox) {
        close();
      }
    }
  );


  /* ---------- Escape ---------- */

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        lightbox.classList.contains("is-open")
      ) {
        event.preventDefault();
        close();
      }
    }
  );
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeSite() {
  initializeAccordions();
  initializeSectionNavigation();
  initializeLightbox();
}


/*
 * Because this script is loaded as type="module",
 * DOMContentLoaded is normally safe.
 *
 * The readyState check also makes this robust if
 * the loading strategy changes later.
 */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeSite,
    { once: true }
  );
} else {
  initializeSite();
}

//------------LOOP CAROUSEL OF TITLES ON HOME PAGE------------
// List of titles to cycle through
const hometitles = [
  "Artist",
  "Author",
  "Teacher",
  "Philosopher",
  "Research Scholar",
  "Indie Game Developer",
];

// Configuration variables (all times in milliseconds)
const homeTitlesFadeTime = 250; // duration of fade in/out
const hometitlesHoldTime = 1250; // time title stays fully visible
const homeTitlesWaitTime = 0; // time to wait before showing the next title

// Select the HTML element where the titles will appear
const titleEl = document.querySelector(".hometitles");

// Update the CSS transition property based on fadeTime
// This makes the fade duration dynamic based on our configuration
titleEl.style.transition = `opacity ${homeTitlesFadeTime / 1000}s`;

// Index to keep track of the current title in the array
let homeTitlesIndex = 0;

// Function to show the next title
function showNextTitle() {
  // Set the current title text
  titleEl.textContent = hometitles[homeTitlesIndex];

  // Fade in the title by setting opacity to 1
  titleEl.style.opacity = 1;

  // After the title has been visible for 'hometitlesHoldTime', start fading out
  setTimeout(() => {
    titleEl.style.opacity = 0; // fade out

    // Wait for the fade out to finish before moving to the next title
    setTimeout(() => {
      // Move to the next title in the array
      homeTitlesIndex = (homeTitlesIndex + 1) % hometitles.length;

      // Wait 'homeTitlesWaitTime' before starting fade-in for the next title
      setTimeout(showNextTitle, homeTitlesWaitTime);
    }, homeTitlesFadeTime); // this delay matches the fade-out duration
  }, hometitlesHoldTime); // this delay matches the hold duration
}
// Start the loop for cycling titles
showNextTitle();