# Raghav // Personal Portfolio (CSE 3rd Year • Semester 5)

A futuristic, non-boxy personal portfolio built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**.

Featuring an organic asymmetrical design, dynamic ambient light mesh, interactive constellation canvas, custom magnetic cursor, cyber terminal HUD, and a **private host telemetry dashboard** that tracks and displays visitor names & IP addresses **to you only**.

---

## ⚡ Key Highlights

1. **Non-Boxy Modern UI & Motion**:
   - Asymmetrical organic glass cards (`backdrop-blur-2xl`, curved borders, glowing aura).
   - Dynamic 3D tilt effects reacting to mouse coordinates.
   - Interactive HTML5 particle constellation canvas that connects nodes to the cursor.
   - Smooth desktop magnetic cursor with ambient lag ring.
   - Procedural Web Audio API sound synthesizer (zero external mp3 files).

2. **CSE 3rd Year (Semester 5) Narrative**:
   - Interactive semester roadmap (Sem 1 to Sem 5).
   - Deep dive into core subjects: **Operating Systems**, **Computer Networks**, **DBMS Internals**, and **DAA**.
   - Flagship systems projects:
     - `NexusDB`: High-performance LSM-tree storage engine in C++20.
     - `VoxelKernel`: 32-bit x86 multitasking hobby kernel.
     - `MeshFlow`: Distributed pub/sub broker with Raft consensus.
     - `Algorithmic Codex`: Interactive memory & graph sandbox.

3. **Interactive Developer Terminal**:
   - Try typing `help`, `whoami`, `sem5`, `projects`, `pass`, `admin`, or `sudo hire`.

4. **Confidential Host Visitor Telemetry (Displayed to You Only)**:
   - **Automatic Logging**: Captures IP address, Geolocation (Country, City, Region), Browser, OS, Device, Timestamp, and Visit count.
   - **Interactive Visitor Pass**: Visitors can introduce themselves with their Name and a note (e.g. *"Sarah (Google Recruiter)"*). Upon submission, celebratory confetti explodes and their name is securely linked to their IP log.
   - **Protected Admin Dashboard**:
     - Dedicated URL: `http://localhost:3000/admin`
     - Or press **`Ctrl + Shift + A`** anywhere on the portfolio!
     - Protected with passcode: `cse2026` (configurable in `.env.local`).
     - Includes real-time search, filter by named vs anonymous, CSV/JSON export, and test logging.

---

## 🚀 Running the Project

```bash
# Navigate to project
cd C:\Users\Raghav\.gemini\antigravity\scratch\portfolio-site

# Start dev server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🔒 Accessing Your Private Visitor Telemetry

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Shortcut**: Press **`Ctrl + Shift + A`** on the home page or click the lock icon in the navbar.
- **Default Passcode**: `cse2026` (changeable in `.env.local`).
- **Export Data**: Download all logs with 1 click as a formatted `.csv` or `.json` file.
