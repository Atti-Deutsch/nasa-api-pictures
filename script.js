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

function updateDOM() {  //Istället för card hållaren i html
    resultsArray.forEach((result) => {
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
        //Clickable-2 Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable-2');
        saveText.textContent = 'Add To Favorites';
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
        copyright.textContent = ` ${result.copyright}`;   // Gör detta för att skapa ett tomrum innan copyright
        // Append (slåihop dessa i tur ordning parent & child förhållanden)
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer),
        link.appendChild(image); // Wrap img
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });   
}

// Get 10 images from NASA API
async function getNasaPictures() {
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        console.log(resultsArray);
        updateDOM();
    }   catch(error) {
        // Catch error here
    }     
}

// On Load
getNasaPictures();