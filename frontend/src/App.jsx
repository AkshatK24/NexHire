import { useState, useRef } from "react";
import axios from "axios";

// ─── Radar Ring ────────────────────────────────────────────────────────────
function RadarRing({ score }) {
  const r = 50;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="radar-wrap">
      <svg width="116" height="116" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e8e8e8" strokeWidth="6" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke="#171717" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="radar-arc"
        />
      </svg>
      <div className="radar-label">
        <span className="radar-num">{score}%</span>
        <span className="radar-sub">MATCH</span>
      </div>
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────
function StatusBadge({ label, value }) {
  return (
    <div className="badge-card">
      <span className="badge-label">{label}</span>
      <span className="badge-value">{value}</span>
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────
function SectionCard({ eyebrow, title, children }) {
  return (
    <div className="section-card">
      {eyebrow && <span className="card-eyebrow">{eyebrow}</span>}
      <h2 className="card-title">{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// ─── Skill Chip ────────────────────────────────────────────────────────────
function SkillChip({ label, variant }) {
  return <span className={`chip chip--${variant}`}>{label}</span>;
}

// ─── File Drop Zone ────────────────────────────────────────────────────────
function FileDropZone({ file, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type === "application/pdf") onChange(f);
  };

  return (
    <div
      className={`drop-zone ${dragging ? "drop-zone--drag" : ""} ${file ? "drop-zone--filled" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => onChange(e.target.files[0])}
        style={{ display: "none" }}
      />
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {file ? (
        <span className="drop-filename">{file.name}</span>
      ) : (
        <span className="drop-placeholder">Drop PDF resume or <u>browse</u></span>
      )}
    </div>
  );
}

// ─── Loader ────────────────────────────────────────────────────────────────
function ScanningLoader() {
  return (
    <div className="scan-loader">
      <div className="scan-ring" />
      <p className="scan-text">Analyzing<span className="scan-dots" /></p>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
function App() {
  const [resume, setResume] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleAnalyze = async () => {
    if (!resume || !companyName || !jobDescription) {
      alert("Please fill all fields");
      return;
    }

    setStarted(true);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("company_name", companyName);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      setResult(null);
      const response = await axios.post(
        "https://nexhire-vdii.onrender.com/analyze-resume",
        formData
      );
      setResult(response.data.analysis);
    } catch (error) {
      console.error(error);
      alert("Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="bg-mesh" />

      <div className={`app-layout ${started ? "app-layout--split" : ""}`}>

        {/* ── Intro Section (hero, left initially) ── */}
        <div className="intro-section">
          <span className="intro-eyebrow">AI PLACEMENT COPILOT</span>
          <h1 className="app-title">
            Know your fit.<br />
            Plan your prep.<br />
            <span className="title-accent">Land the role.</span>
          </h1>
          <p className="app-subtitle">
            NexHire reads your resume against any job description and
            instantly tells you how well you match, what's missing, and
            exactly how to prepare  recruitment process, expected topics,
            and a day-by-day roadmap, all in one place.
          </p>

          <div className="intro-points">
            <div className="intro-point">
              <span className="point-dot" />
              <span>Honest match score &amp; apply recommendation</span>
            </div>
            <div className="intro-point">
              <span className="point-dot" />
              <span>Skill gap analysis - matched vs missing</span>
            </div>
            <div className="intro-point">
              <span className="point-dot" />
              <span>Personalized preparation roadmap</span>
            </div>
          </div>

          <footer className="app-footer">NexHire · Powered by AI</footer>
        </div>

        {/* ── Form / Input Section ── */}
        <div className="input-section">
          <div className="input-panel">
            <div className="panel-heading">
              <h2 className="panel-title">Start your analysis</h2>
              <p className="panel-subtitle">Takes less than a minute</p>
            </div>

            <div className="input-group">
              <label className="field-label">Resume <span className="field-tag">PDF</span></label>
              <FileDropZone file={resume} onChange={setResume} />
            </div>

            <div className="input-group">
              <label className="field-label">Target Company</label>
              <input
                type="text"
                placeholder="e.g. Google, Infosys, Razorpay…"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="text-input"
              />
            </div>

            <div className="input-group">
              <label className="field-label">Job Description</label>
              <textarea
                rows="6"
                placeholder="Paste the full job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="textarea-input"
              />
            </div>

            <button
              className={`analyze-btn ${loading ? "analyze-btn--loading" : ""}`}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing…" : "Analyze Resume"}
            </button>
          </div>
        </div>

        {/* ── Results Section ── */}
        <div className={`results-section ${started ? "results-section--visible" : ""}`}>
          {loading && <ScanningLoader />}

          {result && !loading && (
            <div className="results-inner">
              <div className="results-header">
                <span className="panel-label">ANALYSIS COMPLETE</span>
              </div>

              <div className="stats-row">
                <div className="stat-radar-wrap">
                  <RadarRing score={result.match_score ?? 0} />
                </div>
                <div className="stat-badges">
                  <StatusBadge label="APPLY?" value={result.apply_recommendation} />
                  <StatusBadge label="DIFFICULTY" value={result.difficulty_level} />
                </div>
              </div>

              {result.job_summary && (
                <SectionCard eyebrow="OVERVIEW" title="Job Summary">
                  <p className="prose-text">{result.job_summary}</p>
                </SectionCard>
              )}

              {result.reason && (
                <SectionCard eyebrow="VERDICT" title="Why This Score?">
                  <p className="prose-text">{result.reason}</p>
                </SectionCard>
              )}

              <div className="skills-grid">
                <SectionCard eyebrow="STRENGTHS" title="Matching Skills">
                  <div className="chips-wrap">
                    {result.matching_skills?.map((s, i) => (
                      <SkillChip key={i} label={s} variant="match" />
                    ))}
                  </div>
                </SectionCard>

                {result.missing_skills?.length > 0 && (
                  <SectionCard eyebrow="GAPS" title="Missing Skills">
                    <div className="chips-wrap">
                      {result.missing_skills.map((s, i) => (
                        <SkillChip key={i} label={s} variant="miss" />
                      ))}
                    </div>
                  </SectionCard>
                )}
              </div>

              {result.recruitment_process?.length > 0 && (
                <SectionCard eyebrow="PROCESS" title="Recruitment Pipeline">
                  <ol className="pipeline-list">
                    {result.recruitment_process.map((step, i) => (
                      <li key={i} className="pipeline-item">
                        <span className="pipeline-num">{String(i + 1).padStart(2, "0")}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </SectionCard>
              )}

              {result.expected_topics?.length > 0 && (
                <SectionCard eyebrow="PREP INTEL" title="Expected Topics">
                  <ul className="bullet-list">
                    {result.expected_topics.map((t, i) => (
                      <li key={i} className="bullet-item">
                        <span className="bullet-marker" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              )}

              {result.preparation_roadmap?.length > 0 && (
                <SectionCard eyebrow="ACTION PLAN" title="Preparation Roadmap">
                  <div className="roadmap-list">
                    {result.preparation_roadmap.map((item, i) => (
                      <div key={i} className="roadmap-item">
                        <div className="roadmap-line-wrap">
                          <div className="roadmap-dot" />
                          {i < result.preparation_roadmap.length - 1 && (
                            <div className="roadmap-connector" />
                          )}
                        </div>
                        <span className="roadmap-text">{item}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {result.suggestions?.length > 0 && (
                <SectionCard eyebrow="PERSONALIZED" title="Suggestions">
                  <ul className="suggestions-list">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="suggestion-item">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="suggestion-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
