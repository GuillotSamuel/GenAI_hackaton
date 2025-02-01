// Helper function for suggestion items with keyboard navigation
function createSuggestionItem(text) {
  const item = document.createElement('div');
  item.textContent = text;
  item.setAttribute('role', 'option');
  item.tabIndex = 0;
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clientNameInput.value = text;
      suggestionsDiv.innerHTML = '';
      clientNameInput.focus();
    } else if (e.key === 'ArrowDown') {
      if (item.nextElementSibling) {
        item.nextElementSibling.focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (item.previousElementSibling) {
        item.previousElementSibling.focus();
      } else {
        clientNameInput.focus();
      }
      e.preventDefault();
    }
  });
  item.addEventListener('click', () => {
    clientNameInput.value = text;
    suggestionsDiv.innerHTML = '';
    clientNameInput.focus();
  });
  return item;
}


let citiesData = [];

// DOM Elements for suggestions and messages
const suggestionsDiv = document.getElementById('suggestions');
const messageDiv = document.getElementById('message');
const clientNameInput = document.getElementById('clientName');

// Show spinner while loading CSV data for suggestions (existing functionality)
suggestionsDiv.innerHTML = "<div class='spinner'></div>";

fetch('data/v_commune_2024.csv')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du fichier CSV.');
    }
    return response.text();
  })
  .then(csvData => {
    const rows = csvData.split('\n');
    rows.forEach(row => {
      const columns = row.split(',');
      if (columns.length > 1) {
        citiesData.push({
          code: columns[1].trim(),
          cityName: columns[7].trim(),
          departmentCode: columns[3].trim()
        });
      }
    });
    suggestionsDiv.innerHTML = '';
  })
  .catch(error => {
    console.error("Erreur lors du chargement du CSV:", error);
    suggestionsDiv.innerHTML = "Erreur de chargement des données.";
  });

// Debounce input events for suggestions
let debounceTimer;
clientNameInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const inputValue = clientNameInput.value.trim();
    suggestionsDiv.innerHTML = '';
    if (inputValue.length === 0) return;
    const filteredCities = citiesData.filter(city =>
      city.cityName.toLowerCase().includes(inputValue.toLowerCase()) ||
      city.departmentCode.includes(inputValue)
    );
    if (filteredCities.length > 0) {
      filteredCities.forEach(city => {
        const cleanCityName = city.cityName.replace(/["\)]/g, '');
        const cleanDepartmentCode = city.departmentCode.replace(/["\)]/g, '');
        const displayText = `${cleanCityName} ${cleanDepartmentCode}`;
        suggestionsDiv.appendChild(createSuggestionItem(displayText));
      });
    } else {
      suggestionsDiv.textContent = 'Aucune ville ou département trouvé.';
    }
  }, 300);
});

clientNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    const firstSuggestion = suggestionsDiv.querySelector('div');
    if (firstSuggestion) {
      firstSuggestion.focus();
      e.preventDefault();
    }
  }
});

// Generate Button functionality (existing)
document.getElementById('generateFileBtn').addEventListener('click', () => {
  const clientName = clientNameInput.value.trim();
  if (!clientName) {
    messageDiv.textContent = 'Veuillez entrer un nom de ville ou de département.';
    messageDiv.className = 'message error';
    return;
  }
  messageDiv.textContent = 'Traitement en cours...';
  messageDiv.className = 'message';
  fetch('src/main.py', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientName })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur HTTP ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      messageDiv.textContent = data.message || 'Fichier généré avec succès.';
      messageDiv.className = 'message success';
      // Simulate updating the generated sheet preview
      document.getElementById('generatedSheet').innerHTML = `<p>${data.message || 'Fiche client générée.'}</p>`;
    })
    .catch(error => {
      console.error("Erreur lors de la génération du fichier:", error);
      messageDiv.textContent = 'Erreur lors de la génération du fichier.';
      messageDiv.className = 'message error';
    });
});

// File Import Functionality
document.getElementById('excelFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const importMessage = document.getElementById('importMessage');
  const aggregatedPreview = document.getElementById('aggregatedPreview');
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      // Simulate processing of internal data file (Excel/CSV)
      const content = evt.target.result;
      aggregatedPreview.textContent = "Aperçu des données importées: " + content.slice(0, 200) + "...";
      importMessage.textContent = "Fichier importé avec succès.";
    }
    reader.readAsText(file);
  } else {
    importMessage.textContent = "Aucun fichier sélectionné.";
  }
});

// Feedback Submission
document.getElementById('submitFeedback').addEventListener('click', function() {
  const feedbackText = document.getElementById('feedbackText').value;
  const feedbackMessage = document.getElementById('feedbackMessage');
  if (feedbackText.trim() === "") {
    feedbackMessage.textContent = "Veuillez entrer un commentaire.";
    feedbackMessage.className = "message error";
  } else {
    feedbackMessage.textContent = "Merci pour votre feedback!";
    feedbackMessage.className = "message success";
  }
});