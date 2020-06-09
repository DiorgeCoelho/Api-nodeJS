const express = require('express');
const authMiddllewares = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const Router = express.Router();

Router.use(authMiddllewares)

Router.get('/', async (req, res) => {
        try {
             const project = await Project.find().populate(['user', 'tasks']);
             return res.send({project})   
        } catch (err) {
              return res.status(400).send({error: 'Error creating new project'});   
        }
});
Router.get('/:projectId', async (req, res) => {
        try {
                const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
                return res.send({project})   
           } catch (err) {
                 return res.status(400).send({error: 'Error creating new project'});   
           }
});
Router.post('/', async (req, res) => {
     try {
        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task => {
                const projectTask = new Task({...task, project: project._id});

        await projectTask.save();
        project.tasks.push(projectTask);

        }));
        
        await project.save();

        return res.send({project}); 

     } catch (err) {
           return res.status(400).send({error: 'Error creating new project'});    
     }
});
Router.put('/:projectId', async (req, res) => {
        try {
                const { title, description, tasks } = req.body;
        
                const project = await Project.findByIdAndUpdate(req.params.projectId, { 
                        title, 
                        description}, {new: true} );
                        
                        project.tasks = []; 

                await Task.deleteOne({ project: project._id });

                await Promise.all(tasks.map(async task => {
                        const projectTask = new Task({...task, project: project._id});
        
                await projectTask.save();
                project.tasks.push(projectTask);
        
                }));
                
                await project.save();
        
                return res.send({project}); 
        
             } catch (err) {
                     console.log(err)
                   return res.status(400).send({error: 'Error update  new project'});    
             }
});
Router.delete('/:projectId', async (req, res) => {
        try {
               await Project.findByIdAndRemove(req.params.projectId).populate('user');
                return res.send();   
           } catch (err) {
                 return res.status(400).send({error: 'Error deleting new project'});   
           }
});


module.exports = app => app.use('/project', Router);