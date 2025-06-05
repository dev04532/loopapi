const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
  batch_id: String,
  ingestion_id: String,
  ids: [Number],
  status: {
    type: String,
    enum: ["yet_to_start", "triggered", "completed"],
    default: "yet_to_start",
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Batch", BatchSchema);
