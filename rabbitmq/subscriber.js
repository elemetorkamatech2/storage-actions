/* eslint-disable import/no-unresolved */
import { connect } from 'amqplib/callback_api.js';
import logger from '../logger.js';

export default async function subscribe(queue, callback) {
  connect(process.env.RABBIT_MQ, async (connectError, connection) => {
    if (connectError) {
      throw connectError;
    }
    connection.createChannel(async (createChannelError, channel) => {
      if (createChannelError) {
        throw createChannelError;
      }
      channel.assertQueue(queue, { durable: false });
      channel.consume(queue, async (message) => {
        const jsonMessage = JSON.parse(message.content.toString());
        logger.info(`jsonMessage: ${jsonMessage}`);
        // this is the line that removing the messege from the queue
        channel.ack(message);
        callback(jsonMessage);
      });
    });
  });
}
