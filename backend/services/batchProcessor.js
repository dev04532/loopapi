const Batch = require("../models/Batch");

const priorityMap = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

let jobQueue = [];

function enqueue(job) {
  jobQueue.push(job);
}

async function processQueue() {
  if (jobQueue.length === 0) return;

  jobQueue.sort((a, b) => {
    const prioDiff = priorityMap[a.priority] - priorityMap[b.priority];
    if (prioDiff !== 0) return prioDiff;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  const batch = jobQueue.shift();

  await Batch.updateOne({ batch_id: batch.batch_id }, { status: "triggered" });

  console.log(`Processing batch ${batch.batch_id}...`);
  await new Promise((res) => setTimeout(res, 2000)); // Simulate API

  await Batch.updateOne({ batch_id: batch.batch_id }, { status: "completed" });
  console.log(`Batch ${batch.batch_id} completed`);
}

setInterval(processQueue, 5000);

module.exports = { enqueue };
