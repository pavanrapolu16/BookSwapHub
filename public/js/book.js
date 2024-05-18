function createBookCard(id, title, author, image) {
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
      document.getElementById('ask-now-form').dataset.bookId = id; // Store the book ID
    });
    bookCard.appendChild(button);
  
    bookList.appendChild(bookCard);
  }
  
  // Fetch and display books from the server
  fetch('/api/books')
    .then(response => response.json())
    .then(books => {
      books.forEach(book => {
        createBookCard(book.id, book.title, book.author, book.image);
      });
    })
    .catch(error => console.error('Error fetching books:', error));
  