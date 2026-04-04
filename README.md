# Tri-Netra (EmergencyEye AI) Dashboard

A production-ready interactive dashboard for a smart accident detection system. 
This project features a modern dark-themed UI, live map integration, real-time alert polling, and analytics visualization.

## Technologies Used
- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Lucide React, Google Maps API
- **Backend**: Flask (Python), Flask-CORS
- **Database/Data**: Backend simulates database entries and real-time accidents every few seconds.

## Folder Structure
```text
Tri-Netra-Dashboard/
├── backend/
│   ├── app.py              # Flask server and mock data generator
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components (Sidebar, KPICards, LiveMap, etc.)
│   │   ├── App.jsx         # Main application orchestrator
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles and Tailwind imports
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env                # API Keys config
└── README.md
```

## Running Locally

### 1. Start the Backend
The backend generates new accidents every 5-10 seconds and serves them over a REST API.

1. Open a terminal and navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `python app.py` (Runs on `http://127.0.0.1:5000`)

### 2. Start the Frontend
The frontend polls the backend and renders the interactive dashboard.

1. Open a new terminal and navigate to `frontend/`
2. Install Node modules: `npm install`
3. Open the `.env` file and insert your Google Maps API Key:
   ```
   VITE_GOOGLE_MAPS_API_KEY="AIzaSyYourAPIKeyHere..."
   ```
4. Run the frontend development server: `npm run dev`
5. Visit the Local URL shown in the terminal (usually `http://localhost:5173`).

## Deployment

### Frontend (Vercel/Netlify)
1. Set the build command to `npm run build` and output directory to `dist`.
2. Add the `VITE_GOOGLE_MAPS_API_KEY` and `VITE_API_BASE_URL` to the environment variables on Vercel/Netlify. Ensure `VITE_API_BASE_URL` points to your deployed backend URL.

### Backend (Render/Railway)
1. Connect your repository to Render/Railway.
2. The start command should be `gunicorn app:app`.
3. Add `gunicorn` to your `requirements.txt` before deploying.
