const mongose = require('../../database');



const TaskSchema = new mongose.Schema({
    
    title: {
        type: String,
        require: true,

    },
    project: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true,

    },
    assingTo:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    completed: {
        type: Boolean,
        require: true,
        default : false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongose.model('Task', TaskSchema);

module.exports = Task;