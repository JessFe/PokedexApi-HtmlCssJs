// Select necessary DOM elements for the modal
const modal = document.getElementById("pokemon-modal");
const closeModal = document.querySelector(".close-modal");
const modalContent = document.querySelector(".modal-content");

// Define colors for each Pokemon type
const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

// Function to show Pokemon details in the modal
function showPokemonDetails(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
    .then(function (res) {
      return res.json();
    })
    .then(function (speciesData) {
      const description = speciesData.flavor_text_entries
        .find(function (entry) {
          return entry.language.name === "en";
        })
        .flavor_text.replace(/[\f\n\r\t\v]+/g, " ");

      const mainType = pokemon.types[0].type.name;
      const backgroundColor = typeColors[mainType] || "#A8A878"; // default to normal type color if not found

      modalContent.innerHTML = `
                <span class="close-modal">&times;</span>
                <div class="pokemon-header" style="background-color: ${backgroundColor}">
                    <h2>${capitalizeFirstLetter(pokemon.name)} <span>#${String(pokemon.id).padStart(3, "0")}</span></h2>
                    <div class="navigation-arrows">
                        <button class="nav-arrow" id="prevPokemon">
                        <img src="assets/img/arr_left.svg" alt="Previous Pokémon">
                        </button>
                        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${
        pokemon.name
      }" class="pokemon-det-img">
                        <button class="nav-arrow" id="nextPokemon">
                        <img src="assets/img/arr_right.svg" alt="Next Pokémon">
                        </button>
                    </div>
                    <div class="pokemon-types">
                        ${pokemon.types
                          .map(function (type) {
                            return `<span class="type-badge" style="background-color: ${
                              typeColors[type.type.name]
                            }">${capitalizeFirstLetter(type.type.name)}</span>`;
                          })
                          .join("")}
                    </div>
                </div>
                <div class="pokemon-details">
                    <h3>About</h3>
                    <p class="pokemon-description">${description}</p>
                    <div class="pokemon-info">
                        <div class="info-item">
                            <img src="assets/img/weight.svg" alt="weight icon" class="info-label" />
                            <p class="info-value">${pokemon.weight / 10} kg</p>
                        </div>
                        <div class="info-item">
                            <img src="assets/img/height.svg" alt="height icon" class="info-label" />
                            <p class="info-value">${pokemon.height / 10} m</p>
                        </div>                        
                        <div class="info-item">
                            <img src="assets/img/power.svg" alt="abilities icon" class="info-label" />
                            <div class="info-value">${pokemon.abilities
                              .map(function (ability) {
                                return `<div>${capitalizeFirstLetter(ability.ability.name)}</div>`;
                              })
                              .join("")}</div>
                        </div>
                    </div>
                    <div class="stats-container">
                        <h3>Base Stats</h3>
                        ${pokemon.stats
                          .map(function (stat) {
                            return `
                                <div class="stat-item">
                                    <span class="stat-name" style="color: ${backgroundColor}">${statAbbreviations[stat.stat.name] || capitalizeFirstLetter(stat.stat.name)}</span>
                                    <span class="stat-value">${stat.base_stat}</span>
                                    <div class="stat-line"></div>
                                </div>
                            `;
                          })
                          .join("")}
                    </div>
                </div>
            `;

      modal.style.display = "block";

      document.querySelector(".close-modal").addEventListener("click", closeModalFunction);

      document.getElementById("prevPokemon").addEventListener("click", function () {
        navigatePokemon(pokemon.id - 1);
      });
      document.getElementById("nextPokemon").addEventListener("click", function () {
        navigatePokemon(pokemon.id + 1);
      });
    });
}

// Function to navigate to the previous or next Pokemon
function navigatePokemon(id) {
  // Check if the ID is out of range of loaded Pokemon
  if (id < 1 || id > allPokemons[allPokemons.length - 1].id) return;

  // Find the Pokemon with the correct ID within allPokemons
  const pokemon = allPokemons.find(function (p) {
    return p.id === id;
  });

  // If the Pokemon exists, show its details
  if (pokemon) {
    showPokemonDetails(pokemon);
  }
}

// Abbreviations for stat names
const statAbbreviations = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "SPD",
};

// Function to close the modal
function closeModalFunction() {
  modal.style.display = "none";
}

// Event listener to close the modal when clicking outside
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModalFunction();
  }
});
