import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MusicDataProvider } from './context/MusicDataContext';
import { PlayerProvider } from './context/PlayerContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomPlayer } from './components/player/BottomPlayer';
import { LyricsDrawer } from './components/lyrics/LyricsDrawer';

import { AuthModal } from './components/modals/AuthModal';
import { RatingModal } from './components/modals/RatingModal';
import { FlagModal } from './components/modals/FlagModal';
import { PlaylistModal } from './components/modals/PlaylistModal';

import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { PlaylistsView } from './views/PlaylistsView';
import { FavoritesView } from './views/FavoritesView';
import { CreatorStudioView } from './views/CreatorStudioView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ProfileView } from './views/ProfileView';

import './App.css';

function MainLayout() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'search' | 'playlists' | 'favorites' | 'creator' | 'admin' | 'profile'
  const [searchQuery, setSearchQuery] = useState('');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setCurrentView={setCurrentView} setSearchQuery={setSearchQuery} />;
      case 'search':
        return <SearchView searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'playlists':
        return <PlaylistsView />;
      case 'favorites':
        return <FavoritesView />;
      case 'creator':
        return <CreatorStudioView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'profile':
        return <ProfileView setCurrentView={setCurrentView} />;
      default:
        return <HomeView setCurrentView={setCurrentView} setSearchQuery={setSearchQuery} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="app-main-pane">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="app-content-area">
          {renderView()}
        </main>
      </div>

      <LyricsDrawer />
      <BottomPlayer />

      {/* Global Modals */}
      <AuthModal />
      <RatingModal />
      <FlagModal />
      <PlaylistModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MusicDataProvider>
        <PlayerProvider>
          <MainLayout />
        </PlayerProvider>
      </MusicDataProvider>
    </AuthProvider>
  );
}
