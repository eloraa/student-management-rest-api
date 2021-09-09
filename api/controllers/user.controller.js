exports.getStudentList = (req, res, next) => {
    const students = [{
        name: 'Jonas',
        class: '9',
        classRoll: '2',
        mail: 'mail@jonas.me',
        role: 'student'
    }, {
        name: 'Luban',
        class: '5',
        classRoll: '6',
        mail: 'mail@luban.me',
        role: 'student'
    }]

    res.json(students)

}