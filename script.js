document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quoteForm');
    const successMessage = document.getElementById('success-message');
    const phoneInput = document.getElementById('phone');
    const jobTypeSelect = document.getElementById('jobType');

    // ============================================
    // GA4 EVENT TRACKING - LEAD GENERATION
    // ============================================
    
    /**
     * Helper function to send GA4 events
     * @param {string} eventName - The event name (e.g., 'call_click', 'form_submit')
     * @param {string} category - Event category (e.g., 'lead')
     * @param {string} label - Event label for additional context
     */
    function trackGA4Event(eventName, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': category,
                'event_label': label
            });
        }
    }

    // Track phone call clicks (tel: links)
    // This fires when a user clicks any phone number link on the page
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function(phoneLink) {
        phoneLink.addEventListener('click', function() {
            trackGA4Event('call_click', 'lead', 'phone');
        });
    });

    // Map job type values to readable labels
    const jobTypeLabels = {
        'gravel-aggregate': 'Gravel/Aggregate',
        'dirt-topsoil': 'Dirt/Topsoil',
        'sand': 'Sand',
        'asphalt': 'Asphalt Hauling',
        'demo': 'Demo Haul-Off',
        'material-delivery': 'Material Delivery',
        'other': 'Other'
    };

    // Clean phone input on blur
    phoneInput.addEventListener('blur', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length === 10) {
            this.value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
        } else {
            this.value = value;
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = phoneInput.value.replace(/\D/g, '');
        const jobType = jobTypeSelect.value;
        const location = document.getElementById('location').value.trim();
        const details = document.getElementById('details').value.trim();

        // Build email body with clear formatting
        const emailBody = `New Quote Request from Ohio Valley Hauling Website

Name: ${name}
Phone: ${phone}
Job Type: ${jobTypeLabels[jobType] || jobType}
Location: ${location}
Project Details: ${details || 'N/A'}

---
Submitted via website form`;

        // Create mailto link to ohiovalleyholdings@gmail.com
        const emailSubject = encodeURIComponent('New Quote Request - ' + (jobTypeLabels[jobType] || 'General'));
        const emailBodyEncoded = encodeURIComponent(emailBody);
        const mailtoLink = `mailto:ohiovalleyholdings@gmail.com?subject=${emailSubject}&body=${emailBodyEncoded}`;

        // Open mailto link without redirecting the page
        // Create a temporary link element, click it, then remove it
        const tempLink = document.createElement('a');
        tempLink.href = mailtoLink;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        // Hide form and show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Track form submission in GA4
        // This fires when the form is successfully submitted and success message is shown
        trackGA4Event('form_submit', 'lead', 'quote_form');

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Reset form (for when it's shown again if needed)
        form.reset();
    });
});

