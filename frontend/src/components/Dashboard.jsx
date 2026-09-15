import { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Activity,
  TrendingUp,
  Search,
  Bell,
  Upload,
  RefreshCw,
  Brain,
  ScanSearch,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load uploaded transactions
  const loadTransactions = () => {
    const savedTransactions = localStorage.getItem(
      "fraudshield_transactions"
    );

    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]);
      }
    } else {
      setTransactions([]);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // =========================
  // STATISTICS
  // =========================

  const totalTransactions = transactions.length;

  const fraudTransactions = transactions.filter(
    (transaction) =>
      String(transaction.is_fraud).trim() === "1"
  );

  const highRiskTransactions = transactions.filter(
    (transaction) =>
      transaction.risk_level === "High" ||
      transaction.risk_level === "Critical"
  );

  const safeTransactions = transactions.filter(
    (transaction) => transaction.status === "Safe"
  );

  const mediumRiskTransactions = transactions.filter(
    (transaction) => transaction.risk_level === "Medium"
  );

  const lowRiskTransactions = transactions.filter(
    (transaction) => transaction.risk_level === "Low"
  );

  const criticalRiskTransactions = transactions.filter(
    (transaction) => transaction.risk_level === "Critical"
  );

  const averageProbability =
    totalTransactions > 0
      ? Math.round(
          transactions.reduce(
            (sum, transaction) =>
              sum +
              Number(transaction.fraud_probability || 0),
            0
          ) / totalTransactions
        )
      : 0;

  // =========================
  // RISK PERCENTAGES
  // =========================

  const getPercentage = (count) =>
    totalTransactions > 0
      ? Math.round((count / totalTransactions) * 100)
      : 0;

  const lowPercentage = getPercentage(
    lowRiskTransactions.length
  );

  const mediumPercentage = getPercentage(
    mediumRiskTransactions.length
  );

  const highPercentage = getPercentage(
    transactions.filter(
      (t) => t.risk_level === "High"
    ).length
  );

  const criticalPercentage = getPercentage(
    criticalRiskTransactions.length
  );

  // =========================
  // SEARCH
  // =========================

  const suspiciousTransactions = transactions
    .filter(
      (transaction) =>
        transaction.status === "Fraud" ||
        transaction.risk_level === "High" ||
        transaction.risk_level === "Critical"
    )
    .filter((transaction) => {
      const id = String(
        transaction.transaction_id || ""
      ).toLowerCase();

      return id.includes(searchTerm.toLowerCase());
    })
    .slice(0, 5);

  return (
    <div className="dashboard">

      {/* =========================
          TOP BAR
      ========================= */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h1>FraudShield AI</h1>
            <p>AI-Powered Fraud Detection</p>
          </div>

        </div>

        <div className="topbar-right">

          <div className="system-status">
            <span></span>
            System Active
          </div>

          <Bell size={21} />

        </div>

      </header>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">

        {/* PAGE HEADING */}

        <div className="page-heading">

          <div>
            <h2>Fraud Detection Dashboard</h2>

            <p>
              Monitor transactions and identify
              suspicious activity using AI.
            </p>
          </div>

          <div className="heading-actions">

            <button
              className="analyze-btn"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={17} />
              Refresh Data
            </button>

            <Link
              to="/upload"
              className="upload-dashboard-btn"
            >
              <Upload size={17} />
              Upload CSV
            </Link>

            <Link
              to="/analyze"
              className="analyze-btn"
            >
              <Activity size={18} />
              Analyze Transaction
            </Link>

          </div>

        </div>

        {/* =========================
            STATISTICS
        ========================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              <Activity />
            </div>

            <div>
              <p>Total Transactions</p>

              <h3>
                {totalTransactions.toLocaleString()}
              </h3>

              <span className="positive">
                <TrendingUp size={14} />
                Dataset Loaded
              </span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon red">
              <AlertTriangle />
            </div>

            <div>
              <p>Fraud Detected</p>

              <h3>
                {fraudTransactions.length.toLocaleString()}
              </h3>

              <span className="negative">
                {totalTransactions > 0
                  ? (
                      (fraudTransactions.length /
                        totalTransactions) *
                      100
                    ).toFixed(2)
                  : 0}
                % of transactions
              </span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              <ShieldCheck />
            </div>

            <div>
              <p>High Risk</p>

              <h3>
                {highRiskTransactions.length.toLocaleString()}
              </h3>

              <span className="negative">
                Requires review
              </span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              <TrendingUp />
            </div>

            <div>
              <p>Avg. Fraud Probability</p>

              <h3>
                {averageProbability}%
              </h3>

              <span className="positive">
                AI Risk Analysis
              </span>
            </div>

          </div>

        </section>

        {/* =========================
            AI DETECTION ENGINE
        ========================= */}

        <section className="ai-model-section">

          <div className="section-heading">

            <div>
              <h3>AI Detection Engine</h3>

              <p>
                Multi-layer fraud detection and behavioral analysis
              </p>
            </div>

            <div className="model-status">
              <span className="status-dot"></span>
              Models Active
            </div>

          </div>

          <div className="model-grid">

            <div className="model-card">

              <div className="model-icon">
                <Brain size={23} />
              </div>

              <div>
                <h4>Fraud Classification</h4>

                <p>
                  Identifies potentially fraudulent transactions
                </p>
              </div>

              <strong>Active</strong>

            </div>

            <div className="model-card">

              <div className="model-icon">
                <ScanSearch size={23} />
              </div>

              <div>
                <h4>Anomaly Detection</h4>

                <p>
                  Isolation Forest behavioral analysis
                </p>
              </div>

              <strong>Active</strong>

            </div>

            <div className="model-card">

              <div className="model-icon">
                <BarChart3 size={23} />
              </div>

              <div>
                <h4>Risk Scoring</h4>

                <p>
                  Fraud probability and risk classification
                </p>
              </div>

              <strong>Active</strong>

            </div>

            <div className="model-card">

              <div className="model-icon">
                <Lightbulb size={23} />
              </div>

              <div>
                <h4>Explainable AI</h4>

                <p>
                  Provides reasons behind every prediction
                </p>
              </div>

              <strong>Active</strong>

            </div>

          </div>

        </section>

        {/* =========================
            CHART + RISK
        ========================= */}

        <section className="content-grid">

          {/* TRANSACTION OVERVIEW */}

          <div className="chart-card">

            <div className="card-header">

              <div>
                <h3>Transaction Overview</h3>

                <p>
                  Uploaded transaction dataset
                </p>
              </div>

              <select>
                <option>
                  Current Dataset
                </option>
              </select>

            </div>

            {totalTransactions > 0 ? (

              <div className="fake-chart">

                <div className="chart-bars">

                  {[
                    {
                      label: "Low",
                      value: lowRiskTransactions.length,
                    },
                    {
                      label: "Medium",
                      value: mediumRiskTransactions.length,
                    },
                    {
                      label: "High",
                      value: transactions.filter(
                        (t) =>
                          t.risk_level === "High"
                      ).length,
                    },
                    {
                      label: "Critical",
                      value:
                        criticalRiskTransactions.length,
                    },
                    {
                      label: "Fraud",
                      value: fraudTransactions.length,
                    },
                    {
                      label: "Safe",
                      value: safeTransactions.length,
                    },
                    {
                      label: "Total",
                      value: totalTransactions,
                    },
                  ].map((item) => {

                    const maxValue = Math.max(
                      totalTransactions,
                      1
                    );

                    const height =
                      item.value === 0
                        ? 4
                        : Math.max(
                            8,
                            (item.value / maxValue) *
                              100
                          );

                    return (
                      <div
                        key={item.label}
                        title={`${item.label}: ${item.value}`}
                        style={{
                          height: `${height}%`,
                        }}
                      ></div>
                    );

                  })}

                </div>

                <div className="chart-labels">

                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                  <span>Fraud</span>
                  <span>Safe</span>
                  <span>Total</span>

                </div>

              </div>

            ) : (

              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                }}
              >

                <Activity size={40} />

                <h3>No Dataset Loaded</h3>

                <p>
                  Upload a CSV file to see transaction
                  analytics.
                </p>

                <Link
                  to="/upload"
                  className="upload-dashboard-btn"
                >
                  <Upload size={17} />
                  Upload Dataset
                </Link>

              </div>

            )}

          </div>

          {/* RISK DISTRIBUTION */}

          <div className="risk-card">

            <div className="card-header">

              <div>
                <h3>Risk Distribution</h3>

                <p>
                  Current transaction risk
                </p>
              </div>

            </div>

            {/* LOW */}

            <div className="risk-item">

              <div>
                <span className="risk-dot low"></span>
                Low Risk
              </div>

              <strong>
                {lowPercentage}%
              </strong>

            </div>

            <div className="risk-bar">
              <div
                className="low-bar"
                style={{
                  width: `${lowPercentage}%`,
                }}
              ></div>
            </div>

            {/* MEDIUM */}

            <div className="risk-item">

              <div>
                <span className="risk-dot medium"></span>
                Medium Risk
              </div>

              <strong>
                {mediumPercentage}%
              </strong>

            </div>

            <div className="risk-bar">
              <div
                className="medium-bar"
                style={{
                  width: `${mediumPercentage}%`,
                }}
              ></div>
            </div>

            {/* HIGH */}

            <div className="risk-item">

              <div>
                <span className="risk-dot high"></span>
                High Risk
              </div>

              <strong>
                {highPercentage}%
              </strong>

            </div>

            <div className="risk-bar">
              <div
                className="high-bar"
                style={{
                  width: `${highPercentage}%`,
                }}
              ></div>
            </div>

            {/* CRITICAL */}

            <div className="risk-item">

              <div>
                <span className="risk-dot critical"></span>
                Critical
              </div>

              <strong>
                {criticalPercentage}%
              </strong>

            </div>

            <div className="risk-bar">
              <div
                className="critical-bar"
                style={{
                  width: `${criticalPercentage}%`,
                }}
              ></div>
            </div>

          </div>

        </section>

        {/* =========================
            SUSPICIOUS TRANSACTIONS
        ========================= */}

        <section className="transactions-card">

          <div className="card-header">

            <div>
              <h3>
                Suspicious Transactions
              </h3>

              <p>
                Transactions requiring attention
              </p>
            </div>

            <div className="search-box">

              <Search size={17} />

              <input
                placeholder="Search transaction..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Transaction ID
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Fraud Probability
                  </th>

                  <th>
                    Risk Level
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {suspiciousTransactions.length > 0 ? (

                  suspiciousTransactions.map(
                    (transaction, index) => (

                      <tr key={index}>

                        <td className="transaction-id">

                          {transaction.transaction_id ||
                            `TXN-${index + 1}`}

                        </td>

                        <td className="amount">

                          ₹
                          {Number(
                            transaction.amount || 0
                          ).toLocaleString()}

                        </td>

                        <td>

                          <div className="probability">

                            <div className="probability-bar">

                              <div
                                style={{
                                  width: `${transaction.fraud_probability || 0}%`,
                                }}
                              ></div>

                            </div>

                            <strong>
                              {transaction.fraud_probability || 0}%
                            </strong>

                          </div>

                        </td>

                        <td>

                          <span
                            className={`risk-badge ${
                              transaction.risk_level
                                ?.toLowerCase() || "low"
                            }`}
                          >
                            {transaction.risk_level ||
                              "Low"}
                          </span>

                        </td>

                        <td>

                          <span
                            className={`status-badge ${
                              transaction.status
                                ?.toLowerCase() || "safe"
                            }`}
                          >
                            {transaction.status ||
                              "Safe"}
                          </span>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >

                      {totalTransactions === 0 ? (

                        <>
                          No analyzed transactions yet.
                          <br />

                          <small>
                            Upload a CSV dataset to begin
                            analysis.
                          </small>
                        </>

                      ) : (

                        <>
                          No suspicious transactions
                          found.
                          <br />

                          <small>
                            Your uploaded dataset currently
                            has no matching high-risk records.
                          </small>
                        </>

                      )}

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* =========================
            DATASET SUMMARY
        ========================= */}

        {totalTransactions > 0 && (

          <section
            className="transactions-card"
            style={{ marginTop: "20px" }}
          >

            <div className="card-header">

              <div>

                <h3>
                  Dataset Security Summary
                </h3>

                <p>
                  Overall analysis of the uploaded
                  transaction dataset
                </p>

              </div>

            </div>

            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon green">
                  <ShieldCheck />
                </div>

                <div>
                  <p>Safe Transactions</p>

                  <h3>
                    {safeTransactions.length.toLocaleString()}
                  </h3>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon orange">
                  <AlertTriangle />
                </div>

                <div>
                  <p>Medium Risk</p>

                  <h3>
                    {mediumRiskTransactions.length.toLocaleString()}
                  </h3>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon red">
                  <AlertTriangle />
                </div>

                <div>
                  <p>Critical Risk</p>

                  <h3>
                    {criticalRiskTransactions.length.toLocaleString()}
                  </h3>
                </div>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default Dashboard;