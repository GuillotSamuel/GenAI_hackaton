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
let regionsData = [];
let departmentData = [];


// DOM Elements for suggestions and messages
const suggestionsDiv = document.getElementById('suggestions');
const messageDiv = document.getElementById('message');
const clientNameInput = document.getElementById('clientName');

// Show spinner while loading CSV data for suggestions (existing functionality)
suggestionsDiv.innerHTML = "<div class='spinner'></div>";

fetch('data/v_commune_2024.csv')
  .then(response => {
    if (!response.ok) throw new Error('Erreur lors du chargement du fichier CSV.');
    return response.text();
  })
  .then(csvData => {
    // Nettoyage et traitement du CSV
    const rows = csvData
      .split('\n')
      .slice(1) // On ignore l'en-tête
      .filter(row => row.trim() !== ''); // Filtre les lignes vides

    rows.forEach(row => {
      // Découpage des colonnes en gérant les guillemets
      const columns = row
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/) // Regex pour ignorer les virgules dans les guillemets
        .map(col => col.replace(/^"|"$/g, '').trim()); // Nettoyage des guillemets

      const type = columns[0];
      
      if (type === "COM" && columns.length > 9) {
        citiesData.push({
          code: columns[1],
          cityName: columns[9], // LIBELLE à l'index 9
          departmentCode: columns[1]
        });
      }
      else if (type === "DEP" && columns.length > 9) {
        departmentData.push({
          code: columns[1],
          departmentName: columns[8]
        });
      }
      else if (type === "REG" && columns.length > 9) {
        regionsData.push({
          code: columns[1],
          regionName: columns[9]
        });
      }
    });

    // Gestion de la recherche (une seule fois après chargement)
    setupSearch();
  })
  .catch(error => {
    console.error("Erreur CSV:", error);
    suggestionsDiv.innerHTML = "Erreur de chargement des données";
  });

function setupSearch() {
  let debounceTimer;

  clientNameInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const searchTerm = clientNameInput.value.trim().toLowerCase();
      suggestionsDiv.innerHTML = '';

      if (searchTerm.length < 2) return;

      // Recherche combinée
      const results = [
        ...citiesData.filter(c => 
          c.cityName.toLowerCase().includes(searchTerm) ||
          c.departmentCode.toLowerCase() === searchTerm
        ),
        ...departmentData.filter(d => 
          d.departmentName.toLowerCase().includes(searchTerm) ||
          d.code.toLowerCase() === searchTerm
        )
      ];

      // Affichage des résultats
      if (results.length > 0) {
        results.forEach(item => {
          const isCity = 'cityName' in item;
          const text = isCity 
            ? `${item.cityName} (${item.departmentCode})`
            : `${item.departmentName} [Département ${item.code}]`;
            
          suggestionsDiv.appendChild(createSuggestionItem(text));
        });
      } else {
        suggestionsDiv.textContent = 'Aucun résultat trouvé';
      }
    }, 300);
  });
}

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