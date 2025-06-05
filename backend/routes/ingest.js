const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Ingestion = require("../models/IngestionRequest");
const Batch = require("../models/Batch");
const jobQueue = require("../services/batchProcessor");

const priorityMap = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

router.post("/", async (req, res) => {
  const { ids, priority } = req.body;

  if (!ids || !Array.isArray(ids) || !priorityMap[priority]) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const ingestion_id = uuidv4();
  const batches = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batchIds = ids.slice(i, i + 3);
    const batch_id = uuidv4();
    batches.push(batch_id);

    const batch = new Batch({
      batch_id,
      ingestion_id,
      ids: batchIds,
    });
    await batch.save();

    jobQueue.enqueue({
      batch_id,
      ingestion_id,
      ids: batchIds,
      priority,
      created_at: new Date(),
    });
  }

  const ingestion = new Ingestion({ ingestion_id, priority, batches });
  await ingestion.save();

  res.json({ ingestion_id });
});

module.exports = router;
