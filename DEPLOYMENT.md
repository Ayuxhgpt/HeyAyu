# Deployment Guide: Vercel & GitHub

This guide covers how to deploy the **FancyFont** (Full MERN Stack) to Vercel via GitHub. I have optimized the project to run both Frontend and Backend on Vercel!

## Prerequisite: GitHub Repository
(Already Pushed)
1.  Log in to [GitHub](https://github.com).
2.  Create a **New Repository**.
    *   **Repository Name**: `fancyfont-mern` (or similar).
    *   **Public/Private**: Your choice.
    *   **Initialize**: Do **NOT** add README, .gitignore, or License (we already have them).
3.  Copy the URL of your new empty repository (e.g., `https://github.com/yourusername/fancyfont-mern.git`).

## Step 1: Push Local Code to GitHub
Open your terminal in the project folder (`e:\WEBSITE\FanctFont`) and run:

```bash
# Link your local folder to the GitHub repo
git remote add origin https://github.com/Ayuxhgpt/HeyAyu.git

# Rename main branch to 'main' (if not already)
git branch -M main

# Push the code (Force push might be needed if the repo is not empty)
git push -u origin main --force
```

## Step 2: Deploy on Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub provider and **Import** the `fancyfont-mern` repository.
4.  **Configure Project**:
    *   **Framework Preset**: Select **Vite** (or leave as Other, Vercel detects `vercel.json`).
    *   **Root Directory**: Leave empty / Default (`./`). **IMPORTANT**: Do NOT select `client` anymore. We are deploying the whole repo.
    *   **Build Command**: `cd client && npm run build` (or override in Vercel settings if needed).
    *   **Output Directory**: `client/dist` (**IMPORTANT**: You MUST change this from default).
    *   **Environment Variables**:
        *   `MONGO_URI`: Your MongoDB Connection String (from MongoDB Atlas).
        *   `VITE_API_URL`: `/api/fonts` (Since backend is same domain).

5.  **Click Deploy**.

## Live Status
Once deployed, Vercel will give you a live URL (e.g., `https://fancyfont-mern.vercel.app`).
- The **Frontend** will be live and functional.
- The **Generator** will mostly work using the fallback database.
- Database features (History/Favorites) will default to local storage until the Backend is hosted.
