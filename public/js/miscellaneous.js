document.getElementById('BookSwapHub').addEventListener('click', function() {
    window.location.reload();
});

// Get the current year
const currentYear = new Date().getFullYear();

// Update the span element with the current year
document.getElementById('current-year').textContent = currentYear; 

// script.js
function toggleContact() {
    const contactModal = document.getElementById('contact-modal');
    if (contactModal.style.display === "none" || contactModal.style.display === "") {
        contactModal.style.display = "flex";
    } else {
        contactModal.style.display = "none";
    }
}