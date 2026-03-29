'use client'
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { constants } from 'node:fs/promises';

// --- Types & Interfaces ---
interface Cheat {
  id: string;
  name: string;
  icon: string;
  pts: number;
  cls: string;
}

interface Player {
  id: number;
  name: string;
  totalPts: number;
  roundPts: number[];
}

interface GameState {
  players: Player[];
  round: number;
  roundCheats: string[];
  roundAssign: Record<number, number>; // card index -> player id
  roundFlipped: number[];
  currentTurn: number;
  roundDone: boolean;
  screen: 'setup' | 'game' | 'results';
}

// --- Constants ---
const CHEATS: Cheat[] = [
  { id: 'king',     name: 'King',     icon: '♛', pts: 100, cls: 'king' },
  { id: 'minister', name: 'Minister', icon: '♜', pts: 50,  cls: 'minister' },
  { id: 'soldier',  name: 'Soldier',  icon: '⚔', pts: 20,  cls: 'soldier' },
  { id: 'thief',    name: 'Thief',    icon: '🗡', pts: 0,   cls: 'thief' },
];

// Helper: shuffle array
const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Initial players
const initialPlayers: Player[] = [
  { id: 0, name: 'Player 1', totalPts: 0, roundPts: [] },
  { id: 1, name: 'Player 2', totalPts: 0, roundPts: [] },
  { id: 2, name: 'Player 3', totalPts: 0, roundPts: [] },
  { id: 3, name: 'Player 4', totalPts: 0, roundPts: [] },
];

export default function Home() {
  // --- State ---
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [round, setRound] = useState<number>(1);
  const [roundCheats, setRoundCheats] = useState<string[]>([]);
  const [roundAssign, setRoundAssign] = useState<Record<number, number>>({});
  const [roundFlipped, setRoundFlipped] = useState<number[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [roundDone, setRoundDone] = useState<boolean>(false);
  const [screen, setScreen] = useState<'setup' | 'game' | 'results'>('setup');

  const toastRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<NodeJS.Timeout>();

  // --- Load / Save to localStorage ---
  useEffect(() => {
    const saved = localStorage.getItem('kingscourtgame');
    if (saved) {
      try {
        const data: GameState = JSON.parse(saved);
        setPlayers(data.players);
        setRound(data.round);
        setRoundCheats(data.roundCheats);
        setRoundAssign(data.roundAssign);
        setRoundFlipped(data.roundFlipped);
        setCurrentTurn(data.currentTurn);
        setRoundDone(data.roundDone);
        setScreen(data.screen);
      } catch (e) {
        console.error('Failed to parse saved game', e);
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave: GameState = {
      players,
      round,
      roundCheats,
      roundAssign,
      roundFlipped,
      currentTurn,
      roundDone,
      screen,
    };
    localStorage.setItem('kingscourtgame', JSON.stringify(stateToSave));
  }, [players, round, roundCheats, roundAssign, roundFlipped, currentTurn, roundDone, screen]);

  // --- Game logic ---
  const initRound = () => {
    setRoundCheats(shuffleArray(CHEATS.map(c => c.id)));
    setRoundAssign({});
    setRoundFlipped([]);
    setCurrentTurn(0);
    setRoundDone(false);
  };

  const startGame = () => {
    // Reset players (keep names)
    setPlayers(prev => prev.map(p => ({ ...p, totalPts: 0, roundPts: [] })));
    setRound(1);
    initRound();
    setScreen('game');
  };

  const pickCard = (cardIndex: number) => {
    if (roundDone) return;
    if (roundAssign[cardIndex] !== undefined) return;
    if (roundFlipped.includes(cardIndex)) return;

    const playerId = currentTurn;
    const cheatId = roundCheats[cardIndex];
    const cheat = CHEATS.find(c => c.id === cheatId)!;

    // Flip card and assign
    setRoundFlipped(prev => [...prev, cardIndex]);
    setRoundAssign(prev => ({ ...prev, [cardIndex]: playerId }));

    // Add points
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId
          ? {
              ...p,
              totalPts: p.totalPts + cheat.pts,
              roundPts: [...p.roundPts, cheat.pts],
            }
          : p
      )
    );

    // Toast message
    showToast(`${players[playerId].name} drew ${cheat.icon} ${cheat.name} — +${cheat.pts} pts!`);

    // Advance turn
    if (currentTurn + 1 >= players.length) {
      setRoundDone(true);
    } else {
      setCurrentTurn(prev => prev + 1);
    }
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    initRound();
    setScreen('game');
  };

  const showResults = () => {
    setScreen('results');
  };

  const resetGame = () => {
    setPlayers(initialPlayers);
    setRound(1);
    setRoundCheats([]);
    setRoundAssign({});
    setRoundFlipped([]);
    setCurrentTurn(0);
    setRoundDone(false);
    setScreen('setup');
  };

  // --- Toast ---
  const showToast = (msg: string) => {
    if (toastRef.current) {
      toastRef.current.textContent = msg;
      toastRef.current.classList.add('show');
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        if (toastRef.current) toastRef.current.classList.remove('show');
      }, 2800);
    }
  };

  // --- Render functions ---
  const renderSetup = () => (
    <>
      <p className="setup-intro">
        Four noble souls enter the court. Each shall draw a hidden cheat —<br />
        <em>fortune or folly decided by fate alone.</em>
      </p>

      <div className="players-grid">
        {players.map((p, idx) => (
          <div key={p.id} className="player-setup-card" data-num={idx + 1}>
            <label>Player {idx + 1} Name</label>
            <input
              type="text"
              maxLength={16}
              value={p.name}
              onChange={(e) => {
                const newPlayers = [...players];
                newPlayers[idx].name = e.target.value.trim() || `Player ${idx + 1}`;
                setPlayers(newPlayers);
              }}
              placeholder="Enter name…"
            />
          </div>
        ))}
      </div>

      <div className="ornament">✦ ✦ ✦</div>

      <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.25em', color: 'var(--gold-dark)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.8rem' }}>
        The Four Cheats
      </p>
      <div className="cheat-legend">
        {CHEATS.map(cheat => (
          <div key={cheat.id} className={`cheat-preview ${cheat.cls}`}>
            <div className="ci">{cheat.icon}</div>
            <div className="cn">{cheat.name}</div>
            <div className="cp">{cheat.pts} pts</div>
          </div>
        ))}
      </div>

      <div className="ornament">✦ ✦ ✦</div>
      <button className="btn-royal" onClick={startGame}>♛ &nbsp;Start Game</button>
    </>
  );

  const renderGame = () => {
    // Scoreboard
    const scoreboard = players.map((p, i) => {
      const assignedCard = Object.entries(roundAssign).find(([_, playerId]) => playerId === i);
      const cheat = assignedCard ? CHEATS.find(c => c.id === roundCheats[Number(assignedCard[0])]) : null;
      const isActive = i === currentTurn && !roundDone;
      return (
        <div key={p.id} className={`score-card ${isActive ? 'active-turn' : ''} ${cheat ? 'has-cheat' : ''}`}>
          {isActive && <div className="turn-dot"></div>}
          <div className="pname">{p.name}</div>
          <div className="pscore">{p.totalPts}</div>
          {cheat && <div className="pcheat-label">{cheat.icon} {cheat.name} +{cheat.pts}</div>}
        </div>
      );
    });

    // Cards grid
    const cards = roundCheats.map((cheatId, idx) => {
      const cheat = CHEATS.find(c => c.id === cheatId)!;
      const flipped = roundFlipped.includes(idx);
      const taken = roundAssign[idx] !== undefined;
      const owner = taken ? players[roundAssign[idx]].name : '';
      return (
        <div
          key={idx}
          className={`card-wrap ${flipped ? 'flipped' : ''} ${taken ? 'taken' : ''}`}
          onClick={() => pickCard(idx)}
        >
          <div className="card-inner">
            <div className="card-face card-back">
              <div className="card-back-border"></div>
              <div className="card-back-design">✦</div>
            </div>
            <div className={`card-face card-front ${cheat.cls}`}>
              <div className="cf-icon">{cheat.icon}</div>
              <div className="cf-name">{cheat.name}</div>
              <div className="cf-pts">{cheat.pts}</div>
              <div className="cf-pts-label">pts</div>
              {taken && <div className="cf-owner">{owner}</div>}
            </div>
          </div>
        </div>
      );
    });

    return (
      <>
        <div className="round-badge">
          <div className="round-label">Round</div>
          <div className="round-num">{round}</div>
        </div>

        <div className="scoreboard">{scoreboard}</div>

        {!roundDone && (
          <div className="turn-banner">
            <div className="tb-label">Now Drawing</div>
            <div className="tb-name">{players[currentTurn]?.name || '—'}</div>
          </div>
        )}

        <p className="cards-label">Choose a Cheat Card</p>
        <div className="cards-grid">{cards}</div>

        <div className={`round-done ${roundDone ? 'show' : ''}`}>
          <h3>✦ Round Complete ✦</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)' }}>
            All cheats have been drawn this round.
          </p>
          <div className="round-btns">
            <button className="btn-sm" onClick={nextRound}>▶ Play Another Round</button>
            <button className="btn-sm" onClick={showResults}>⚑ View Final Results</button>
            <button className="btn-sm" onClick={resetGame}>↺ New Game</button>
          </div>
        </div>
      </>
    );
  };

  const renderResults = () => {
    const sorted = [...players].sort((a, b) => b.totalPts - a.totalPts);
    const medals = ['🥇', '🥈', '🥉', '4'];

    // Podium
    const podium = sorted.map((p, rank) => (
      <div key={p.id} className="podium-slot">
        <div className="podium-name">{p.name}</div>
        <div className="podium-score">{p.totalPts}</div>
        <div className="podium-block">{medals[rank]}</div>
      </div>
    ));

    // Full results table
    const fullResults = sorted.map((p, rank) => (
      <div key={p.id} className="result-row">
        <div className="result-rank">{rank + 1}</div>
        <div className="result-name">{p.name}</div>
        <div className="result-round-scores">
          {p.roundPts.map((v, i) => `R${i + 1}: +${v}`).join(' · ')}
        </div>
        <div className="result-pts">
          {p.totalPts} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>pts</span>
        </div>
      </div>
    ));

    return (
      <>
        <div className="results-title">
          <h2>⚑ Final Results</h2>
          <p>The court has spoken. Honour and shame alike.</p>
        </div>
        <div className="podium">{podium}</div>
        <div className="full-results">{fullResults}</div>
        <div className="results-btns">
          <button className="btn-sm" onClick={nextRound}>▶ Another Round</button>
          <button className="btn-sm" onClick={resetGame}>↺ New Game</button>
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
        <title>King's Court — The Cheat Game</title>
      </Head>

      <header>
        <div className="crown-icon">♛</div>
        <h1>King's Court</h1>
        <p className="subtitle">The Cheat Game</p>
      </header>

      <div className={`screen ${screen === 'setup' ? 'active' : ''}`}>
        {screen === 'setup' && renderSetup()}
      </div>
      <div className={`screen ${screen === 'game' ? 'active' : ''}`}>
        {screen === 'game' && renderGame()}
      </div>
      <div className={`screen ${screen === 'results' ? 'active' : ''}`}>
        {screen === 'results' && renderResults()}
      </div>

      <div id="toast" ref={toastRef}></div>

      {/* Global styles – copy the full CSS from the original HTML */}
      <style jsx global>{`
        :root {
          --gold: #c9a84c;
          --gold-light: #e8c97a;
          --gold-dark: #8b6914;
          --crimson: #8b1a1a;
          --crimson-light: #c0392b;
          --emerald: #0d4f3c;
          --ink: #0a0704;
          --parchment: #f5ead0;
          --parchment-dark: #e8d5a3;
          --shadow: rgba(0,0,0,0.7);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'EB Garamond', serif;
          background: var(--ink);
          color: var(--parchment);
          min-height: 100vh;
          overflow-x: hidden;
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(139,26,26,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(13,79,60,0.15) 0%, transparent 60%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(201,168,76,0.02) 40px,
              rgba(201,168,76,0.02) 41px
            );
        }

        header {
          text-align: center;
          padding: 2.5rem 1rem 1.5rem;
          position: relative;
        }
        header::after {
          content: '';
          display: block;
          width: 60%;
          margin: 1rem auto 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }
        .crown-icon { font-size: 2.5rem; line-height: 1; margin-bottom: 0.3rem; }
        h1 {
          font-family: 'Cinzel Decorative', cursive;
          font-size: clamp(1.4rem, 4vw, 2.4rem);
          color: var(--gold-light);
          text-shadow: 0 0 30px rgba(201,168,76,0.4), 2px 2px 0 var(--ink);
          letter-spacing: 0.05em;
        }
        .subtitle {
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          color: var(--gold-dark);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-top: 0.4rem;
        }

        .screen { display: none; padding: 1rem 1.5rem 2rem; max-width: 900px; margin: 0 auto; }
        .screen.active { display: block; }

        .setup-intro {
          text-align: center;
          font-style: italic;
          color: var(--parchment-dark);
          font-size: 1.05rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .players-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .player-setup-card {
          background: linear-gradient(135deg, rgba(201,168,76,0.07), rgba(201,168,76,0.02));
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 8px;
          padding: 1rem 1.2rem;
          position: relative;
          overflow: hidden;
        }
        .player-setup-card::before {
          content: attr(data-num);
          position: absolute;
          top: -0.3rem; right: 0.5rem;
          font-family: 'Cinzel Decorative', cursive;
          font-size: 3rem;
          color: rgba(201,168,76,0.06);
          font-weight: 900;
          pointer-events: none;
        }

        .player-setup-card label {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .player-setup-card input {
          width: 100%;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 4px;
          padding: 0.55rem 0.8rem;
          color: var(--parchment);
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .player-setup-card input:focus { border-color: var(--gold); }
        .player-setup-card input::placeholder { color: rgba(245,234,208,0.3); }

        .cheat-legend {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
          margin-bottom: 2rem;
        }
        .cheat-preview {
          text-align: center;
          padding: 0.8rem 0.4rem;
          border-radius: 6px;
          border: 1px solid;
          position: relative;
        }
        .cheat-preview.king   { border-color: rgba(201,168,76,0.6); background: rgba(201,168,76,0.07); }
        .cheat-preview.minister{ border-color: rgba(139,26,26,0.6); background: rgba(139,26,26,0.07); }
        .cheat-preview.soldier { border-color: rgba(13,79,60,0.6);  background: rgba(13,79,60,0.07); }
        .cheat-preview.thief   { border-color: rgba(80,80,80,0.6);  background: rgba(80,80,80,0.07); }
        .cheat-preview .ci { font-size: 1.6rem; line-height: 1; }
        .cheat-preview .cn {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 0.3rem;
          color: var(--gold-light);
        }
        .cheat-preview .cp {
          font-size: 0.95rem;
          font-weight: 600;
          margin-top: 0.1rem;
        }
        .cheat-preview.king   .cp { color: var(--gold-light); }
        .cheat-preview.minister .cp { color: #e74c3c; }
        .cheat-preview.soldier .cp { color: #2ecc71; }
        .cheat-preview.thief   .cp { color: #888; }

        .btn-royal {
          display: block;
          width: 100%;
          max-width: 340px;
          margin: 0 auto;
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-dark));
          color: var(--ink);
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(201,168,76,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .btn-royal:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(201,168,76,0.45), inset 0 1px 0 rgba(255,255,255,0.2);
          background: linear-gradient(135deg, var(--gold), var(--gold-light), var(--gold));
        }
        .btn-royal:active { transform: translateY(0); }

        .btn-sm {
          padding: 0.5rem 1.2rem;
          font-size: 0.75rem;
          background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08));
          color: var(--gold);
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 4px;
          font-family: 'Cinzel', serif;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-sm:hover { background: rgba(201,168,76,0.2); border-color: var(--gold); }

        .round-badge {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .round-label {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: var(--gold-dark);
          text-transform: uppercase;
        }
        .round-num {
          font-family: 'Cinzel Decorative', cursive;
          font-size: 2rem;
          color: var(--gold);
          line-height: 1.1;
        }

        .scoreboard {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.8rem;
        }
        .score-card {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 6px;
          padding: 0.7rem 0.5rem;
          text-align: center;
          transition: all 0.3s;
          position: relative;
        }
        .score-card.active-turn {
          border-color: var(--gold);
          background: rgba(201,168,76,0.08);
          box-shadow: 0 0 15px rgba(201,168,76,0.2);
        }
        .score-card.has-cheat { opacity: 0.65; }
        .score-card .pname {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: var(--gold-dark);
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.2rem;
        }
        .score-card .pscore {
          font-family: 'Cinzel Decorative', cursive;
          font-size: 1.4rem;
          color: var(--gold-light);
          line-height: 1;
        }
        .score-card .pcheat-label {
          font-size: 0.7rem;
          margin-top: 0.3rem;
          color: var(--parchment-dark);
          font-style: italic;
        }
        .score-card .turn-dot {
          position: absolute;
          top: 6px; right: 6px;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--gold);
          animation: pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        .turn-banner {
          text-align: center;
          margin-bottom: 1.2rem;
          padding: 0.6rem 1rem;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent);
          border-top: 1px solid rgba(201,168,76,0.15);
          border-bottom: 1px solid rgba(201,168,76,0.15);
        }
        .turn-banner .tb-label {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: var(--gold-dark);
          text-transform: uppercase;
        }
        .turn-banner .tb-name {
          font-family: 'Cinzel', serif;
          font-size: 1.15rem;
          color: var(--gold-light);
          font-weight: 700;
        }

        .cards-label {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: var(--gold-dark);
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 0.8rem;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }

        .card-wrap {
          perspective: 700px;
          cursor: pointer;
        }
        .card-inner {
          position: relative;
          width: 100%;
          padding-top: 150%;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card-wrap.flipped .card-inner { transform: rotateY(180deg); }
        .card-wrap.taken { pointer-events: none; opacity: 0.4; }

        .card-face {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
        }
        .card-back {
          background: var(--crimson);
          background-image:
            repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px);
          border: 2px solid rgba(201,168,76,0.5);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: box-shadow 0.2s;
        }
        .card-wrap:not(.taken):not(.flipped):hover .card-back {
          box-shadow: 0 8px 30px rgba(201,168,76,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
          border-color: var(--gold);
        }
        .card-back-design {
          font-size: 2.2rem;
          opacity: 0.7;
        }
        .card-back-border {
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 5px;
          pointer-events: none;
        }

        .card-front {
          transform: rotateY(180deg);
          border: 2px solid;
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        }
        .card-front.king    { background: linear-gradient(160deg,#2c1e04,#1a1000); border-color: var(--gold); }
        .card-front.minister{ background: linear-gradient(160deg,#2c0a0a,#150404); border-color: #c0392b; }
        .card-front.soldier { background: linear-gradient(160deg,#031c13,#010e09); border-color: #27ae60; }
        .card-front.thief   { background: linear-gradient(160deg,#141414,#080808); border-color: #555; }

        .cf-icon { font-size: 2rem; line-height: 1; }
        .cf-name {
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 0.25rem;
        }
        .card-front.king    .cf-name { color: var(--gold-light); }
        .card-front.minister .cf-name { color: #e74c3c; }
        .card-front.soldier .cf-name { color: #2ecc71; }
        .card-front.thief   .cf-name { color: #aaa; }

        .cf-pts {
          font-family: 'Cinzel Decorative', cursive;
          font-size: 1.3rem;
          font-weight: 900;
          line-height: 1;
          margin-top: 0.2rem;
        }
        .card-front.king    .cf-pts { color: var(--gold-light); }
        .card-front.minister .cf-pts { color: #e74c3c; }
        .card-front.soldier .cf-pts { color: #2ecc71; }
        .card-front.thief   .cf-pts { color: #666; }

        .cf-pts-label {
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .cf-owner {
          position: absolute;
          bottom: 5px;
          font-size: 0.5rem;
          font-family: 'Cinzel', serif;
          letter-spacing: 0.1em;
          opacity: 0.7;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }

        .round-done {
          display: none;
          text-align: center;
          padding: 1rem;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.06), transparent);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .round-done.show { display: block; }
        .round-done h3 {
          font-family: 'Cinzel', serif;
          color: var(--gold);
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .round-btns { display: flex; gap: 0.7rem; justify-content: center; flex-wrap: wrap; margin-top: 0.8rem; }

        .results-title {
          text-align: center;
          margin-bottom: 2rem;
        }
        .results-title h2 {
          font-family: 'Cinzel Decorative', cursive;
          font-size: 1.5rem;
          color: var(--gold);
          margin-bottom: 0.3rem;
        }
        .results-title p {
          font-style: italic;
          color: var(--parchment-dark);
          font-size: 0.95rem;
        }

        .podium {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          min-height: 200px;
        }

        .podium-slot {
          flex: 1;
          max-width: 160px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .podium-name {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: var(--parchment-dark);
          text-transform: uppercase;
          margin-bottom: 0.3rem;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .podium-score {
          font-family: 'Cinzel Decorative', cursive;
          font-size: 1.6rem;
          color: var(--gold-light);
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .podium-block {
          width: 100%;
          border-radius: 4px 4px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel Decorative', cursive;
          font-size: 1.3rem;
          color: var(--ink);
          font-weight: 900;
        }
        .podium-slot:nth-child(1) .podium-block { height: 140px; background: linear-gradient(180deg, var(--gold-light), var(--gold-dark)); }
        .podium-slot:nth-child(2) .podium-block { height: 100px; background: linear-gradient(180deg, #ccc, #888); }
        .podium-slot:nth-child(3) .podium-block { height: 75px;  background: linear-gradient(180deg, #cd7f32, #8b5218); }
        .podium-slot:nth-child(4) .podium-block { height: 55px;  background: linear-gradient(180deg, #555, #222); color: #aaa; }

        .full-results {
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .result-row {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.2rem;
          border-bottom: 1px solid rgba(201,168,76,0.08);
          gap: 1rem;
          transition: background 0.2s;
        }
        .result-row:last-child { border-bottom: none; }
        .result-row:hover { background: rgba(201,168,76,0.04); }
        .result-rank {
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          color: var(--gold-dark);
          width: 1.5rem;
          text-align: center;
        }
        .result-name { flex: 1; font-size: 1rem; }
        .result-pts {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: var(--gold);
          font-weight: 700;
        }
        .result-round-scores {
          font-size: 0.75rem;
          color: var(--parchment-dark);
          font-style: italic;
        }

        .results-btns { display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; }

        #toast {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: rgba(10,7,4,0.95);
          border: 1px solid var(--gold);
          border-radius: 6px;
          padding: 0.7rem 1.4rem;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          color: var(--gold-light);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s;
          z-index: 999;
          white-space: nowrap;
        }
        #toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .ornament {
          text-align: center;
          color: var(--gold-dark);
          font-size: 1rem;
          margin: 0.5rem 0 1.5rem;
          letter-spacing: 0.5em;
          opacity: 0.6;
        }

        @media(max-width:600px) {
          .players-grid { grid-template-columns: 1fr 1fr; }
          .cheat-legend { grid-template-columns: repeat(2, 1fr); }
          .scoreboard { grid-template-columns: repeat(2, 1fr); }
          .cards-grid { grid-template-columns: repeat(2, 1fr); }
          .podium { min-height: 160px; }
          .podium-slot:nth-child(1) .podium-block { height: 110px; }
          .podium-slot:nth-child(2) .podium-block { height: 80px; }
          .podium-slot:nth-child(3) .podium-block { height: 60px; }
          .podium-slot:nth-child(4) .podium-block { height: 45px; }
        }
      `}</style>
    </>
  );
}