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

let myLibrary = [];

function Book(author, title, pages, read)
{
    // constructor
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary() 
{

}

// Function call
openNewBookButton();