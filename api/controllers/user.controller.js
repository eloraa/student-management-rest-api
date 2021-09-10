const students = require('../models/user.model')

exports.getStudentList = (req, res, next) => {
    res.json(students)
}

exports.getStudent = (req, res, next) => {
    const student = students.find(e => e.id == req.params.id)

    if(!student) {
        const error = new Error('not found')
        next(error)
    } else{   res.json(student) }
}
