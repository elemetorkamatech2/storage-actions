const { PubSub } = require('@google-cloud/pubsub');
const path = require('path');
require('dotenv').config();

const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const pubsub = new PubSub({
  keyFilename: keyFilePath
});
console.log(pubsub.getClient_)

// Set the name of the new topic
const topicName = 'my-new-topic';

// Create the new topic asynchronously
async function createTopic() {
  try {
    const topic = await pubsub.topic("OOOOOO");
    await topic.create();
    console.log(`Topic ${topicName} created successfully`);
  } catch (err) {
    console.error(err);
  }
}

// Export the createTopic function
exports.createTopic = createTopic;

