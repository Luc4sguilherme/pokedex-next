import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Card from "../components/card";
import { getPokemons, getPokemon } from "../services/pokeapi";

import styles from "../../styles/Home.module.css";

function App({ pokemons: pokemonsPreloaded }) {
  const amountOfPoKemons = 1126;
  const limit = 50;

  let [gridColumnCount, setGridColumnCount] = useState(1);
  let [pokemons, setPokemons] = useState(pokemonsPreloaded);
  let [offset, setOffset] = useState(pokemonsPreloaded.length);
  let [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    if (pokemons.length >= amountOfPoKemons) {
      setHasMore(false);
      return;
    }

    getPokemons(limit, offset).then(({ results }) => {
      Promise.all(results.map((data) => getPokemon(data.name))).then((pokemon) => {
        setPokemons([...pokemons, ...pokemon]);
      });
    });

    setOffset(offset + limit);
  };

  useEffect(() => {
    fetchMoreData();
  }, []);

  useEffect(() => {
    const grid = document.querySelector(".infinite-scroll-component");

    if (grid) {
      const gridComputedStyle = window.getComputedStyle(grid);
      const gridColumn = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ");
      setGridColumnCount(gridColumn.length);
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1>Pokédex</h1>
      <InfiniteScroll
        className={styles.pokedex}
        dataLength={pokemons.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div
            style={{
              gridColumn: `span ${gridColumnCount}`,
              justifySelf: "center",
              padding: "15px",
            }}
          >
            <div className={styles.loader}></div>
          </div>
        }
      >
        {pokemons.map((pokemon) => (
          <Card key={pokemon.id} id={pokemon.id} name={pokemon.name} types={pokemon.types} sprites={pokemon.sprites} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const { results } = await getPokemons(50, 0);
    const promises = results.map((data) => getPokemon(data.name));
    const data = await Promise.all(promises);
    const pokemons = data.map((pokemon) => {
      return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        sprites: pokemon.sprites,
      };
    });

    return {
      props: {
        pokemons,
      },
      revalidate: 60 * 60 * 8,
    };
  } catch (error) {
    console.error(error);
  }
}

export default App;
