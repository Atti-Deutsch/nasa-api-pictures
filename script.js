const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.pulse');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {}; // Beware this is an object why we use curlybrackets

function showContent(page) {
    window.scrollTo({top: 0, behavior: 'instant'}); //On load content on top of page instantly
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');  // Här skapar vi klassen "card"
        // Link wrappes the image
        const link = document.createElement('a');
        link.href = result.hdurl;   // Länkning till NAsas api  (alla element attribut tillförs nedan)
        link.title = 'View Full Image', // Showcase when hover over
        link.target = '_blank'; // Allows link open in a new tag
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day'; // Text if page not load img
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable-2');
        if (page === 'results') {
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);   // This saving object to favorites
        } else {
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);   // This saving object to favorites
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright; // Om namn ej finns, slipper vi undefined så här
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;   // Gör detta för att skapa ett tomrum innan copyright
        // Append (slåihop dessa i tur ordning parent & child förhållanden)
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer),
        link.appendChild(image); // Wrap img
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });   
}

function updateDOM(page) {  //Istället för card hållaren i html
    // Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';  // For reseting after deleting items from localstorage
    createDOMNodes(page);
    showContent(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    }   catch(error) {
        // Catch error here
    }     
}

// Add result to Favorites
function saveFavorite(itemUrl) {
    // Loop through Results Array to select Favorite
    resultsArray.forEach((item) => {
       if (item.url.includes(itemUrl) && !favorites[itemUrl]) { //Check if itemUrl already exists in favorites
           favorites[itemUrl] = item;
           // Show Save Confirmation for 2 seconds
           saveConfirmed.hidden = false;
           setTimeout(() => {
            saveConfirmed.hidden = true;
           }, 2000);
           // Set Favorites in localStorage
           localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
       }
    });
}

// Remove item from Favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

// On Load
getNasaPictures();