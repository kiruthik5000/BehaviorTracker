import React, { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../api';

const FONT = { fontFamily: 'Inter, Geist, sans-serif' };

/* ─── Category icon map ─── */
const ICONS = {
  javascript: '⚡', dsa: '🌲', react: '⚛️', backend: '🛠️',
  mongodb: '🍃', frontend: '🎨', architecture: '🏗️', python: '🐍',
  java: '☕', css: '🖌️', html: '📄',
};
const catIcon = (cat) => ICONS[cat?.toLowerCase()] ?? '📋';

/* ─── Difficulty badge ─── */
function DifficultyBadge({ level }) {
  const map = {
    easy:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15  text-amber-400  border-amber-500/30',
    hard:   'bg-rose-500/15   text-rose-400   border-rose-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md border text-xs font-mono uppercase tracking-wider ${map[level] ?? 'bg-white/10 text-slate-400 border-white/10'}`}>
      {level ?? 'N/A'}
    </span>
  );
}

/* ─── Option button (quiz) ─── */
function OptionButton({ label, text, selected, correct, revealed, onClick }) {
  let cls = 'w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ';
  if (revealed) {
    cls += correct ? 'border-emerald-500/70 bg-emerald-500/10 cursor-default '
      : selected   ? 'border-rose-500/70 bg-rose-500/10 cursor-default '
                   : 'border-white/5 opacity-40 cursor-default ';
  } else {
    cls += selected ? 'border-blue-500 bg-blue-500/10 cursor-pointer '
                    : 'border-white/8 bg-[#1e293b] hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer ';
  }
  const mk = revealed
    ? correct ? 'bg-emerald-500 text-white' : selected ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-500'
    : selected ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400';
  return (
    <button className={cls} onClick={onClick} disabled={revealed}>
      <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${mk}`}>{label}</div>
      <span className="text-slate-200 text-sm leading-relaxed flex-1">{text}</span>
      {revealed && correct  && <span className="shrink-0 text-emerald-400 text-xs font-semibold">✓ Correct</span>}
      {revealed && selected && !correct && <span className="shrink-0 text-rose-400 text-xs font-semibold">✗ Wrong</span>}
    </button>
  );
}

/* ─── Score Ring ─── */
function ScoreRing({ pct }) {
  const r = 54, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto mb-6">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray 1s ease' }}/>
      <text x="70" y="66" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter">{pct}%</text>
      <text x="70" y="84" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter">Score</text>
    </svg>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function MCQAssessment() {
  /* ── Data ── */
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  /* ── Dashboard state ── */
  const [expandedCat, setExpandedCat]   = useState(null);
  const [takenCats, setTakenCats]       = useState({}); // { [cat]: { score, total, pct } }

  /* ── Quiz/Results state ── */
  const [phase, setPhase]               = useState('dashboard'); // 'dashboard' | 'quiz' | 'results'
  const [activeCategory, setActiveCategory] = useState(null);
  const [questions, setQuestions]       = useState([]);
  const [current, setCurrent]           = useState(0);
  const [answers, setAnswers]           = useState({});
  const [revealed, setRevealed]         = useState({});
  const [showExpl, setShowExpl]         = useState({});

  useEffect(() => {
    api.get('/mcqs')
      .then(r => { setAllQuestions(r.data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const categories = useMemo(() => {
    const map = {};
    allQuestions.forEach(q => {
      const cat = q.category ?? 'Uncategorized';
      if (!map[cat]) map[cat] = [];
      map[cat].push(q);
    });
    return map;
  }, [allQuestions]);

  /* ── Quiz helpers ── */
  const q   = questions[current];
  const qId = q?._id;
  const select = useCallback((idx) => {
    if (revealed[qId]) return;
    setAnswers(a => ({ ...a, [qId]: idx }));
  }, [qId, revealed]);
  const submit = () => {
    if (answers[qId] === undefined) return;
    setRevealed(r => ({ ...r, [qId]: true }));
  };
  const score = questions.reduce((acc, q) => {
    const idx = answers[q._id];
    if (idx === undefined) return acc;
    return q.options?.[idx] === q.correctAnswer ? acc + (q.marks ?? 1) : acc;
  }, 0);
  const totalMarks    = questions.reduce((a, q) => a + (q.marks ?? 1), 0);
  const answeredCount = Object.keys(answers).length;

  const startQuiz = (cat) => {
    setActiveCategory(cat);
    setQuestions(categories[cat]);
    setCurrent(0); setAnswers({}); setRevealed({}); setShowExpl({});
    setPhase('quiz');
  };

  const finishQuiz = () => {
    const pct = totalMarks ? Math.round((score / totalMarks) * 100) : 0;
    setTakenCats(t => ({ ...t, [activeCategory]: { score, total: totalMarks, pct } }));
    setPhase('results');
  };

  const backToDashboard = () => {
    setPhase('dashboard');
    setQuestions([]); setCurrent(0); setAnswers({}); setRevealed({}); setShowExpl({});
  };

  /* ─── Loading / Error ─── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3" style={FONT}>
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      <p className="text-slate-500 text-sm">Loading assessments…</p>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3" style={FONT}>
      <p className="text-rose-400">⚠️ {error}</p>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     QUIZ OVERLAY — covers full screen (fixed, z-[999])
  ════════════════════════════════════════════════════════ */
  if (phase === 'quiz' || phase === 'results') {
    const pct     = totalMarks ? Math.round((score / totalMarks) * 100) : 0;
    const correct = questions.filter(q => q.options?.[answers[q._id]] === q.correctAnswer).length;
    const wrong   = questions.filter(q => answers[q._id] !== undefined && q.options?.[answers[q._id]] !== q.correctAnswer).length;
    const skipped = questions.length - answeredCount;

    /* ── Results overlay ── */
    if (phase === 'results') return (
      <div className="fixed inset-0 z-[999] bg-[#020617] flex flex-col overflow-y-auto" style={FONT}>
        <header className="w-full flex items-center justify-between px-8 h-14 bg-[#0f172a]/95 backdrop-blur border-b border-white/5 shrink-0">
          <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MCQ Results</span>
          <span className="text-xs text-slate-500 font-mono">{activeCategory}</span>
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg">
            <div className="bg-[#0f172a] border border-white/8 rounded-2xl p-10 text-center shadow-2xl">
              <ScoreRing pct={pct} />
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
                {pct >= 70 ? '🏆 Excellent!' : pct >= 40 ? '📊 Good Effort' : '📝 Keep Practising'}
              </h1>
              <p className="text-slate-400 text-sm mb-8">{activeCategory} — Assessment Complete</p>
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[
                  { label: 'Score',   value: `${score}/${totalMarks}`, color: 'text-blue-400'    },
                  { label: 'Correct', value: correct,                  color: 'text-emerald-400' },
                  { label: 'Wrong',   value: wrong,                    color: 'text-rose-400'    },
                  { label: 'Skipped', value: skipped,                  color: 'text-amber-400'   },
                ].map(s => (
                  <div key={s.label} className="bg-white/4 rounded-xl p-4 border border-white/6">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => startQuiz(activeCategory)}
                  className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                  Retake
                </button>
                <button onClick={backToDashboard}
                  className="px-7 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-semibold text-sm transition-all">
                  ← Assessments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    /* ── Quiz overlay ── */
    const isAnswered = answers[qId] !== undefined;
    const isRevealed = !!revealed[qId];
    const chosenIdx  = answers[qId];
    const correctIdx = q.options?.indexOf(q.correctAnswer);
    const progress   = Math.round(((current + 1) / questions.length) * 100);

    return (
      <div className="fixed inset-0 z-[999] bg-[#020617] flex flex-col text-slate-200" style={FONT}>

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 h-14 bg-[#0b1120]/95 backdrop-blur border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={backToDashboard} className="text-slate-400 hover:text-white text-sm transition-colors">← Back</button>
            <span className="text-white/20">|</span>
            <span className="text-sm font-semibold text-slate-300">{activeCategory} Assessment</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">{current + 1} / {questions.length}</span>
            <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Question navigator */}
          <aside className="w-52 bg-[#0b1120] border-r border-white/5 p-4 flex flex-col overflow-y-auto shrink-0">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-300 mb-0.5">Question Map</h2>
              <p className="text-xs text-slate-500 font-mono">{answeredCount} of {questions.length} answered</p>
            </div>
            <div className="grid grid-cols-4 gap-1.5 content-start">
              {questions.map((item, i) => {
                const done = revealed[item._id];
                const active = i === current;
                const ok = done && item.options?.[answers[item._id]] === item.correctAnswer;
                let cls = 'flex items-center justify-center aspect-square rounded-lg border text-xs font-mono transition-all ';
                if (active)    cls += 'bg-blue-600 border-blue-500 text-white font-bold ';
                else if (done) cls += ok ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 ' : 'bg-rose-500/20 border-rose-500/50 text-rose-400 ';
                else           cls += 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 cursor-pointer ';
                return <button key={item._id} className={cls} onClick={() => setCurrent(i)}>{i + 1}</button>;
              })}
            </div>
            <button onClick={finishQuiz}
              className="mt-auto pt-3 w-full py-2 rounded-lg border border-rose-500/40 text-rose-400 text-xs font-semibold hover:bg-rose-500/10 transition-all uppercase tracking-wider">
              Finish
            </button>
          </aside>

          {/* Main quiz content */}
          <main className="flex-1 overflow-y-auto p-8 pb-24 min-w-0">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-xs font-mono text-purple-400 uppercase tracking-wider">
                {q.category}{q.subcategory ? ` / ${q.subcategory}` : ''}
              </span>
              <span className="text-white/20">›</span>
              <span className="text-xs font-semibold text-blue-400">Q{current + 1} of {questions.length}</span>
              <DifficultyBadge level={q.difficulty} />
              <span className="ml-auto text-xs text-slate-500 font-mono">{q.marks ?? 1} mark{(q.marks ?? 1) > 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="bg-[#0f172a] border border-white/8 rounded-2xl p-8 shadow-xl">
                {q.title && <span className="text-blue-400 text-xs font-mono block mb-3 uppercase tracking-widest">{q.title}</span>}
                <p className="text-lg font-semibold text-white leading-relaxed">{q.question}</p>
              </div>
              <div className="space-y-3">
                {(q.options ?? []).map((opt, i) => (
                  <OptionButton key={i} label={String.fromCharCode(65 + i)} text={opt}
                    selected={chosenIdx === i} correct={correctIdx === i}
                    revealed={isRevealed} onClick={() => select(i)} />
                ))}
                <div className="pt-1 space-y-3">
                  {!isRevealed ? (
                    <button onClick={submit} disabled={!isAnswered}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all">
                      Submit Answer
                    </button>
                  ) : q.explanation && (
                    <button onClick={() => setShowExpl(s => ({ ...s, [qId]: !s[qId] }))}
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                      <span>{showExpl[qId] ? '▲' : '▼'}</span>
                      {showExpl[qId] ? 'Hide' : 'View'} Explanation
                    </button>
                  )}
                  {isRevealed && showExpl[qId] && q.explanation && (
                    <div className="bg-[#12131d] border border-white/10 rounded-xl p-5 text-sm text-slate-300 leading-relaxed">
                      <p className="text-purple-400 font-bold mb-2 uppercase text-xs tracking-widest">Explanation</p>
                      <p>{q.explanation}</p>
                      <p className="mt-3 text-blue-400 font-semibold text-xs">✓ Correct: {q.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Bottom nav */}
        <footer className="shrink-0 flex items-center justify-between px-6 py-3 bg-[#0b1120]/95 backdrop-blur border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">U</div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-300 leading-none">User</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Score: <span className="text-blue-400 font-bold">{score}/{totalMarks}</span></p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-all">
              ← Prev
            </button>
            <button onClick={() => { if (current < questions.length - 1) setCurrent(c => c + 1); else finishQuiz(); }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
              {current < questions.length - 1 ? 'Next →' : 'Finish'}
            </button>
          </div>
        </footer>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════
     DASHBOARD — rendered inside the normal Layout/sidebar
  ════════════════════════════════════════════════════════ */
  return (
    <div style={FONT}>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
          MCQ Assessments
        </h1>
        <p className="text-slate-500 text-sm">{Object.keys(categories).length} categories · {allQuestions.length} questions total</p>
      </div>

      {/* Assessment cards */}
      <div className="space-y-3">
        {Object.entries(categories).map(([cat, qs]) => {
          const taken    = takenCats[cat];
          const expanded = expandedCat === cat;
          const easyN    = qs.filter(q => q.difficulty === 'easy').length;
          const medN     = qs.filter(q => q.difficulty === 'medium').length;
          const hardN    = qs.filter(q => q.difficulty === 'hard').length;
          const pts      = qs.reduce((a, q) => a + (q.marks ?? 1), 0);
          const subs     = [...new Set(qs.map(q => q.subcategory).filter(Boolean))];

          return (
            <div key={cat}
              className={`bg-[#0f172a] border rounded-2xl overflow-hidden transition-all duration-200 ${expanded ? 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.08)]' : 'border-white/8 hover:border-white/15'}`}>

              {/* Card header — always visible, clickable to expand */}
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpandedCat(expanded ? null : cat)}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${expanded ? 'bg-blue-600' : 'bg-white/5'}`}>
                  {catIcon(cat)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-white text-sm">{cat}</span>
                    {taken && (
                      <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase rounded-full tracking-wide">
                        ✓ Taken
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {qs.length} questions · {pts} pts
                    {taken ? ` · Last score: ${taken.score}/${taken.total} (${taken.pct}%)` : ''}
                  </p>
                </div>

                {/* Difficulty pills */}
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  {easyN > 0 && <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">{easyN} easy</span>}
                  {medN  > 0 && <span className="px-2 py-0.5 rounded-md bg-amber-500/10  text-amber-400  text-[10px] font-mono border border-amber-500/20">{medN} med</span>}
                  {hardN > 0 && <span className="px-2 py-0.5 rounded-md bg-rose-500/10   text-rose-400   text-[10px] font-mono border border-rose-500/20">{hardN} hard</span>}
                </div>

                {/* Chevron */}
                <span className={`text-slate-500 text-sm transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Expanded details */}
              {expanded && (
                <div className="px-5 pb-5 border-t border-white/5">
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    {/* Subcategories */}
                    {subs.length > 0 && (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Topics Covered</p>
                        <div className="flex flex-wrap gap-1.5">
                          {subs.map(s => (
                            <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Stats */}
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Stats</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Questions', value: qs.length,    color: 'text-blue-400'    },
                          { label: 'Points',    value: pts,           color: 'text-purple-400'  },
                          { label: 'Est. Time', value: `${qs.length * 2}m`, color: 'text-slate-300' },
                        ].map(s => (
                          <div key={s.label} className="bg-white/3 rounded-lg p-3 border border-white/6 text-center">
                            <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-white/2 rounded-xl p-4 border border-white/6 mb-5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Instructions</p>
                    <ul className="space-y-1.5">
                      {[
                        'Answer each question and submit before moving on.',
                        'Use the Question Map to jump between questions.',
                        'Your score is updated in real-time in the footer.',
                      ].map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="text-blue-500 mt-0.5">·</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Start / Retake button */}
                  <button
                    onClick={() => startQuiz(cat)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      taken
                        ? 'border border-blue-500/40 text-blue-400 hover:bg-blue-500/10'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {taken ? '↺ Retake Assessment' : 'Start Assessment ▶'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
