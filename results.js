const backBtn = document.getElementById('backBtn');

// Get form data from URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Back button functionality
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Populate the template when page loads
window.addEventListener('DOMContentLoaded', () => {
    populateTemplate();
});

function populateTemplate() {
    // Get all form data from URL
    const eventType = urlParams.get('eventType');
    const otherEventType = urlParams.get('otherEventType');
    const location = urlParams.get('location');
    const guestCount = urlParams.get('guestCount');
    const budget = urlParams.get('budget');
    const commuteDistance = urlParams.get('commuteDistance');
    const eventDate = urlParams.get('eventDate');
    const theme = urlParams.get('theme');
    const dietary = urlParams.get('dietary');
    const additional = urlParams.get('additional');

    // Populate Event Overview
    const displayEventType = eventType === 'other' ? otherEventType : eventType;
    document.getElementById('eventType').textContent = displayEventType || 'Not specified';
    document.getElementById('location').textContent = location || 'Not specified';
    document.getElementById('guestCount').textContent = guestCount || 'Not specified';
    document.getElementById('budget').textContent = budget ? parseInt(budget).toLocaleString() : 'Not specified';
    document.getElementById('totalBudget').textContent = budget ? parseInt(budget).toLocaleString() : 'Not specified';

    // Show optional fields if they have values
    if (eventDate) {
        document.getElementById('dateSection').style.display = 'block';
        document.getElementById('eventDate').textContent = eventDate;
    }

    if (theme) {
        document.getElementById('themeSection').style.display = 'block';
        document.getElementById('theme').textContent = theme;
    }

    if (dietary) {
        document.getElementById('dietaryNotes').style.display = 'block';
        document.getElementById('dietary').textContent = dietary;
    }

    if (additional) {
        document.getElementById('additionalNotes').style.display = 'block';
        document.getElementById('additional').textContent = additional;
    }

    if (commuteDistance) {
        document.getElementById('commuteNotes').style.display = 'block';
        document.getElementById('commuteDistance').textContent = commuteDistance;
    }
}