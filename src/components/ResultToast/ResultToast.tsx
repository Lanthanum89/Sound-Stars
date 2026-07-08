import styles from './ResultToast.module.css';

interface ResultToastProps {
  correct: number;
  total: number;
  onRestart: () => void;
}

function messageFor(pct: number): string {
  if (pct === 100) return 'Perfect round! 🌟';
  if (pct >= 80) return 'Brilliant reading!';
  if (pct >= 50) return 'Great effort — keep practising!';
  return "Good try — let's sound those out again.";
}

export function ResultToast({ correct, total, onRestart }: ResultToastProps) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);

  return (
    <div className={styles.toast} role="status">
      <p className={styles.score}>
        {correct} / {total} correct
      </p>
      <p className={styles.message}>{messageFor(pct)}</p>
      <button type="button" onClick={onRestart}>
        Play again
      </button>
    </div>
  );
}
