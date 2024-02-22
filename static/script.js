document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wineForm');
    const resultDiv = document.getElementById('predictionResult');

    form.onsubmit = async function(e) {
        e.preventDefault();

        // Clear previous results and errors
        resultDiv.innerHTML = '';
        resultDiv.style.display = 'none';

        const formData = new FormData(form);
        const data = {};
        let isValid = true;

        // Validate and collect form data
        formData.forEach((value, key) => {
            // Convert input value to float and validate
            const numValue = parseFloat(value);
            const inputElement = document.getElementById(key);
            const min = parseFloat(inputElement.min);
            const max = parseFloat(inputElement.max);

            if (isNaN(numValue) || numValue < min || numValue > max) {
                isValid = false;
                inputElement.classList.add('invalid-input'); // Highlight invalid input
                resultDiv.innerHTML += `Value for ${key.replace('_', ' ')} must be between ${min} and ${max}.<br/>`;
            } else {
                inputElement.classList.remove('invalid-input'); // Remove highlight from valid input
                data[key] = numValue;
            }
        });

        // Stop here if validation failed
        if (!isValid) {
            resultDiv.style.display = 'block';
            return;
        }

        // Display loading message or spinner
        resultDiv.innerHTML = 'Calculating...';
        resultDiv.style.display = 'block';

        // Send valid data to server
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            const result = await response.json();
            resultDiv.innerHTML = `Predicted Quality: ${result.prediction}`;
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
        }
    };
});