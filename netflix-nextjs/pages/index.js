import React, { useEffect, useState } from 'react';
import { Logo } from "../public/images/Netflix"
import { ConnectButton, Icon, Button, Modal, useNotification } from 'web3uikit';
import { Tab, Tabs, TabList } from '@chakra-ui/react';
import styles from "../styles/Home.module.css"
import { movies } from './helpers/library';
import Link from 'next/link';
import { useRouter } from 'next/router'
import useLocalStorage from './helpers/uselocalstorage';
import { useMoralis } from 'react-moralis';

export default function Home() {
  const [pageToShow, setPageToShow] = useState("")
  const [visible, setVisible] = useState(false)
  const [selectedFilm, setSelectedFilm] = useState()
  const router = useRouter()
  const [watchingFilm, setWatchingFilm] = useLocalStorage("film", "null");
  const { isAuthenticated, Moralis, account, isInitialized } = useMoralis()
  const [myMovies, setMyMovies] = useState()

  const dispatch = useNotification()

  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "Please connect your crypto wallet",
      title: "Not authenticated",
      position: "topL"
    })
  }

  const handleAddNotification = () => {
    dispatch({
      type: "success",
      message: "Movie added to your list",
      title: "Success",
      position: "topL"
    })
  }

  const handleClick = (path, movie) => {
    if (path === "/player") {
      console.log("I clicked on the Player Page");
      setWatchingFilm(movie)
      router.push(path)
    }
  };

  useEffect(() => {
    async function fetchMyList() {
      let filteredList = []
      if (isInitialized) {
        const theList = await Moralis.Cloud.run("getMyList", { addrs: account })
        filteredList = movies.filter(function (e) {
          return theList.indexOf(e.Name) > -1;
        })
      }
      setMyMovies(filteredList)
    }

    fetchMyList()
  }, [account])

  return (
    <div className={styles.home}>
      <div className={styles.topBanner}>
        <div className={styles.logo} >
          <Logo />
        </div>
        <Tabs defaultIndex={1}>
          <TabList>
            <Tab className={styles.tab} onClick={() => setPageToShow("Movies")}>Movies</Tab>
            <Tab className={styles.tab} onClick={() => setPageToShow("Series")}>Series</Tab>
            <Tab className={styles.tab} onClick={() => setPageToShow("My List")}>My List</Tab>
          </TabList>
        </Tabs>
        <div className={styles.connect}>
          <Icon fill='#ffffff' size={24} svg="bell" />
          <ConnectButton />
        </div>
      </div>
      <div>
        {(pageToShow === "Movies") &&
          <div className={styles.scene}>
            <img className={styles.sceneLogo} src={movies[0].Logo} />
            <p className={styles.sceneDesc}>{movies[0].Description}</p>
            <div className={styles.playButton}>
              <Button
                icon="chevronRightX2"
                text="Play"
                theme="secondary"
                type="button"
              />
              <Button
                icon="plus"
                text="Add to My List"
                theme="translucent"
                type="button"
                onClick={() => console.log(myMovies)}
              />
            </div>
          </div>}
        {(pageToShow === "Movies") &&
          <div className={styles.thumbnailsContainer}>
            <div className={styles.title}>Movies</div>
            <div className={styles.thumbs}>
              {movies && movies.map((e) => {
                return (
                  <img
                    key={e.Thumbnail}
                    src={e.Thumbnail}
                    className={styles.thumbnail}
                    onClick={() => {
                      setSelectedFilm(e)
                      setVisible(true)
                    }} />
                )
              })}
            </div>
          </div>}
        {selectedFilm && (
          <div className={styles.modal}>
            <Modal
              onCloseButtonPressed={() => setVisible(false)}
              isVisible={visible}
              hasFooter={false}
              width="60vw"
              height="80vh"
            >
              <div className={styles.modalContent}>
                <img className={styles.modalImg} src={selectedFilm.Scene} />
                <img className={styles.modalLogo} src={selectedFilm.Logo} />
                <div className={styles.modalPlayButton}>
                  {isAuthenticated ? (
                    <>
                      <Button
                        icon="chevronRightX2"
                        text="Play"
                        theme="secondary"
                        type="button"
                        onClick={() => handleClick("/player", selectedFilm.Movie)}
                      />
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={async () => {
                          await Moralis.Cloud.run("updateMyList", {
                            addrs: account,
                            newFav: selectedFilm.Name
                          })
                          handleAddNotification()
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        icon="chevronRightX2"
                        text="Play"
                        theme="secondary"
                        type="button"
                        onClick={handleNewNotification}
                      />
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification}
                      />
                    </>)}
                </div>
                <div className={styles.movieInfo}>
                  <div className={styles.description}>
                    <div className={styles.details}>
                      <span>{selectedFilm.Year}</span>
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
      <div>
        {(pageToShow === "My List") &&
          <div className={styles.ownListContent}>
            <div className={styles.title}>
              Your Library
            </div>
            {myMovies && isAuthenticated ? (
              <div className={styles.ownThumbs}>
                {myMovies.map((e) => {
                  return (
                    <img
                      key={e.Thumbnail}
                      src={e.Thumbnail}
                      className={styles.thumbnail}
                      onClick={() => {
                        setSelectedFilm(e)
                        setVisible(true)
                      }}>
                    </img>
                  )
                })}
              </div>
            ) : (
              <div className={styles.ownThumbs}>
                You need to authenticate to view your own list
              </div>
            )}

          </div>}
      </div>
      <div className={styles.bottomBanner}></div>
    </div>
  )
}
