
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
// low initial count for faster initial loading
let isInitialLoad = true;
const initialImageLoadCount = 5;
const imageLoadCount = 30;
// FUTURE: create a secure backend for these env variables and move these into a env/config file
const apiKey = '0FXsibRdBB_UW6vlFdUEQrcYWqcT_DX7k0VXdDeHkSM';
const unsplashApiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialImageLoadCount}`;

function updateUnsplashApiUrl() {
    unsplashApiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageLoadCount}`;
}

// check if each image is loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
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

        // Event listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);

        // put <img> inside <a>, then put both inside image-container element
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

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(unsplashApiUrl);
        photosArray = await response.json();
        displayPhotos();
        if (isInitialLoad) {
            updateUnsplashApiUrl();
            isInitialLoad = false;
        }
    } catch (error) {

    }
}

// On Load
getPhotos();