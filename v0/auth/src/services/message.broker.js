import amqplib from 'amqplib';

export let channel;
export const QUEUE_NAME = 'AUTH_SANDBOX_REGISTER';

export default async function initMessageBroker() {


    const connection = await amqplib.connect(process.env.MQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`Message broker initialized.`);
}