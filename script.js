
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const searchForm = document.getElementById('search-form');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
// low initial count for faster initial loading
let isInitialLoad = true;
const initialImageLoadCount = 5;
const imageLoadCount = 30;
let searchTerm = '';
// FUTURE: create a secure backend for these env variables and move these into a env/config file
const apiKey = '0FXsibRdBB_UW6vlFdUEQrcYWqcT_DX7k0VXdDeHkSM';
let unsplashApiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialImageLoadCount}`;

function updateUnsplashApiUrlCount() {
    unsplashApiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageLoadCount}`;
}

function getPhotosBySearchTerm() {
    // clear current photos
    imageContainer.innerHTML = '';

    // update unsplashApiUrl
    unsplashApiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialImageLoadCount}&query=${searchTerm}`;
    
    getPhotos();
}

function getPhotosByCreator(creatorSearchTerm) {
        // clear current photos
        imageContainer.innerHTML = '';

        // update unsplashApiUrl
        unsplashApiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialImageLoadCount}&username=${creatorSearchTerm}`;
        
        getPhotos();
    
}

// check if each image is loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        document.querySelectorAll('.overlay-button').forEach(btn => btn.style.display = 'block');
        // subsequent loads include more photos
        count = 30;
    }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    };
};

// Create elements for links and photos
// add to DOM
function displayPhotos() {
    totalImages += photosArray.length;
    // run function for each object in photosArray
    photosArray.forEach((photo) => {
        // create <a> to link to unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });

        // create image for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        const userBtn = document.createElement('button');
        // MOVE these into setAttributes function
        setAttributes(userBtn, {
            class: 'overlay-button',
            username: photo.user.username
        });
        userBtn.innerText = 'More By This Creator';

        userBtn.addEventListener('click', (event) => {
            event.preventDefault();
            loader.hidden = false;
            const creator = event.target.getAttribute('username');
            getPhotosByCreator(creator);
        });

        // Event listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);
        
        // put <img> inside <a>, then put both inside image-container element
        item.appendChild(userBtn);
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Check to see if scrolling near bottom of page, Load more ephotos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1200 && ready) {
        ready = false;
        getPhotos();
    }
});

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    loader.hidden = false;
    searchTerm = document.getElementById('search-input').value
    getPhotosBySearchTerm();
});



// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(unsplashApiUrl);
        photosArray = await response.json();
        displayPhotos();
        if (isInitialLoad) {
            updateUnsplashApiUrlCount();
            isInitialLoad = false;
        }
    } catch (error) {

    }
}

// On Load
getPhotos();