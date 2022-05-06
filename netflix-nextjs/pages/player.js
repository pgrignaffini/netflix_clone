import React from 'react';
import Link from 'next/link';
import styles from "../styles/Player.module.css"
import { useRouter } from 'next/router'
import { Icon } from 'web3uikit';

export default function Player() {

  const router = useRouter()

  const handleClick = (path, movie) => {
    if (path === "/player") {
      console.log("I clicked on the Player Page");
      setWatchingFilm(movie)
      router.push(path)
    }
  };

  function getFilmToPlay() {
    let savedValue
    if (typeof window !== 'undefined') {
      savedValue = JSON.parse(localStorage.getItem("film"))
    }

    return savedValue
  }

  return (
    <>
      <div className={styles.playerPage}>
        <video autoPlay controls className={styles.videoPlayer}>
          <source
            src={getFilmToPlay()}
            type="video/mp4">
          </source>
        </video>
        <div className={styles.backHome}>
          <Link href="/" passHref>
            <a>
              <Icon
                className={styles.backButton}
                fill="rgba(255,255,255,0.25)"
                size={60}
                svg="arrowCircleLeft"
              />
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}
