const amqp = require('amqplib');
async function sendToQueue(queueName, message) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(message));
  console.log(`Sent message "${message}" to queue "${queueName}"`);
  await channel.close();
  await connection.close();
}
sendToQueue('my-queue', 'rabbitmq work!');