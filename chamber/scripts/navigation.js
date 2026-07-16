// Chamber responsive menu toggle and nav item active highlighter (wayfinding)

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");

  // Toggle navigation menu visibility
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("open");
      menuToggle.classList.toggle("open");
      
      // Update accessibility aria-expanded
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Wayfinding: highlight the current navigation tab
  const navLinks = document.querySelectorAll(".nav-menu a");
  const currentPath = window.location.pathname;

  let matchFound = false;

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    
    // Clear active classes
    link.classList.remove("active");

    // Match if URL includes href (ignore empty hashes)
    if (href && href !== "#" && currentPath.includes(href)) {
      link.classList.add("active");
      matchFound = true;
    }
  });

  // Default fallback: if no matching file in path (e.g. index.html or raw folder URL), highlight Home or directory as appropriate
  if (!matchFound) {
    // If path is folder ending (like /chamber/), highlight directory or home
    if (currentPath.includes("directory.html")) {
      const directoryLink = document.getElementById("nav-directory");
      if (directoryLink) directoryLink.classList.add("active");
    } else {
      const homeLink = document.getElementById("nav-home");
      if (homeLink) homeLink.classList.add("active");
    }
  }
});
