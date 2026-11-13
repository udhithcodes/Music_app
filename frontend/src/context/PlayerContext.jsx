import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useMusicData } from './MusicDataContext';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const { songs, incrementSongPlays } = useMusicData();

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // UI Drawer / Modal states
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [rateModalSong, setRateModalSong] = useState(null);
  const [flagModalSong, setFlagModalSong] = useState(null);
  const [playlistModalSong, setPlaylistModalSong] = useState(null);

  const audioRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const isSynthesizingRef = useRef(false);

  // Keep latest callbacks in refs for stable audio event listener binding
  const handleNextRef = useRef(null);
  const startSynthRef = useRef(null);

  const stopSynthesizer = useCallback(() => {
    isSynthesizingRef.current = false;
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }, []);

  // Web Audio Synthesizer fallback for reliable in-browser audio playback
  const startSynthesizer = useCallback(() => {
    stopSynthesizer();
    isSynthesizingRef.current = true;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const chords = [
        [261.63, 329.63, 392.0], // C Maj
        [220.0, 261.63, 329.63], // A Min
        [174.61, 220.0, 261.63], // F Maj
        [196.0, 246.94, 293.66], // G Maj
      ];
      let chordStep = 0;

      const playChord = () => {
        if (!isSynthesizingRef.current) return;
        const notes = chords[chordStep % chords.length];
        chordStep++;

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const vol = isMuted ? 0 : volume * 0.12;
          gain.gain.setValueAtTime(vol, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 2.0);
        });
      };

      playChord();
      synthIntervalRef.current = setInterval(() => {
        playChord();
        setCurrentTime((prev) => {
          const next = prev + 1.8;
          if (next >= (currentSong?.duration || 180)) {
            if (handleNextRef.current) handleNextRef.current();
            return 0;
          }
          return next;
        });
      }, 1800);
    } catch (e) {
      console.warn('Web Audio synthesis not supported:', e);
    }
  }, [stopSynthesizer, isMuted, volume, currentSong]);

  startSynthRef.current = startSynthesizer;

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = 0.8;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!isSynthesizingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (handleNextRef.current) handleNextRef.current();
    };

    const handleError = () => {
      console.warn('Audio URL playback failed, falling back to Web Audio Synthesizer');
      if (startSynthRef.current) startSynthRef.current();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      stopSynthesizer();
    };
  }, [stopSynthesizer]);

  // Play a specific song
  const playSong = useCallback((song, customQueue = null) => {
    if (!song) return;

    stopSynthesizer();
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(song.duration || 180);

    const activeQueue = customQueue || (queue.length > 0 ? queue : songs);
    setQueue(activeQueue);
    const index = activeQueue.findIndex((s) => s.id === song.id);
    setQueueIndex(index >= 0 ? index : 0);

    incrementSongPlays(song.id);

    if (audioRef.current) {
      audioRef.current.pause();
      if (song.audioUrl) {
        audioRef.current.src = song.audioUrl;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Direct audio play failed, falling back to synthesizer:', err.message);
            setIsPlaying(true);
            if (startSynthRef.current) startSynthRef.current();
          });
      } else {
        setIsPlaying(true);
        if (startSynthRef.current) startSynthRef.current();
      }
    }
  }, [queue, songs, incrementSongPlays, stopSynthesizer]);

  // Next song
  const handleNext = useCallback(() => {
    if (queue.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playSong(queue[randomIndex], queue);
      return;
    }

    const nextIndex = (queueIndex + 1) % queue.length;
    playSong(queue[nextIndex], queue);
  }, [queue, queueIndex, isShuffle, playSong]);

  handleNextRef.current = handleNext;

  // Seek
  const seek = (time) => {
    setCurrentTime(time);
    if (audioRef.current && !isSynthesizingRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Previous song
  const handlePrev = useCallback(() => {
    if (queue.length === 0) return;

    if (currentTime > 3) {
      seek(0);
      return;
    }

    const prevIndex = queueIndex - 1 < 0 ? queue.length - 1 : queueIndex - 1;
    playSong(queue[prevIndex], queue);
  }, [queue, queueIndex, currentTime, playSong]);

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!currentSong) {
      if (songs.length > 0) {
        playSong(songs[0]);
      }
      return;
    }

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopSynthesizer();
      setIsPlaying(false);
    } else {
      if (isSynthesizingRef.current) {
        startSynthesizer();
        setIsPlaying(true);
      } else if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            startSynthesizer();
            setIsPlaying(true);
          });
      }
    }
  };

  // Set Volume
  const changeVolume = (val) => {
    const newVol = Math.max(0, Math.min(1, val));
    setVolumeState(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeat = () => setIsRepeat((prev) => !prev);
  const toggleLyrics = () => setLyricsOpen((prev) => !prev);

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    queue,
    playSong,
    togglePlay,
    nextSong: handleNext,
    prevSong: handlePrev,
    seek,
    setVolume: changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    lyricsOpen,
    setLyricsOpen,
    toggleLyrics,
    rateModalSong,
    setRateModalSong,
    flagModalSong,
    setFlagModalSong,
    playlistModalSong,
    setPlaylistModalSong,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
};
