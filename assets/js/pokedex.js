// Select necessary DOM elements
const pokemonList = document.getElementById("pokemon-list");
const notFoundMessage = document.getElementById("not-found-message");
const generationFilterBtn = document.getElementById("generation-filter-btn");
const generationDropdown = document.getElementById("generation-dropdown");
const generationCheckboxes = document.querySelectorAll('input[name="generation"]');

// Array to store all Pokemon
let allPokemons = [];

// Define ID ranges for each Pokemon generation
const generationRanges = {
  1: { start: 1, end: 151 },
  2: { start: 152, end: 251 },
  3: { start: 252, end: 386 },
  4: { start: 387, end: 493 },
  5: { start: 494, end: 649 },
  6: { start: 650, end: 721 },
  7: { start: 722, end: 809 },
  8: { start: 810, end: 905 },
  9: { start: 906, end: 1025 },
};

// Function to fetch Pokemon data from the API
function fetchPokemons() {
  const selectedGenerations = getSelectedGenerations();
  const promises = [];

  selectedGenerations.forEach(function (gen) {
    const range = generationRanges[gen];
    for (let i = range.start; i <= range.end; i++) {
      promises.push(
        fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(function (res) {
          return res.json();
        })
      );
    }
  });

  Promise.all(promises).then(function (results) {
    allPokemons = results;
    displayPokemons(allPokemons);
  });
}

// Function to get selected generations
function getSelectedGenerations() {
  return Array.from(generationCheckboxes)
    .filter(function (checkbox) {
      return checkbox.checked;
    })
    .map(function (checkbox) {
      return parseInt(checkbox.value);
    });
}

// Function to display Pokemon in the grid
function displayPokemons(pokemons) {
  pokemonList.innerHTML = "";

  pokemons.forEach(function (pokemon) {
    const pokemonCard = document.createElement("div");
    pokemonCard.className = "pokemon-card";
    pokemonCard.innerHTML = `
            <p class="pokemon-number">#${String(pokemon.id).padStart(3, "0")}</p>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image">            
            <h3 class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</h3>
        `;
    pokemonCard.addEventListener("click", function () {
      showPokemonDetails(pokemon);
    });
    pokemonList.appendChild(pokemonCard);
  });

  notFoundMessage.style.display = pokemons.length === 0 ? "block" : "none";
}

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event handling for generation filter
generationFilterBtn.addEventListener("click", function () {
  generationDropdown.classList.toggle("hidden");
});

generationCheckboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", fetchPokemons);
});

// Close the filter dropdown when clicking outside
document.addEventListener("click", function (event) {
  if (!generationFilterBtn.contains(event.target) && !generationDropdown.contains(event.target)) {
    generationDropdown.classList.add("hidden");
  }
});

// Function to filter Pokemon based on search term
function filterPokemons(searchTerm) {
  const filteredPokemons = allPokemons.filter(function (pokemon) {
    const matchesName = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNumber = pokemon.id.toString() === searchTerm;
    return matchesName || matchesNumber;
  });
  displayPokemons(filteredPokemons);
}

// Event handling for search
document.getElementById("search-input").addEventListener("input", function (e) {
  filterPokemons(e.target.value);
});

document.getElementById("clear-search-icon").addEventListener("click", function () {
  document.getElementById("search-input").value = "";
  displayPokemons(allPokemons);
});

// Handling the "Back to Top" button
let scrollToTopBtn = document.getElementById("scroll-to-top");

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Initially load Pokemon
fetchPokemons();
