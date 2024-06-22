let imageBlob = null;
let cropper;

document.getElementById('image').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const cropImage = document.getElementById('crop-image');
        cropImage.src = e.target.result;
        cropImage.onload = async function() {
            const src = cv.imread(cropImage);
            const dst = new cv.Mat();
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
            cv.threshold(dst, dst, 120, 200, cv.THRESH_BINARY);
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
            cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

            let maxArea = 0;
            let maxContour = null;
            for (let i = 0; i < contours.size(); i++) {
                const contour = contours.get(i);
                const area = cv.contourArea(contour);
                if (area > maxArea) {
                    maxArea = area;
                    maxContour = contour;
                }
            }

            const rect = cv.boundingRect(maxContour);
            cv.rectangle(src, new cv.Point(rect.x, rect.y), new cv.Point(rect.x + rect.width, rect.y + rect.height), [255, 0, 0, 255]);

            cropper = new Cropper(cropImage, {
                aspectRatio: 0,
                viewMode: 1,
                minContainerWidth: 300,
                minContainerHeight: 300,
                ready: function () {
                    cropper.setCropBoxData({
                        left: rect.x,
                        top: rect.y,
                        width: rect.width,
                        height: rect.height
                    });
                }
            });

            cv.imshow('canvasOutput', src);
            src.delete();
            dst.delete();
            contours.delete();
            hierarchy.delete();
        };

        document.getElementById('crop-modal').style.display = 'block';
    };
    reader.readAsDataURL(file);
});

document.getElementById('crop-button').addEventListener('click', function() {
    const canvas = cropper.getCroppedCanvas();
    canvas.toBlob(function(blob) {
        imageBlob = blob;
        document.getElementById('crop-modal').style.display = 'none';
    }, 'image/jpeg');
});

document.getElementById('cancel-crop').addEventListener('click', function() {
  document.getElementById('crop-image').src = '';
  document.getElementById('image').value = '';
  if (cropper) {
      cropper.destroy();
      cropper = null;
  }
  document.getElementById('crop-modal').style.display = 'none';
});

// Book upload form handling
document.getElementById('upload-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  showLoading('Uploading Book...');

  try {
    let imageUrl = '';
    if (imageBlob) {
      const formData = new FormData();
      formData.append('image', imageBlob, 'croppedImage.jpg');

      const imageResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const imageData = await imageResponse.json();
      if (!imageResponse.ok) {
        throw new Error(imageData.error || 'Failed to upload image');
      }
      imageUrl = imageData.imageUrl;
    }

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

    const bookResponse = await fetch('/api/books/uploadToDB', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });

    const bookResult = await bookResponse.json();
    if (!bookResponse.ok) {
      throw new Error(bookResult.error || 'Failed to upload book data');
    }

    alert('Book added successfully');
    // const books = (await getBooksFromCache()) || [];    
    // const excludedKeys = ['name', 'mobile', 'email', 'ID', 'class'];
    // const bookInfo = {};
    // for (const key in bookData) {
    //   if (!excludedKeys.includes(key)) {
    //     bookInfo[key] = bookData[key];
    //   }
    // }
    // books.push(bookInfo);
    // await saveBooksToCache(books);
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to upload book. Please try again.');
  } finally {
  }
  hideLoading();
});


document.getElementById('cancel-upload').addEventListener('click', () => {
  document.getElementById('upload-form-container').style.visibility = 'hidden';
  document.getElementById('upload-form-container').style.opacity = '0';
});

document.getElementById('upload-button').addEventListener('click', () => {
  document.getElementById('upload-form-container').style.visibility = 'visible';
  document.getElementById('upload-form-container').style.opacity = '1';
});
