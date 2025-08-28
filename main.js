document.addEventListener('DOMContentLoaded', () => {

    /**
     * Helper function to log user interactions for research.
     * In a real study, this would send data to a server.
     * @param {string} eventType - The type of event (e.g., 'click', 'error').
     * @param {string} message - A description of the event.
     */
    function logInteraction(eventType, message) {
        console.log(`[Interaction Log] ${new Date().toISOString()} - ${eventType}: ${message}`);
    }

    const startButton = document.getElementById('start-btn');
    if (startButton) {
        startButton.addEventListener('click', (event) => {
            logInteraction('button_click', 'User clicked the Start Experiment button.');
            // Implement a delayed response to frustrate the user
            event.target.textContent = 'Please Wait...';
            event.target.disabled = true;

            setTimeout(() => {
                window.location.href = 'pages/prototype.html';
            }, 5000); // 5-second delay before redirect
        });
    }

    // Prototype page frustration logic
    if (document.title.includes('Prototype')) {
        logInteraction('page_load', 'Prototype page loaded, starting frustration test.');
        
        const prototypeContainer = document.querySelector('main');
        let errorCount = 0;

        // Misleading button logic
        const fakeButton = document.createElement('button');
        fakeButton.textContent = 'Submit Form';
        fakeButton.className = 'frustrating-btn';
        prototypeContainer.appendChild(fakeButton);

        fakeButton.addEventListener('click', () => {
            errorCount++;
            logInteraction('prototype_error', `User clicked a fake button. Error count: ${errorCount}`);
            // Randomly trigger a misleading popup
            if (Math.random() > 0.5) {
                alert('That was not the correct button. Please try again.');
            }
        });
    }

    // Survey page frustration logic
    if (document.title.includes('Survey')) {
        logInteraction('page_load', 'Survey page loaded. User is expected to recover from frustration.');

        // Slow-loading iframe for the survey
        const iframeContainer = document.querySelector('main');
        const iframe = document.createElement('iframe');
        iframe.src = 'https://forms.gle/qh2F6fXJiJkbBQGW8';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.opacity = '0';
        iframe.style.transition = 'opacity 5s ease-in';

        // Add fake buttons around the iframe
        const fakeButton1 = document.createElement('button');
        fakeButton1.textContent = 'Submit My Answers!';
        fakeButton1.className = 'frustrating-btn';

        const fakeButton2 = document.createElement('button');
        fakeButton2.textContent = 'Finalize Submission';
        fakeButton2.className = 'frustrating-btn';

        iframeContainer.innerHTML = `
            <h2>Thank you for participating!</h2>
            <p>Before you submit, please complete the form below. Your frustration levels will be monitored. (Note: The form may be a little slow to load, but don't give up!)</p>
            <div id="survey-frame-container" style="position:relative; width:100%; height:600px; overflow:hidden;"></div>
        `;
        document.getElementById('survey-frame-container').appendChild(iframe);
        iframeContainer.appendChild(fakeButton1);
        iframeContainer.appendChild(fakeButton2);

        // Fake button redirection
        fakeButton1.addEventListener('click', () => {
            logInteraction('survey_error', 'User clicked a fake survey button. Redirecting to home page.');
            window.location.href = '../index.html'; // Redirects user away
        });
        fakeButton2.addEventListener('click', () => {
            logInteraction('survey_error', 'User clicked a fake survey button. Opening a blank tab.');
            window.open('', '_blank'); // Opens a blank tab
        });

        // Make the iframe slowly appear
        setTimeout(() => {
            iframe.style.opacity = '1';
        }, 3000); // 3-second delay for iframe to start loading
    }
});

// A function to introduce delayed, random popups
function showRandomError() {
    if (Math.random() < 0.2) {
        alert('An unexpected error has occurred. Please refresh the page. (This is part of the experiment!)');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // Prototype page frustration logic
    if (document.title.includes('Prototype')) {
        // ... existing prototype code ...

        const form = document.getElementById('frustrating-form');
        const submitBtn = document.getElementById('submit-btn');
        const extraBtn = document.getElementById('extra-btn');
        const datePicker = document.getElementById('date-picker');
        let errorCount = 0;

        // Misleading button logic
        extraBtn.style.position = 'absolute';
        extraBtn.style.bottom = '-50px';
        extraBtn.style.left = '50%';
        extraBtn.style.transform = 'translateX(-50%)';

        extraBtn.addEventListener('click', (event) => {
            event.preventDefault(); // This is the "correct" button, but it's hidden and looks wrong
            logInteraction('recovery_success', 'User clicked the hidden correct button.');
            alert('Congratulations! You found the correct button. Redirecting to the survey.');
            setTimeout(() => {
                window.location.href = 'survey.html';
            }, 2000);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            errorCount++;
            logInteraction('form_submission_error', `User tried to submit the form. Error count: ${errorCount}`);
            
            // Randomly reject the date
            if (datePicker.value && Math.random() > 0.5) {
                alert('Invalid date. The form has been reset.');
                form.reset();
                logInteraction('form_reset', 'Form reset after random date rejection.');
            } else {
                alert('Something went wrong. The form has been reset.');
                form.reset();
                logInteraction('form_reset', 'Form reset after a generic error.');
            }

            // Provide a subtle hint after 3 failures
            if (errorCount >= 3) {
                document.getElementById('hint').style.display = 'block';
                logInteraction('recovery_hint', 'Hint displayed to the user.');
            }
        });
    }

    // ... existing code ...
});