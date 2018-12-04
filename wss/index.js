const server = require('http').createServer()
const io = require('socket.io')(server)

const shell = require('shelljs')
const Dockerode = require('dockerode')

const docker = new Dockerode({ socketPath: '/var/run/docker.sock' })

io.on('connection', client => {
  client.on('docker', ({ id, commands }) => {

    console.log(id)
    console.log(commands)

    if (Array.isArray(commands)) {

      commands.reduce((chain, command) => {
        return chain.then(chainedResults => {
          return command.then()
        })
      }, Promise.resolve([]))

      // const promises = []
      //
      // commands.forEach((command) => {
      //   const methodName = `${command.action.toLowerCase()}${command.entity.charAt(0).toUpperCase()}${command.entity.slice(1)}`
      //
      //   let method
      //
      //   if (methodName in docker) {
      //     method = docker[methodName]
      //   } else if (command.entity.hasOwnProperty(command.action)) {
      //     method = command.entity[command.action]
      //   }
      //
      //   promises.push(method.apply(docker, command.args || []))
      // })
      //
      // Promise.all(promises).then((values) => {
      //   client.send({ id, values })
      // })
    }

    // const errorHandler = (...args) => Promise.reject(args)
    //
    // switch (command) {
    //   case 'startContainer':
    //     docker.getContainer(id)
    //       .then(() => {
    //         console.log(arguments)
    //         // client.send({ id, containers })
    //       })
    //       .catch(errorHandler)
    //     break
    //   case 'pauseContainer':
    //     docker.getContainer(id)
    //       .then(() => {
    //         console.log(arguments)
    //         // client.send({ id, containers })
    //       })
    //       .catch(errorHandler)
    //     break
    //   case 'stopContainer':
    //     docker.getContainer(id)
    //       .then(() => {
    //         console.log(arguments)
    //         // client.send({ id, containers })
    //       })
    //       .catch(errorHandler)
    //     break
    //   case 'listContainers':
    //     docker.listContainers()
    //       .then((containers) => {
    //         client.send({ id, containers })
    //       })
    //       .catch(errorHandler)
    //     break
    //   case 'listImages':
    //     docker.listImages()
    //       .then((images) => {
    //         client.send({ id, images })
    //       })
    //       .catch(errorHandler)
    //     break
    //   case 'info':
    //     docker.info()
    //       .then((info) => {
    //         client.send({ id, info })
    //       })
    //       .catch(errorHandler)
    //     break
    //   default:
    //     client.send('Invalid Command')
    // }
  })
  client.on('message', data => {
    const child = shell.exec(data, { async: true })

    child.stdout.on('data', (data) => {
      client.send(data)
    })

    child.stderr.on('data', (data) => {
      client.send(data)
    })
  })
  client.on('disconnect', () => { /* … */ })
})

server.listen(process.env.WS_PORT)
