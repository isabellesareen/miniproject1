const API_KEY = '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';

const form = document.getElementById('eventForm');
const submitBtn = document.getElementById('submitBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');
const errorMessage = document.getElementById('errorMessage');
const regenerateBtn = document.getElementById('regenerateBtn');
const eventTypeSelect = document.getElementById('eventType');
const otherEventGroup = document.getElementById('otherEventGroup');
const otherEventInput = document.getElementById('otherEventType');

// Show/hide "Other" event type input
eventTypeSelect.addEventListener('change', () => {
    if (eventTypeSelect.value === 'other') {
        otherEventGroup.style.display = 'block';
        otherEventInput.required = true;
    } else {
        otherEventGroup.style.display = 'none';
        otherEventInput.required = false;
        otherEventInput.value = '';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await generateEventPlan();
});

regenerateBtn.addEventListener('click', () => {
    resultsSection.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

async function generateEventPlan() {
    const formData = {
        eventType: document.getElementById('eventType').value,
        otherEventType: document.getElementById('otherEventType').value,
        location: document.getElementById('location').value,
        guestCount: document.getElementById('guestCount').value,
        budget: document.getElementById('budget').value,
        commuteDistance: document.getElementById('commuteDistance').value,
        eventDate: document.getElementById('eventDate').value,
        theme: document.getElementById('theme').value,
        dietary: document.getElementById('dietary').value,
        additional: document.getElementById('additional').value
    };

    // Use custom event type if "other" was selected
    const eventTypeDisplay = formData.eventType === 'other' ? formData.otherEventType : formData.eventType;

    const prompt = `You are an expert event planner. Based on the following details, provide comprehensive recommendations for planning this event. Include specific suggestions for venues, caterers, event planners, and other important services.

Event Details:
- Type: ${eventTypeDisplay}
- Location: ${formData.location}
- Number of Guests: ${formData.guestCount}
- Budget: $${formData.budget}
${formData.commuteDistance ? `- Maximum Commute Distance: ${formData.commuteDistance} miles` : ''}
${formData.eventDate ? `- Preferred Date: ${formData.eventDate}` : ''}
${formData.theme ? `- Theme/Color Scheme: ${formData.theme}` : ''}
${formData.dietary ? `- Dietary Restrictions: ${formData.dietary}` : ''}
${formData.additional ? `- Additional Requirements: ${formData.additional}` : ''}

Please provide:
1. Venue recommendations (3-4 specific venues with brief descriptions)
2. Catering options (2-3 caterers that match the budget and dietary needs)
3. Event planner/coordinator suggestions
4. Other essential services (photography, entertainment, decorations, etc.)
5. Budget breakdown estimate
6. Timeline and planning checklist

Format the response with clear headings and bullet points for easy reading.`;

    submitBtn.disabled = true;
    loadingSection.classList.add('show');
    errorMessage.classList.remove('show');
    resultsSection.classList.remove('show');

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 2000,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const result = data.content[0].text;

        displayResults(result);
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'An error occurred while generating your event plan. Please check your API key and try again.';
        errorMessage.classList.add('show');
    } finally {
        submitBtn.disabled = false;
        loadingSection.classList.remove('show');
    }
}

function displayResults(text) {
    const formatted = text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^(\d+\.\s+.+?)$/gm, '<li>$1</li>')
        .replace(/^[-•]\s+(.+?)$/gm, '<li>$1</li>');

    resultsContent.innerHTML = `<p>${formatted}</p>`;
    resultsSection.classList.add('show');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}