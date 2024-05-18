
function createBookCard(title, author, image) {
    const bookList = document.getElementById('book-list');
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
  
    const img = document.createElement('img');
    img.src = image;
    img.alt = title;
    bookCard.appendChild(img);
  
    const h3 = document.createElement('h3');
    h3.textContent = title;
    bookCard.appendChild(h3);
  
    const p = document.createElement('p');
    p.textContent = author;
    bookCard.appendChild(p);
  
    const button = document.createElement('button');
    button.textContent = 'Ask Now';
    button.addEventListener('click', function() {
      document.getElementById('ask-now-form-container').style.visibility = 'visible';
      document.getElementById('ask-now-form-container').style.opacity = '1';
    });
    bookCard.appendChild(button);
  
    bookList.appendChild(bookCard);
}
  
// Sample book data
const sampleBooks = [
    {
        title:"Harry Poter",
        author:"J.K Rowling",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLwCqBEJHkc5YZ-pE0z79jH7b3QU4O74lhtw&s"
    },
    {
        title: "Four Past Midnight",
        author: "Stephen King",
        image: "https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg",
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        image: "https://images-na.ssl-images-amazon.com/images/I/81YPgi4vpDL.jpg",
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        image: "https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg",
    },
    {
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        image: "https://images-na.ssl-images-amazon.com/images/I/71OFqSRFDgL.jpg",
    },
    {
        title: "1984",
        author: "George Orwell",
        image: "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg",
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        image: "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
    },
    {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        image: "https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg",
    }, 
    {
    title: "War and Peace",
    author: "Leo Tolstoy",
    image: "https://images.penguinrandomhouse.com/cover/9781400079988",
    },
    
    {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1382846449l/7144.jpg",
    },
    {
    title: "Brave New World",
    author: "Aldous Huxley",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1575509280l/5129._SY475_.jpg",
    },
    {
    title: "The Alchemist",
    author: "Paulo Coelho",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1483412266l/865.jpg",
    },
    {
    title: "Moby-Dick",
    author: "Herman Melville",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327940656l/153747.jpg",
    },
    {
    title: "The Odyssey",
    author: "Homer",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1390173285l/1381.jpg",
    },
    {
    title: "The Iliad",
    author: "Homer",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388188509l/1371.jpg",
    },
    {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1320399351l/1885.jpg",
    },
    {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690l/2657._SY475_.jpg",
    },
    {
    title: "1984",
    author: "George Orwell",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348990566l/5470.jpg",
    },
    {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1490528560l/4671.jpg",
    },
    {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1398034300l/5107.jpg",
    },
    {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327867269l/10210.jpg",
    },
    {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1383718290l/13079982.jpg",
    },
    {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546071216l/5907.jpg",
    }
// Add more sample books here
];
  
// Add sample books to the book list
sampleBooks.forEach(book => {
    createBookCard(book.title, book.author, book.image);
});
  
// Show the upload book form when the upload button is clicked
    document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('upload-form-container').style.visibility = 'visible';
    document.getElementById('upload-form-container').style.opacity = '1';
});
  
// Hide the upload book form when the cancel button is clicked
document.getElementById('cancel-upload').addEventListener('click', function() {
    document.getElementById('upload-form-container').style.visibility = 'hidden';
    document.getElementById('upload-form-container').style.opacity = '0';
});
  
// Handle upload form submission
  document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle form submission
    alert('Book uploaded successfully!');
    document.getElementById('upload-form-container').style.visibility = 'hidden';
    document.getElementById('upload-form-container').style.opacity = '0';
});
  
// Hide the "Ask Now" form when the cancel button is clicked
  document.getElementById('cancel-ask-now').addEventListener('click', function() {
    document.getElementById('ask-now-form-container').style.visibility = 'hidden';
    document.getElementById('ask-now-form-container').style.opacity = '0';
});
  
// Handle "Ask Now" form submission
  document.getElementById('ask-now-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle form submission
    alert('Your request has been submitted.');
    // Hide the form
    document.getElementById('ask-now-form-container').style.visibility = 'hidden';
    document.getElementById('ask-now-form-container').style.opacity = '0';
});


document.getElementById('search-bar').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const bookCards = document.querySelectorAll('.book-card');
  
    bookCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const author = card.querySelector('p').textContent.toLowerCase();
  
      if (title.includes(searchTerm) || author.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
  