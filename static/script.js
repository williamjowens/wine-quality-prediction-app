document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wineForm');
    const resultDiv = document.getElementById('predictionResult');
    const glasses = document.querySelectorAll('.wine-glass');

    form.onsubmit = async function(e) {
        e.preventDefault();
        resultDiv.innerHTML = '';
        resultDiv.style.display = 'none';

        const formData = new FormData(form);
        const data = {};
        let isValid = true;

        formData.forEach((value, key) => {
            const numValue = parseFloat(value);
            const inputElement = document.getElementById(key);
            const glass = inputElement.closest('.form-group').querySelector('.wine-fill');
            const min = parseFloat(inputElement.min);
            const max = parseFloat(inputElement.max);

            if (isNaN(numValue) || numValue < min || numValue > max) {
                isValid = false;
                inputElement.classList.add('invalid-input');
                resultDiv.innerHTML += `Value for ${key.replace('_', ' ')} must be between ${min} and ${max}.<br/>`;
            } else {
                inputElement.classList.remove('invalid-input');
                data[key] = numValue;
                // Calculate fill height as a percentage
                const fillHeight = ((numValue - min) / (max - min)) * 100;
                glass.style.height = `${fillHeight}%`;
            }
        });

        if (!isValid) {
            resultDiv.style.display = 'block';
            return;
        }

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
        }
    };
});