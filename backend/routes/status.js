const express = require("express");
const router = express.Router();
const Ingestion = require("../models/IngestionRequest");
const Batch = require("../models/Batch");

router.get("/:ingestion_id", async (req, res) => {
  const { ingestion_id } = req.params;

  const ingestion = await Ingestion.findOne({ ingestion_id });
  if (!ingestion) return res.status(404).json({ error: "Not found" });

  const batchDocs = await Batch.find({ batch_id: { $in: ingestion.batches } });

  const outerStatus = batchDocs.every((b) => b.status === "yet_to_start")
    ? "yet_to_start"
    : batchDocs.every((b) => b.status === "completed")
    ? "completed"
    : "triggered";

  res.json({
    ingestion_id,
    status: outerStatus,
    batches: batchDocs.map((b) => ({
      batch_id: b.batch_id,
      ids: b.ids,
      status: b.status,
    })),
  });
});

module.exports = router;
