document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.room-details-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Adjust offset if you have a fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}); 