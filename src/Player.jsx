import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Player.css';
import { extractColors } from "extract-colors";

function Player(){
    // state to toggle lyrics
    const [showLyrics, setShowLyrics] = useState(false);

    // function to toggle lyrics
    const toggleLyrics = () => setShowLyrics(!showLyrics);

    // state to toggle icon colors
    const [iconColor, setIconColor] = useState("#FFF");

    // function to toggle icon colors
    const toggleColor = () => {
        setIconColor((prevColor) => (prevColor === "#FFF" ? "#FFD25F" : "#FFF"));
    };

    // state for background color changing based on album cover
    const [backgroundColor, setBackgroundColor] = useState("#870DB3");

    // ref for album cover
    const albumCoverRef = useRef(null);

    // state to change songs (first song is already loaded)
    const [song, setSong] = useState({
        id_song: 1,
        song_name: "DIE FOR ME",
        album_name: "DIE FOR ME",
        artist_name: "Chase Atlantic",
        cover_path: "/images/die-for-me.png",
        audio_path: "/audio/die-for-me.mp3",
        lyrics_path: "/lrc/die-for-me.lrc"
      });

    // state to play/pause song
    const [isPlaying, setIsPlaying] = useState(false);
  
    // state to change song
    const [songId, setSongId] = useState(1);

    // state to change audio source
    const [audioSrc, setAudioSrc] = useState("/audio/die-for-me.mp3");

    // audio reference
    const audioRef = useRef(null);

    // state for current time in song
    const [currentTime, setCurrentTime] = useState(0);

    // state for duration of song
    const [duration, setDuration] = useState(0);

    // ref for progress bar
    const progressBarRef = useRef(null);

    // function to format song duration (minutes:seconds)
    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
    };

    // Load song duration when metadata is loaded
    useEffect(() => {
        const audio = audioRef.current;
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        if (audio) {
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        }
    });

    // update current time
    useEffect(() => {
        const audio = audioRef.current;
        const handleTimeUpdate = () => {
          setCurrentTime(audio.currentTime);
        };
        if (audio) {
          audio.addEventListener('timeupdate', handleTimeUpdate);
        }
    });

    // update progress bar width based on current time
    const progressPercent = (currentTime / duration) * 100;
    
    // fetch song data from the API
    useEffect(() => {
        axios.get(`http://localhost:3001/songs/${songId}`)
          .then(response => {
            setSong(response.data);
            setAudioSrc(response.data.audio_path);
          })
          .catch(error => console.error('Error fetching song:', error));
      }, [songId]);  // every time the song changes, fetch the data
    
  
    // function to play/pause song
    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio){
             if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
        }
    };

    // load the next/previous song
    useEffect(() => {
        const audio = audioRef.current;
    
        const handleCanPlay = () => {
            if (isPlaying) {
                audio.play();
            }
        };
    
        if (audio && audioSrc) {
            audio.pause();  // pause any currently playing audio
            audio.load();   // load new audio
            audio.addEventListener('canplaythrough', handleCanPlay);
    
            return () => {
                audio.removeEventListener('canplaythrough', handleCanPlay);
            };
        }
    }, [audioSrc]);

    // function to play next song
    const nextSong = () => {
        setSongId(prevId => prevId + 1);
        setIsPlaying(true); // plays automatically
    };

    // function to go back to previous song
    const prevSong = () => {
        setSongId(prevId => (prevId > 1 ? prevId - 1 : prevId));
        setIsPlaying(true); // plays automatically
    };

    // keyboard keys to handle play/pause
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "Space") {
                event.preventDefault(); // prevent default behavior (scrolling down the page)
                togglePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown); // clean up listener on unmount
        };
    }, [isPlaying]);

    // function to skip through song
    const updateProgressBar = (event) => {
        const audio = audioRef.current;
        const progressBar = progressBarRef.current;
        const rect = progressBar.getBoundingClientRect();  // get position based on viewport
        const clickX = event.clientX - rect.left;  // get the new position relative to the progress bar
        const progressBarWidth = rect.width;  // get the width of the progress bar
        const newTime = (clickX / progressBarWidth) * duration;  // calculate new time based on click
    
        audio.currentTime = newTime;
        setCurrentTime(newTime);

        if (!isPlaying) {
            audio.pause();  // re-pause the song to avoid it playing after skipping through
        }
    };

    // filter colors for dynamic background color
    const colorOptions = {
        pixels: 64000,
        distance: 0.22,
        saturationDistance: 0.2,
        lightnessDistance: 0.2,
        hueDistance: 0.083333333,
      
        // exclude too bright/dark colors
        colorValidator: (red, green, blue, alpha = 255) => {
          if (alpha < 250) return false; // exclude transparent colors
      
          // convert RGB to HSL to filter based on lightness
          const r = red / 255;
          const g = green / 255;
          const b = blue / 255;
      
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const lightness = (max + min) / 2;
      
          return lightness > 0.3 && lightness < 0.5;
        }
      };

    // change background color dynamically
    useEffect(() => {
        const albumCover = albumCoverRef.current;
        if (song && albumCover) {
            extractColors(albumCover.src, colorOptions)
            .then((colors) => {
                if (colors.length > 0) {
                    const selectedColor = colors[0]; // choose the first color that passes the filter
                    setBackgroundColor(selectedColor.hex);
                }
            });
        }
    }, [song]); // every time the song changes

    // state for lyrics
    const [lyrics, setLyrics] = useState([]);

    // manage lrc files
    const parseLRC = (lrcContent) => {
        const lines = lrcContent.split("\n");
        const lyricsArray = [];
    
        //[mm:ss.ttt] lyric
        const regex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/;

    
        lines.forEach(line => {
            const match = regex.exec(line);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = parseInt(match[3], 10);
                const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
                const text = match[4].trim();
    
                lyricsArray.push({ time: timeInSeconds, text });
            }
        });
    
        return lyricsArray;
    };

    // change lyrics
    useEffect(() => {
        // fetch the LRC file for the current song
        const fetchLyrics = async () => {
            try {
                const response = await fetch(song.lyrics_path);
                console.log(response);
                const lrcText = await response.text();
                console.log(lrcText);
                const parsedLyrics = parseLRC(lrcText);
                setLyrics(parsedLyrics);
                console.log(parsedLyrics);
            } catch (error) {
                console.error('Error fetching lyrics:', error);
            }
        };
    
        if (song) {
            fetchLyrics();
        }
    }, [song]); // whenever the song changes

    // get the current lyric based on currentTime
    const currentLyric = lyrics.find((line, index) => {
        const nextLineTime = lyrics[index + 1] ? lyrics[index + 1].time : Infinity;
        return currentTime >= line.time && currentTime < nextLineTime;
    });

    // auto scroll
    useEffect(() => {
        const highlightedLyric = document.querySelector('.highlighted');
        if (highlightedLyric) {
            highlightedLyric.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [currentLyric]); // whenever the current lyric changes

    // ref for lyrics container
    const lyricsContainerRef = useRef(null); 

    // scroll to top when song changes
    useEffect(() => {
        if (lyricsContainerRef.current) {
            lyricsContainerRef.current.scrollTo({
                top: 0,
                behavior: 'auto'  // instantly scroll to the top
            });
        }
    }, [songId]); // every time the songId changes

    return(
        <>
            <div className="main-container" style={{ backgroundColor: backgroundColor }}>
                <div className={`player-container ${showLyrics ? 'shifted-left' : 'centered'}`}>
                    <div className="metadata">
                        <p className="playing-from">Playing from album</p>
                        <p className="album-name">{song.album_name}</p>
                    </div>
                    <img className="cover" ref={albumCoverRef} src={song.cover_path} alt="album cover"></img>
                    <div className="song-info">
                        <p className="song-title">{song.song_name}</p>
                        <div className="song-artist">
                            {song.explicit_tag && ( // only render the icon if tag's true
                            <svg className="explicit-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <g clipPath="url(#clip0_20_41)">
                                <path d="M2.03125 0C1.49253 0 0.975873 0.214006 0.594939 0.594939C0.214006 0.975873 0 1.49253 0 2.03125L0 10.9688C0 11.5075 0.214006 12.0241 0.594939 12.4051C0.975873 12.786 1.49253 13 2.03125 13H10.9688C11.5075 13 12.0241 12.786 12.4051 12.4051C12.786 12.0241 13 11.5075 13 10.9688V2.03125C13 1.49253 12.786 0.975873 12.4051 0.594939C12.0241 0.214006 11.5075 0 10.9688 0L2.03125 0ZM5.54613 8.84H8.53125V9.75H4.46875V3.25162H8.53125V4.16163H5.54613V6.0125H8.35494V6.88431H5.54613V8.84Z" fill="#C1C0CD"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_20_41">
                                    <rect width="13" height="13" fill="white"/>
                                </clipPath>
                            </defs>
                            </svg>
                            )}
                            <span className="artist-name">{song.artist_name}</span>
                        </div>
                        <audio ref={audioRef} src={audioSrc}></audio>
                    </div>
                    <div className="progress-bar">
                        <div className="progress" ref={progressBarRef} onClick={updateProgressBar}>
                            <div className="progress-line" style={{ width: `${progressPercent}%` }}></div>
                            <div className="progress-circle"></div>
                        </div>
                        <div className="duration-wrapper">
                            <span id="current-time">{formatDuration(currentTime)}</span>
                            <span id="duration">{formatDuration(duration)}</span>
                        </div>
                    </div>
                    <div className="controls">
                        <svg className="lyrics-icon icon" onClick={() => { toggleLyrics(); toggleColor(); }} xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M19.8594 16.8998C18.5316 16.8974 17.2457 16.4347 16.2208 15.5906C15.1958 14.7464 14.4953 13.573 14.2384 12.2703C13.9816 10.9676 14.1843 9.61608 14.8122 8.44607C15.44 7.27606 16.454 6.35991 17.6816 5.85368C18.9091 5.34746 20.2741 5.28247 21.5442 5.66981C22.8143 6.05714 23.9108 6.87282 24.6469 7.9779C25.383 9.08298 25.7132 10.4091 25.5813 11.7303C25.4494 13.0516 24.8634 14.2862 23.9233 15.2239C22.8445 16.2993 21.3827 16.9021 19.8594 16.8998ZM19.8594 7.35281C18.9786 7.35329 18.1253 7.65915 17.4447 8.21827C16.7641 8.7774 16.2985 9.55519 16.1271 10.4191C15.9557 11.2831 16.0891 12.1797 16.5047 12.9563C16.9203 13.7329 17.5923 14.3414 18.4062 14.6781C19.2201 15.0147 20.1255 15.0588 20.9683 14.8028C21.811 14.5467 22.5389 14.0064 23.0279 13.2738C23.517 12.5413 23.7369 11.6618 23.6502 10.7853C23.5635 9.90879 23.1756 9.08945 22.5525 8.46688C22.1993 8.11277 21.7795 7.83203 21.3173 7.64083C20.8551 7.44963 20.3596 7.35175 19.8594 7.35281Z" fill={iconColor}/>
                            <path d="M9.74083 24.9356C9.47107 24.9386 9.20345 24.8875 8.95383 24.7851C8.70422 24.6828 8.4777 24.5314 8.2877 24.3398L6.64567 22.6978C6.29176 22.3453 6.08027 21.8747 6.05167 21.376C6.02307 20.8773 6.17938 20.3856 6.49067 19.995L14.3279 10.0992C14.4575 9.93518 14.6368 9.8175 14.8388 9.76376C15.0409 9.71001 15.2549 9.72308 15.4489 9.80101C15.643 9.87895 15.8066 10.0176 15.9153 10.1962C16.024 10.3747 16.0721 10.5837 16.0522 10.7919C15.9971 11.3513 16.0666 11.9161 16.2559 12.4454C16.4452 12.9747 16.7495 13.4555 17.1469 13.8531C17.5447 14.2503 18.0255 14.5544 18.5548 14.7437C19.0841 14.9329 19.6487 15.0026 20.2082 14.9478C20.4163 14.928 20.6253 14.976 20.8039 15.0847C20.9825 15.1935 21.1211 15.3571 21.199 15.5511C21.277 15.7451 21.29 15.9591 21.2363 16.1612C21.1825 16.3633 21.0649 16.5425 20.9008 16.6722L11.005 24.4948C10.6456 24.7805 10.2 24.9359 9.74083 24.9356ZM14.4296 13.0781L8.0213 21.1962C8.00637 21.2157 7.99828 21.2395 7.99828 21.2641C7.99828 21.2886 8.00637 21.3124 8.0213 21.3319L9.68755 22.9691C9.7062 22.9857 9.73034 22.995 9.75536 22.995C9.78038 22.995 9.80452 22.9857 9.82317 22.9691L17.9219 16.5705C17.1213 16.2864 16.3946 15.8262 15.7955 15.2239C15.1838 14.6212 14.7167 13.8875 14.4296 13.0781Z" fill={iconColor}/>
                            <path d="M6.37919 25.5895C6.18719 25.5897 5.99947 25.5328 5.83987 25.426C5.68027 25.3193 5.55598 25.1675 5.4828 24.99C5.40962 24.8125 5.39083 24.6173 5.42883 24.4291C5.46683 24.2409 5.5599 24.0682 5.69622 23.933L7.47872 22.1505C7.56873 22.0605 7.67558 21.9891 7.79318 21.9404C7.91078 21.8916 8.03683 21.8666 8.16411 21.8666C8.2914 21.8666 8.41745 21.8916 8.53504 21.9404C8.65264 21.9891 8.7595 22.0605 8.84951 22.1505C8.93951 22.2405 9.01091 22.3473 9.05962 22.4649C9.10833 22.5825 9.1334 22.7086 9.1334 22.8359C9.1334 22.9632 9.10833 23.0892 9.05962 23.2068C9.01091 23.3244 8.93951 23.4313 8.84951 23.5213L7.067 25.3038C6.97688 25.3944 6.86971 25.4663 6.75166 25.5154C6.63361 25.5644 6.50702 25.5896 6.37919 25.5895Z" fill={iconColor}/>
                        </svg>
                        <svg className="prev-icon icon" onClick={() => { prevSong(); }}xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
                        <g clipPath="url(#clip0_20_56)">
                            <path d="M9.25 9.25H12.3333V27.75H9.25V9.25ZM14.6458 18.5L27.75 27.75V9.25L14.6458 18.5Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_20_56">
                                <rect width="37" height="37" fill="white"/>
                            </clipPath>
                        </defs>
                        </svg>
                        <svg className="play-pause-icon icon" onClick={() => {togglePlayPause(); }} xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57" fill="none">
                        {isPlaying ? (
                            <>
                            <g clipPath="url(#clip0_108_43)">
                              <path d="M28.5 0C12.7582 0 0 12.7582 0 28.5C0 44.2418 12.7582 57 28.5 57C44.2418 57 57 44.2418 57 28.5C57 12.7582 44.2418 0 28.5 0ZM24.9375 21.2748V35.5248C24.9375 37.5955 23.3455 39.1875 21.375 39.1875C19.4045 39.1875 17.8125 37.5955 17.8125 35.625V21.2748C17.8125 19.4045 19.4045 17.8125 21.2748 17.8125C23.1451 17.8125 24.9375 19.4045 24.9375 21.2748ZM39.1875 21.2748V35.5248C39.1875 37.5955 37.5955 39.1875 35.625 39.1875C33.6545 39.1875 32.0625 37.5955 32.0625 35.625V21.2748C32.0625 19.4045 33.6545 17.8125 35.5248 17.8125C37.3951 17.8125 39.1875 19.4045 39.1875 21.2748Z" fill="white"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_108_43">
                                <rect width="57" height="57" fill="white"/>
                              </clipPath>
                            </defs>
                            </>
                        ) : (
                            <>
                            <g clipPath="url(#clip0_20_60)">
                            <path d="M28.5 0C12.7582 0 0 12.7582 0 28.5C0 44.2418 12.7582 57 28.5 57C44.2418 57 57 44.2418 57 28.5C57 12.7582 44.2418 0 28.5 0ZM41.4697 30.7822L25.4385 40.5791C25.0154 40.8352 24.5256 40.9688 24.0469 40.9688C22.5228 40.9688 21.375 39.7219 21.375 38.2969V18.7031C21.375 17.2893 22.5105 16.0312 24.0469 16.0312C24.5305 16.0312 25.013 16.1622 25.4396 16.4227L41.4708 26.2196C42.2602 26.7076 42.75 27.5648 42.75 28.5C42.75 29.4352 42.2602 30.2924 41.4697 30.7822Z" fill="white"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_20_60">
                                <rect width="57" height="57" fill="white"/>
                            </clipPath>
                            </defs>
                            </>
                        )}
                        </svg>
                        <svg className="next-icon icon" onClick={() => { nextSong(); }}xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
                        <g clipPath="url(#clip0_20_63)">
                            <path d="M9.25 27.75L22.3542 18.5L9.25 9.25V27.75ZM24.6667 9.25V27.75H27.75V9.25H24.6667Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_20_63">
                                <rect width="37" height="37" fill="white"/>
                            </clipPath>
                        </defs>
                        </svg>
                        <svg className="repeat-icon icon" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <g clipPath="url(#clip0_20_50)">
                            <path d="M17 1.5L21 5.5L17 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 11.5V9.5C3 8.43913 3.42143 7.42172 4.17157 6.67157C4.92172 5.92143 5.93913 5.5 7 5.5H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 23.5L3 19.5L7 15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 13.5V15.5C21 16.5609 20.5786 17.5783 19.8284 18.3284C19.0783 19.0786 18.0609 19.5 17 19.5H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_20_50">
                                <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
                            </clipPath>
                        </defs>
                        </svg>
                    </div>
                </div>
                {showLyrics && (
                    <div className="lyrics-container" ref={lyricsContainerRef} style={{ backgroundColor: backgroundColor }}>
                        <div className="lyrics">
                            {lyrics.map((line, index) => (
                                <p
                                    key={index}
                                    className={currentLyric && currentLyric.time === line.time ? "highlighted" : ""}
                                >
                                {line.text}
                            </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Player