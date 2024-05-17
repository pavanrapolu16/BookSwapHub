// script.js

document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('upload-form-container').style.visibility = 'visible';
    document.getElementById('upload-form-container').style.opacity = '1';
  });
  
  document.getElementById('cancel-upload').addEventListener('click', function() {
    document.getElementById('upload-form-container').style.visibility = 'hidden';
    document.getElementById('upload-form-container').style.opacity = '0';
  });
  
  document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle form submission
    alert('Book uploaded successfully!');
    document.getElementById('upload-form-container').style.visibility = 'hidden';
    document.getElementById('upload-form-container').style.opacity = '0';
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

// books.js (This script can be included directly in the HTML or loaded as a separate file)

const books = [
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
    // Add more book objects here
  ];

  
  
document.addEventListener('DOMContentLoaded', function() {
    const bookList = document.querySelector('.book-list');
    
    // Function to create a book card
    function createBookCard(book) {
      const card = document.createElement('div');
      card.className = 'book-card';
      
      const img = document.createElement('img');
      img.src = book.image;
      img.alt = `Cover of ${book.title}`;
      
      const title = document.createElement('h3');
      title.textContent = book.title;
      
      const author = document.createElement('p');
      author.textContent = book.author;
      
      const button = document.createElement('button');
      button.id="askNow"
      button.textContent = 'Ask Now';
      
      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(author);
      card.appendChild(button);
      
      return card;
    }
  
    // Function to load book cards dynamically
    function loadBookCards() {
      books.forEach(book => {
        const bookCard = createBookCard(book);
        bookList.appendChild(bookCard);
      });
    }

    
    loadBookCards();
})
