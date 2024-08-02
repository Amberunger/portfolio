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
