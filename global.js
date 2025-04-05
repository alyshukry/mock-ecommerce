// Function to load an HTML component
function loadComponent(element, filePath) {
    fetch(`${filePath}`)
        .then(response => response.text())
        .then(html => {
            document.querySelector(element).innerHTML = html;
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

function darkModeToggle() {
    const darkModeButton = document.querySelector("#dark-mode-icon svg");
    document.documentElement.classList.toggle("dark-mode");

    if (document.documentElement.classList.contains("dark-mode")) {
            darkModeButton.innerHTML = `
            <path d="M22.5,10.5H19.349a7.455,7.455,0,0,0-1.1-2.632l2.232-2.232a1.5,1.5,0,0,0-2.121-2.121L16.132,5.747a7.455,7.455,0,0,0-2.632-1.1V1.5a1.5,1.5,0,0,0-3,0V4.651a7.455,7.455,0,0,0-2.632,1.1L5.636,3.515A1.5,1.5,0,0,0,3.515,5.636L5.747,7.868a7.455,7.455,0,0,0-1.1,2.632H1.5a1.5,1.5,0,0,0,0,3H4.651a7.455,7.455,0,0,0,1.1,2.632L3.515,18.364a1.5,1.5,0,0,0,2.121,2.121l2.232-2.232a7.455,7.455,0,0,0,2.632,1.1V22.5a1.5,1.5,0,0,0,3,0V19.349a7.455,7.455,0,0,0,2.632-1.1l2.232,2.232a1.5,1.5,0,0,0,2.121-2.121l-2.232-2.232a7.455,7.455,0,0,0,1.1-2.632H22.5A1.5,1.5,0,0,0,22.5,10.5ZM12,16.5a4.5,4.5,0,0,1,0-9A4.5,4.5,0,0,1,12,16.5Z"/>
            `;
            localStorage.setItem("theme", "dark");
    }
    else {
            darkModeButton.innerHTML = `
            <path d="M15,24A12,12,0,1,1,19.058.71a2.93,2.93,0,0,1,.814,5.067c-5.1,3.92-5.088,8.539,0,12.446a2.93,2.93,0,0,1-.816,5.067A12.2,12.2,0,0,1,15,24ZM15,3a9,9,0,1,0,2.925,17.508c-6.511-5.065-6.489-11.969,0-17.016A9.322,9.322,0,0,0,15,3Z"/>
            `;
            localStorage.setItem("theme", "light");
    }
}

// Checks the user's past pick
if (localStorage.getItem("theme") === "dark") {
    darkModeToggle();
}

function hamburgerMenuToggle(event) {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    event.stopPropagation(); // Stops the click from bubbling up to the document
    hamburgerMenu.classList.toggle("open");
    if (hamburgerMenu.classList.contains("open")) {
        document.addEventListener("click", closeHamburgerMenu);
    }
    else {
        document.removeEventListener("click", closeHamburgerMenu);
    }
}

function closeHamburgerMenu(event) {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    let target = event.target;

    if (event.target.tagName === "path") {
        target = target.closest("svg");
    } 

    if (!target.closest("#hamburger-menu")) {
        hamburgerMenu.classList.remove("open");
        document.removeEventListener("click", closeHamburgerMenu);
    }
}

function redirectToPage(page) {
    window.location.href = `${page}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}