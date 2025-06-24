document.addEventListener('DOMContentLoaded', () => {
    console.log('Contact Us page loaded');

    const apiService = new ApiService();
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const payload = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            services: formData.getAll('services'),
            message: formData.get('messages'),
            termsAccepted: formData.get('terms') ? true : false
        };

        try {
            await apiService.fetchAPI('/contact', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            alert('Thank you for contacting us! We will get back to you soon.');
            contactForm.reset();
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to submit message');
        }
    });
});
