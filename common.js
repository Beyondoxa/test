// =========================================================
// DYATI — COMMON SITE JAVASCRIPT
// =========================================================

/* ---------- GoatCounter ---------- */

class GoatCounter extends HTMLElement {
  connectedCallback() {
    if (document.head.querySelector("script[data-goatcounter]")) {
      return;
    }

    const script = document.createElement("script");

    script.setAttribute(
      "data-goatcounter",
      "https://epicsteme.goatcounter.com/count"
    );

    script.setAttribute("async", "");
    script.src = "//gc.zgo.at/count.js";

    document.head.appendChild(script);

    this.style.display = "none";
  }
}

customElements.define("goat-counter", GoatCounter);


/* ---------- Shared Header ---------- */

class MyHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header" id="site-header">
        <div class="site-header-inner">

          <a
            class="site-brand"
            href="./"
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

customElements.define("my-header", MyHeader);


/* ---------- Shared Footer ---------- */

class FooterNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer
        class="site-footer"
        id="site-footer"
        role="contentinfo"
      >

        <p>
          Contact me on
          <a
            href="https://signal.org/download/"
            rel="noopener"
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

customElements.define("footer-nav", FooterNav);


/* ---------- Bootstrap ---------- */

class SiteAssets extends HTMLElement {
  connectedCallback() {

    // Load Bootstrap CSS
    if (!document.getElementById("bootstrap-css-cdn")) {

      const link = document.createElement("link");

      link.id = "bootstrap-css-cdn";
      link.rel = "stylesheet";

      link.href =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css";

      link.integrity =
        "sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr";

      link.crossOrigin = "anonymous";

      document.head.appendChild(link);
    }


    // Load Bootstrap JavaScript
    if (!document.getElementById("bootstrap-js-cdn")) {

      const script = document.createElement("script");

      script.id = "bootstrap-js-cdn";

      script.src =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js";

      script.integrity =
        "sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q";

      script.crossOrigin = "anonymous";

      document.head.appendChild(script);
    }
  }
}

customElements.define("site-assets", SiteAssets);


/* =========================================================
   ACCORDION BEHAVIOR
   ========================================================= */

function initializeAccordions() {

  /*
   * Literature category accordions
   */

  document
    .querySelectorAll(".toggle-section-btn")
    .forEach((button) => {

      const targetId =
        button.getAttribute("aria-controls");

      const target =
        document.getElementById(targetId);

      if (!target) {
        return;
      }

      const expanded =
        button.getAttribute("aria-expanded") === "true";

      target.hidden = !expanded;

      target.setAttribute(
        "aria-hidden",
        String(!expanded)
      );


      button.addEventListener("click", () => {

        const nextState =
          button.getAttribute("aria-expanded") !== "true";

        button.setAttribute(
          "aria-expanded",
          String(nextState)
        );

        target.hidden = !nextState;

        target.setAttribute(
          "aria-hidden",
          String(!nextState)
        );

      });

    });


  /*
   * Individual poem / story accordions
   */

  document
    .querySelectorAll(".toggle-article-btn")
    .forEach((button) => {

      const targetId =
        button.getAttribute("aria-controls");

      const target =
        document.getElementById(targetId);

      if (!target) {
        return;
      }

      const expanded =
        button.getAttribute("aria-expanded") === "true";

      target.hidden = !expanded;

      target.setAttribute(
        "aria-hidden",
        String(!expanded)
      );


      button.addEventListener("click", () => {

        const nextState =
          button.getAttribute("aria-expanded") !== "true";

        button.setAttribute(
          "aria-expanded",
          String(nextState)
        );

        target.hidden = !nextState;

        target.setAttribute(
          "aria-hidden",
          String(!nextState)
        );

      });

    });

}


/* =========================================================
   SMOOTH SECTION NAVIGATION
   ========================================================= */

function initializeSectionNavigation() {

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const id =
          link.getAttribute("href");

        const target =
          document.querySelector(id);

        if (!target) {
          return;
        }

        event.preventDefault();

        const reducedMotion =
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

        target.scrollIntoView({
          behavior: reducedMotion
            ? "auto"
            : "smooth",

          block: "start"
        });

        history.replaceState(
          null,
          "",
          id
        );

      });

    });

}


/* =========================================================
   ARTWORK LIGHTBOX
   ========================================================= */

function initializeLightbox() {

  const lightbox =
    document.getElementById("lightbox");

  const image =
    document.getElementById("lightbox-image");

  const closeButton =
    document.querySelector(".lightbox-close");


  if (
    !lightbox ||
    !image ||
    !closeButton
  ) {
    return;
  }


  let lastTrigger = null;


  /*
   * Close the lightbox
   */

  const close = () => {

    lightbox.classList.remove("is-open");

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    image.removeAttribute("src");
    image.removeAttribute("alt");


    /*
     * Return keyboard focus to
     * the artwork that opened it.
     */

    if (lastTrigger) {
      lastTrigger.focus();
    }

  };


  /*
   * Open artwork
   */

  document
    .querySelectorAll(".artwork-trigger")
    .forEach((trigger) => {

      trigger.addEventListener(
        "click",
        () => {

          lastTrigger = trigger;


          image.src =
            trigger.dataset.lightboxSrc;


          image.alt =
            trigger.dataset.lightboxAlt || "";


          lightbox.classList.add(
            "is-open"
          );


          lightbox.setAttribute(
            "aria-hidden",
            "false"
          );


          closeButton.focus();

        }
      );

    });


  /*
   * Close button
   */

  closeButton.addEventListener(
    "click",
    close
  );


  /*
   * Clicking outside the image closes
   * the lightbox.
   */

  lightbox.addEventListener(
    "click",
    (event) => {

      if (event.target === lightbox) {
        close();
      }

    }
  );


  /*
   * Escape key closes the lightbox.
   */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        !lightbox.classList.contains(
          "is-open"
        )
      ) {
        return;
      }


      if (event.key === "Escape") {
        close();
      }

    }
  );

}


/* =========================================================
   INITIALIZE SITE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeAccordions();

    initializeSectionNavigation();

    initializeLightbox();

  }
);