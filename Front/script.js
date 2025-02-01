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
          departmentCode: columns[3]
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
          code: columns[3],
          regionName: columns[8]
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

// Fonction de normalisation mise à jour pour enlever les accents et les tirets
function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Supprime les accents
    .replace(/-/g, ' ')               // Remplace les tirets par des espaces
    .trim();
}

  function setupSearch() {
    let debounceTimer;

    clientNameInput.addEventListener('input', () => {
      // Dès que l'utilisateur commence à taper, on efface le message d'erreur
      if (clientNameInput.value.trim() !== '') {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
      }
      
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const searchTerm = clientNameInput.value.trim();
        const searchTermNormalized = normalizeString(searchTerm);
        suggestionsDiv.innerHTML = '';
    
        if (searchTermNormalized.length < 2) {
          suggestionsDiv.classList.remove('show');
          return;
        }
    
        // Recherche par catégories avec startsWith et normalisation pour ignorer la casse et les accents
        const regionResults = regionsData.filter(d => 
          normalizeString(d.regionName).startsWith(searchTermNormalized) ||
          normalizeString(d.code).startsWith(searchTermNormalized)
        );
        const departmentResults = departmentData.filter(d => 
          normalizeString(d.departmentName).startsWith(searchTermNormalized) ||
          normalizeString(d.code).startsWith(searchTermNormalized)
        );
        const cityResults = citiesData.filter(c => 
          normalizeString(c.cityName).startsWith(searchTermNormalized) ||
          normalizeString(c.departmentCode).startsWith(searchTermNormalized)
        );
    
        // Fonction pour ajouter un header pour chaque groupe
        function appendHeader(text) {
          const header = document.createElement('div');
          header.textContent = text;
          header.className = 'suggestions-header';
          suggestionsDiv.appendChild(header);
        }
    
        let resultsFound = false;
    
        if (regionResults.length > 0) {
          appendHeader('Régions');
          regionResults.forEach(item => {
            suggestionsDiv.appendChild(createSuggestionItem(`${item.regionName} (${item.code})`));
          });
          resultsFound = true;
        }
    
        if (departmentResults.length > 0) {
          appendHeader('Départements');
          departmentResults.forEach(item => {
            suggestionsDiv.appendChild(createSuggestionItem(`${item.departmentName} (${item.code})`));
          });
          resultsFound = true;
        }
    
        if (cityResults.length > 0) {
          appendHeader('Communes');
          cityResults.forEach(item => {
            suggestionsDiv.appendChild(createSuggestionItem(`${item.cityName} (${item.departmentCode})`));
          });
          resultsFound = true;
        }
    
        if (resultsFound) {
          suggestionsDiv.classList.add('show');
        } else {
          suggestionsDiv.textContent = 'Aucun résultat trouvé';
          suggestionsDiv.classList.add('show');
        }
      }, 300);
    });
  }

// Ajout d'un écouteur pour effacer le message d'erreur lorsque l'input est vide
clientNameInput.addEventListener('input', () => {
  if (clientNameInput.value.trim() === '') {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
  }
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