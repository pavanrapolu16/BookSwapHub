const showLoading = (message) => {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-message').textContent = message;
  };

  const hideLoading = () => {
    document.getElementById('loading-overlay').style.display = 'none';
    document.getElementById('loading').style.display = 'none';

  };

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

  const newBox=document.createElement('div');

  const button = document.createElement('button');
  button.id="ask-now-button"
  button.textContent = 'Ask Now';
  button.style.marginRight="10px"
  button.addEventListener('click', function() {
    document.getElementById('terms-popup').style.display = 'flex';
    document.getElementById('accept-terms-button').addEventListener('click', function() {
      document.getElementById('terms-popup').style.display = 'none';
      document.getElementById('ask-now-form-container').style.visibility = 'visible';
      document.getElementById('ask-now-form-container').style.opacity = '1';
    });
    document.getElementById('cancel-terms-button').addEventListener('click', function() {
      document.getElementById('terms-popup').style.display = 'none';
    });
    document.getElementById('ask-now-form').dataset.bookId = id; // Store the book ID
  });
  newBox.appendChild(button);

  const viewMorebutton = document.createElement('button');
  viewMorebutton.id="view-more-button"
  viewMorebutton.textContent = 'View More';
  viewMorebutton.style.marginLeft="10px"
  viewMorebutton.dataset.bookId=id;
  viewMorebutton.addEventListener('click', () => {
    const bookId = viewMorebutton.dataset.bookId;
    console.log(bookId);
    showLoading("Loading Book details");
    // Navigate to the new page
    window.location.href = `/api/books/viewMore/${bookId}`;
  });
  newBox.appendChild(viewMorebutton);

  bookCard.appendChild(newBox)

  

  return bookCard;
}

// Function to fetch books from the server
const CACHE_KEY = 'booksCache';
const CACHE_EXPIRY_KEY = 'booksCacheExpiry';
const CACHE_DURATION = 3600 * 1000; // 1 hour

const fetchBooksFromServer = async () => {
  try {
    const response = await fetch('/api/books');
    const books = await response.json();
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return null;
  }
};

// Function to remove owner details from books
const removeOwnerDetails = (books) => {
  return books.map(({ owner, ...bookWithoutOwner }) => bookWithoutOwner);
};

// Function to save books to cache without owner details
const saveBooksToCache = (books) => {
  const booksWithoutOwner = removeOwnerDetails(books);
  localStorage.setItem(CACHE_KEY, JSON.stringify(booksWithoutOwner));
  localStorage.setItem(CACHE_EXPIRY_KEY, Date.now() + CACHE_DURATION);
};

const getBooksFromCache = () => {
  const books = localStorage.getItem(CACHE_KEY);
  const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

  if (books && expiry && Date.now() < expiry) {
    return JSON.parse(books);
  }

  return null;
};

const fetchAndDisplayBooks = async () => {
  showLoading('Loading Books...');

  let books = getBooksFromCache();
  if (books) {
    displayBooksByCategory(books);
    hideLoading();
  }

  books = await fetchBooksFromServer();
  if (books) {
    saveBooksToCache(books);
    displayBooksByCategory(books);
  }

  hideLoading();
};

window.onload = fetchAndDisplayBooks;

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