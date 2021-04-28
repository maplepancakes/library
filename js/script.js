// Checks if browser supports Web Storage API
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

// Toggles popup form for uploading new book
function openNewBookButton()
{
    const newBookButton = document.querySelector(`#new-book-button`);

    newBookButton.addEventListener(`click`, function(e)
    {
        const newBookForm = document.querySelector(`#new-book-form`);

        if (newBookForm.style.display === ``)
        {
            newBookForm.style.display = `grid`;
        }
        else if (newBookForm.style.display === `grid`)
        {
            newBookForm.style.display = ``;
        }
    })
}

// Array for storing book objects
let myLibrary = [];

// Counter for tracking the ids of generated book container, checkbox, and trash icon
let bookIndex = 0;

// Constructor
function Book(author, title, pages, read, imageSource, index)
{
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.imageSource = imageSource;
    this.index = index;
}

// Prototypal function for Book object: Sets object[read] to `Read` if parameter is true, else object[read] is set to `Not Read`
Book.prototype.isRead = function(check)
{
    if (check === true)
    {
        this.read = `Read`;
    }
    else if (check === false)
    {
        this.read = `Not Read`;
    }
}

// Appends book container and all of its contents onto user display
function appendBookToPage(index)
{
    const libraryContainer = document.querySelector(`#library-container`);

    const bookContainer = document.createElement(`div`);
    bookContainer.classList.add(`book-container`);
    bookContainer.setAttribute(`id`, `book-container-${bookIndex}`);

    const author = document.createElement(`label`);
    author.classList.add(`author`);

    const title = document.createElement(`label`);
    title.classList.add(`title`);

    const pages = document.createElement(`label`);
    pages.classList.add(`pages`);

    const read = document.createElement(`label`);
    read.classList.add(`read`);

    const images = document.createElement(`img`);
    images.classList.add(`book-image`);
    images.setAttribute(`alt`, `No image displayed`);
    images.setAttribute(`src`, myLibrary[index].imageSource);

    const trashIcon = document.createElement(`img`);
    trashIcon.classList.add(`delete-icon`);
    trashIcon.setAttribute(`id`,`${bookIndex}`);
    trashIcon.setAttribute(`src`, `images/delete.png`);
    trashIcon.setAttribute(`alt`, `Trash icon here`);

    const readIcon = document.createElement(`input`);
    readIcon.classList.add(`read-icon`);
    readIcon.setAttribute(`id`, `${bookIndex}`);
    readIcon.setAttribute(`type`, `checkbox`);

    author.textContent = myLibrary[index].author;
    title.textContent = myLibrary[index].title;
    pages.textContent = myLibrary[index].pages;
    read.textContent = myLibrary[index].read;

    // Appends alternate text if text content is blank
    if (author.textContent === ``)
    {
        author.textContent = `Unknown author`;
    }

    if (title.textContent === ``)
    {
        title.textContent = `Unknown title`;
    }
    
    if (pages.textContent === ` pages`)
    {
        pages.textContent = `Unknown number of pages`;
    }

    // Appends checked attribute if text content is `Read`
    if (read.textContent === `Read`)
    {
        readIcon.setAttribute(`checked`, `true`);
    }

    // Appends book container and all its contents onto user display
    bookContainer.appendChild(images);
    bookContainer.appendChild(author);
    bookContainer.appendChild(title);
    bookContainer.appendChild(pages);
    bookContainer.appendChild(read);
    bookContainer.appendChild(trashIcon);
    bookContainer.appendChild(readIcon);

    libraryContainer.appendChild(bookContainer);

    bookIndex++;
}

// Removes books from display and myLibrary variable
function removeBooks()
{  
    const trashIcon = document.querySelectorAll(`.delete-icon`);

    for (let i = 0; i < trashIcon.length; i++)
    {
        trashIcon[i].onclick = function()
        {   
            let id = trashIcon[i].id;

            // Removes book container and its contents from user display
            const bookToDelete = document.querySelector(`#book-container-${id}`);
            bookToDelete.parentNode.removeChild(bookToDelete);

            // Removes object from myLibrary array
            myLibrary = myLibrary.filter(function(obj)
            {
                return obj.index !== id;
            }); 
        }
    }
}

// Toggles whether book is read or not
function toggleRead()
{
    const readIcon = document.querySelectorAll(`.read-icon`);

    for (let i = 0; i < readIcon.length; i++)
    {
        readIcon[i].onclick = function()
        {
            let id = readIcon[i].id;

            let checkIfRead = readIcon[i].checked;

            index = myLibrary.findIndex(function(obj)
            {
                return obj.index === i;
            }); 

            // Sets object[read] from 'Read' to 'Not Read' if checkbox on user display is unselected, and 'Not Read' to 'Read' if checkbox on user display is selected
            myLibrary[index].isRead(checkIfRead);

            // Updates `Read` to `Not Read` on user display if checkbox is selected, and the opposite if checkbox is unselected
            const toggleReadBook = document.querySelector(`#book-container-${id} .read`);
            toggleReadBook.textContent = `${myLibrary[index].read}`;
        }
    }
}

// Adds book object to myLibrary variable, and adds book to page display
function mainProgram() 
{
    const submitButton = document.querySelector(`#submit-form-button`);

    const inputAuthor = document.querySelector(`#input-author`);
    const inputTitle = document.querySelector(`#input-title`);
    const inputPages = document.querySelector(`#input-pages`);
    const readSelection = document.querySelector(`#read-selection`);
    const uploadImage = document.querySelector(`#upload-image-button`);

    let src = ``;

    // Creates image URL when image is uploaded in user display
    uploadImage.addEventListener(`change`, function(e)
    {
        if (this.files && this.files[0])
        {
            src = ``;
            src = URL.createObjectURL(this.files[0]);
        }
    });

    // Appends all inputted information into myLibrary array when user clicks on the Submit button
    submitButton.addEventListener(`click`, function(e)
    {
        let author = inputAuthor.value;
        let title = inputTitle.value;

        // remember to add checking for pages
        let pages = inputPages.value + ` pages`;
        let selection = readSelection.value;
        let index = bookIndex;

        const book = new Book(author, title, pages, selection, src, index);

        myLibrary.push(book);

        appendBookToPage(myLibrary.length - 1);

        inputAuthor.value = ``;
        inputTitle.value = ``;
        inputPages.value = ``;
        uploadImage.value = ``;

        removeBooks();
        toggleRead();
    });
}

// Displays book objects stored in myLibrary variable upon page load
function displayBooksUponLoad()
{   
    for (let i = 0; i < myLibrary.length; i++)
    {
        appendBookToPage(i);
    }
}

// Function call
displayBooksUponLoad();
openNewBookButton();
mainProgram();
removeBooks();