// Lagos Chamber of Commerce Directory - Fetch and Toggle Layout Logic

const membersUrl = "data/members.json";

// Fetch the member data from JSON file using async/await
async function getMembers() {
  try {
    const response = await fetch(membersUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    displayMembers(data);
  } catch (error) {
    console.error("Failed to load chamber members:", error);
    const container = document.getElementById("members-container");
    if (container) {
      container.innerHTML = `<p class="error-msg">Sorry, we couldn't load the directory members at this time.</p>`;
    }
  }
}

// Render the members list in the DOM
function displayMembers(members) {
  const container = document.getElementById("members-container");
  if (!container) return;

  container.innerHTML = ""; // Clear loader

  members.forEach(member => {
    // Determine membership tier label
    let tierClass = "member-tier";
    let tierName = "Member";
    if (member.membership === 3) {
      tierClass = "gold-tier";
      tierName = "Gold Member";
    } else if (member.membership === 2) {
      tierClass = "silver-tier";
      tierName = "Silver Member";
    }

    // Create member card element
    const card = document.createElement("section");
    card.className = `member-card ${tierClass}`;

    // Structure internal elements
    card.innerHTML = `
      <div class="member-logo-container">
        <img src="images/${member.image}" alt="${member.name} Logo" class="member-logo" loading="lazy" width="200" height="100">
      </div>
      <span class="membership-badge">${tierName}</span>
      <h3>${member.name}</h3>
      <p class="tagline">"${member.tagline}"</p>
      <div class="details-block">
        <p class="address-val">📍 ${member.address}</p>
        <p class="phone-val">📞 ${member.phone}</p>
      </div>
      <a href="${member.website}" target="_blank" rel="noopener" class="website-link">Visit Website</a>
    `;

    container.appendChild(card);
  });
}

// Setup Grid/List toggles listeners on load
document.addEventListener("DOMContentLoaded", () => {
  const gridBtn = document.getElementById("grid-btn");
  const listBtn = document.getElementById("list-btn");
  const container = document.getElementById("members-container");

  // Fetch and render directory data
  getMembers();

  if (gridBtn && listBtn && container) {
    // Switch to Grid layout view
    gridBtn.addEventListener("click", () => {
      container.classList.remove("list-view");
      container.classList.add("grid-view");
      
      listBtn.classList.remove("active");
      gridBtn.classList.add("active");
    });

    // Switch to List layout view
    listBtn.addEventListener("click", () => {
      container.classList.remove("grid-view");
      container.classList.add("list-view");
      
      gridBtn.classList.remove("active");
      listBtn.classList.add("active");
    });
  }
});
