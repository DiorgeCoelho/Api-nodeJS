const mongose = require('../../database');



const ProjectSchema = new mongose.Schema({

    title: {
        type: String,
        require: true,

    },
    description: {
        type: String,
        require: true,
    },
    user: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    tasks: [{
        type: mongose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongose.model('Project', ProjectSchema);

module.exports = Project;