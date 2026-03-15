document.body.classList.add("has-motion");

const reveals = document.querySelectorAll(".reveal");
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

reveals.forEach((item, index) => {
  item.style.transitionDelay = `${index * 100}ms`;
  observer.observe(item);
});

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
