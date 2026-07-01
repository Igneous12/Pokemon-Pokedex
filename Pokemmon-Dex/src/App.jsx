import { useCallback, useEffect, useRef, useState } from "react";
import PokemonList from "./components/PokemonList";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");

  const [nextUrl, setNextUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=20"
  );

  const [loading, setLoading] = useState(false);

  const loader = useRef(null);
  const isFetching = useRef(false);

  const fetchPokemon = useCallback(async () => {
    if (isFetching.current || !nextUrl) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const res = await fetch(nextUrl);

      if (!res.ok) {
        throw new Error("Failed to fetch Pokémon.");
      }

      const data = await res.json();

      setNextUrl(data.next);

      const pokemonData = await Promise.all(
        data.results.map(async (poke) => {
          const res = await fetch(poke.url);

          if (!res.ok) {
            throw new Error(`Failed to fetch ${poke.name}`);
          }

          return await res.json();
        })
      );

      setPokemon((prev) => [...prev, ...pokemonData]);
    } catch (err) {
      console.error(err);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, [nextUrl]);

  // Initial Load
  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  // Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && nextUrl) {
          fetchPokemon();
        }
      },
      {
        threshold: 0.5,
      }
    );

    const currentLoader = loader.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchPokemon, nextUrl]);

  const filteredPokemon = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>React Pokédex</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <PokemonList pokemon={filteredPokemon} />

      {loading && <h2>Loading Pokémon...</h2>}

      {!nextUrl && (
        <h3>You've reached the end of the Pokédex!</h3>
      )}

      <div
        ref={loader}
        style={{
          height: "50px",
        }}
      />
    </div>
  );
}

export default App;