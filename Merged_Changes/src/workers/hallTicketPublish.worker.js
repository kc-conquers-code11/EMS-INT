const { Worker } = require('bullmq');
const { getRedisConnection } = require('../config/redis.connection');
const { QUEUE_NAME } = require('../queues/hallTicket.queue');
const { runHallTicketPublishJob } = require('../services/hall_ticket/hallTicketPublishJob.service');

const connection = getRedisConnection();

const hallTicketPublishWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log(`[hallTicketPublishWorker] Processing job ${job.id} for event ${job.data.exam_event_id}`);
    const result = await runHallTicketPublishJob(job.data);
    console.log(
      `[hallTicketPublishWorker] Completed event ${job.data.exam_event_id}, generated ${result.generated_count} PDF(s)`
    );
    return result;
  },
  {
    connection,
    concurrency: 1,
  }
);

hallTicketPublishWorker.on('failed', (job, err) => {
  console.error(`[hallTicketPublishWorker] Job ${job?.id} failed:`, err.message);
});

hallTicketPublishWorker.on('completed', (job) => {
  console.log(`[hallTicketPublishWorker] Job ${job.id} completed`);
});

const closeWorker = async () => {
  await hallTicketPublishWorker.close();
};

process.on('SIGTERM', closeWorker);
process.on('SIGINT', closeWorker);

console.log('[hallTicketPublishWorker] Started');

module.exports = hallTicketPublishWorker;
