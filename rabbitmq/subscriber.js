import { connect } from 'amqplib/callback_api.js';
import logger from '../logger.js';

export default async function subscribe(queue, callback) {
  logger.info(`callback: ${callback}`);
  connect('amqp://localhost', async (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel(async (error1, channel) => {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queue, { durable: false });
      channel.consume(queue, async (message) => {
        const jsonMessage = JSON.parse(message.content.toString());
        logger.info(`jsonMessage: ${jsonMessage}`);
        callback(jsonMessage);
      });
    });
  });
}
