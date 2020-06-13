const chalk = require('chalk')
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const readFileP = (path) => {
    return new Promise((res,rej) => {
        fs.readFile(path, (err, data) => {
            if (err) rej(err)
            else res(JSON.parse(data.toString()))
        })
    })
};

const writeFileP = (path, data) => {
    return new Promise((res,rej) => {
        fs.writeFile(path, JSON.stringify(data), (err) => {
            if (err) rej(err)
            else res()
        })
    })
}
const DB_Path = path.join(__dirname, './products.json')
app.use((req, res, next) => {
    console.log(chalk.cyan(`Request made to: ${req.path}`))
    next();
})

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json())
app.use((req,res,next) => {
    readFileP(DB_Path)
    .then(data => {
        req.products = data
        next()
    });
});
app.get('/api/products', (req,res)=>{
    res.send({
        products:req.products
    })
})
app.delete('/api/products/:name', (req,res)=>{
    const {name} = req.params
    console.log(name, req.products)
    for (let i = 0; i < req.products.length; i++){
        if (req.products[i].name === name) {
            delete req.products[i]
            req.products = req.products.filter(elem => elem !== null)
            return writeFileP(DB_Path, req.products)
            .then(() => {
                return res.send({
                    message:`Product ${name} has been removed`
                }) 
            })
            .catch(e => console.error(e))
        }
    }
    return res.status(400).send({
        message:`Product ${name} does not exist`
    })
})
app.use((req,res,next) => {
    res.send({
        message:`Webpage not found at ${req.url}`
    })
})
app.use((err,req,res,next) => {
    console.log('hit error')
    res.send({
        error:err.message,
    })
})
app.listen(3000, () => console.log(chalk.green('listening')))