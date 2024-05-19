document.getElementById('upload-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Create a FormData object to handle file upload
  const formData = new FormData();
  formData.append('image', document.getElementById('image').files[0]);

  const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
  const data = await response.json();

  // Extract the imageUrl from the response
  const imageUrl = data.imageUrl;

  const bookData = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    description: document.getElementById('description').value,
    image: imageUrl,
    language: document.getElementById('language').value,
    category: document.getElementById('category').value,
    name: document.getElementById('name').value,
    mobile: document.getElementById('mobile').value,
    email: document.getElementById('email').value,
    ID: document.getElementById('ID').value,
    class: document.getElementById('class').value
  };
  console.log(bookData)

  fetch('/api/books/uploadToDB', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    if (data.message === 'Book added successfully') {
      document.getElementById('upload-form-container').style.visibility = 'hidden';
      document.getElementById('upload-form-container').style.opacity = '0';
      // Optionally, add the new book to the book list dynamically
      createBookCard(data.bookId, bookData.title, bookData.author, bookData.image);
      window.location.reload();
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to upload book. Please try again.');
  });
});

document.getElementById('cancel-upload').addEventListener('click', () => {
  document.getElementById('upload-form-container').style.visibility = 'hidden';
  document.getElementById('upload-form-container').style.opacity = '0';
});


document.getElementById('upload-button').addEventListener('click', () => {
  document.getElementById('upload-form-container').style.visibility = 'visible';
  document.getElementById('upload-form-container').style.opacity = '1';
});

  