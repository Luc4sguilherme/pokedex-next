import React from "react";
import Image from "next/image";

import getPokemonImage from "../../utils/getPokemonImage";

import styles from "./styles.module.css";

function Card(props) {
  const elementTypes = props.types.map((typesInfo) => typesInfo.type.name);

  return (
    <div className={`${styles.card} ${styles[`${elementTypes[0]}`]}`}>
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
