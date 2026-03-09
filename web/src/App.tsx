import { useState, useCallback, useRef } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const EXERCISES = ['Squat', 'Deadlift', 'Bench Press', 'Overhead Press', 'Barbell Row', 'Pull-up', 'Lunge', 'Plank'];

function CoachPage() {
  const [exercise, setExercise] = useState('Squat'); const [desc, setDesc] = useState(''); const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null);
  const ref = useRef<HTMLInputElement>(null);
  const analyze = useAction(api.ai.analyzeForm); const save = useMutation(api.functions.saveAnalysis);
  const handleFile = (f: File) => { const r = new FileReader(); r.onload = e => setImg(e.target?.result as string); r.readAsDataURL(f); };

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    try {
      const r = await analyze({ exercise, description: desc || undefined, imageBase64: img || undefined }); setResult(r); await save({ exercise, description: desc || undefined, ...r });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [exercise, desc, img, analyze, save]);

  const getColor = (s: number) => s >= 7 ? 'var(--green)' : s >= 4 ? 'var(--accent)' : 'var(--red)';

  return (
    <div className="mc"><div className="pg">
      <h1 className="title">Perfect Your <span className="a">Form</span></h1>
      <p className="sub">Upload a photo of your exercise form or describe it — get AI coaching feedback.</p>
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {EXERCISES.map(e => <button key={e} onClick={() => setExercise(e)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: exercise === e ? 700 : 500, border: `1px solid ${exercise === e ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--pill)', background: exercise === e ? 'var(--asoft)' : 'var(--card)', color: exercise === e ? 'var(--accent2)' : 'var(--txt2)', cursor: 'pointer' }}>{e}</button>)}
      </div>
      {img ? <div className="preview-container"><img src={img} className="preview-image" alt="Form" /><br /><button style={{ marginTop: '0.5rem', padding: '0.3rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--pill)', background: 'var(--card)', color: 'var(--txt2)', cursor: 'pointer' }} onClick={() => setImg(null)}>Remove</button></div>
        : <div className="dropzone" onClick={() => ref.current?.click()}><p>📸 Upload a photo of your form (optional)</p><input ref={ref} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} /></div>}
      <input className="inp" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe your form concerns (optional)..." />
      <button className="btn" disabled={loading} onClick={handleAnalyze}>{loading ? '⏳ Analyzing...' : '🏋️ Analyze Form'}</button>
      {loading && <div className="ld"><span /><span /><span /></div>}
      {result && !loading && <>
        <div className="score-circle" style={{ color: getColor(result.overallScore), borderColor: getColor(result.overallScore) }}>{result.overallScore}</div>
        {result.formNotes?.map((n: any, i: number) => (
          <div key={i} className="note-card"><div className="note-area"><span>{n.area}</span><span className="note-score" style={{ color: getColor(n.score) }}>{n.score}/10</span></div><div className="note-feedback">{n.feedback}</div><div className="note-correction">✅ {n.correction}</div></div>
        ))}
        {result.injuryRisks?.length > 0 && <div className="risk-box"><strong>⚠️ Injury Risks:</strong><br />{result.injuryRisks.map((r: string, i: number) => <div key={i}>• {r}</div>)}</div>}
        {result.tips?.length > 0 && <div className="tips"><strong>💡 Tips:</strong><br />{result.tips.map((t: string, i: number) => <div key={i}>• {t}</div>)}</div>}
      </>}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app">
    <header className="hdr"><a href="/"><span style={{ fontSize: '1.5rem' }}>🏋️</span><div><h1>FormCoach</h1></div></a></header>
    <Routes><Route path="/" element={<CoachPage />} /></Routes>
    <footer className="ftr">© {new Date().getFullYear()} FormCoach — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
