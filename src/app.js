import './sass/app.scss';
require('./bootstrap');

let socket = io();

socket.on('connect', () => {
    console.log('connect');
    socket.emit('join_room', 'users');
});

$('#upload').on('click', () => {
    let firmware = document.querySelector('#firmware');
    let data = new FormData();
    data.append('firmware', firmware.files['0']);

    $.ajax({
        url: '/firmware',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: (data, textStatus, jqXHR) => {
            if (data.file_url) {
                let newItem = `<li class="list-group-item" data-url="${data.file_url}">
                    ${data.file_url} <a href="${data.file_url}">
                    <i class="fa fa-download" aria-hidden="true"></i></a></li>`;
                $('#firmwares').append(newItem);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log('ERRORS: ' + textStatus);
        }
    });
});

$('#firmwares').on('click', '.list-group-item', (event) => {
    let firmwareUrl = $(event.target).data('url');
    console.log(firmwareUrl);
    socket.emit('update_firmware', {firmware_url: firmwareUrl});
});
