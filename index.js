const collectionsBanners = document.getElementById("collections-banners");
const bestSellersBanners = document.getElementById("best-sellers-banners");

// Load components
loadComponent("#hamburger-menu", "components/hamburger-menu.html");
loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");

// Creating collections banners
createBannersDisplay("collections", "COLLECTIONS", "data/collections.json", "main")
    // Creating best sellers banners
    .then(() => createBannersDisplay("best-sellers", "BEST SELLERS", "data/products.json", "main"))
    // .then waits for function to finish and banners to be created and loaded
    .then(() => addMarqueeEffect(".banners-display .container .banners .banner .text p")) // Adds marquee effect to all banners that have too long of a name
    .then(() => addScrollability()); // Makes the banners displays scrollable (can click left and right arrows)

const bannersScrollValues = new Map(); // Store scroll values for each banners container
function createBannersDisplay(id, header, data, parent) {
    return new Promise((resolve, reject) => {
        const bannersDisplay = document.createElement("div");
        bannersDisplay.classList.add("banners-display");
        bannersDisplay.id = id;

        const title = document.createElement("p");
        title.classList.add("title");
        title.innerHTML = `${header}`;

        const container = document.createElement("div");
        container.classList.add("container");

        const leftArrow = document.createElement("div");
        leftArrow.classList.add("left-arrow");
        leftArrow.classList.add("arrow");
        leftArrow.innerHTML = `
            <span class="icon" id="left-arrow-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.957,12.354a.5.5,0,0,1,0-.708l4.586-4.585a1.5,1.5,0,0,0-2.121-2.122L8.836,9.525a3.505,3.505,0,0,0,0,4.95l4.586,4.586a1.5,1.5,0,0,0,2.121-2.122Z"/>
                </svg>
            </span>
        `;

        const banners = document.createElement("div");
        banners.classList.add("banners");

        const rightArrow = document.createElement("div");
        rightArrow.classList.add("right-arrow");
        rightArrow.classList.add("arrow");
        rightArrow.innerHTML = `
            <span class="icon" id="left-arrow-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.75,9.525,11.164,4.939A1.5,1.5,0,0,0,9.043,7.061l4.586,4.585a.5.5,0,0,1,0,.708L9.043,16.939a1.5,1.5,0,0,0,2.121,2.122l4.586-4.586A3.505,3.505,0,0,0,15.75,9.525Z"/>
                </svg>
            </span>
        `;

        bannersDisplay.appendChild(title);
        bannersDisplay.appendChild(container);
        container.appendChild(leftArrow);
        container.appendChild(banners);
        container.appendChild(rightArrow);

        fetch(`http://192.168.1.198:5500/${data}`)
            .then(response => response.json())
            .then(B => {
                if (!Array.isArray(B)) {
                    reject("Invalid data format"); // Reject if data is not an array
                    return;
                }

                B.forEach(b => {
                    const banner = document.createElement("div");
                    const bannerTextBackground = document.createElement("div");
                    bannerTextBackground.classList.add("text");

                    const bannerText = document.createElement("p");

                    banner.appendChild(bannerTextBackground);
                    bannerTextBackground.appendChild(bannerText);
                    banners.appendChild(banner);

                    banner.className = "banner";
                    banner.id = `${id}-${b.id}`;
                    banner.style.backgroundImage = `url(${b.image})`;
                    bannerText.innerHTML = `${b.name.toUpperCase()}`;
                });

                // Append the bannersDisplay after banners are loaded
                const bannersDisplayParent = document.querySelector(`${parent}`);
                if (bannersDisplayParent) {
                    bannersDisplayParent.appendChild(bannersDisplay);
                    resolve(); // Resolve when banners are added
                } else {
                    reject(`Parent element "${parent}" not found`);
                }
            })
            .catch(error => reject(error)); // Catch fetch errors
        }
    );
}

function addMarqueeEffect(element) {
    document.querySelectorAll(`${element}`).forEach(text => {
        // Function to check if text overflows its container
        if (text.parentElement.clientWidth < text.clientWidth) {
            text.classList.add("marquee");
            text.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + text.innerHTML + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + text.innerHTML;
            // justify-content: center; ruins the marquee effect so we remove it
            text.parentElement.style.justifyContent = "left";
        }
    });
}

// Store max scroll to the right values for each banner display
bannersScrollMax = new Map();
function addScrollability() { // Makes banners scrollable using the arrows
    document.querySelectorAll(".left-arrow").forEach(leftArrow => {
        const bannersContainer = leftArrow.parentElement.querySelector(".banners");
        leftArrow.onclick = () => {
            // Get or initialize scroll value
            let scrollValue = bannersScrollValues.get(bannersContainer) || 0;
            if (scrollValue !== 0) scrollValue += 260; // Scrolls left only if not on the first banner
    
            // Store updated value
            bannersScrollValues.set(bannersContainer, scrollValue);
    
            const banners = bannersContainer.querySelectorAll(".banner");
            // Apply translation
            banners.forEach((banner) => {
                banner.style.left = `${scrollValue}px`;
            })
        };
    })
    
    document.querySelectorAll(".right-arrow").forEach(rightArrow => {
        const bannersContainer = rightArrow.parentElement.querySelector(".banners");

        rightArrow.onclick = () => {
            // Check screen width to see how many banners are on display so we can calculate the scrollMax
            // This is inside the onclick function in case the user changes the screen width
            let screenWidth = window.innerWidth; let bannersOnDisplay;
            if (screenWidth > 890) bannersOnDisplay = 3; else if (screenWidth > 630) bannersOnDisplay = 2; else bannersOnDisplay = 1;
            console.log(bannersOnDisplay)
            // Store max scroll to the right values for each banner display
            bannersScrollMax.set(bannersContainer, (rightArrow.parentElement.querySelector(".banners").children.length * -260) + 260 * bannersOnDisplay); // (+260*bannersOnDisplay) is to not count the banners that are already on display    

            if (!bannersContainer) return;
    
            // Get or initialize scroll value
            let scrollValue = bannersScrollValues.get(bannersContainer) || 0;
            if (scrollValue > bannersScrollMax.get(bannersContainer)) scrollValue -= 260; // Check if banners display is on last element
    
            // Store updated value
            bannersScrollValues.set(bannersContainer, scrollValue);
    
            const banners = bannersContainer.querySelectorAll(".banner");
            // Apply translation
            banners.forEach((banner) => {
                banner.style.left = `${scrollValue}px`;
            })
        };
    });
}