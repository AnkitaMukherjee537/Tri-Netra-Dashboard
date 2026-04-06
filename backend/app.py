import time
import threading
import uuid
import random
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app)
@app.route("/")
def home():
    return "Tri-Netra Backend is Running 🚀"
# In-memory storage for accidents
accidents_db = []

# Possible locations (around a generic center, let's say a busy city like New Delhi or generic)
# Let's use a generic point: 22.5726, 88.3639 (Kolkata)
BASE_LAT = 22.5726
BASE_LNG = 88.3639

def generate_dummy_accident():
    severities = ['Low', 'Medium', 'High']
    statuses = ['Pending', 'Ambulance Dispatched', 'Resolved']
    
    severity = random.choices(severities, weights=[50, 30, 20])[0]
    
    # Randomize coordinates slightly around the base location
    lat_offset = random.uniform(-0.05, 0.05)
    lng_offset = random.uniform(-0.05, 0.05)
    
    return {
        "id": str(uuid.uuid4()),
        "lat": BASE_LAT + lat_offset,
        "lng": BASE_LNG + lng_offset,
        "severity": severity,
        "timestamp": datetime.now().isoformat(),
        "confidence": round(random.uniform(0.7, 0.99), 2),
        "status": random.choice(statuses),
        "location_name": f"Route {random.randint(1, 100)}, Area {random.choice(['North', 'South', 'East', 'West'])}"
    }

def background_simulator():
    """Simulate new accidents being detected every 5-10 seconds."""
    while True:
        # Every 5-15 seconds add a new accident
        time.sleep(random.uniform(5, 15))
        new_accident = generate_dummy_accident()
        accidents_db.insert(0, new_accident)
        # Keep only latest 100 to avoid memory bloat
        if len(accidents_db) > 100:
            accidents_db.pop()

# Initialize some past data so the dashboard isn't empty on load
def init_dummy_data():
    for _ in range(20):
        acc = generate_dummy_accident()
        # Backdate them randomly over the past 24 hours
        past_time = datetime.now() - timedelta(minutes=random.randint(1, 1440))
        acc['timestamp'] = past_time.isoformat()
        accidents_db.append(acc)
    # Sort by timestamp descending
    accidents_db.sort(key=lambda x: x['timestamp'], reverse=True)

init_dummy_data()

# Start background simulation thread
simulation_thread = threading.Thread(target=background_simulator, daemon=True)
simulation_thread.start()

@app.route('/accidents', methods=['GET'])
def get_accidents():
    severity_filter = request.args.get('severity')
    status_filter = request.args.get('status')
    
    filtered_data = accidents_db
    
    if severity_filter:
        filtered_data = [a for a in filtered_data if a['severity'].lower() == severity_filter.lower()]
        
    if status_filter:
        filtered_data = [a for a in filtered_data if a['status'].lower() == status_filter.lower()]
        
    return jsonify({
        "success": True,
        "count": len(filtered_data),
        "data": filtered_data,
        # Summary stats for KPIs
        "stats": {
            "total_detected": len(accidents_db),
            "avg_confidence": round(sum(a['confidence'] for a in accidents_db) / max(1, len(accidents_db)) * 100, 1),
            "active_cameras": random.randint(120, 150),
            "avg_response_time_mins": random.randint(4, 12)
        }
    })

@app.route('/add_accident', methods=['POST'])
def add_accident():
    data = request.json
    if not data or 'lat' not in data or 'lng' not in data:
        return jsonify({"success": False, "error": "Missing coordinates"}), 400
        
    new_accident = {
        "id": str(uuid.uuid4()),
        "lat": data.get('lat'),
        "lng": data.get('lng'),
        "severity": data.get('severity', 'Medium'),
        "timestamp": datetime.now().isoformat(),
        "confidence": data.get('confidence', 0.85),
        "status": data.get('status', 'Pending'),
        "location_name": data.get('location_name', 'Manual Entry')
    }
    accidents_db.insert(0, new_accident)
    return jsonify({"success": True, "data": new_accident}), 201

if __name__ == '__main__':
    # Serve index.html for root and any non-API routes
    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    @app.route('/<path:path>')
    def static_proxy(path):
        import os
        # If static file exists, serve it
        if os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        # Otherwise fallback to index.html for React router
        return app.send_static_file('index.html')

    app.run(debug=True, port=5000, use_reloader=False) 
    # use_reloader=False to prevent starting background thread twice
