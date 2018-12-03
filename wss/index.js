const server = require('http').createServer()
const io = require('socket.io')(server)

const shell = require('shelljs')
const Docker = require('dockerode')

const d = new Docker({socketPath: '/var/run/docker.sock'})

io.on('connection', client => {
  client.on('docker', data => {
    console.log(data)
    d.listImages().then((images) => {
      images.forEach((image) => {
        console.log(image)
      })
    })
  })
  client.on('message', data => {
    console.log(data)

    const child = shell.exec(data, {async: true})

    child.stdout.on('data' , (data) => {
      client.send(data)
    })

    child.stderr.on('data', (data) => {
      client.send(data)
    })
  })
  client.on('disconnect', () => { /* … */ })
})
server.listen(process.env.WS_PORT)