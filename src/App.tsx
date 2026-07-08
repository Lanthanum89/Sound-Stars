import { useMemo, useState } from 'react';
import { SetupScreen } from './screens/SetupScreen';
import { RoundScreen } from './screens/RoundScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ParentScreen } from './screens/ParentScreen';
import { buildGraphemeDeck, buildTrickyWordDeck, buildTargetedDeck } from './content/deck';
import { useProgress, type RoundAnswer } from './hooks/useProgress';
import { getWeeklySummary, getSparkling, getNeedsPractice } from './progress/derive';
import type { Phase } from './content/phonicsGraphemeBank';
import type { DeckKind, FlashcardItem } from './content/types';
import type { SessionSize } from './screens/types';

const ALL_PHASES: Phase[] = [2, 3, 4, 5];
const DEFAULT_SECONDS_PER_CARD = 5;

type View = 'setup' | 'round' | 'results' | 'parent';

interface RoundResult {
  correct: number;
  total: number;
}

function App() {
  const [phases, setPhases] = useState<Phase[]>(ALL_PHASES);
  const [deckKind, setDeckKind] = useState<DeckKind>('grapheme');
  const [timedMode, setTimedMode] = useState(false);
  const [secondsPerCard, setSecondsPerCard] = useState(DEFAULT_SECONDS_PER_CARD);
  const [sessionSize, setSessionSize] = useState<SessionSize>('all');
  const [view, setView] = useState<View>('setup');
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [targetedItems, setTargetedItems] = useState<FlashcardItem[] | null>(null);

  const progress = useProgress();

  const items = useMemo(
    () => (deckKind === 'grapheme' ? buildGraphemeDeck(phases) : buildTrickyWordDeck(phases)),
    [deckKind, phases],
  );

  const activeItems = targetedItems ?? items;
  const roundSize = sessionSize === 'all' ? activeItems.length : Math.min(sessionSize, activeItems.length);
  const effectiveSessionSize = targetedItems || sessionSize === 'all' ? undefined : sessionSize;

  const togglePhase = (phase: Phase) => {
    setPhases((prev) => (prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase].sort()));
  };

  const handleRoundComplete = (answers: RoundAnswer[]) => {
    progress.recordSession(answers);
    setRoundResult({ correct: answers.filter((a) => a.correct).length, total: answers.length });
    setTargetedItems(null);
    setView('results');
  };

  const handleRoundClose = () => {
    setTargetedItems(null);
    setView('setup');
  };

  const handlePractiseTogether = (prompts: string[]) => {
    setTargetedItems(buildTargetedDeck(prompts));
    setView('round');
  };

  if (view === 'round') {
    return (
      <RoundScreen
        items={activeItems}
        timed={timedMode}
        secondsPerCard={secondsPerCard}
        sessionSize={effectiveSessionSize}
        onClose={handleRoundClose}
        onComplete={handleRoundComplete}
      />
    );
  }

  if (view === 'results' && roundResult) {
    return (
      <ResultsScreen
        correct={roundResult.correct}
        total={roundResult.total}
        onPlayAgain={() => setView('round')}
        onBackHome={() => setView('setup')}
      />
    );
  }

  if (view === 'parent') {
    return (
      <ParentScreen
        childName={progress.data.childName}
        onRenameChild={progress.setChildName}
        weekly={getWeeklySummary(progress.data)}
        sparkling={getSparkling(progress.data)}
        needsPractice={getNeedsPractice(progress.data)}
        hasSessions={progress.data.sessions.length > 0}
        lastBackupAt={progress.data.lastBackupAt}
        onBack={() => setView('setup')}
        onBackup={progress.backup}
        onRestoreJson={progress.restore}
        onPractiseTogether={handlePractiseTogether}
      />
    );
  }

  return (
    <SetupScreen
      phases={phases}
      onTogglePhase={togglePhase}
      deckKind={deckKind}
      onDeckKindChange={setDeckKind}
      sessionSize={sessionSize}
      onSessionSizeChange={setSessionSize}
      timedMode={timedMode}
      onTimedModeChange={setTimedMode}
      secondsPerCard={secondsPerCard}
      onSecondsPerCardChange={setSecondsPerCard}
      roundSize={roundSize}
      onStart={() => setView('round')}
      onOpenParentView={() => setView('parent')}
    />
  );
}

export default App;
