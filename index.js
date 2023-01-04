const mysql = require('mysql')
const express = require('express')
const cors = require('cors')
const multiparty = require('multiparty')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

const conex = mysql.createConnection({
    host: 'localhost',
    database: 'loginelmer',
    user: 'root',
    password: ''
})

conex.connect((err) => {
 if (err) {
    throw err
 } else {
    console.log('Base de datos conectada');
 }
})

app.get('/', (req, res) => {
    conex.query('SELECT * FROM productos', (err, results) => {
        if (err) return;
        res.send(results)
    })
})

app.post('/upload', (req, res) => {
    const IMG_DIR = './public'
    let form = new multiparty.Form({uploadDir: IMG_DIR})


    form.parse(req, async (err, fields, files) => {
        if (err) res.send({err: err.message})

        let { name, desc, price, dsc_price } = fields
        const img = files ? `http://127.0.0.1:3000/${files.img[0].path.split('public\\').pop()}` : null
        name = name[0], desc = desc[0], price = price[0], dsc_price = dsc_price[0]

        conex.query("INSERT INTO `productos`(`nombre`, `descripcion`, `price`, `dsc_price`, `img`) VALUES ('"+ name + "', '"+ desc + "', '"+ price + "', '"+ dsc_price + "', '"+img+"')", (err, results) => {
            if (err) res.send({err: err.message})

            res.send(results)
        })
    })
})

app.get('/delete/:id', (req, res) => {
    const { id } = req.params
    conex.query(`DELETE FROM productos WHERE id=${id}`, (err, results) => {
        if (err) res.send({err: err.message})

        res.send(results)
    })
})

app.post('/login', (req, res) => {
    const {usuario, password} = req.body

    conex.query(`SELECT * FROM USUARIOS WHERE usuario='${usuario}' && contraseña='${password}'`, (err, results) => {
        if (err) {
            throw err
        }

        if (results[0]) {
            res.status(202)
            res.send(results[0])
        } else {
            res.status(401)
            res.send({error: 'Información invalida'})
        }
    })
})

app.listen(3000, () => {
    console.log('Servidor iniciado');
})
