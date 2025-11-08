import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'Sv9eZrEdakTMHvT9DPGT9VhI8LuzGA8e',
    socket: {
        host: 'redis-19131.c91.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 19131
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'redis is successfully conncted');
const result = await client.get('foo');
console.log(result)  

export default client;