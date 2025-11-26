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