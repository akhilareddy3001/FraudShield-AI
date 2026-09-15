import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Brain,
  MapPin,
  Smartphone,
  IndianRupee,
  Clock,
  AlertTriangle,
  UserRoundSearch,
} from "lucide-react";

function AnalyzeTransaction() {
  const [formData, setFormData] = useState({
    amount: "",
    hour: "",
    location: "",
    device: "",
    international: "No",
    previousAverage: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const analyzeTransaction = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      setResult(data.result);
    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        "Unable to connect to the FraudShield AI backend. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-page">
      {/* Header */}
      <div className="analysis-header">
        <div>
          <h2>Analyze Transaction</h2>

          <p>
            Enter transaction details to detect potential fraudulent activity.
          </p>
        </div>

        <div className="ai-badge">
          <Brain size={18} />
          AI Analysis
        </div>
      </div>

      <div className="analysis-layout">
        {/* Transaction Form */}
        <div className="form-card">
          <h3>Transaction Details</h3>

          <p className="form-description">
            Provide the transaction information below.
          </p>

          <form onSubmit={analyzeTransaction}>
            <div className="form-grid">
              {/* Amount */}
              <div className="form-group">
                <label>
                  <IndianRupee size={15} />
                  Transaction Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  placeholder="e.g. 25000"
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Hour */}
              <div className="form-group">
                <label>
                  <Clock size={15} />
                  Transaction Hour
                </label>

                <input
                  type="number"
                  name="hour"
                  min="0"
                  max="23"
                  placeholder="0 - 23"
                  value={formData.hour}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label>
                  <MapPin size={15} />
                  Location
                </label>

                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select location type</option>

                  <option value="Known Location">
                    Known Location
                  </option>

                  <option value="New Location">
                    New Location
                  </option>
                </select>
              </div>

              {/* Device */}
              <div className="form-group">
                <label>
                  <Smartphone size={15} />
                  Device
                </label>

                <select
                  name="device"
                  value={formData.device}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select device</option>

                  <option value="Known">
                    Known Device
                  </option>

                  <option value="Unknown">
                    Unknown Device
                  </option>
                </select>
              </div>

              {/* International */}
              <div className="form-group">
                <label>
                  International Transaction
                </label>

                <select
                  name="international"
                  value={formData.international}
                  onChange={handleChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {/* Previous Average */}
              <div className="form-group">
                <label>
                  Customer's Previous Average
                </label>

                <input
                  type="number"
                  name="previousAverage"
                  placeholder="e.g. 5000"
                  min="1"
                  value={formData.previousAverage}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className="analyze-submit"
              type="submit"
              disabled={loading}
            >
              <Brain size={19} />

              {loading
                ? "Analyzing Transaction..."
                : "Analyze Transaction"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px",
                borderRadius: "8px",
                background: "#fff1f2",
                color: "#be123c",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        <div className="result-card">
          {!result ? (
            <div className="empty-result">
              <div className="empty-icon">
                <ShieldCheck size={42} />
              </div>

              <h3>
                {loading
                  ? "AI Analysis in Progress..."
                  : "Ready for Analysis"}
              </h3>

              <p>
                {loading
                  ? "FraudShield AI is analyzing the transaction patterns."
                  : "Enter the transaction information and click Analyze Transaction to generate an AI risk assessment."}
              </p>
            </div>
          ) : (
            <>
              {/* Result Header */}
              <div className="result-title">
                <h3>AI Risk Assessment</h3>

                {result.status === "Fraud" ? (
                  <ShieldAlert className="fraud-icon" />
                ) : (
                  <ShieldCheck className="safe-icon" />
                )}
              </div>

              {/* Fraud Probability */}
              <div className="probability-circle">
                <div>
                  <strong>{result.probability}%</strong>
                  <span>Fraud Probability</span>
                </div>
              </div>

              {/* Risk Level */}
              <div
                className={`result-risk ${result.riskLevel.toLowerCase()}`}
              >
                <span>Risk Level</span>

                <strong>{result.riskLevel}</strong>
              </div>

              {/* Classification */}
              <div className="result-status">
                <span>Classification</span>

                <strong>{result.status}</strong>
              </div>

              {/* Anomaly Detection */}
              <div className="anomaly-box">
                <div>
                  <span>Anomaly Detection</span>

                  <strong>
                    {result.anomaly
                      ? "⚠ Anomaly Detected"
                      : "✓ Normal Pattern"}
                  </strong>
                </div>

                <div className="anomaly-score">
                  <span>Anomaly Score</span>

                  <strong>{result.anomalyScore}%</strong>
                </div>
              </div>

              {/* Personalized Behavioral Analysis */}
              <div className="behavior-box">
                <div>
                  <span>
                    <UserRoundSearch size={15} />
                    Personalized Behavioral Analysis
                  </span>

                  <strong>
                    {result.behaviorDeviation >= 70
                      ? "⚠ Significant Deviation"
                      : result.behaviorDeviation >= 40
                      ? "⚠ Moderate Deviation"
                      : "✓ Normal Behavior"}
                  </strong>
                </div>

                <div className="anomaly-score">
                  <span>Behavior Deviation</span>

                  <strong>{result.behaviorDeviation}%</strong>
                </div>
              </div>

              {/* Fraud Reasons */}
              <div className="explanation">
                <h4>Why was this transaction flagged?</h4>

                {result.reasons.map((reason, index) => (
                  <div className="reason" key={index}>
                    <span>
                      <AlertTriangle size={14} />
                    </span>

                    {reason}
                  </div>
                ))}
              </div>

              {/* Behavioral Analysis */}
              <div className="explanation">
                <h4>Behavioral Analysis</h4>

                {result.anomalyReasons.map((reason, index) => (
                  <div className="reason" key={index}>
                    <span>!</span>

                    {reason}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyzeTransaction;