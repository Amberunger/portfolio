document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add any additional JavaScript functionality here
    console.log("Welcome to my arcade & video games personal website!");
});
function toggleImage() {
    var imagePopup = document.getElementById('cert-image');
    if (imagePopup.style.display === 'none') {
        imagePopup.style.display = 'block';
    } else {
        imagePopup.style.display = 'none';
    }
}
// Function to format the date in a readable format
function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return month + '/' + day + '/' + year;
}

// Function to set the last updated date in the footer
function setLastUpdated() {
    var lastUpdated = new Date(document.lastModified);
    document.getElementById('last-updated').textContent = formatDate(lastUpdated);
}

// Call the function to set last updated date when the page is loaded
window.onload = function() {
    setLastUpdated();
};