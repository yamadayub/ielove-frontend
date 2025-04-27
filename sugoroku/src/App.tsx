import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StepProvider, useStepContext } from './contexts/StepContext';
import Header from './components/Header';
import TimelineView from './views/TimelineView';
import GridView from './views/GridView';
import BoardGameView from './views/BoardGameView';
import NavigationBar from './components/NavigationBar';
import NotesView from './views/NotesView';
import MyPageView from './views/MyPageView';

// BASE_PATHはvite.config.tsのbaseに合わせる
const BASE_PATH = '/sugoroku';

const MainContent: React.FC = () => {
  const { viewMode } = useStepContext();
  const [isNotesView, setIsNotesView] = useState(false);

  const handleViewNotes = () => {
    setIsNotesView(!isNotesView);
  };

  if (isNotesView) {
    return (
      <>
        <NotesView />
        <NavigationBar onViewNotes={handleViewNotes} isNotesView={isNotesView} />
      </>
    );
  }

  return (
    <>
      {viewMode === 'timeline' && <TimelineView />}
      {viewMode === 'grid' && <GridView />}
      {viewMode === 'boardGame' && <BoardGameView />}
      {viewMode === 'mypage' && <MyPageView />}
      <NavigationBar onViewNotes={handleViewNotes} isNotesView={isNotesView} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router basename={BASE_PATH}>
      <StepProvider>
        <div className="App">
          <Header />
          <main className="main-content">
            <MainContent />
          </main>
        </div>
      </StepProvider>
    </Router>
  );
};

export default App;