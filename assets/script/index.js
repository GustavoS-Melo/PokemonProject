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

// CARREGA OS DETALHES DO POKÉMON
async function loadDetails(id) {
  // Dados principais do Pokémon
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json());

  // Dados da espécie
  const species = await fetch(pokemon.species.url)
    .then(res => res.json());

  // Dados da cadeia evolutiva
  const evolution = await fetch(species.evolution_chain.url)
    .then(res => res.json());

  // Monta a linha evolutiva
  function getEvolutionNames(chain) {
    const evo = [];
    let current = chain;

    while (current) {
      evo.push(current.species.name);
      current = current.evolves_to[0];
    }

    return evo.join(" → ");
  }

  const evolutionLine = getEvolutionNames(evolution.chain);

  // Abre o modal com tudo
  openModal(pokemon, species, evolutionLine);
}
// DETALHES DO POKÉMON

// Abre o modal com todas as informações
function openModal(pokemonData, speciesData, evolutionLine) {
  const modal = document.getElementById("pokemon-modal");

  modal.innerHTML = `
        <div class="modal">
            <button class="close-modal">×</button>

            <div class="modal-header">
                <h2>#${pokemonData.id} — ${pokemonData.name.toUpperCase()}</h2>
                <img src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
            </div>

            <div class="modal-section">
                <h3>Descrição</h3>
                <p>${speciesData.flavor_text_entries.find(t => t.language.name === "en").flavor_text.replace(/\f/g, " ")}</p>
            </div>

            <div class="modal-section">
                <h3>Stats</h3>
                <ul class="stats-list">
                    ${pokemonData.stats.map(s => `<li>${s.stat.name}: <strong>${s.base_stat}</strong></li>`).join("")}
                </ul>
            </div>

            <div class="modal-section">
                <h3>Habilidades</h3>
                <ul>
                    ${pokemonData.abilities.map(a => `<li>${a.ability.name}</li>`).join("")}
                </ul>
            </div>

            <div class="modal-section">
                <h3>Evoluções</h3>
                <p>${evolutionLine}</p>
            </div>
        </div>`;

  modal.classList.remove("hidden");

  // Fechar modal
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
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

// ADICIONANDO EVENTO NOS CARDS
function enableCardClick(cardElement, pokemonId) {
  cardElement.addEventListener("click", () => loadDetails(pokemonId));
}

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

  // EXIBE O MODAL
  enableCardClick(card, id);

  grid.appendChild(card);
}