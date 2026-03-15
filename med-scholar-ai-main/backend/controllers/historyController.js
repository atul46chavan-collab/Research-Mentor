import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HISTORY_FILE = path.join(__dirname, '..', 'search_history.json');

function readHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading history:', e.message);
  }
  return [];
}

function writeHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
}

export const saveSearch = (req, res) => {
  try {
    const { topic, papers } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const history = readHistory();
    history.unshift({
      id: Date.now().toString(),
      topic,
      paperCount: papers ? papers.length : 0,
      papers: papers || [],
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 searches
    if (history.length > 50) history.length = 50;
    writeHistory(history);

    res.json({ message: "Search saved", id: history[0].id });
  } catch (error) {
    console.error("Save History Error:", error.message);
    res.status(500).json({ error: "Failed to save search" });
  }
};

export const getHistory = (req, res) => {
  try {
    const history = readHistory();
    res.json(history);
  } catch (error) {
    console.error("Get History Error:", error.message);
    res.status(500).json({ error: "Failed to get history" });
  }
};

export const deleteHistory = (req, res) => {
  try {
    writeHistory([]);
    res.json({ message: "History cleared" });
  } catch (error) {
    console.error("Delete History Error:", error.message);
    res.status(500).json({ error: "Failed to clear history" });
  }
};
