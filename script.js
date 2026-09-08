document.body.classList.add("has-motion");

const previewTabs = document.querySelectorAll(".preview-tab");
const previewOverline = document.getElementById("preview-overline");
const previewTitle = document.getElementById("preview-title");
const previewDescription = document.getElementById("preview-description");
const previewList = document.getElementById("preview-list");
const previewCta = document.getElementById("preview-cta");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

const registerReveal = (item, index = 0) => {
  if (item.dataset.revealReady === "true") {
    return;
  }

  item.dataset.revealReady = "true";
  item.style.transitionDelay = `${index * 100}ms`;
  observer.observe(item);
};

const initReveals = (scope = document) => {
  scope.querySelectorAll(".reveal").forEach((item, index) => {
    registerReveal(item, index);
  });
};

initReveals();

const turntable = document.querySelector("[data-turntable]");

if (turntable) {
  const tonearm = turntable.querySelector(".tonearm");
  const vinyl = turntable.querySelector(".vinyl");
  const status = turntable.querySelector("[data-turntable-status]");
  let isDraggingTonearm = false;

  const setPlayback = (isPlaying) => {
    turntable.classList.toggle("is-playing", isPlaying);
    tonearm.setAttribute("aria-pressed", String(isPlaying));
    status.textContent = isPlaying ? "Now spinning / 33 1/3 RPM" : "Place needle to play";
  };

  const cueTonearm = (event) => {
    const tableRect = turntable.getBoundingClientRect();
    const pivotX = tableRect.right - tableRect.width * 0.09;
    const pivotY = tableRect.top + tableRect.height * 0.13;
    const dx = event.clientX - pivotX;
    const dy = event.clientY - pivotY;
    const rawAngle = (Math.atan2(-dy, -dx) * 180) / Math.PI;
    const normalizedAngle = rawAngle < 0 ? rawAngle + 360 : rawAngle;
    const angle = Math.min(345, Math.max(270, normalizedAngle));
    const recordRect = vinyl.getBoundingClientRect();
    const needleLength = tonearm.offsetWidth;
    const radians = (angle * Math.PI) / 180;
    const needleX = pivotX - needleLength * Math.cos(radians);
    const needleY = pivotY - needleLength * Math.sin(radians);
    const recordX = recordRect.left + recordRect.width / 2;
    const recordY = recordRect.top + recordRect.height / 2;
    const isOnRecord = Math.hypot(needleX - recordX, needleY - recordY) < recordRect.width / 2;

    tonearm.style.setProperty("--arm-angle", `${angle.toFixed(1)}deg`);
    setPlayback(isOnRecord);
  };

  tonearm.addEventListener("pointerdown", (event) => {
    isDraggingTonearm = true;
    tonearm.setPointerCapture(event.pointerId);
    cueTonearm(event);
  });

  tonearm.addEventListener("pointermove", (event) => {
    if (isDraggingTonearm) {
      cueTonearm(event);
    }
  });

  const releaseTonearm = (event) => {
    if (!isDraggingTonearm) {
      return;
    }

    isDraggingTonearm = false;
    tonearm.releasePointerCapture(event.pointerId);
  };

  tonearm.addEventListener("pointerup", releaseTonearm);
  tonearm.addEventListener("pointercancel", releaseTonearm);
  tonearm.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    setPlayback(!turntable.classList.contains("is-playing"));
  });
}

const previewContent = {
  experience: {
    overline: "Preview",
    title: "Experience",
    description:
      "Some of the places I've spent my time lately, from internships to research, in Chapel Hill and beyond!",
    items: [],
    href: "experience.html",
    ctaClass: "preview-cta-experience",
  },
  writing: {
    overline: "Preview",
    title: "Writing",
    description:
      "A small shelf of things I've written, mostly for the Daily Tar Heel! I'm hoping to start a blog so stay tuned :)",
    items: [],
    href: "writing.html",
    ctaClass: "preview-cta-writing",
  },
  "out-and-about": {
    overline: "Preview",
    title: "Out & About",
    description:
      "I'm grateful to have been featured in speaking engagements and articles at UNC. This is a space to collect the conversations, events, and moments where my work has shown up publicly.",
    items: [],
    href: "out-and-about.html",
    ctaClass: "preview-cta-out-and-about",
  },
};

if (
  previewTabs.length > 0 &&
  previewOverline &&
  previewTitle &&
  previewDescription &&
  previewList &&
  previewCta
) {
  const updatePreview = (key) => {
    const content = previewContent[key];
    if (!content) {
      return;
    }

    previewTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.preview === key);
    });

    previewOverline.textContent = content.overline;
    previewTitle.textContent = content.title;
    previewDescription.textContent = content.description;
    previewList.innerHTML = content.items.map((item) => `<li>${item}</li>`).join("");
    previewList.style.display = content.items.length > 0 ? "block" : "none";
    previewCta.href = content.href;
    previewCta.textContent = "Click to see more!";
    previewCta.className = `preview-cta ${content.ctaClass}`;
  };

  previewTabs.forEach((tab) => {
    const key = tab.dataset.preview;
    tab.addEventListener("mouseenter", () => updatePreview(key));
    tab.addEventListener("focus", () => updatePreview(key));
  });
}

const writingArticles = [
  {
    title: "Satire: What your campus bag says about you",
    publishedDate: "03/09/26",
    imageSrc: "assets/whatyourcampusbagsaysaboutyou.jpeg",
    imageAlt: "Illustration for Satire: What your campus bag says about you",
    href: "https://www.dailytarheel.com/article/4bb76654-eb71-4f27-b362-9c21d38ebca4",
  },
  {
    title: "Satire: A letter from Lady Belltower",
    publishedDate: "02/24/26",
    imageSrc: "assets/aletterfromladybelltower.jpeg",
    imageAlt: "Illustration for Satire: A letter from Lady Belltower",
    href: "https://www.dailytarheel.com/article/559de0e7-d602-4c2d-8984-4db95c407e87",
  },
  {
    title: "Satire: The Groundhog Industrial Complex disproves climate change",
    publishedDate: "02/05/26",
    imageSrc: "assets/groundhogindustrialcomplex.jpeg",
    imageAlt: "Illustration for Satire: The Groundhog Industrial Complex disproves climate change",
    href: "https://www.dailytarheel.com/article/ec1ccbe0-e0c9-477c-a5fd-bbb87813d3d9",
  },
  {
    title: "Keep your friends in the sun",
    publishedDate: "01/26/26",
    imageSrc: "assets/keepyourfriendinthesun.jpeg",
    imageAlt: "Illustration for Keep your friends in the sun",
    href: "https://www.dailytarheel.com/article/624b21c9-2c30-4148-83c0-dd9e5514465a",
  },
  {
    title: "All this before GTA 6?",
    publishedDate: "11/30/25",
    imageSrc: "assets/gta6.jpeg",
    imageAlt: "Illustration for All this before GTA 6?",
    href: "https://www.dailytarheel.com/article/c212ba2f-a76e-45ed-880c-0f66f0a03281",
  },
  {
    title: "When the (digital) cloud gets too cloudy",
    publishedDate: "10/30/25",
    imageSrc: "assets/digitalcloudtoocloudy.jpeg",
    imageAlt: "Illustration for When the (digital) cloud gets too cloudy",
    href: "https://www.dailytarheel.com/article/3d5c27a1-360a-45dd-8262-50f7f51cdb0c",
  },
  {
    title: "Hope is a discipline - Jane Goodall’s farewell to a fractured planet",
    publishedDate: "10/13/25",
    imageSrc: "assets/janegoodall.jpg",
    imageAlt: "Illustration for Hope is a discipline - Jane Goodall’s farewell to a fractured planet",
    href: "https://www.dailytarheel.com/article/7010e0d5-78b2-4776-9e0a-35572d2ccfeb",
  },
  {
    title: "Satire: Costco is coming to campus",
    publishedDate: "09/17/25",
    imageSrc: "assets/costcoiscomingtocampus.jpeg",
    imageAlt: "Illustration for Satire: Costco is coming to campus",
    href: "https://www.dailytarheel.com/article/a13631f2-2c9e-41e5-95bc-10e00afb1910",
  },
  {
    title: "Bring back the communal screen",
    publishedDate: "08/27/25",
    imageSrc: "assets/communalscreen.jpeg",
    imageAlt: "Illustration for Bring back the communal screen",
    href: "https://www.dailytarheel.com/article/6a3272e1-db57-4c0b-be6a-af486d645025",
  },
  {
    title: "Satire: UNC launches six campus representatives to space with Blue Origin",
    publishedDate: "04/24/25",
    imageSrc: "assets/blueorigin.jpeg",
    imageAlt: "Illustration for Satire: UNC launches six campus representatives to space with Blue Origin",
    href: "https://www.dailytarheel.com/article/012cceed-646c-4883-9213-d990cd4c0966",
  },
  {
    title: "North Carolina cannot afford to lose access to NOAA",
    publishedDate: "03/31/25",
    imageSrc: "assets/noaa.jpeg",
    imageAlt: "Illustration for North Carolina cannot afford to lose access to NOAA",
    href: "https://www.dailytarheel.com/article/77f04978-4161-40d1-9996-676cc8dacc00",
  },
  {
    title: "Not all art needs an audience",
    publishedDate: "03/05/25",
    imageSrc: "assets/notallartneedsanaudience.jpeg",
    imageAlt: "Illustration for Not all art needs an audience",
    href: "https://www.dailytarheel.com/article/2cbacc97-2da6-4206-ae9f-3ea0531338ba",
  },
  {
    title: "Insurance reform is part of the answer to North Carolina's climate crisis",
    publishedDate: "02/05/25",
    imageSrc: "assets/insurancereform.jpeg",
    imageAlt: "Illustration for Insurance reform is part of the answer to North Carolina's climate crisis",
    href: "https://www.dailytarheel.com/article/c4f0f9b1-2e17-4873-96e9-1a60fe5157c7",
  },
  {
    title: "Meta indicates the future of online accountability is bleak",
    publishedDate: "01/14/25",
    imageSrc: "assets/metaindicates.jpg",
    imageAlt: "Illustration for Meta indicates the future of online accountability is bleak",
    href: "https://www.dailytarheel.com/article/3b31b05b-b2ba-4232-9571-fc74ab321045",
  },
  {
    title: "Hold onto timelessness at a changing UNC",
    publishedDate: "11/25/24",
    imageSrc: "assets/timelessnessinachangingunc.jpeg",
    imageAlt: "Illustration for Hold onto timelessness at a changing UNC",
    href: "https://www.dailytarheel.com/article/74dd6209-48ed-4e77-bab1-8a96ff15198c",
  },
  {
    title: "Joe Rogan and Elon Musk's election influence define the true value of X",
    publishedDate: "11/13/24",
    imageSrc: "assets/joeroganandelonmusk.jpg",
    imageAlt: "Illustration for Joe Rogan and Elon Musk's election influence define the true value of X",
    href: "https://www.dailytarheel.com/article/23f2775c-64cb-46c4-a4d7-89ddab828658",
  },
  {
    title: "Slow down and embrace the everyday moments",
    publishedDate: "10/20/24",
    imageSrc: "assets/slowdownandembrace.jpeg",
    imageAlt: "Illustration for Slow down and embrace the everyday moments",
    href: "https://www.dailytarheel.com/article/37acd236-6ebb-48bf-99e1-ccc1b39bc6b3",
  },
];

const writingArticleList = document.getElementById("writing-article-list");
const writingPagination = document.getElementById("writing-pagination");

if (writingArticleList && writingPagination) {
  const pageSize = 6;
  const totalPages = Math.ceil(writingArticles.length / pageSize);
  let currentPage = 1;

  const createWritingCardMedia = (article) => {
    if (article.imageSrc) {
      return `
        <div class="writing-card-media">
          <img src="${article.imageSrc}" alt="${article.imageAlt || article.title}" />
        </div>
      `;
    }

    return `
      <div class="writing-card-media writing-card-media-placeholder" aria-hidden="true">
        Article image
      </div>
    `;
  };

  const createWritingCard = (article) => {
    const mediaMarkup = createWritingCardMedia(article);
    const sourceLabel = article.source || "DTH Article";

    if (article.href) {
      return `
        <a class="writing-card reveal" href="${article.href}" target="_blank" rel="noreferrer">
          <p class="panel-label writing-card-tag">${sourceLabel}</p>
          ${mediaMarkup}
          <p class="writing-card-date">${article.publishedDate}</p>
          <h2>${article.title}</h2>
        </a>
      `;
    }

    return `
      <article class="writing-card writing-card-static reveal">
        <p class="panel-label writing-card-tag">${sourceLabel}</p>
        ${mediaMarkup}
        <p class="writing-card-date">${article.publishedDate}</p>
        <h2>${article.title}</h2>
      </article>
    `;
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      writingPagination.innerHTML = "";
      return;
    }

    const pageButtons = Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;
      const activeClass = pageNumber === currentPage ? " is-active" : "";
      const activeState = pageNumber === currentPage ? ' aria-current="page"' : "";

      return `
        <button
          class="pagination-number${activeClass}"
          type="button"
          data-page="${pageNumber}"
          aria-label="Go to page ${pageNumber}"
          ${activeState}
        >
          ${pageNumber}
        </button>
      `;
    }).join("");

    writingPagination.innerHTML = `
      <button
        class="pagination-button"
        type="button"
        data-direction="prev"
        ${currentPage === 1 ? "disabled" : ""}
      >
        Previous
      </button>
      <span class="pagination-summary">Page ${currentPage} of ${totalPages}</span>
      ${pageButtons}
      <button
        class="pagination-button"
        type="button"
        data-direction="next"
        ${currentPage === totalPages ? "disabled" : ""}
      >
        Next
      </button>
    `;
  };

  const renderWritingArchive = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const visibleArticles = writingArticles.slice(startIndex, startIndex + pageSize);

    writingArticleList.innerHTML = visibleArticles.map(createWritingCard).join("");
    initReveals(writingArticleList);
    renderPagination();
  };

  writingPagination.addEventListener("click", (event) => {
    const target = event.target.closest("button");

    if (!target) {
      return;
    }

    const page = Number(target.dataset.page);
    const direction = target.dataset.direction;

    if (page) {
      currentPage = page;
    } else if (direction === "prev" && currentPage > 1) {
      currentPage -= 1;
    } else if (direction === "next" && currentPage < totalPages) {
      currentPage += 1;
    } else {
      return;
    }

    renderWritingArchive();
    writingArticleList.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderWritingArchive();
}

const clotheslineGallery = document.getElementById("clothesline-gallery");

if (clotheslineGallery) {
  const clotheslineAnchors = Array.from(clotheslineGallery.querySelectorAll(".cloth-anchor"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    clotheslineGallery.classList.remove("is-swaying");
  } else {
    let breezeStrength = 1.05;
    let animationFrameId = null;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let pointerFrameId = null;
    let pointerTargetX = null;
    let pointerCurrentX = null;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const applyBreeze = () => {
      clotheslineGallery.style.setProperty("--breeze-strength", breezeStrength.toFixed(3));

      if (breezeStrength > 0.045) {
        clotheslineGallery.classList.add("is-swaying");
      } else {
        clotheslineGallery.classList.remove("is-swaying");
      }
    };

    const decayBreeze = () => {
      breezeStrength *= 0.968;

      if (breezeStrength < 0.03) {
        breezeStrength = 0;
        applyBreeze();
        animationFrameId = null;
        return;
      }

      applyBreeze();
      animationFrameId = window.requestAnimationFrame(decayBreeze);
    };

    const startBreeze = (nextStrength) => {
      breezeStrength = Math.max(breezeStrength, nextStrength);
      applyBreeze();

      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(decayBreeze);
    };

    const handleScrollBreeze = () => {
      const currentTime = performance.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const deltaTime = Math.max(currentTime - lastScrollTime, 16);
      const velocity = deltaY / deltaTime;
      const impulse = Math.min(1.35, velocity * 14);

      if (impulse > 0.08) {
        startBreeze(impulse);
      }

      lastScrollY = window.scrollY;
      lastScrollTime = currentTime;
    };

    const updatePointerTilts = () => {
      if (pointerTargetX === null) {
        let hasVisibleMotion = false;

        clotheslineAnchors.forEach((anchor) => {
          const currentTilt = Number.parseFloat(anchor.style.getPropertyValue("--pointer-tilt")) || 0;
          const currentLift = Number.parseFloat(anchor.style.getPropertyValue("--pointer-lift")) || 0;
          const nextTilt = Math.abs(currentTilt) < 0.05 ? 0 : currentTilt * 0.82;
          const nextLift = Math.abs(currentLift) < 0.08 ? 0 : currentLift * 0.82;

          if (nextTilt !== 0 || nextLift !== 0) {
            hasVisibleMotion = true;
          }

          anchor.style.setProperty("--pointer-tilt", `${nextTilt.toFixed(3)}deg`);
          anchor.style.setProperty("--pointer-lift", `${nextLift.toFixed(3)}px`);
        });

        if (!hasVisibleMotion) {
          pointerCurrentX = null;
          pointerFrameId = null;
          return;
        }
      } else {
        pointerCurrentX =
          pointerCurrentX === null
            ? pointerTargetX
            : pointerCurrentX + (pointerTargetX - pointerCurrentX) * 0.18;

        const galleryRect = clotheslineGallery.getBoundingClientRect();
        const referenceWidth = Math.max(galleryRect.width * 0.18, 1);

        clotheslineAnchors.forEach((anchor, index) => {
          const rect = anchor.getBoundingClientRect();
          const anchorCenter = rect.left + rect.width / 2;
          const normalizedOffset = clamp((pointerCurrentX - anchorCenter) / referenceWidth, -1.3, 1.3);
          const direction = index % 2 === 0 ? 1 : -1;
          const depth = 4.8 + (index % 3) * 0.9;
          const wave = Math.sin(normalizedOffset * (Math.PI / 2));
          const tilt = clamp(wave * depth * direction, -10, 10);
          const lift = -Math.abs(wave) * (7 + (index % 3) * 1.5);
          anchor.style.setProperty("--pointer-tilt", `${tilt.toFixed(3)}deg`);
          anchor.style.setProperty("--pointer-lift", `${lift.toFixed(3)}px`);
        });

        if (Math.abs(pointerTargetX - pointerCurrentX) < 0.08) {
          pointerFrameId = null;
          return;
        }
      }

      pointerFrameId = window.requestAnimationFrame(updatePointerTilts);
    };

    const startPointerAnimation = () => {
      if (pointerFrameId !== null) {
        return;
      }

      pointerFrameId = window.requestAnimationFrame(updatePointerTilts);
    };

    const handlePointerMove = (event) => {
      pointerTargetX = event.clientX;
      startPointerAnimation();
    };

    const handlePointerLeave = () => {
      pointerTargetX = null;
      startPointerAnimation();
    };

    applyBreeze();
    startBreeze(1.05);
    window.addEventListener("scroll", handleScrollBreeze, { passive: true });
    clotheslineGallery.addEventListener("pointermove", handlePointerMove);
    clotheslineGallery.addEventListener("pointerleave", handlePointerLeave);
  }
}
