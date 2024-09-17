// Select the search input and clear search icon elements
const searchInput = document.getElementById("search-input");
const clearSearchIcon = document.getElementById("clear-search-icon");

// Function to handle the search functionality
function handleSearch() {
  const searchTerm = searchInput.value.trim();
  filterPokemons(searchTerm);
  // Show or hide the clear search icon based on whether there's a search term
  clearSearchIcon.style.display = searchTerm ? "block" : "none";
}

// Function to clear the search input and reset the Pokemon list
function clearSearch() {
  searchInput.value = "";
  filterPokemons("");
  clearSearchIcon.style.display = "none";
}

// Add event listeners for search input and clear search icon
searchInput.addEventListener("input", handleSearch);
clearSearchIcon.addEventListener("click", clearSearch);
