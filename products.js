// Load components
loadComponent("#hamburger-menu", "components/hamburger-menu.html");
loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");
loadComponent("#filters", "components/filters.html");

createProductCards("#products");

function createProductCards(parent) {
    return new Promise((resolve, reject) => {

        fetch("http://192.168.1.198:5500/data/products.json")
            .then(response => response.json())
            .then(products => {
                if (!Array.isArray(products)) {
                    reject("Invalid data format"); // Reject if data is not an array
                    return;
                }

                products.forEach(product => {
                    const card = document.createElement("div"); // The main card element
                    const cardImage = document.createElement("div");
                    const cardInfo = document.createElement("div");

                    card.appendChild(cardImage);
                    card.appendChild(cardInfo);

                    const cardColors = document.createElement("div");
                    const cardName = document.createElement("p");
                    const cardPrice = document.createElement("p");

                    cardImage.appendChild(cardColors);
                    cardInfo.appendChild(cardName);
                    cardInfo.appendChild(cardPrice);

                    card.id = `${product.id}`
                    card.className = "product";

                    cardInfo.className = "info";

                    cardImage.style.backgroundImage = `${product.image}`;
                    cardImage.className = "image";

                    cardColors.className = "colors";

                    cardName.innerHTML = `${product.name.toUpperCase()}`;
                    cardName.className = "name";

                    cardPrice.innerHTML = `${product.price} ${product.currency}`;
                    cardPrice.className = "price";

                    // Adding the categories as classes to the card
                    product.categories.forEach(category => card.classList.add(category));

                    for (const [colorName, hex] of Object.entries(product.colors)) {
                        const cardColor = document.createElementNS("http://www.w3.org/2000/svg", "svg"); // SVGs aren't HTML

                        cardColor.setAttribute("viewBox", "0 0 200 200");
                        cardColor.setAttribute("xmlns", "http://www.w3.org/2000/svg");

                        if (colorName.includes(" ")) { // Two colored SVG
                            cardColor.innerHTML = `
                                <path d="M 50,0 C 80,0 120,0 150,0 C 200,0 200,50 200,50 C 200,80 200,120 200,150 C 200,200 150,200 150,200 C 120,200 80,200 50,200 C 0,200 0,150 0,150 C 0,120 0,80 0,50 C 0,0 50,0 50,0 Z" fill="${hex[0]}"/>
                                <path d="M 200,200 C 200,140 200,110 200,50 L 50,200 C 120,200 150,200 150,200 C 200,200 200,150 200,150 Z" fill="${hex[1]}"/>
                                        `
                        }
                        else { // One color SVG
                            cardColor.innerHTML = `
                                <path d="M 50,0 C 80,0 120,0 150,0 C 200,0 200,50 200,50 C 200,80 200,120 200,150 C 200,200 150,200 150,200 C 120,200 80,200 50,200 C 0,200 0,150 0,150 C 0,120 0,80 0,50 C 0,0 50,0 50,0" fill="${hex}" />
                            `;
                        }

                        cardColors.appendChild(cardColor);
                    }

                    // Append the card
                    const cardParent = document.querySelector(`${parent}`);
                    if (cardParent) {
                        cardParent.appendChild(card);
                        resolve(); // Resolve when banners are added
                    } else {
                        reject(`Parent element "${parent}" not found`);
                    }
                });
            })
            .catch(error => reject(error)); // Catch fetch errors
        }
    );
}

// Toggling the filters section
let filterClosed = 1;
function toggleFilter(element) {
    const optionsBoxID = element.id + "-options-box"; // Options box is outside the filters container
    if (filterClosed === 1) {
        // Displaying filter box
        document.querySelector(`#${optionsBoxID}`).classList.add("active");
        element.querySelector(".arrow-up-icon svg").style.transform = "rotate(180deg)";

        filterClosed = 0;
    }
    else {
        // Hiding filter box
        document.querySelector(`#${optionsBoxID}`).classList.remove("active");
        element.querySelector(".arrow-up-icon svg").style.transform = "rotate(0deg)";

        filterClosed = 1;
    }
}

// Keeping the '.options-box's under their respective 'filter', since '.options-box' is outside 'filter'
// console.log(document.querySelectorAll("#price-options-box.options-box").length);

// document.querySelectorAll(".options-box").forEach(optionsBox => {
//     const optionsBoxPos = optionsBox.getBoundingClientRect();
//     console.log(optionsBoxPos);
//     console.log("hello")
// });

// Adding categories to categories filter
fetch("http://192.168.1.198:5500/data/products.json")
    .then(response => response.json())
    .then(products => {
        const uniqueCategories = new Set(); // Creates a set that cannot contain duplicates
        products.forEach(product => {
            product.categories.forEach(category => uniqueCategories.add(category))
        }); 
        uniqueCategories.forEach(category => {
            document.querySelector("#category-options-box").innerHTML += `
                    <input type="checkbox" id="${category}" name="categories" checked>
                    <label for="${category}">${capitalizeFirstLetter(category)}</label><br>`;
        })
    })
    .catch(error => console.error("Error: " + error));

// Adding colors to colors filter
fetch("http://192.168.1.198:5500/data/products.json")
    .then(response => response.json())
    .then(products => {
        const uniqueColors = new Set(); // Creates a set that cannot contain duplicates
        products.forEach(product => {
            for (const [colorName] of Object.entries(product.colors)) {
                uniqueColors.add(colorName);
            }
        }); 
        uniqueColors.forEach(color => {
            document.querySelector("#colors-options-box").innerHTML += `
                    <input type="checkbox" id="${color}" name="colors" checked>
                    <label for="${color}">${capitalizeFirstLetter(color)}</label><br>`;
        })
    })
    .catch(error => console.error("Error: " + error));