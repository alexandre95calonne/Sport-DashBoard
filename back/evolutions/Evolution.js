const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
const csvPath = path.join(__dirname, '../csv/evolution_progression_sportive_6mois.csv')

function findAllEvolutions() {
    return new Promise((resolve, reject) => {
        const results = []
        fs.createReadStream(csvPath)
        .pipe(csv({separator: ','})) // convert CSV to JS
        .on('data', (data) => results.push(data)) // pushing data in results array
        .on('end', () => {
            resolve(results) 
        })
    })
}

exports.findAll = async (req, res) => {
    try {
        const evolutions = await findAllEvolutions()
        res.json(evolutions)
    } catch(error) {
        res.status(500).send({message: error.message})
    }
}

exports.findOne = async (req, res) => {
    try {
        const evolutions = await findAllEvolutions()
        const evolution = evolutions.find(evolution => evolution.id === req.params.id)

        if(evolution) {
            res.json(evolution)
        } else {
            res.status(400).send({message: 'Evolution with the id you gave was not found. Maybe it do not exist'})
        }
    } catch(error) {
        res.status(500).send({message: error.message})
    }
}