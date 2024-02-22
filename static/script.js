document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wineForm');
    const resultDiv = document.getElementById('predictionResult');

    // Update value display and wine glass fill for each slider input
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', function() {
            updateValueDisplay(this.id, this.value);
            updateWineGlass();
        });
    });

    form.onsubmit = async function(e) {
        e.preventDefault();

        // Clear previous results and errors
        resultDiv.innerHTML = '';
        resultDiv.style.display = 'none';

        const data = {};
        let isValid = true;

        // Validate and collect form data from sliders
        document.querySelectorAll('input[type="range"]').forEach(input => {
            const numValue = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);

            if (isNaN(numValue) || numValue < min || numValue > max) {
                isValid = false;
                input.classList.add('invalid-input'); // Highlight invalid input
                resultDiv.innerHTML += `Value for ${input.id.replace('_', ' ')} must be between ${min} and ${max}.<br/>`;
            } else {
                input.classList.remove('invalid-input'); // Remove highlight from valid input
                data[input.id] = numValue;
            }
        });

        if (!isValid) {
            resultDiv.style.display = 'block';
            return;
        }

        // Display loading message
        resultDiv.innerHTML = 'Calculating...';
        resultDiv.style.display = 'block';

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
        } finally {
            resultDiv.style.display = 'block';
        }
    };
});

function updateValueDisplay(feature, value) {
    document.getElementById(`value-${feature}`).innerText = value;
}

function updateWineGlass() {
    // This example assumes a simplistic approach to updating the wine glass fill level.
    // Implement the logic based on the average value of all sliders or a specific feature's value.
    const sliders = document.querySelectorAll('input[type="range"]');
    let totalValue = 0;
    sliders.forEach(slider => {
        totalValue += parseFloat(slider.value);
    });
    const averageValue = totalValue / sliders.length;
    // Example: Update SVG fill level based on averageValue. Adjust logic as needed.
    // This part needs to be tailored to your SVG and the visual effect you desire.
}