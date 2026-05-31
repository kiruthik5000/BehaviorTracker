import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';

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

/* ─── Option button ─── */
function OptionButton({ label, text, selected, correct, revealed, onClick }) {
  let cls = 'w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ';
  if (revealed) {
    cls += correct
      ? 'border-emerald-500/70 bg-emerald-500/10 cursor-default '
      : selected
        ? 'border-rose-500/70 bg-rose-500/10 cursor-default '
        : 'border-white/5 bg-white/3 opacity-40 cursor-default ';
  } else {
    cls += selected
      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_16px_rgba(59,130,246,0.12)] cursor-pointer '
      : 'border-white/8 bg-[#1e293b] hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer ';
  }

  const markerCls = revealed
    ? correct ? 'bg-emerald-500 text-white' : selected ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-500'
    : selected ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400';

  return (
    <button className={cls} onClick={onClick} disabled={revealed}>
      <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${markerCls}`}>
        {label}
      </div>
      <span className="text-slate-200 text-sm leading-relaxed flex-1">{text}</span>
      {revealed && correct && <span className="shrink-0 text-emerald-400 text-xs font-semibold">✓ Correct</span>}
      {revealed && selected && !correct && <span className="shrink-0 text-rose-400 text-xs font-semibold">✗ Wrong</span>}
    </button>
  );
}

/* ─── Score Ring SVG ─── */
function ScoreRing({ pct }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto mb-6">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x="70" y="66" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter,sans-serif">{pct}%</text>
      <text x="70" y="84" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter,sans-serif">Score</text>
    </svg>
  );
}

/* ─── Main Page ─── */
export default function MCQAssessment() {
  const [questions, setQuestions]             = useState([]);
  const [current, setCurrent]                 = useState(0);
  const [answers, setAnswers]                 = useState({});
  const [revealed, setRevealed]               = useState({});
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [showExplanation, setShowExplanation] = useState({});
  const [finished, setFinished]               = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/mcqs')
      .then(r => { setQuestions(r.data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

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

  const toggleExplanation = () =>
    setShowExplanation(s => ({ ...s, [qId]: !s[qId] }));

  const score = questions.reduce((acc, q) => {
    const idx = answers[q._id];
    if (idx === undefined) return acc;
    return q.options?.[idx] === q.correctAnswer ? acc + (q.marks ?? 1) : acc;
  }, 0);
  const totalMarks = questions.reduce((a, q) => a + (q.marks ?? 1), 0);
  const answeredCount = Object.keys(answers).length;

  /* ── Loading / Error ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] gap-3">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      <p className="text-slate-500 text-sm">Loading questions…</p>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] gap-3">
      <p className="text-rose-400 text-2xl">⚠️</p>
      <p className="text-rose-400 text-sm">Error: {error}</p>
    </div>
  );
  if (!questions.length) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] gap-3">
      <p className="text-slate-400 text-sm">No MCQs found in database.</p>
    </div>
  );

  /* ─── Results Screen ─── */
  if (finished) {
    const pct       = totalMarks ? Math.round((score / totalMarks) * 100) : 0;
    const correct   = questions.filter(q => q.options?.[answers[q._id]] === q.correctAnswer).length;
    const wrong     = questions.filter(q => answers[q._id] !== undefined && q.options?.[answers[q._id]] !== q.correctAnswer).length;
    const skipped   = questions.length - answeredCount;

    return (
      <div className="min-h-screen w-full bg-[#020617] flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Header */}
        <header className="w-full flex items-center justify-between px-8 h-14 bg-[#0f172a]/90 backdrop-blur border-b border-white/5 shrink-0">
          <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Coding MCQ
          </span>
          <span className="text-xs text-slate-500 font-mono">Results</span>
        </header>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-12 w-full">

            {/* Score card */}
            <div className="bg-[#0f172a] border border-white/8 rounded-2xl p-10 text-center mb-8 shadow-2xl">
              <ScoreRing pct={pct} />

              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
                {pct >= 70 ? '🏆 Excellent!' : pct >= 40 ? '📊 Good Effort' : '📝 Keep Practising'}
              </h1>
              <p className="text-slate-400 text-sm mb-8">Assessment Complete</p>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Score',   value: `${score}/${totalMarks}`, color: 'text-blue-400' },
                  { label: 'Correct', value: correct,  color: 'text-emerald-400' },
                  { label: 'Wrong',   value: wrong,    color: 'text-rose-400'    },
                  { label: 'Skipped', value: skipped,  color: 'text-amber-400'   },
                ].map(s => (
                  <div key={s.label} className="bg-white/4 rounded-xl p-4 border border-white/6">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setCurrent(0); setAnswers({}); setRevealed({}); setShowExplanation({}); setFinished(false); }}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                >
                  Retry Quiz
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-8 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-semibold text-sm transition-all"
                >
                  Back
                </button>
              </div>
            </div>

            {/* Per-question review */}
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Question Review</h2>
            <div className="space-y-4">
              {questions.map((item, i) => {
                const chosenIdx   = answers[item._id];
                const correctIdx  = item.options?.indexOf(item.correctAnswer);
                const wasCorrect  = chosenIdx !== undefined && item.options?.[chosenIdx] === item.correctAnswer;
                const wasSkipped  = chosenIdx === undefined;

                return (
                  <div key={item._id} className="bg-[#0f172a] border border-white/8 rounded-xl p-5">
                    {/* Q header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        wasSkipped ? 'bg-amber-500/20 text-amber-400' : wasCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono text-purple-400 uppercase">{item.category}</span>
                          <DifficultyBadge level={item.difficulty} />
                          <span className={`ml-auto text-xs font-semibold ${wasSkipped ? 'text-amber-400' : wasCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {wasSkipped ? '— Skipped' : wasCorrect ? `+${item.marks ?? 1} pts` : '0 pts'}
                          </span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">{item.question}</p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pl-10">
                      {(item.options ?? []).map((opt, oi) => {
                        const isChosen  = chosenIdx === oi;
                        const isCorrect = correctIdx === oi;
                        let optCls = 'flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs transition-all ';
                        if (isCorrect)       optCls += 'border-emerald-500/50 bg-emerald-500/8 text-emerald-300 ';
                        else if (isChosen)   optCls += 'border-rose-500/50 bg-rose-500/8 text-rose-300 ';
                        else                 optCls += 'border-white/5 text-slate-500 ';
                        return (
                          <div key={oi} className={optCls}>
                            <span className="font-bold w-4 shrink-0">{String.fromCharCode(65 + oi)}</span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <span className="text-emerald-400 shrink-0">✓</span>}
                            {isChosen && !isCorrect && <span className="text-rose-400 shrink-0">✗</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {item.explanation && (
                      <div className="mt-3 pl-10">
                        <p className="text-xs text-slate-500 italic leading-relaxed border-l-2 border-purple-500/30 pl-3">
                          {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom retry */}
            <div className="mt-8 text-center">
              <button
                onClick={() => { setCurrent(0); setAnswers({}); setRevealed({}); setShowExplanation({}); setFinished(false); }}
                className="px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
              >
                Retry Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Quiz Layout ─── */
  const isAnswered = answers[qId] !== undefined;
  const isRevealed = !!revealed[qId];
  const chosenIdx  = answers[qId];
  const correctIdx = q.options?.indexOf(q.correctAnswer);
  const progress   = Math.round(((current + 1) / questions.length) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top Bar ── */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-14 bg-[#0f172a]/90 backdrop-blur border-b border-white/5">
        <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Coding MCQ
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">{current + 1} / {questions.length}</span>
          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-14">

        {/* ── Question Navigator Sidebar ── */}
        <aside className="fixed left-0 top-14 w-56 h-[calc(100vh-56px-64px)] bg-[#0f172a] border-r border-white/5 p-4 flex flex-col overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-300 mb-0.5">Question Map</h2>
            <p className="text-xs text-slate-500 font-mono">{answeredCount} of {questions.length} answered</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5 content-start">
            {questions.map((item, i) => {
              const done   = revealed[item._id];
              const active = i === current;
              const wasCorrect = done && item.options?.[answers[item._id]] === item.correctAnswer;
              let cls = 'flex items-center justify-center aspect-square rounded-lg border text-xs font-mono transition-all ';
              if (active)        cls += 'bg-blue-600 border-blue-500 text-white font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)] ';
              else if (done)     cls += wasCorrect ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 ' : 'bg-rose-500/20 border-rose-500/50 text-rose-400 ';
              else               cls += 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 cursor-pointer ';
              return (
                <button key={item._id} className={cls} onClick={() => setCurrent(i)}>{i + 1}</button>
              );
            })}
          </div>
          <button
            onClick={() => setFinished(true)}
            className="mt-auto pt-4 w-full py-2 rounded-lg border border-rose-500/40 text-rose-400 text-xs font-semibold hover:bg-rose-500/10 transition-all uppercase tracking-wider"
          >
            Finish
          </button>
        </aside>

        {/* ── Main Content ── */}
        <main className="ml-56 flex-1 pb-20 pt-8 px-8 min-w-0">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-xs font-mono text-purple-400 uppercase tracking-wider">
              {q.category}{q.subcategory ? ` / ${q.subcategory}` : ''}
            </span>
            <span className="text-white/20">›</span>
            <span className="text-xs font-semibold text-blue-400">Q{current + 1} of {questions.length}</span>
            <DifficultyBadge level={q.difficulty} />
            <span className="ml-auto text-xs text-slate-500 font-mono">{q.marks ?? 1} mark{(q.marks ?? 1) > 1 ? 's' : ''}</span>
          </div>

          {/* Two-column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* Left: Question */}
            <div className="bg-[#0f172a] border border-white/8 rounded-2xl p-8 shadow-xl">
              {q.title && (
                <span className="text-blue-400 text-xs font-mono block mb-3 uppercase tracking-widest">{q.title}</span>
              )}
              <p className="text-lg font-semibold text-white leading-relaxed">{q.question}</p>
            </div>

            {/* Right: Options + actions */}
            <div className="space-y-3">
              {(q.options ?? []).map((opt, i) => (
                <OptionButton
                  key={i}
                  label={String.fromCharCode(65 + i)}
                  text={opt}
                  selected={chosenIdx === i}
                  correct={correctIdx === i}
                  revealed={isRevealed}
                  onClick={() => select(i)}
                />
              ))}

              <div className="pt-1 space-y-3">
                {!isRevealed ? (
                  <button
                    onClick={submit}
                    disabled={!isAnswered}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all"
                  >
                    Submit Answer
                  </button>
                ) : (
                  q.explanation && (
                    <button
                      onClick={toggleExplanation}
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
                    >
                      <span>{showExplanation[qId] ? '▲' : '▼'}</span>
                      {showExplanation[qId] ? 'Hide' : 'View'} Explanation
                    </button>
                  )
                )}
                {isRevealed && showExplanation[qId] && q.explanation && (
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

      {/* ── Bottom Nav ── */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-[#0f172a]/90 backdrop-blur border-t border-white/5">
        {/* Left: User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
            U
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-300 leading-none">User</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Score: <span className="text-blue-400 font-bold">{score}/{totalMarks}</span></p>
          </div>
        </div>

        {/* Right: Prev / Next */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-all"
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              if (current < questions.length - 1) setCurrent(c => c + 1);
              else setFinished(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            {current < questions.length - 1 ? 'Next →' : 'Finish Test'}
          </button>
        </div>
      </footer>
    </div>
  );
}
