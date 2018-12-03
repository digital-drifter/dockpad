import { version } from '../../package.json'
import { Router } from 'express'
import facets from './facets'
import shell from 'shelljs'
import fs from 'fs'
import path from 'path'

export default ({ config, db }) => {
  let api = Router()

  const repoDir = path.resolve(__dirname, 'repos')

  // mount the facets resource
  api.use('/facets', facets({ config, db }))

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version })
  })

  api.post('/exec', (req, res) => {
    // console.log(req.body)
    //
    // console.log(repoDir)

    try {
      if (!fs.existsSync(repoDir)) {
        console.log('TEST')
        fs.mkdirSync(repoDir)
      } else {
        console.log('TEST 2')
      }
    } catch (e) {
      console.log(e)
    }

    res.json({ result: shell.exec('pwd') })
  })

  return api
}
