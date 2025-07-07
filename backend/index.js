const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// Banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json());

// ✅ GET /tasks - listar tarefas
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY updated_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err.message);
    res.status(500).send("Erro ao buscar tarefas");
  }
});

// ✅ POST /tasks - criar nova tarefa
app.post("/tasks", async (req, res) => {
  const { title, completed } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *",
      [title, completed || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar tarefa:", err.message);
    res.status(500).send("Erro ao criar tarefa");
  }
});

app.listen(port, () => {
  console.log(`✅ API rodando em http://localhost:${port}`);
});
