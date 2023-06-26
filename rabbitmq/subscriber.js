import { connect } from 'amqplib/callback_api.js';
import create from '../api/services/website.service.js';
import logger from '../logger.js';

export default async function getFromQueue(queue) {
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
        switch (queue) {
        case 'create':
          create(jsonMessage);
          break;
        default:
          logger.info(`Function ${queue} not found.`);
        }
      });
    });
  });
}
