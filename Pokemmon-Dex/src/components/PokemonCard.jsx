function PokemonCard({ pokemon }) {
  return (

    <div className="card">
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
      />

      <h2>
        #{pokemon.id}{" "}
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </h2>

      <p>Height: {pokemon.height}"</p>
      <p>Weight: {pokemon.weight}kg</p>

      <div className="types">
        {pokemon.types.map((type) => (
            <span
            key={type.type.name}
            className={type.type.name}
            >
            {type.type.name}
            </span>
        ))}
        </div>
    </div>
  );
}

export default PokemonCard;