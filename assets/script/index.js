// Função para buscar Pokémon
async function buscarPokemon(nomeOuId) {
  grid.innerHTML = "<p>Carregando...</p>";
  title.textContent = "Resultados";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeOuId}`);
    if (!response.ok) throw new Error('Pokémon não encontrado');

    const data = await response.json();
    exibirResultado(data);
  } catch (error) {
    grid.innerHTML = `<p style="color:red">Pokémon não encontrado.</p>`;
  }
}

// Captura dos elementos
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const grid = document.getElementById('cards-grid');
const title = document.getElementById('results-title');


// Evento do botão (submit do form)
form.addEventListener('submit', (e) => {
  e.preventDefault(); // impede que a pagina recarregue

  const query = input.value.trim().toLowerCase();
  if (!query) return;

  buscarPokemon(query);
});

// Exibe o resultado na tela
function exibirResultado(pokemon) {
  grid.innerHTML = "";

  const id = pokemon.id;
  const nome = pokemon.name;
  const img = pokemon.sprites.other['official-artwork'].front_default;
  const tipos = pokemon.types.map(t => t.type.name);

  const card = document.createElement('div');
  card.className += 'card';

  card.innerHTML = `
    <img src="${img}" alt="${nome}">
    <p class="card-id">#${id}</p>
    <p class="card-name">${nome}</p>`;

  grid.appendChild(card);
}