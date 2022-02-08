const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/devices', async (req, res) => {
  fs.readFile('./public/data.json', (err, data) => {
    if (err) throw err;
    const devices = JSON.parse(data);
    return res.json(devices);
  });
});

router.get('/devices/:id', async (req, res) => {
  const id = req.params.id;
  fs.readFile('./public/data.json', (err, data) => {
    if (err) throw err;
    const devices = JSON.parse(data);
    const device = devices.filter(device => device.id === id);
    return res.json(device);
  });
});

router.post('/devices', async (req, res) => {
  const deviceToPost = req.body;
  fs.readFile('./public/data.json', (err, data) => {
    if (err) throw err;
    const devices = JSON.parse(data);
    const devicesToPost = devices.filter(item => item.id !== deviceToPost.id);
    devicesToPost.push(deviceToPost);
    fs.writeFileSync('./public/data.json', JSON.stringify(devicesToPost));
    return res.json(devicesToPost);
  });
});

router.get('/devices/refresh', async (req, res) => {
  req.io.broadcast.emit('refresh');
});

module.exports = router;
