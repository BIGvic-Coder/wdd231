// Responsive Menu & Navigation Wayfinding Behavior

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");

  // Toggle navigation menu visibility on small screens
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("open");
      menuToggle.classList.toggle("open");
      
      // Update accessibility attributes
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Wayfinding: highlight active nav link based on current page URL path
  const navLinks = document.querySelectorAll(".nav-menu a");
  const currentPath = window.location.pathname;
  
  let matchFound = false;

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    
    // Clear any hardcoded active classes
    link.classList.remove("active");

    // Match conditions: URL includes href, ignoring empty/placeholder hashes
    if (href && href !== "#" && href !== "index.html" && currentPath.includes(href)) {
      link.classList.add("active");
      matchFound = true;
    }
  });

  // Default fallback: highlight Home if no matching sub-path found
  if (!matchFound) {
    const homeLink = document.getElementById("nav-home");
    if (homeLink) {
      homeLink.classList.add("active");
    }
  }
});
