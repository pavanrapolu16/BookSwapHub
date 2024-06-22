// public/script.js
document.getElementById('search-bar').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const bookCards = document.querySelectorAll('.book-card');

    // Create an array of book objects
    const books = [];
    bookCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('p').textContent.toLowerCase();
        const language = card.querySelector('p:nth-child(4)').textContent.toLowerCase();
        const category = card.querySelector('p:nth-child(5)').textContent.toLowerCase();
        books.push({ element: card, title, author, language, category });
    });

    // Set up Fuse.js options
    const options = {
        keys: ['title', 'author', 'language', 'category'],
        threshold: 0.3 // Adjust the threshold as needed (lower value means more strict matching)
    };

    // Create a new Fuse instance
    const fuse = new Fuse(books, options);

    // Perform the search
    const result = searchTerm ? fuse.search(searchTerm) : books.map(book => ({ item: book }));

    let booksFound = result.length > 0;

    // Update the display of book cards based on the search results
    bookCards.forEach(card => card.style.display = 'none'); // Hide all cards initially
    result.forEach(({ item }) => item.element.style.display = 'block'); // Show matched cards

    // Hide category headers if no books are found in that category
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(section => {
        const visibleBooks = section.querySelectorAll('.book-card:not([style*="display: none"])');
        section.style.display = visibleBooks.length > 0 ? 'block' : 'none';
    });

    // Hide language sections during search
    const languagesContainer = document.getElementById('languages');
    languagesContainer.style.display = searchTerm.length > 0 ? 'none' : 'block';

    // Display "No books found" message if no books match the search term
    let noBooksMessage = document.getElementById('no-books-message');
    if (!noBooksMessage) {
        noBooksMessage = document.createElement('p');
        noBooksMessage.id = 'no-books-message';
        noBooksMessage.textContent = 'No books found';
        document.getElementById('categories').appendChild(noBooksMessage);
    }

    noBooksMessage.style.display = booksFound ? 'none' : 'block';
});
