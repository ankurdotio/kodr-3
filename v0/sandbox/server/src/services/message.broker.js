import amqp from 'amqplib';
import userModel from '../models/user.model.js';


export default async function initMessageBroker() {
    const QUEUE_NAME = 'AUTH_SANDBOX_REGISTER';

    const connection = await amqp.connect(process.env.MQ_URL);

    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });


    console.log(`Message broker connected to queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (message) => {


        const content = message.content.toString();
        console.log(`Received message: ${content}`);

        const { name, email, id } = JSON.parse(content);

        await userModel.create({ name, email, _id: id });

        channel.ack(message);

    })

}