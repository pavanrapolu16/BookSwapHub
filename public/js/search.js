document.getElementById('search-bar').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const bookCards = document.querySelectorAll('.book-card');
    let booksFound = false;

    bookCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('p').textContent.toLowerCase();
        const language = card.querySelector('p:nth-child(4)').textContent.toLowerCase();
        const category=card.querySelector('p:nth-child(5)').textContent.toLowerCase();
        if (title.includes(searchTerm) || author.includes(searchTerm) || language.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = 'block';
            booksFound = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Hide category headers if no books are found in that category
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(section => {
        const visibleBooks = section.querySelectorAll('.book-card:not([style*="display: none"])');
        section.style.display = visibleBooks.length > 0 ? 'block' : 'none';
    });

    // Hide language sections during search
    const languagesContainer = document.getElementById('languages');
    if (searchTerm.length > 0) {
        languagesContainer.style.display = 'none';
    } else {
        languagesContainer.style.display = 'block';
    }

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
