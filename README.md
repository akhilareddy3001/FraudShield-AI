# FraudShield AI 🛡️

## 🌐 Live Demo

### 🚀 Frontend
[Open FraudShield AI](https://frontend-beta-ivory-38.vercel.app/)

### ⚙️ Backend API
[Backend Service](https://fraudshield-ai-9s2b.onrender.com/)

### 🤖 ML Service
[ML Service](https://fraudshield-ml-n46m.onrender.com/)

AI-powered financial fraud detection system that analyzes transaction patterns and identifies potentially fraudulent transactions.

## 🚀 Features

- Transaction fraud classification
- AI-powered anomaly detection using Isolation Forest
- Fraud probability scoring
- Risk-level classification
- Suspicious transaction identification
- Explainable AI with reasons for every prediction
- Personalized customer behavioral deviation analysis
- CSV transaction analysis
- Interactive fraud monitoring dashboard

## ⭐ Unique Feature

### Personalized Behavioral Intelligence

FraudShield AI does not only compare transactions against general fraud patterns.

It compares a transaction with the customer's normal behavior, including:

- Previous transaction average
- Transaction time
- Device
- Location
- International activity

This helps identify unusual behavior such as possible account takeover or suspicious activity.

## 🧠 AI Detection Pipeline

Transaction Data  
↓  
Fraud Classification  
↓  
Anomaly Detection  
↓  
Personalized Behavioral Analysis  
↓  
Fraud Probability Score  
↓  
Risk Classification  
↓  
Explainable Result

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- Axios

### Machine Learning
- Python
- FastAPI
- Scikit-learn
- Isolation Forest

## 📂 Project Structure

```text
FraudShield-AI/
│
├── frontend/
├── backend/
├── ml-service/
├── dataset/
└── README.md
