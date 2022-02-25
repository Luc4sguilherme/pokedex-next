import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { getPokemon, getPokemons } from "../../services/pokeapi";
import getPokemonImage from "../../utils/getPokemonImage";

import styles from "./styles.module.css";

function Pokemon({ pokemon }) {
  const router = useRouter();

  return (
    <>
      {pokemon && (
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.wrapperTop}>
              <h1 className={styles.name}>
                {pokemon.name}
                <span> Nº{String(pokemon.id).padStart(3, 0)}</span>
              </h1>
              <button className={styles.backBtn} onClick={() => router.push("/")}>
                <svg
                  width="13px"
                  height="20px"
                  viewBox="0 0 13 20"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g id="Icons" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                    <g id="Outlined" transform="translate(-581.000000, -3434.000000)">
                      <g id="Navigation" transform="translate(100.000000, 3378.000000)">
                        <g id="Outlined-/-Navigation-/-arrow_back_ios" transform="translate(476.000000, 54.000000)">
                          <g>
                            <polygon id="Path" opacity="0.87" points="0 0 24 0 24 24 0 24" />
                            <polygon
                              id="🔹-Icon-Color"
                              fill="#1D1D1D"
                              points="17.51 3.87 15.73 2.1 5.84 12 15.74 21.9 17.51 20.13 9.38 12"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            </div>

            <Image
              src={`${pokemon.sprite}`}
              alt={`${pokemon.name}`}
              width={250}
              height={250}
            />

            <div className={styles.infos}>
              <div className={styles.types}>
                Types:
                {pokemon.types.map(({ type }) => (
                  <div key={type.name} className={`${styles.type} ${type.name}`}>
                    {type.name}
                  </div>
                ))}
              </div>

              <div>
                Weight: <span>{pokemon.weight / 10} kg</span>
              </div>
              <div>
                Height: <span>{pokemon.height / 10} m</span>
              </div>

              {pokemon.stats.map(({ base_stat, stat }) => {
                const { name } = stat;

                return (
                  <div className={styles.stats} key={name}>
                    {name}: <span>{base_stat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticPaths() {
  const { results } = await getPokemons(15, 0);
  const paths = results.map((data) => ({
    params: { name: data.name },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  try {
    const { name } = params;
    const data = await getPokemon(name);

    return {
      props: {
        pokemon: {
          sprite: getPokemonImage(data.sprites),
          id: data.id,
          weight: data.weight,
          height: data.height,
          name: data.name,
          types: data.types,
          stats: data.stats,
        },
      },
      revalidate: 60 * 60 * 8,
    };
  } catch (error) {
    console.error(error);
  }
}

export default Pokemon;
