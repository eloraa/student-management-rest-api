const User = require('../models/user.model')

exports.getStudentList = async (req, res, next) => {
    try {
        const users = await User.find();
        const transformedUsers = users.map((user) => user.transform());

        res.json(transformedUsers);
    } catch (error) {
        next(error);
    }
}

exports.getStudent = (req, res, next) => {
    const student = students.find(e => e.id == req.params.id)

    if (!student) {
        const error = new Error('not found')
        next(error)
    } else {
        res.json(student)
    }
}