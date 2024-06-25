function updateTotalBooksCount(count) {
  const totalBooksCountElement = document.getElementById('total-books-count');
  totalBooksCountElement.textContent = count;
}

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
  // p.style.display="None";

  const lang = document.createElement('p');
  lang.textContent = `Language: ${language}`;
  bookCard.appendChild(lang);
  
  const categories = document.createElement('p');
  categories.textContent = `Category : ${category}`;
  bookCard.appendChild(categories);
  categories.style.display="None";

  const newBox=document.createElement('div');

  const button = document.createElement('button');
  button.id="ask-now-button"
  button.textContent = 'Ask Now';
  button.style.paddingRight="11%"
  button.style.paddingLeft="11%"
  button.addEventListener('click', function() {
    document.getElementById('terms-popup').style.display = 'flex';
    document.getElementById('accept-terms-button').addEventListener('click', function() {
      document.getElementById('terms-popup').style.display = 'none';
      document.getElementById('ask-now-form-container').style.visibility = 'visible';
      document.getElementById('ask-now-form-container').style.opacity = '1';
      document.getElementById('upload-form-container').style.visibility = 'hidden';
      document.getElementById('upload-form-container').style.opacity = '0';
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
  // viewMorebutton.style.marginLeft="10px"
  viewMorebutton.dataset.bookId=id;
  viewMorebutton.addEventListener('click', () => {
    const bookId = viewMorebutton.dataset.bookId;
    console.log(bookId);
    showLoading("Loading Book details");
    // Navigate to the new page
    window.location.href = `/api/books/viewMore/${bookId}`;
    hideLoading();
  });
  newBox.appendChild(viewMorebutton);

  bookCard.appendChild(newBox)

  

  return bookCard;
}

const DB_NAME = 'BooksDB';
const DB_VERSION = 1;
const STORE_NAME = 'books';
const CACHE_EXPIRY_STORE_NAME = 'cacheExpiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(CACHE_EXPIRY_STORE_NAME)) {
        db.createObjectStore(CACHE_EXPIRY_STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const saveBooksToCache = async (books) => {
  const db = await openDatabase();

  const transaction = db.transaction([STORE_NAME, CACHE_EXPIRY_STORE_NAME], 'readwrite');
  const bookStore = transaction.objectStore(STORE_NAME);
  const expiryStore = transaction.objectStore(CACHE_EXPIRY_STORE_NAME);

  // Clear existing data
  bookStore.clear();
  expiryStore.clear();

  // Remove owner details and add books to store
  books.forEach(book => {
    const { owner, ...bookWithoutOwner } = book;
    bookStore.add(bookWithoutOwner);
  });

  // Set cache expiry time
  expiryStore.add({ key: 'expiry', value: Date.now() + CACHE_DURATION });

  return transaction.complete;
};

const getBooksFromCache = async () => {
  const db = await openDatabase();
  const transaction = db.transaction([STORE_NAME, CACHE_EXPIRY_STORE_NAME], 'readonly');
  const bookStore = transaction.objectStore(STORE_NAME);
  const expiryStore = transaction.objectStore(CACHE_EXPIRY_STORE_NAME);

  const expiry = await expiryStore.get('expiry');
  if (expiry && Date.now() > expiry.value) {
    // Cache has expired
    await clearCache(db);
    return null;
  }

  return new Promise((resolve, reject) => {
    hideLoading();
    const request = bookStore.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const clearCache = (db) => {
  const transaction = db.transaction([STORE_NAME, CACHE_EXPIRY_STORE_NAME], 'readwrite');
  transaction.objectStore(STORE_NAME).clear();
  transaction.objectStore(CACHE_EXPIRY_STORE_NAME).clear();
  return transaction.complete;
};

const fetchBooksFromServerAndSave = async () => {
  try {
    const response = await fetch('/api/books');
    const books = await response.json();
    updateTotalBooksCount(books.length);
    await saveBooksToCache(books);
    hideLoading()
    return books;
  } catch (error) {
    console.error('Error fetching books from server:', error);
    hideLoading()
    return null;
  }
};

const fetchAndDisplayBooks = async () => {
  showLoading('Loading Books...');

  let books = await getBooksFromCache();
  if (books && books.length > 0) {
    hideLoading()
    displayBooksByCategory(books);
  }
  
  books = await fetchBooksFromServerAndSave();
  if (books) {
    hideLoading();
    displayBooksByCategory(books);
  }

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