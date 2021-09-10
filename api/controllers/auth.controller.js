const students = require('../models/user.model')

exports.register = (req, res, next) => {
    const student = {
        id: (students.length + 1),
        name: req.body.name,
        class: req.body.class,
        classRoll: req.body.roll,
        email: req.body.email,
        role: req.body.role
    }
    students.push(student)

    res.json(students)
}
