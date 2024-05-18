// Function to create a book card
function createBookCard(id, title, author, image, language, category) {
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

  const lang = document.createElement('p');
  lang.textContent = `Language: ${language}`;
  bookCard.appendChild(lang);

  const button = document.createElement('button');
  button.textContent = 'Ask Now';
  button.addEventListener('click', function() {
      document.getElementById('ask-now-form-container').style.visibility = 'visible';
      document.getElementById('ask-now-form-container').style.opacity = '1';
      document.getElementById('ask-now-form').dataset.bookId = id; // Store the book ID
  });
  bookCard.appendChild(button);

  return bookCard;
}

// Function to fetch books from the server
function fetchBooks() {
  fetch('/api/books')
      .then(response => response.json())
      .then(books => {
          displayBooksByCategory(books);
      })
      .catch(error => console.error('Error fetching books:', error));
}

// Function to display books categorized by genre and language
function displayBooksByCategory(books) {
  const categories = {};
  const languages = {};

  books.forEach(book => {
      if (!categories[book.category]) {
          categories[book.category] = [];
      }
      categories[book.category].push(book);

      if (!languages[book.language]) {
          languages[book.language] = [];
      }
      languages[book.language].push(book);
  });

  const categoriesContainer = document.getElementById('categories');
  categoriesContainer.innerHTML = '';

  for (const [category, books] of Object.entries(categories)) {
      const categorySection = document.createElement('div');
      categorySection.classList.add('category-section');

      const categoryTitle = document.createElement('h3');
      categoryTitle.textContent = category;
      categorySection.appendChild(categoryTitle);

      const bookList = document.createElement('div');
      bookList.classList.add('book-list');

      books.forEach(book => {
          const bookCard = createBookCard(book.id, book.title, book.author, book.image, book.language, book.category);
          bookList.appendChild(bookCard);
      });

      categorySection.appendChild(bookList);
      categoriesContainer.appendChild(categorySection);
  }

  const languagesContainer = document.getElementById('languages');
  languagesContainer.innerHTML = '';

  for (const [language, books] of Object.entries(languages)) {
      const languageSection = document.createElement('div');
      languageSection.classList.add('language-section');

      const languageTitle = document.createElement('h3');
      languageTitle.textContent = language;
      languageSection.appendChild(languageTitle);

      const bookList = document.createElement('div');
      bookList.classList.add('book-list');

      books.forEach(book => {
          const bookCard = createBookCard(book.id, book.title, book.author, book.image, book.language, book.category);
          bookList.appendChild(bookCard);
      });

      languageSection.appendChild(bookList);
      languagesContainer.appendChild(languageSection);
  }
}

// Call fetchBooks on page load
window.onload = fetchBooks;
