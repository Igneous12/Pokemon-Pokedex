import PokemonCard from "./PokemonCard";

function PokemonList({ pokemon }) {
  return (
    <div className="grid">
      {pokemon.map((poke) => (
        <PokemonCard key={poke.id} pokemon={poke} />
      ))}
    </div>
  );
}

export default PokemonList;