# Food Classification AI

A full-stack application for instant food and cuisine recognition using AI. Upload a food image and get the predicted cuisine, dish, and a visual heatmap highlighting important regions. Built with Django REST API (backend) and React Native (frontend) for seamless mobile and web experience.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **AI-powered food and cuisine classification** from images
- **Grad-CAM heatmap** visualization for model interpretability
- **Mobile-first UI** with React Native (Expo)
- **JWT authentication** (backend ready for user auth)
- **Modular, extensible codebase** for easy contributions

---

## Tech Stack
| Layer     | Technology                  |
|-----------|-----------------------------|
| Backend   | Django, Django REST Framework, TensorFlow, Keras |
| Frontend  | React Native, Expo, React Navigation |
| Database  | SQLite (dev), PostgreSQL (prod) |
| Auth      | JWT (SimpleJWT), Allauth    |

---

## Project Structure
```
food_classification_be/   # Django backend (API, ML model)
    manage.py
    requirements.txt
    config/               # Django settings (dev/prod)
    llm/                  # Food classification API app
    model/                # Trained Keras model (.keras)
food_classification_fe/   # React Native frontend (Expo)
    App.js
    src/
        screens/          # UI screens (Home, Upload, HowItWorks, Welcome)
    assets/               # Images, icons
```

---

## Installation

### Backend (Django)
1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd Food_Classification/food_classification_be
   ```
2. **Create a virtual environment & activate:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure environment variables:**
   - Copy `.env.example` to `.env` and set values (see [Configuration](#configuration)).
5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```
6. **Start the server:**
   ```bash
   python manage.py runserver
   ```

### Frontend (React Native)
1. **Install Node.js & npm** (if not already installed)
2. **Install Expo CLI:**
   ```bash
   npm install -g expo-cli
   ```
3. **Install dependencies:**
   ```bash
   cd ../food_classification_fe
   npm install
   ```
4. **Start the app:**
   ```bash
   npx start expo
   ```
5. **Run on device/emulator:**
   - Android: `npx run-android`
   - iOS: `npx run-ios`
   - Web: `npx run-web`

---

## Configuration

### Backend
- **Environment variables:**
  - Copy `.env.example` to `.env` in `food_classification_be/` and set:
    - `DEBUG`, `SECRET_KEY`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, etc.
- **Model file:**
  - Place your trained Keras model as `food_classification_be/model/food_model.keras`.
- **Media/static:**
  - Uploaded images and static files are served from `/media/` and `/static/`.

### Frontend
- **API URL:**
  - The frontend auto-detects the backend IP using Expo config. Set your local IP in `app.json` if needed.

---

## Usage
1. **Open the app** (mobile or web)
2. **Upload or snap a food image**
3. **View predictions:**
   - Cuisine
   - Dish
   - Confidence score
   - Grad-CAM heatmap (if enabled)

---

## API Endpoints

### Food Classification
| Method | Endpoint            | Description                |
|--------|---------------------|----------------------------|
| POST   | `/llm/classify/`    | Classify food image        |

#### Example Request
```bash
curl -X POST -F "image=@/path/to/food.jpg" http://<backend-ip>:8000/llm/classify/
```

#### Example Response
```json
{
  "predicted_cuisine": "Italian",
  "predicted_dish": "Pizza",
  "confidence": 0.98
}
```

---

## Contributing
1. Fork the repo & clone locally
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes with clear messages
4. Push to your fork and open a Pull Request

---

## License
This project is licensed under the [MIT License](LICENSE).
