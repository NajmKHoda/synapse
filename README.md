# Synapse

![alt text](image.png)

**Synapse** is an AI-powered administrative platform designed for educators to optimize student placement in learning groups. By combining quantitative scoring data with qualitative personality surveys, Synapse helps create the most effective, complementary groupings to maximize learning outcomes and enhance classroom dynamics.

## Features

- **AI-Driven Group Placement:** Synapse uses our *AcaDiff* algorithm to match students based on their assignment scores, ensuring groups are balanced in terms of strengths and weaknesses.

- **Personality Compatibility:** The system integrates personality surveys and our *PersonaSim* algorithm powered by Google Gemini to ensure students are paired with others they are likely to work well with.

- **Optimized Learning Environment:** By leveraging both academic data and personality insights, Synapse helps form well-rounded groups that promote collaborative learning and reduce potential conflicts.

## Tech Stack

**Frontend:** React with Next.js

**Backend:** Supabase with PostgreSQL

**AI Integration:** Google Gemini for personality analysis

**Styling:** Tailwind CSS

## Getting Started

1. Copy Synapse's repository:

```bash
git clone https://github.com/NajmKHoda/synapse.git
cd synapse
```

2. Configure environment variables as per the [`.env.example` template](/.env.example).

2. Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.