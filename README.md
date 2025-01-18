# Image Steganography Project - Setup and Usage

This README provides instructions for setting up and running the Image Steganography Project using Vite.

## Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (LTS version recommended)  
   Download: [https://nodejs.org/](https://nodejs.org/)

2. **npm** (comes with Node.js)

## Project Structure

The project is organized as follows:

```
project-root/
|-- src/               # Source code directory
|-- public/            # Static assets
|-- package.json       # Project dependencies and scripts
|-- vite.config.js     # Vite configuration file
```

## Setup Instructions

### Step 1: Clone the Repository

Clone this repository to your local machine:
```bash
git clone <repository-url>
cd project-root
```

### Step 2: Install Dependencies

Install the required dependencies listed in `package.json`:
```bash
npm install
```

## Running the Application

### Start the Development Server
Use the following command to start the development server:
```bash
npm run dev
```

### Accessing the Application
- Open your browser and navigate to the URL provided by Vite, typically `http://localhost:3000`.

## Features

This project allows you to:
- Encode hidden messages into images.
- Decode hidden messages from images.
- Perform steganographic operations with a user-friendly interface.

## Notes
- Make sure all necessary dependencies are installed before starting the server.
- For production builds, refer to Vite’s documentation for deployment steps.

## Troubleshooting
- **Issues with npm:** Delete the `node_modules` folder and run `npm install` again.
- **Vite Development Server Issues:** Clear the cache by running `npm cache clean --force` and retry.

---

Feel free to customize this README further based on your specific project requirements!

