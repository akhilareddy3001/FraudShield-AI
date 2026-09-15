from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.ensemble import IsolationForest

app = FastAPI(title="FraudShield AI ML Service")


class Transaction(BaseModel):
    amount: float
    hour: int
    international: str
    device: str
    location: str
    previousAverage: float


@app.get("/")
def home():
    return {
        "message": "FraudShield AI ML Service is running!"
    }


@app.post("/predict")
def predict(transaction: Transaction):

    amount = transaction.amount
    hour = transaction.hour
    average = transaction.previousAverage

    probability = 10
    reasons = []

    # -----------------------------
    # Fraud Classification Features
    # -----------------------------

    if average > 0 and amount > average * 5:
        probability += 30
        reasons.append(
            "Transaction amount is significantly higher than the customer's normal average"
        )

    if amount > 50000:
        probability += 20
        reasons.append(
            "High-value transaction detected"
        )

    if hour < 6 or hour >= 23:
        probability += 15
        reasons.append(
            "Transaction occurred at an unusual time"
        )

    if transaction.international == "Yes":
        probability += 10
        reasons.append(
            "International transaction detected"
        )

    if transaction.device == "Unknown":
        probability += 10
        reasons.append(
            "Transaction originated from an unknown device"
        )

    if transaction.location == "New Location":
        probability += 10
        reasons.append(
            "Transaction originated from a new location"
        )

    probability = min(probability, 99)

    # -----------------------------
    # Personalized Behavioral Deviation
    # -----------------------------

    behavior_deviation = 10

    # Compare transaction amount with customer's normal average
    if average > 0:
        amount_deviation = abs(amount - average) / average * 100
        behavior_deviation += min(50, amount_deviation / 2)

    # Unusual transaction time
    if hour < 6 or hour >= 23:
        behavior_deviation += 15

    # International behavior change
    if transaction.international == "Yes":
        behavior_deviation += 10

    # Device behavior change
    if transaction.device == "Unknown":
        behavior_deviation += 10

    # Location behavior change
    if transaction.location == "New Location":
        behavior_deviation += 10

    behavior_deviation = min(
        99,
        round(behavior_deviation)
    )

    # -----------------------------
    # Risk Classification
    # -----------------------------

    if probability >= 86:
        risk_level = "Critical"
        status = "Fraud"

    elif probability >= 61:
        risk_level = "High"
        status = "Review"

    elif probability >= 31:
        risk_level = "Medium"
        status = "Review"

    else:
        risk_level = "Low"
        status = "Safe"

    # -----------------------------
    # Anomaly Detection
    # -----------------------------

    features = [[
        amount,
        average,
        hour,
        1 if transaction.international == "Yes" else 0,
        1 if transaction.device == "Unknown" else 0,
        1 if transaction.location == "New Location" else 0,
    ]]

    model = IsolationForest(
        contamination=0.25,
        random_state=42
    )

    # Normal reference transactions
    reference_data = [
        [1000, 5000, 10, 0, 0, 0],
        [2000, 5000, 14, 0, 0, 0],
        [3000, 5000, 18, 0, 0, 0],
        [5000, 5000, 12, 0, 0, 0],
        [4000, 5000, 16, 0, 0, 0],
        [2500, 5000, 11, 0, 0, 0],
        [3500, 5000, 15, 0, 0, 0],
        [4500, 5000, 13, 0, 0, 0],
    ]

    model.fit(reference_data)

    prediction = model.predict(features)

    anomaly = prediction[0] == -1

    if anomaly:
        anomaly_score = min(
            99,
            max(
                40,
                probability
            )
        )

        anomaly_message = (
            "Machine learning model detected an unusual transaction pattern"
        )

    else:
        anomaly_score = min(
            30,
            probability
        )

        anomaly_message = (
            "Transaction pattern is within the normal range"
        )

    # -----------------------------
    # Default Explanation
    # -----------------------------

    if not reasons:
        reasons.append(
            "Transaction matches normal customer behavior patterns"
        )

    # -----------------------------
    # Final Response
    # -----------------------------

    return {
        "success": True,

        "model": "Isolation Forest + Rule-Based Fraud Classifier",

        "result": {
            "probability": probability,

            "riskLevel": risk_level,

            "status": status,

            "anomaly": anomaly,

            "anomalyScore": anomaly_score,

            "behaviorDeviation": behavior_deviation,

            "reasons": reasons,

            "anomalyReasons": [
                anomaly_message
            ],
        },
    }