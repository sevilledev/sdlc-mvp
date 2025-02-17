const express = require('express')
const path = require('path')
const cors = require('cors')

require('dotenv/config')

// MARK: Express
const app = express()


// MARK: Middlewares
app.use(cors())
app.use(express.json())


// MARK: Server
app.listen(process.env.PORT, () => console.log(`\x1b[33mApp running on 🔥 PORT: ${process.env.PORT} \x1b[0m\n`))


// MARK: Routes
// app.use('/auth', require('./routes/auth.routes'))

app.use('/', express.static(path.join(__dirname, 'client', 'dist')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html')))