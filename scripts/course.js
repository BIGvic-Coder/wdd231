// BYU-I Web and Computer Programming Course Filtering & Display Logic

// Array of course objects representing certificate courses
const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Programming Building Blocks",
    credits: 2,
    certificate: "Web and Computer Programming",
    description: "This course introduces students to the fundamentals of programming. Students learn variables, conditionals, loops, lists, and input/output to solve problems.",
    completed: true
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description: "This course serves as an introduction to web design and development. Students gain basic proficiency in structural HTML and presentation CSS.",
    completed: true
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description: "CSE 111 teaches how to organize and write efficient, modular programs using functions, unit testing, debugging, and external libraries.",
    completed: true
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description: "Students learn how to build interactive, responsive, and visually appealing webpages using client-side JavaScript, media queries, and accessibility standards.",
    completed: true
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description: "Introduces Object-Oriented Programming (OOP) concepts. Students design, write, and test applications using classes, encapsulation, inheritance, and polymorphism.",
    completed: true
  },
  {
    subject: "WDD",
    number: 231,
    title: "Web Frontend Development II",
    credits: 2,
    certificate: "Web and Computer Programming",
    description: "Focuses on advanced user experiences, accessibility, performance optimization, and integrating web storage and web/remote APIs.",
    completed: false
  }
];

// Display the selected list of courses dynamically in the grid
function displayCourses(filteredCourses) {
  const coursesGrid = document.getElementById("courses-grid");
  if (!coursesGrid) return;
  
  // Clear existing items in grid
  coursesGrid.innerHTML = "";

  // Render course cards
  filteredCourses.forEach(course => {
    // Create card element
    const card = document.createElement("div");
    card.className = `course-card ${course.completed ? 'completed' : 'pending'}`;
    
    // Add accessibility identifier
    card.id = `course-${course.subject.toLowerCase()}-${course.number}`;

    // Structure internal HTML elements
    card.innerHTML = `
      <div class="course-header">
        <h3>${course.subject} ${course.number}</h3>
        <span class="course-badge">${course.completed ? 'Completed ✓' : 'In Progress'}</span>
      </div>
      <div class="course-name">${course.title}</div>
      <p class="course-desc">${course.description}</p>
      <div class="course-footer">
        <span>Credits: ${course.credits}</span>
        <span>Certificate: ${course.subject}</span>
      </div>
    `;

    coursesGrid.appendChild(card);
  });

  // Calculate and display dynamically total credits using .reduce()
  const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
  const creditsSumElement = document.getElementById("credits-sum");
  if (creditsSumElement) {
    creditsSumElement.textContent = totalCredits;
  }
}

// Attach filter button action listeners
document.addEventListener("DOMContentLoaded", () => {
  const filterAll = document.getElementById("filter-all");
  const filterCse = document.getElementById("filter-cse");
  const filterWdd = document.getElementById("filter-wdd");

  // Initial load: render all certificate courses
  displayCourses(courses);

  // Setup visual styling and filter controls
  if (filterAll && filterCse && filterWdd) {
    
    const filterButtons = [filterAll, filterCse, filterWdd];

    // Helper to toggle active class
    function setActiveButton(activeBtn) {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      activeBtn.classList.add("active");
    }

    // "All" filter click action
    filterAll.addEventListener("click", () => {
      setActiveButton(filterAll);
      displayCourses(courses);
    });

    // "CSE" filter click action
    filterCse.addEventListener("click", () => {
      setActiveButton(filterCse);
      const cseCourses = courses.filter(course => course.subject === "CSE");
      displayCourses(cseCourses);
    });

    // "WDD" filter click action
    filterWdd.addEventListener("click", () => {
      setActiveButton(filterWdd);
      const wddCourses = courses.filter(course => course.subject === "WDD");
      displayCourses(wddCourses);
    });
  }
});
