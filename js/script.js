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

// Constructor
function Book(author, title, pages, read, imageSource)
{
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.imageSource = imageSource;
}

// Appends book to page display
function appendBookToPage(index)
{
    const libraryContainer = document.querySelector(`#library-container`);

    const bookContainer = document.createElement(`div`);
    bookContainer.classList.add(`book-container`);

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

    author.textContent = myLibrary[index].author;
    title.textContent = myLibrary[index].title;
    pages.textContent = myLibrary[index].pages;
    read.textContent = myLibrary[index].read;

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

    bookContainer.appendChild(images);
    bookContainer.appendChild(author);
    bookContainer.appendChild(title);
    bookContainer.appendChild(pages);
    bookContainer.appendChild(read);

    libraryContainer.appendChild(bookContainer);
}

// Adds book object to myLibrary variable, and adds book to page display
function addBookToLibrary() 
{
    const submitButton = document.querySelector(`#submit-form-button`);

    const inputAuthor = document.querySelector(`#input-author`);
    const inputTitle = document.querySelector(`#input-title`);
    const inputPages = document.querySelector(`#input-pages`);
    const readSelection = document.querySelector(`#read-selection`);
    const uploadImage = document.querySelector(`#upload-image-button`);

    let src = ``;

    uploadImage.addEventListener(`change`, function(e)
    {
        if (this.files && this.files[0])
        {
            src = ``;
            src = URL.createObjectURL(this.files[0]);

            console.log(uploadImage);
        }
    });

    submitButton.addEventListener(`click`, function(e)
    {
        let author = inputAuthor.value;
        let title = inputTitle.value;

        // remember to add checking for pages
        let pages = inputPages.value + ` pages`;
        let selection = readSelection.value;

        const book = new Book(author, title, pages, selection, src);

        myLibrary.push(book);

        appendBookToPage(myLibrary.length - 1);

        inputAuthor.value = ``;
        inputTitle.value = ``;
        inputPages.value = ``;
        uploadImage.value = ``;
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
addBookToLibrary();