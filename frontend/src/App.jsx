import { useState, useEffect, useRef } from "react";
import axios from "axios";

// ─── Radar Ring Component ─────────────────────────────────────────────────────
function RadarRing({ score }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;
  const color =
    score >= 70 ? "#10B981" : score >= 45 ? "#F59E0B" : "#EF4444";

  return (
    <div className="radar-ring-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        {/* Grid rings */}
        {[44, 52, 60].map((radius, i) => (
          <circle
            key={i}
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="rgba(99,115,160,0.12)"
            strokeWidth="1"
          />
        ))}
        {/* Track */}
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke="rgba(59,130,246,0.12)"
          strokeWidth="8"
        />
        {/* Progress arc */}
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s" }}
        />
        {/* Center dot */}
        <circle cx="65" cy="65" r="3" fill={color} opacity="0.6" />
        {/* Crosshair lines */}
        <line x1="65" y1="20" x2="65" y2="30" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <line x1="65" y1="100" x2="65" y2="110" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <line x1="20" y1="65" x2="30" y2="65" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <line x1="100" y1="65" x2="110" y2="65" stroke={color} strokeWidth="1.5" opacity="0.4" />
      </svg>
      <div className="radar-score-label">
        <span className="radar-score-num" style={{ color }}>{animated}%</span>
        <span className="radar-score-sub">MATCH</span>
      </div>
    </div>
  );
}

// ─── Badge Component ──────────────────────────────────────────────────────────
function StatusBadge({ label, value, type }) {
  const colorMap = {
    apply: { YES: "#10B981", MAYBE: "#F59E0B", NO: "#EF4444" },
    difficulty: {
      Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444",
      "Very Hard": "#EF4444", Low: "#10B981", Moderate: "#F59E0B", High: "#EF4444",
    },
  };
  const color = colorMap[type]?.[value] ?? "#3B82F6";

  return (
    <div className="status-badge-card">
      <span className="badge-label">{label}</span>
      <span className="badge-value" style={{ color }}>{value}</span>
      <div className="badge-glow" style={{ background: color }} />
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ eyebrow, title, children, accent = "#3B82F6" }) {
  return (
    <div className="section-card" style={{ "--card-accent": accent }}>
      {eyebrow && <span className="card-eyebrow">{eyebrow}</span>}
      <h2 className="card-title">{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────
function SkillChip({ label, variant }) {
  return (
    <span className={`skill-chip skill-chip--${variant}`}>
      <span className="chip-dot" />
      {label}
    </span>
  );
}

// ─── File Drop Zone ───────────────────────────────────────────────────────────
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
      className={`file-drop-zone ${dragging ? "file-drop-zone--dragging" : ""} ${file ? "file-drop-zone--filled" : ""}`}
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
      <div className="drop-icon">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      {file ? (
        <span className="drop-filename">{file.name}</span>
      ) : (
        <span className="drop-placeholder">
          Drop your <strong>PDF resume</strong> here, or <u>browse</u>
        </span>
      )}
    </div>
  );
}

// ─── Scanning Loader ──────────────────────────────────────────────────────────
function ScanningLoader() {
  return (
    <div className="scanning-loader">
      <div className="scan-ring">
        <div className="scan-beam" />
      </div>
      <p className="scan-text">Analyzing resume<span className="scan-dots" /></p>
      <p className="scan-sub">Cross-referencing skills · Building roadmap · Calculating fit</p>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [resume, setResume] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume || !companyName || !jobDescription) {
      alert("Please fill all fields");
      return;
    }

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
      {/* Ambient background elements */}
      <div className="bg-grid" />
      <div className="bg-glow bg-glow--blue" />
      <div className="bg-glow bg-glow--purple" />

      <div className="app-container">

        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-eyebrow">
            <span className="eyebrow-dot" />
            AI-POWERED PLACEMENT ANALYSIS
          </div>
          <h1 className="app-title">
            Nex<span className="title-accent">Hire</span>
          </h1>
          <p className="app-subtitle">
            Upload your resume, target a role - get an honest fit score,
            skill gap analysis, and a personalized prep roadmap.
          </p>
        </header>

        {/* ── Input Panel ── */}
        <div className="input-panel">
          <div className="panel-header">
            <span className="panel-label">MISSION BRIEFING</span>
          </div>

          <div className="input-group">
            <label className="field-label">Resume <span className="field-tag">PDF</span></label>
            <FileDropZone file={resume} onChange={setResume} />
          </div>

          <div className="input-grid">
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
          </div>

          <div className="input-group">
            <label className="field-label">Job Description</label>
            <textarea
              rows="7"
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
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
            {loading ? "Analyzing…" : "Analyze Resume"}
          </button>
        </div>

        {/* ── Loading State ── */}
        {loading && <ScanningLoader />}

        {/* ── Results ── */}
        {result && !loading && (
          <div className="results-section">
            <div className="results-header">
              <span className="panel-label">ANALYSIS COMPLETE</span>
              <div className="results-divider" />
            </div>

            {/* Top stats row */}
            <div className="stats-row">
              <div className="stat-radar-wrap">
                <RadarRing score={result.match_score ?? 0} />
              </div>
              <div className="stat-badges">
                <StatusBadge label="APPLY?" value={result.apply_recommendation} type="apply" />
                <StatusBadge label="DIFFICULTY" value={result.difficulty_level} type="difficulty" />
              </div>
            </div>

            {/* Job Summary */}
            {result.job_summary && (
              <SectionCard eyebrow="OVERVIEW" title="Job Summary" accent="#3B82F6">
                <p className="prose-text">{result.job_summary}</p>
              </SectionCard>
            )}

            {/* Recommendation Reason */}
            {result.reason && (
              <SectionCard eyebrow="VERDICT" title="Why This Score?" accent="#8B5CF6">
                <p className="prose-text">{result.reason}</p>
              </SectionCard>
            )}

            {/* Skills grid */}
            <div className="skills-grid">
              <SectionCard eyebrow="STRENGTHS" title="Matching Skills" accent="#10B981">
                <div className="chips-wrap">
                  {result.matching_skills?.map((s, i) => (
                    <SkillChip key={i} label={s} variant="match" />
                  ))}
                </div>
              </SectionCard>

              {result.missing_skills?.length > 0 && (
                <SectionCard eyebrow="GAPS" title="Missing Skills" accent="#EF4444">
                  <div className="chips-wrap">
                    {result.missing_skills.map((s, i) => (
                      <SkillChip key={i} label={s} variant="miss" />
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* Recruitment Process */}
            {result.recruitment_process?.length > 0 && (
              <SectionCard eyebrow="PROCESS" title="Recruitment Pipeline" accent="#F59E0B">
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

            {/* Expected Topics */}
            {result.expected_topics?.length > 0 && (
              <SectionCard eyebrow="PREP INTEL" title="Expected Topics" accent="#06B6D4">
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

            {/* Preparation Roadmap */}
            {result.preparation_roadmap?.length > 0 && (
              <SectionCard eyebrow="ACTION PLAN" title="Preparation Roadmap" accent="#8B5CF6">
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

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
              <SectionCard eyebrow="PERSONALIZED" title="Suggestions" accent="#10B981">
                <ul className="suggestions-list">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="suggestion-item">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="suggestion-icon">
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

        <footer className="app-footer">
          <span>NexHire · Powered by AI</span>
        </footer>

      </div>
    </div>
  );
}

export default App;
