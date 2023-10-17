const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
const csvPath = path.join(__dirname, '../csv/employee_fitness.csv')

function findAllEmployees() {
    return new Promise((resolve, reject) => {
        const results = []
        fs.createReadStream(csvPath)
        .pipe(csv({separator: ';'})) // convert CSV to JS
        .on('data', (data) => results.push(data)) // pushing data in results array
        .on('end', () => {
            resolve(results) 
        })
    })
}

exports.findAll = async (req, res) => {
    try {
        const employees = await findAllEmployees()
        res.json(employees)
    } catch(error) {
        res.status(500).send({message: error.message})
    }
}

exports.findOne = async (req, res) => {
    try {
        const employees = await findAllEmployees()
        const employee = employees.find(employee => employee.id === req.params.id)

        if(employee) {
            res.json(employee)
        } else {
            res.status(400).send({message: 'Employee with the id you gave was not found. Maybe he do not exist'})
        }
    } catch(error) {
        res.status(500).send({message: error.message})
    }
}