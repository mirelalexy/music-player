import React, { useState } from 'react';
import './Player.css';


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
    
    return(
        <>
            <div className="main-container">
                <div className={`player-container ${showLyrics ? 'shifted-left' : 'centered'}`}>
                    <div className="metadata">
                        <p className="playing-from">Playing from album</p>
                        <p className="album-name">DIE FOR ME</p>
                    </div>
                    <img className="cover" src="src/assets/die-for-me-cover.png" alt="album cover"></img>
                    <div className="song-info">
                        <p className="song-title">DIE FOR ME</p>
                        <div className="song-artist">
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
                            <span className="artist-name">Chase Atlantic</span>
                        </div>
                        <audio src=""></audio>
                    </div>
                    <div className="progress-bar">
                        <div className="progress">
                            <div className="progress-line"></div>
                            <div className="progress-circle"></div>
                        </div>
                        <div className="duration-wrapper">
                            <span id="current-time">0:00</span>
                            <span id="duration">2:02</span>
                        </div>
                    </div>
                    <div className="controls">
                        <svg className="lyrics-icon icon" onClick={() => { toggleLyrics(); toggleColor(); }} xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                    <path d="M19.8594 16.8998C18.5316 16.8974 17.2457 16.4347 16.2208 15.5906C15.1958 14.7464 14.4953 13.573 14.2384 12.2703C13.9816 10.9676 14.1843 9.61608 14.8122 8.44607C15.44 7.27606 16.454 6.35991 17.6816 5.85368C18.9091 5.34746 20.2741 5.28247 21.5442 5.66981C22.8143 6.05714 23.9108 6.87282 24.6469 7.9779C25.383 9.08298 25.7132 10.4091 25.5813 11.7303C25.4494 13.0516 24.8634 14.2862 23.9233 15.2239C22.8445 16.2993 21.3827 16.9021 19.8594 16.8998ZM19.8594 7.35281C18.9786 7.35329 18.1253 7.65915 17.4447 8.21827C16.7641 8.7774 16.2985 9.55519 16.1271 10.4191C15.9557 11.2831 16.0891 12.1797 16.5047 12.9563C16.9203 13.7329 17.5923 14.3414 18.4062 14.6781C19.2201 15.0147 20.1255 15.0588 20.9683 14.8028C21.811 14.5467 22.5389 14.0064 23.0279 13.2738C23.517 12.5413 23.7369 11.6618 23.6502 10.7853C23.5635 9.90879 23.1756 9.08945 22.5525 8.46688C22.1993 8.11277 21.7795 7.83203 21.3173 7.64083C20.8551 7.44963 20.3596 7.35175 19.8594 7.35281Z" fill={iconColor}/>
                    <path d="M9.74083 24.9356C9.47107 24.9386 9.20345 24.8875 8.95383 24.7851C8.70422 24.6828 8.4777 24.5314 8.2877 24.3398L6.64567 22.6978C6.29176 22.3453 6.08027 21.8747 6.05167 21.376C6.02307 20.8773 6.17938 20.3856 6.49067 19.995L14.3279 10.0992C14.4575 9.93518 14.6368 9.8175 14.8388 9.76376C15.0409 9.71001 15.2549 9.72308 15.4489 9.80101C15.643 9.87895 15.8066 10.0176 15.9153 10.1962C16.024 10.3747 16.0721 10.5837 16.0522 10.7919C15.9971 11.3513 16.0666 11.9161 16.2559 12.4454C16.4452 12.9747 16.7495 13.4555 17.1469 13.8531C17.5447 14.2503 18.0255 14.5544 18.5548 14.7437C19.0841 14.9329 19.6487 15.0026 20.2082 14.9478C20.4163 14.928 20.6253 14.976 20.8039 15.0847C20.9825 15.1935 21.1211 15.3571 21.199 15.5511C21.277 15.7451 21.29 15.9591 21.2363 16.1612C21.1825 16.3633 21.0649 16.5425 20.9008 16.6722L11.005 24.4948C10.6456 24.7805 10.2 24.9359 9.74083 24.9356ZM14.4296 13.0781L8.0213 21.1962C8.00637 21.2157 7.99828 21.2395 7.99828 21.2641C7.99828 21.2886 8.00637 21.3124 8.0213 21.3319L9.68755 22.9691C9.7062 22.9857 9.73034 22.995 9.75536 22.995C9.78038 22.995 9.80452 22.9857 9.82317 22.9691L17.9219 16.5705C17.1213 16.2864 16.3946 15.8262 15.7955 15.2239C15.1838 14.6212 14.7167 13.8875 14.4296 13.0781Z" fill={iconColor}/>
                    <path d="M6.37919 25.5895C6.18719 25.5897 5.99947 25.5328 5.83987 25.426C5.68027 25.3193 5.55598 25.1675 5.4828 24.99C5.40962 24.8125 5.39083 24.6173 5.42883 24.4291C5.46683 24.2409 5.5599 24.0682 5.69622 23.933L7.47872 22.1505C7.56873 22.0605 7.67558 21.9891 7.79318 21.9404C7.91078 21.8916 8.03683 21.8666 8.16411 21.8666C8.2914 21.8666 8.41745 21.8916 8.53504 21.9404C8.65264 21.9891 8.7595 22.0605 8.84951 22.1505C8.93951 22.2405 9.01091 22.3473 9.05962 22.4649C9.10833 22.5825 9.1334 22.7086 9.1334 22.8359C9.1334 22.9632 9.10833 23.0892 9.05962 23.2068C9.01091 23.3244 8.93951 23.4313 8.84951 23.5213L7.067 25.3038C6.97688 25.3944 6.86971 25.4663 6.75166 25.5154C6.63361 25.5644 6.50702 25.5896 6.37919 25.5895Z" fill={iconColor}/>
                        </svg>
                        <svg className="prev-icon icon" xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
                        <g clipPath="url(#clip0_20_56)">
                            <path d="M9.25 9.25H12.3333V27.75H9.25V9.25ZM14.6458 18.5L27.75 27.75V9.25L14.6458 18.5Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_20_56">
                                <rect width="37" height="37" fill="white"/>
                            </clipPath>
                        </defs>
                        </svg>
                        <svg className="play-pause-icon icon" xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57" fill="none">
                        <g clipPath="url(#clip0_20_60)">
                            <path d="M28.5 0C12.7582 0 0 12.7582 0 28.5C0 44.2418 12.7582 57 28.5 57C44.2418 57 57 44.2418 57 28.5C57 12.7582 44.2418 0 28.5 0ZM41.4697 30.7822L25.4385 40.5791C25.0154 40.8352 24.5256 40.9688 24.0469 40.9688C22.5228 40.9688 21.375 39.7219 21.375 38.2969V18.7031C21.375 17.2893 22.5105 16.0312 24.0469 16.0312C24.5305 16.0312 25.013 16.1622 25.4396 16.4227L41.4708 26.2196C42.2602 26.7076 42.75 27.5648 42.75 28.5C42.75 29.4352 42.2602 30.2924 41.4697 30.7822Z" fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_20_60">
                                <rect width="57" height="57" fill="white"/>
                            </clipPath>
                        </defs>
                        </svg>
                        <svg className="next-icon icon" xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
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
                            <path d="M17 1.5L21 5.5L17 9.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3 11.5V9.5C3 8.43913 3.42143 7.42172 4.17157 6.67157C4.92172 5.92143 5.93913 5.5 7 5.5H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7 23.5L3 19.5L7 15.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21 13.5V15.5C21 16.5609 20.5786 17.5783 19.8284 18.3284C19.0783 19.0786 18.0609 19.5 17 19.5H3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                    <div className="lyrics-container">
                        <div className="lyrics">
                            <p>Ooh, oh, yeah, yeah</p>
                            <p>Oh, yeah</p>
                            <p>Yeah</p>
                            <p className="highlighted">Yeah, hit the gas, ignite it, she sniff gasoline (Gasoline)</p>
                            <p>Throw it back in private, never on the screen, no (No, no, no)</p>
                            <p>Love the passion, fire, high ass self-esteem, yeah</p>
                            <p>So outlandish, she said, "Fuck me 'til I scream," whoa</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Player