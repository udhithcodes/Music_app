import { createContext, useContext, useState, useEffect } from 'react';

const MusicDataContext = createContext(null);

const INITIAL_ALBUMS = [
  {
    id: 1,
    name: 'Midnight Neon City',
    artist: 'Luna Pulse',
    genre: 'Synthwave',
    releaseYear: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    description: 'Nostalgic analog synthesizers wandering through rain-soaked midnight streets.',
  },
  {
    id: 2,
    name: 'Lo-Fi Coffee Break',
    artist: 'ChillHop Collective',
    genre: 'Lo-Fi',
    releaseYear: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=60',
    description: 'Warm vinyl crackle, mellow rhodes keys, and study beats to relax to.',
  },
  {
    id: 3,
    name: 'Echoes of the Monsoon',
    artist: 'Aarav Sharma',
    genre: 'World Fusion',
    releaseYear: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    description: 'Traditional sitar notes blending with modern electronic basslines and rain textures.',
  },
  {
    id: 4,
    name: 'Celestial Horizons',
    artist: 'Astral Wave',
    genre: 'Electronic',
    releaseYear: 2023,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60',
    description: 'Expansive pads, pulsing basslines, and uplifting melodic trance.',
  },
];

const INITIAL_SONGS = [
  {
    id: 1,
    name: 'Cyber Dreamscape',
    artist: 'Luna Pulse',
    albumId: 1,
    albumName: 'Midnight Neon City',
    genre: 'Synthwave',
    duration: 215, // seconds
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    dateCreated: '2024-01-15',
    rating: 4.8,
    ratingCount: 42,
    plays: 1240,
    flagged: false,
    lyrics: `[00:00] (Retro synth arpeggio intro)
[00:15] Cruising down the neon highway
[00:22] Purple lights reflecting off the chrome
[00:30] Tokyo midnight in our rear-view mirror
[00:37] Never felt so far away from home
[00:45] We are digital ghosts in the electric fog
[00:52] Singing to the rhythm of the city heart
[01:00] (Soaring synth solo)
[01:20] Hold on to the speed of light
[01:28] Everything will be alright tonight.`,
  },
  {
    id: 2,
    name: 'After Hours Boulevard',
    artist: 'Luna Pulse',
    albumId: 1,
    albumName: 'Midnight Neon City',
    genre: 'Synthwave',
    duration: 184,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60',
    dateCreated: '2024-02-01',
    rating: 4.6,
    ratingCount: 29,
    plays: 890,
    flagged: false,
    lyrics: `[00:00] Raindrops on the dashboard glass
[00:18] Watching hours slowly pass
[00:34] Footsteps echo in the alleyway
[00:52] Waiting for the break of day
[01:10] Just another midnight flight
[01:25] Wrapped within the neon light.`,
  },
  {
    id: 3,
    name: 'Morning Coffee & Rain',
    artist: 'ChillHop Collective',
    albumId: 2,
    albumName: 'Lo-Fi Coffee Break',
    genre: 'Lo-Fi',
    duration: 160,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=60',
    dateCreated: '2024-02-14',
    rating: 4.9,
    ratingCount: 58,
    plays: 2310,
    flagged: false,
    lyrics: `[00:00] (Soft vinyl hiss, cup clinking on saucer)
[00:15] Steam rising in the early chill
[00:30] Books and notes upon the sill
[00:45] Muted trumpets through the breeze
[01:00] Whispers underneath the trees
[01:20] Breathe it in, take your time
[01:40] Gentle rhythm, gentle rhyme.`,
  },
  {
    id: 4,
    name: 'Barish Ki Dhun (Monsoon Melody)',
    artist: 'Aarav Sharma',
    albumId: 3,
    albumName: 'Echoes of the Monsoon',
    genre: 'World Fusion',
    duration: 230,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    dateCreated: '2024-03-01',
    rating: 4.7,
    ratingCount: 35,
    plays: 1450,
    flagged: false,
    lyrics: `[00:00] (Sitar prelude with thunder ambience)
[00:20] सावन की ये पहली बूंदें
[00:28] मिट्टी की वो भीनी खुशबू
[00:35] दिल में बहती एक तरंग सी
[00:43] हर तरफ बस तेरा जादू
[00:55] Raining down across the hills
[01:05] Every drop the silence fills
[01:20] संग तेरे इस मोड़ पर
[01:35] भीग जाए सारा शहर।`,
  },
  {
    id: 5,
    name: 'Tokyo Midnight Rain (東京の夜雨)',
    artist: 'Sakura & Sound',
    albumId: 2,
    albumName: 'Lo-Fi Coffee Break',
    genre: 'Lo-Fi',
    duration: 175,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&auto=format&fit=crop&q=60',
    dateCreated: '2024-03-10',
    rating: 4.9,
    ratingCount: 61,
    plays: 3100,
    flagged: false,
    lyrics: `[00:00] (Rain sounds in Shinjuku)
[00:15] 静かな夜に響く足音 (Quiet footsteps echoing in the night)
[00:30] ネオンの光が滲む水たまり (Puddles blurring neon lights)
[00:48] 忘れたくないこの温もり (This warmth I never want to forget)
[01:05] 夢の中でまた会えるから (Because we'll meet again in dreams)
[01:25] (Mellow guitar outro)`,
  },
  {
    id: 6,
    name: 'Starlight Odyssey',
    artist: 'Astral Wave',
    albumId: 4,
    albumName: 'Celestial Horizons',
    genre: 'Electronic',
    duration: 245,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60',
    dateCreated: '2024-03-22',
    rating: 4.5,
    ratingCount: 22,
    plays: 740,
    flagged: false,
    lyrics: `[00:00] (Deep ambient pulsar pulse)
[00:25] Beyond the stratosphere we glide
[00:40] Cosmic dust on every side
[01:00] Across the constellations high
[01:20] Sailing through the diamond sky
[01:45] We become the endless light.`,
  },
];

const INITIAL_PLAYLISTS = [
  {
    id: 1,
    name: 'Late Night Coding',
    description: 'Deep focus synth & chill beats for late night coding sessions.',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
    songIds: [1, 3, 5],
    createdBy: 'system',
  },
  {
    id: 2,
    name: 'Chill Vibes & Coffee',
    description: 'Acoustic warmth, lo-fi beats, and calm melodies.',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60',
    songIds: [2, 3, 4],
    createdBy: 'system',
  },
];

export const MusicDataProvider = ({ children }) => {
  // Load from localStorage or defaults
  const [songs, setSongs] = useState(() => {
    try {
      const saved = localStorage.getItem('music_songs');
      return saved ? JSON.parse(saved) : INITIAL_SONGS;
    } catch {
      return INITIAL_SONGS;
    }
  });

  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem('music_albums');
      return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
    } catch {
      return INITIAL_ALBUMS;
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('music_playlists');
      return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
    } catch {
      return INITIAL_PLAYLISTS;
    }
  });

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const saved = localStorage.getItem('music_user_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('music_favorites');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch {
      return [1, 3];
    }
  });

  const [flags, setFlags] = useState(() => {
    try {
      const saved = localStorage.getItem('music_flags');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('music_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('music_albums', JSON.stringify(albums));
  }, [albums]);

  useEffect(() => {
    localStorage.setItem('music_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('music_user_ratings', JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    localStorage.setItem('music_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('music_flags', JSON.stringify(flags));
  }, [flags]);

  // Rate a song (1-5 stars)
  const rateSong = (songId, rating) => {
    setUserRatings((prev) => ({ ...prev, [songId]: rating }));
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id === songId) {
          const prevUserRating = userRatings[songId];
          const count = prevUserRating ? s.ratingCount : s.ratingCount + 1;
          const currentTotal = s.rating * s.ratingCount;
          const newTotal = prevUserRating
            ? currentTotal - prevUserRating + rating
            : currentTotal + rating;
          const newRating = Number((newTotal / count).toFixed(1));
          return { ...s, rating: newRating, ratingCount: count };
        }
        return s;
      })
    );
  };

  // Flag a song / album
  const flagContent = ({ songId, albumId, reason, user }) => {
    const flagItem = {
      id: Date.now(),
      songId: songId || null,
      albumId: albumId || null,
      reason,
      reportedBy: user?.username || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
    };

    setFlags((prev) => [flagItem, ...prev]);

    if (songId) {
      setSongs((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, flagged: true, flagReason: reason } : s))
      );
    }
  };

  // Moderate flagged content (Admin action)
  const resolveFlag = (flagId, action = 'dismiss') => {
    const flag = flags.find((f) => f.id === flagId);
    if (!flag) return;

    if (action === 'remove_content' && flag.songId) {
      deleteSong(flag.songId);
    } else if (flag.songId) {
      setSongs((prev) =>
        prev.map((s) => (s.id === flag.songId ? { ...s, flagged: false, flagReason: null } : s))
      );
    }

    setFlags((prev) => prev.filter((f) => f.id !== flagId));
  };

  // Toggle Favorite
  const toggleFavorite = (songId) => {
    setFavorites((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  // Add a new song (Creator / Admin)
  const addSong = (songData) => {
    const newSong = {
      id: Date.now(),
      name: songData.name || 'Untitled Track',
      artist: songData.artist || 'Unknown Artist',
      albumId: songData.albumId ? Number(songData.albumId) : null,
      albumName: songData.albumName || 'Singles',
      genre: songData.genre || 'Electronic',
      duration: songData.duration ? Number(songData.duration) : 180,
      lyrics: songData.lyrics || 'No lyrics available for this song.',
      audioUrl: songData.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverUrl: songData.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
      dateCreated: new Date().toISOString().split('T')[0],
      rating: 5.0,
      ratingCount: 1,
      plays: 0,
      flagged: false,
    };

    setSongs((prev) => [newSong, ...prev]);
    return newSong;
  };

  // Edit existing song
  const editSong = (id, updatedData) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  // Delete song
  const deleteSong = (id) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    setPlaylists((prev) =>
      prev.map((p) => ({
        ...p,
        songIds: p.songIds.filter((sId) => sId !== id),
      }))
    );
  };

  // Add Album
  const addAlbum = (albumData) => {
    const newAlbum = {
      id: Date.now(),
      name: albumData.name || 'Untitled Album',
      artist: albumData.artist || 'Unknown Artist',
      genre: albumData.genre || 'Electronic',
      releaseYear: albumData.releaseYear || new Date().getFullYear(),
      coverUrl: albumData.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
      description: albumData.description || '',
    };
    setAlbums((prev) => [newAlbum, ...prev]);
    return newAlbum;
  };

  // Delete Album
  const deleteAlbum = (id) => {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  };

  // Create Playlist
  const createPlaylist = (name, description = '', coverUrl = '') => {
    const newPlaylist = {
      id: Date.now(),
      name: name.trim() || 'My Playlist',
      description,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
      songIds: [],
      createdBy: 'user',
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  // Delete Playlist
  const deletePlaylist = (id) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  // Add Song to Playlist
  const addSongToPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId && !p.songIds.includes(songId)) {
          return { ...p, songIds: [...p.songIds, songId] };
        }
        return p;
      })
    );
  };

  // Remove Song from Playlist
  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, songIds: p.songIds.filter((id) => id !== songId) };
        }
        return p;
      })
    );
  };

  const incrementSongPlays = (songId) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, plays: (s.plays || 0) + 1 } : s))
    );
  };

  const value = {
    songs,
    albums,
    playlists,
    userRatings,
    favorites,
    flags,
    rateSong,
    flagContent,
    resolveFlag,
    toggleFavorite,
    addSong,
    editSong,
    deleteSong,
    addAlbum,
    deleteAlbum,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    incrementSongPlays,
  };

  return <MusicDataContext.Provider value={value}>{children}</MusicDataContext.Provider>;
};

export const useMusicData = () => {
  const ctx = useContext(MusicDataContext);
  if (!ctx) throw new Error('useMusicData must be used within a MusicDataProvider');
  return ctx;
};

