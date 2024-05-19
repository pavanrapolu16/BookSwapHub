document.getElementById('BookSwapHub').addEventListener('click', function() {
    window.location.reload();
});

// Get the current year
const currentYear = new Date().getFullYear();

// Update the span element with the current year
document.getElementById('current-year').textContent = currentYear;
