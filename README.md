#  CliniFlow Frontend

## Overview
The frontend of ClinicFlow is a React-based application that provides an intuitive interface for managing patients, visits, appointments, and drug information.

## Backend Repository:
https://github.com/mbafousu/ClinicFlow-Backend.git

## Features
- Patient Management (CRUD UI)
- Visit Tracking (Create, Read, Update, Delete)
- Appointment Management (new feature)
- Drug Lookup (FDA API integration)
- Authentication (JWT-based login)
- Responsive UI with clean layout

## Pages
- Dashboard
- Patients
- Patient Details
- Visits
- Appointments 
- Drug Lookup

## API Integration
The frontend communicates with the backend using a custom API helper:
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

## Tech Stack
- React(Vite)
- React Router
- Material UI (MUI)/ CSS
- Fetch API

## Installation
- clone repositories: git clone https://github.com/YOUR_USERNAME/ClinicFlow-Frontend.git
- cd clinicflow
- run the development server: npm run dev

## Aplication Architecture
- React Frontend 
      - ↓
- Express Backend API 
      - ↓ 
- MongoDB Database 
      - ↓ 
- FDA Drug API

