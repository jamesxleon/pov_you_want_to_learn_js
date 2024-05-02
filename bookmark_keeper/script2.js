// script.js saves bookmarks as lists and every time you want to delete something bigO is O(n) because it has to go through the entire list to find the bookmark to delete.
// Instead, we can save bookmarks as an object with the url as the key and the bookmark as the value. This way, we can delete bookmarks in O(1) time.
// let's do that in script2.js

const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false);

// Validate Form
function validate(nameValue, urlValue){

    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert('Please submit values for both fields');
        return false;
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }
    return true;

}

// Build Bookmarks DOM
function buildBookmarks(){

    // Remove all bookmark elements
    bookmarksContainer.textContent = '';

    //build items from the bookmarks object
    Object.keys(bookmarks).forEach((url) => {

        const {name} = bookmarks[url];

        // Item (from the Parent)
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid',  'fa-circle-xmark');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container (from the smallest thing to the progressively bigger thing)
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);

        bookmarksContainer.appendChild(item);

    })
}

// Fetch Bookmarks
function fetchBookmarks(){

    // Get bookmars from localStorage if available
    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks object in local storage and assign an id
        const id = 'https://google.com';
        bookmarks[id] = {
            name: 'Google',
            url: 'https://google.com',
        };
        console.log(bookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
    
}

// Delete Bookmark 
function deleteBookmark(url) {

    // Find the url as an id and delete it
    if (bookmarks[url]){
        delete bookmarks[url];
    }

    // Update bookmarks array in localStorage, re-populate the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();

}

// Handle Data from Form
function storeBookmark(e){
    
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://', 'https://')){
        urlValue = `https://${urlValue}`;
    }

    if(!validate(nameValue, urlValue)){
        console.log('It should end here and no bookmark should be created!');
        return false;
    }

    const bookmark = {
        name: nameValue, 
        url: urlValue,
    };

    bookmarks[urlValue] = bookmark;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();

}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();