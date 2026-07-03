// Get Current Dates & Timestamps for Footer Info

document.addEventListener("DOMContentLoaded", () => {
  // Populate the current year dynamically
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Populate the last modified date/time dynamically
  const lastModifiedElement = document.getElementById("lastModified");
  if (lastModifiedElement) {
    lastModifiedElement.innerHTML = `Last Modification: ${document.lastModified}`;
  }
});
