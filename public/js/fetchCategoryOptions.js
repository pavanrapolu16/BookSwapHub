const categorySelect = document.getElementById('category');

function fetchCategories() {
fetch('/api/books/getCategoriesOptions')
    .then(response => response.json())
    .then(data => {
        data.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }).catch(error => {
        console.error('Error fetching categories:', error);
    });
}

fetchCategories();