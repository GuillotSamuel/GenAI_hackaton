let citiesData = [];

// Load CSV data with proper error handling
fetch('data/v_commune_2024.csv')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des données CSV.');
    }
    return response.text();
  })
  .then(csvData => {
    const rows = csvData.split('\n');
    rows.forEach(row => {
      const columns = row.split(',');
      if (columns.length > 1) {
        citiesData.push({
          code: columns[1],          // Code commune
          cityName: columns[7],      // Nom de la commune
          departmentCode: columns[3] // Code département
        });
      }
    });
  })
  .catch(error => {
    console.error("Erreur lors du chargement du CSV:", error);
  });

// DOM elements
const clientNameInput = document.getElementById('clientName');
const suggestionsDiv = document.getElementById('suggestions');
const messageDiv = document.getElementById('message');

// Input event for dynamic suggestions
clientNameInput.addEventListener('input', () => {
  const inputValue = clientNameInput.value.trim();
  suggestionsDiv.innerHTML = '';
  
  if (inputValue.length === 0) return;
  
  const filteredCities = citiesData.filter(city => {
    return city.cityName.toLowerCase().includes(inputValue.toLowerCase()) ||
           city.departmentCode.includes(inputValue);
  });
  
  if (filteredCities.length > 0) {
    filteredCities.forEach(city => {
      const suggestionItem = document.createElement('div');
      // Clean data by removing unwanted characters
      const cleanCityName = city.cityName.replace(/["\)]/g, '');
      const cleanDepartmentCode = city.departmentCode.replace(/["\)]/g, '');
      suggestionItem.textContent = `${cleanCityName} ${cleanDepartmentCode}`;
      suggestionItem.addEventListener('click', () => {
        clientNameInput.value = `${cleanCityName} ${cleanDepartmentCode}`;
        suggestionsDiv.innerHTML = '';
      });
      suggestionsDiv.appendChild(suggestionItem);
    });
  } else {
    suggestionsDiv.textContent = 'Aucune ville ou département trouvé.';
  }
});

// Button click to generate file via a POST request
document.getElementById('generateFileBtn').addEventListener('click', () => {
  const clientName = clientNameInput.value.trim();
  if (!clientName) {
    messageDiv.textContent = 'Veuillez entrer un nom de ville ou de département.';
    return;
  }
  
  fetch('src/main.py', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clientName })
  })
    .then(response => response.json())
    .then(data => {
      messageDiv.textContent = data.message || 'Fichier généré avec succès.';
    })
    .catch(error => {
      messageDiv.textContent = 'Erreur lors de la génération du fichier.';
    });
});