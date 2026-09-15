import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import "./Upload.css";

function calculateRisk(transaction) {
  let score = 0;
  const reasons = [];

  const amount = Number(transaction.amount) || 0;
  const hour = Number(transaction.transaction_hour) || 0;
  const foreign = Number(transaction.foreign_transaction) || 0;
  const mismatch = Number(transaction.location_mismatch) || 0;
  const deviceTrust = Number(transaction.device_trust_score) || 100;
  const velocity = Number(transaction.velocity_last_24h) || 0;

  // High transaction amount
  if (amount > 50000) {
    score += 25;
    reasons.push("Unusually high transaction amount");
  } else if (amount > 20000) {
    score += 12;
    reasons.push("Above-normal transaction amount");
  }

  // Unusual transaction time
  if (hour < 6 || hour >= 23) {
    score += 15;
    reasons.push("Transaction made at unusual hours");
  }

  // Foreign transaction
  if (foreign === 1) {
    score += 15;
    reasons.push("Foreign transaction detected");
  }

  // Location mismatch
  if (mismatch === 1) {
    score += 20;
    reasons.push("Location mismatch detected");
  }

  // Device trust
  if (deviceTrust < 30) {
    score += 20;
    reasons.push("Low device trust score");
  } else if (deviceTrust < 60) {
    score += 10;
    reasons.push("Medium device trust score");
  }

  // Transaction velocity
  if (velocity > 10) {
    score += 15;
    reasons.push("High transaction velocity");
  } else if (velocity > 5) {
    score += 8;
    reasons.push("Elevated transaction velocity");
  }

  score = Math.min(score, 99);

  let risk;
  let status;

  if (score >= 75) {
    risk = "Critical";
    status = "Fraud";
  } else if (score >= 50) {
    risk = "High";
    status = "Review";
  } else if (score >= 25) {
    risk = "Medium";
    status = "Review";
  } else {
    risk = "Low";
    status = "Safe";
  }

  if (reasons.length === 0) {
    reasons.push("No major suspicious patterns detected");
  }

  return {
    ...transaction,
    fraud_probability: score,
    risk_level: risk,
    status,
    reasons,
  };
}

function UploadTransactions() {
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setMessage("Please upload a CSV file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setTransactions([]);
  };

  const processFile = () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text
        .trim()
        .split(/\r?\n/)
        .map((row) => row.split(","));

      if (rows.length < 2) {
        setMessage("CSV file does not contain transaction data.");
        return;
      }

      const headers = rows[0].map((header) =>
        header.trim().replace(/^"|"$/g, "")
      );

      const data = rows.slice(1).map((row) => {
        const transaction = {};

        headers.forEach((header, index) => {
          transaction[header] =
            row[index]?.trim().replace(/^"|"$/g, "") || "";
        });

        return calculateRisk(transaction);
      });

      setTransactions(data);
      localStorage.setItem(
        "fraudshield_transactions",
        JSON.stringify(data)
    );

      // Count actual fraud records from Kaggle dataset
      const fraudCount = data.filter(
        (transaction) =>
          String(transaction.is_fraud).trim() === "1"
      ).length;

      setMessage(
        `${data.length} transactions processed successfully. ${fraudCount} actual fraudulent transactions found in the dataset.`
      );
    };

    reader.readAsText(file);
  };

  // ALL actual fraud transactions
  const fraudTransactions = transactions.filter(
    (transaction) =>
      String(transaction.is_fraud).trim() === "1"
  );

  // Summary statistics
  const highRiskTransactions = transactions.filter(
    (transaction) =>
      transaction.risk_level === "High" ||
      transaction.risk_level === "Critical"
  );

  const safeTransactions = transactions.filter(
    (transaction) => transaction.status === "Safe"
  );

  return (
    <div className="upload-page">

      {/* PAGE HEADER */}
      <div className="upload-header">
        <div>
          <h2>Transaction Data Processing</h2>
          <p>
            Upload transaction data and identify suspicious activity using AI.
          </p>
        </div>

        <div className="processing-badge">
          <FileSpreadsheet size={18} />
          CSV Processing
        </div>
      </div>

      {/* UPLOAD CARD */}
      <div className="upload-card">
        <div className="upload-icon">
          <Upload size={35} />
        </div>

        <h3>Upload Transaction Dataset</h3>

        <p>
          Upload a CSV file containing financial transaction records.
        </p>

        <label className="file-input">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          <span>
            {file ? file.name : "Choose CSV File"}
          </span>
        </label>

        {file && (
          <div className="selected-file">
            <FileSpreadsheet size={18} />

            <div>
              <strong>{file.name}</strong>
              <small>
                {(file.size / 1024).toFixed(1)} KB
              </small>
            </div>
          </div>
        )}

        <button
          className="process-btn"
          onClick={processFile}
        >
          <Upload size={18} />
          Process Transactions
        </button>

        {message && (
          <div
            className={
              message.includes("successfully")
                ? "upload-message success"
                : "upload-message error"
            }
          >
            {message.includes("successfully") ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}

            {message}
          </div>
        )}
      </div>

      {/* RESULTS */}
      {transactions.length > 0 && (
        <>
          {/* SUMMARY CARDS */}
          <div className="upload-stats-grid">

            {/* TOTAL TRANSACTIONS */}
            <div className="upload-stat-card">
              <div className="upload-stat-icon blue">
                <FileSpreadsheet size={22} />
              </div>

              <div>
                <p>Total Transactions</p>
                <h3>
                  {transactions.length.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* FRAUD DETECTED */}
            <div className="upload-stat-card">
              <div className="upload-stat-icon red">
                <AlertTriangle size={22} />
              </div>

              <div>
                <p>Fraud Detected</p>
                <h3>
                  {fraudTransactions.length.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* HIGH / CRITICAL RISK */}
            <div className="upload-stat-card">
              <div className="upload-stat-icon orange">
                <AlertCircle size={22} />
              </div>

              <div>
                <p>High / Critical Risk</p>
                <h3>
                  {highRiskTransactions.length.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* SAFE TRANSACTIONS */}
            <div className="upload-stat-card">
              <div className="upload-stat-icon green">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p>Safe Transactions</p>
                <h3>
                  {safeTransactions.length.toLocaleString()}
                </h3>
              </div>
            </div>

          </div>

          {/* AI RESULTS TABLE */}
          <div className="uploaded-data-card">

            <div className="data-header">
              <div>
                <h3>AI Fraud Analysis Results</h3>

                <p>
                  {transactions.length.toLocaleString()}
                  {" "}transaction records analyzed
                </p>
              </div>

              <div className="processed-count">
                <ShieldCheck size={16} />
                AI Analysis Complete
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Fraud Probability</th>
                    <th>Risk Level</th>
                    <th>Status</th>
                    <th>Explanation</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions
                    .slice(0, 15)
                    .map((transaction, index) => (
                      <tr key={index}>

                        <td className="transaction-id">
                          {transaction.transaction_id ||
                            `TXN-${index + 1}`}
                        </td>

                        <td>
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
                                  width: `${transaction.fraud_probability}%`,
                                }}
                              ></div>
                            </div>

                            <strong>
                              {transaction.fraud_probability}%
                            </strong>

                          </div>
                        </td>

                        <td>
                          <span
                            className={`risk-badge ${transaction.risk_level.toLowerCase()}`}
                          >
                            {transaction.risk_level}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${transaction.status.toLowerCase()}`}
                          >
                            {transaction.status}
                          </span>
                        </td>

                        <td>
                          <div className="explanation">

                            {transaction.reasons.map(
                              (reason, i) => (
                                <span key={i}>
                                  <AlertTriangle size={13} />
                                  {reason}
                                </span>
                              )
                            )}

                          </div>
                        </td>

                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {transactions.length > 15 && (
              <p className="table-note">
                Showing first 15 transactions out of{" "}
                {transactions.length.toLocaleString()}.
              </p>
            )}

          </div>

          {/* ALL FRAUD TRANSACTION IDS */}
          <div className="uploaded-data-card fraud-list-card">

            <div className="data-header">

              <div>
                <h3>
                  <AlertTriangle size={20} />
                  Suspicious Transaction IDs
                </h3>

                <p>
                  All transactions classified as potentially fraudulent
                </p>
              </div>

              <div className="fraud-count">
                {fraudTransactions.length} Detected
              </div>

            </div>

            {fraudTransactions.length > 0 ? (

              <div className="fraud-id-grid">

                {fraudTransactions.map(
                  (transaction, index) => (

                    <div
                      className="fraud-id-item"
                      key={index}
                    >

                      <AlertTriangle size={16} />

                      <strong>
                        {transaction.transaction_id ||
                          `TXN-${index + 1}`}
                      </strong>

                      <span>
                        {transaction.fraud_probability}% risk
                      </span>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="no-fraud">
                <ShieldCheck size={20} />
                No potentially fraudulent transactions detected.
              </div>

            )}

          </div>
        </>
      )}

    </div>
  );
}

export default UploadTransactions;