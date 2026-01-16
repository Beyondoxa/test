//------------ADD GOAT COUNTER------------
class GoatCounter extends HTMLElement {
    connectedCallback() {
        // Problem: Setting innerHTML with a <script> tag does not execute the script.
        // Solution: We must create the script element programmatically and append it.

        // 1. Check if the script has already been added to prevent duplicates
        if (document.head.querySelector('script[data-goatcounter]')) {
            // console.log("GoatCounter script already initialized.");
            return;
        }

        // 2. Create the script element
        const script = document.createElement('script');

        // 3. Set the required attributes
        // This attribute tells GoatCounter where to send the data.
        script.setAttribute('data-goatcounter', 'https://epicsteme.goatcounter.com/count');
        
        // The async attribute is required for non-blocking loading
        script.setAttribute('async', ''); 
        
        // Set the source URL
        script.src = '//gc.zgo.at/count.js';

        // 4. Append the script to the <head> of the document, 
        // which is the standard place for global tracking scripts.
        document.head.appendChild(script);

        // Optional: Hide the element itself as it doesn't need to be visible
        this.style.display = 'none';
    }
}

//------------IMPLEMENT GOAT COUNTER------------
customElements.define("goat-counter", GoatCounter);

//------------ADD HEADER NAVIGATION------------
class MyHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <header id="header">
        
        <nav class="navbar navbar-expand-lg py-0 mx-0 my-0" aria-label="Primary navigation">
            
            <a href="./" class="navbar-brand" aria-current="page">
                
                <h1 class="text-start" aria-hidden="true">
                    Beyondoxa
                </h1>
                
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#toggleMobileMenu" aria-controls="toggleMobileMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="toggleMobileMenu">
                <ul class="navbar-nav ms-auto" role="menubar">
                    <li class="ms-3 mb-3" role="none">
                        <a class="text-black hover-underline" href="./" role="menuitem"> Home </a>
                    </li>
                    <li class="ms-3 mb-3" role="none">
                        <a class="text-black hover-underline" href="blog.html" role="menuitem"> Blog </a>
                    </li>
                    <li class="ms-3 mb-3" role="none">
                        <a class="text-black hover-underline" href="literature.html" role="menuitem"> Literature </a>
                    </li>
                    <li class="ms-3 mb-3" role="none">
                        <a class="text-black hover-underline" href="3d-models.html" role="menuitem"> 3D Models </a>
                    </li>
                    <li class="ms-3 mb-3" role="none">
                        <a class="text-black hover-underline" href="https://pikonparadox.itch.io/" target="_blank" rel="noopener noreferrer" role="menuitem"> Games </a>
                    </li>
                    <li class="ms-3 mb-3" role="none">
                        <a class="text-black hover-underline" href="about.html" role="menuitem"> About </a>
                    </li>
                </ul>
            </div>
        </nav>
        <hr class="mt-0 mb-2">
    </header> `;
  }
}

//------------IMPLEMENT FUNCTION HEADER------------
customElements.define("my-header", MyHeader);

//

//------------ADD FOOTER NAVIGATION------------
class FooterNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<footer class="container-lg text-center mb-3" aria-label="Footer navigation">
    <hr class="container-lg">
    <nav aria-label="Footer site links">
        <ul class="list-inline mb-2" role="menubar">
            <li class="list-inline-item hover-underline" role="link"><a class="text-black" href="./" role="menuitem">Home</a></li>
            <li class="list-inline-item hover-underline" role="link"><a class="text-black" href="blog.html" role="menuitem">Blog</a></li>
            <li class="list-inline-item hover-underline" role="link"><a class="text-black" href="literature.html" role="menuitem">Literature</a></li>
            <li class="list-inline-item hover-underline" role="link"><a class="text-black" href="3d-models.html" role="menuitem">3D Models</a></li>
            <li class="list-inline-item hover-underline" role="link"><a class="text-black" href="https://pikonparadox.itch.io/" target="_blank" rel="noopener noreferrer" role="menuitem">Games</a></li>
            <li class="list-inline-item hover-underline" role="link"><a class="text-black" href="about.html" role="menuitem">About</a></li>
        </ul>
        
        <p class="text-muted">Website designed by Aditya</P>
    </nav>
</footer>
        `;
  }
}

//------------IMPLEMENT FUNCTION FOOTER------------
customElements.define("footer-nav", FooterNav);

//------------LOAD BOOTSTRAP CSS AND JS FROM A CDN------------
class SiteAssets extends HTMLElement {
  connectedCallback() {
    // Add Bootstrap CSS CDN
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

    // Add BOOTSTRAP JS CDN
    if (!document.getElementById("bootstrap-js-cdn")) {
      const script = document.createElement("script");
      script.id = "bootstrap-js-cdn";
      script.src =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js";
      script.integrity =
        "sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        // Dispatch a custom event when Bootstrap JS is loaded
        document.dispatchEvent(new Event("bootstrap:loaded"));
      };
      document.head.appendChild(script);
    } else {
      // If already loaded, dispatch immediately
      document.dispatchEvent(new Event("bootstrap:loaded"));
    }
  }
}

// ------------IMPLEMENT FUNCTION TO LOAD BOOTSTRAP ASSETS------------
customElements.define("site-assets", SiteAssets);

// ------------WAIT TO SHOW INDEX PAGE CONTENTS------------
// this seems to be tied to "fade-content" and "fade-content.visible" in custom.css
window.addEventListener("load", () => {
  // Fade in homeintro after 0.25 seconds (250 ms)
  setTimeout(() => {
    document.getElementById("homebody").classList.add("visible");
  }, 250);

  /* Fade in hometitles after 1.0 seconds (1000 ms)
  setTimeout(() => {
    document.getElementById("hometitles").classList.add("visible");
  }, 2000);*/
});

//------------LOOP CAROUSEL OF TITLES ON HOME PAGE------------
// List of titles to cycle through
const hometitles = [
  "Artist",
  "Writer",
  "Educator",
  "Antiphilosopher",
  "Indie Game Developer",
];

// Configuration variables (all times in milliseconds)
const homeTitlesFadeTime = 250; // duration of fade in/out
const hometitlesHoldTime = 2000; // time title stays fully visible
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
