const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
    console.log('Connected to MQTT broker');
    const topic = 'test/topic';
    const message = 'Message from Node.js';
    client.publish(topic, message, function() {
        console.log('Message published');
        client.end();
    });
});
