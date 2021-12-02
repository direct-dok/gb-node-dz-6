const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, './index.html');
    const readStream = fs.createReadStream(indexPath);

    readStream.pipe(res);
});

const io = socket(server);

io.on('connection', client => {

    client.on('message-connect', data => {
        const payload = {
            message: `Новый клиент подключился к беседе`,
        }

        client.broadcast.emit('connect-msg', payload);
        client.emit('connect-msg', payload);
    })

    client.on('client-msg', data => {
        const payload = {
            message: data.message.split('').reverse().join(''),
            name: data.name
        }
        client.broadcast.emit('server-msg', payload);
        client.emit('server-msg', payload);
    });

    client.on('disconnect', () => {
        const payload = {
            message: 'Клиент покинул беседу',
        }

        client.broadcast.emit('disconnect-msg', payload);
        client.emit('disconnect-msg', payload);
    })
})

server.listen(5500);