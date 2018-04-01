require('dotenv').config();

let express = require('express');
let multer  = require('multer');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = 3000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/firmwares');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

let upload = multer({storage: storage});

app.use(express.static(__dirname + '/public'));

app.post('/firmware', upload.single('firmware'), (req, res, next) => {
    console.log(req.file);
    let fileUrl = '';
    if (req.file) {
        fileUrl = 'firmwares/' + req.file.filename;
    }

    res.status(200);
    res.json({'file_url': fileUrl});
});

io.on('connection', (socket) => {
    socket.on('update_firmware', (data) => {
        io.to('devices').emit('update_firmware', data.firmware_url);
    });

    socket.on('join_room', (data) => {
        socket.join(data, () => {
            let rooms = Object.keys(socket.rooms);
            console.log(rooms); // [ <socket.id>, 'room 237' ]
        });
    });

});

