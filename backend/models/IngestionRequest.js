const mongoose = require("mongoose");

const IngestionSchema = new mongoose.Schema({
  ingestion_id: String,
  priority: { type: String, enum: ["HIGH", "MEDIUM", "LOW"] },
  created_at: { type: Date, default: Date.now },
  batches: [String],
});

module.exports = mongoose.model("IngestionRequest", IngestionSchema);
