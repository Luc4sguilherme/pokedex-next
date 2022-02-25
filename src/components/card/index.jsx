import React from "react";
import Image from "next/image";
import { useRouter } from 'next/router';

import getPokemonImage from "../../utils/getPokemonImage";

import styles from "./styles.module.css";

function Card(props) {
  const router = useRouter();
  const elementTypes = props.types.map((typesInfo) => typesInfo.type.name);

  return (
    <div
      className={`${styles.card} ${elementTypes[0]}`}
      onClick={() => router.push(`/pokemon/${props.name}`)}
    >
      <Image
        className={styles.cardImage}
        src={`${getPokemonImage(props.sprites)}`}
        alt={`${props.name}`}
        width={180}
        height={180}
      />
      <h2 className={styles.cardTitle}>{`${props.id}. ${props.name}`}</h2>
      <p className={styles.cardSubtitle}>{`${elementTypes.join(" | ")}`}</p>
    </div>
  );
}

export default Card;
