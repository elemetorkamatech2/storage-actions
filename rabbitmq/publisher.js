import amqp from 'amqplib';
import logger from '../logger.js';

export default async function publish(queueName, message) {
  const connection = await amqp.connect(process.env.RABBIT_MQ);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  const data = JSON.stringify(message);
  logger.info(`queueName: ${queueName}`);
  channel.sendToQueue(queueName, Buffer.from(data));
  await channel.close();
  await connection.close();
}
