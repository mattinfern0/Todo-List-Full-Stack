
const mongoose = require('mongoose');
const async = require('async');

const Project = require('../models/project');
const Task = require('../models/task');

function notImplemented(res) {
  return res.send('Not implemented');
}

function onError(err, res, next) {
  console.log('ERROR: ', err);
  // res.send('Error');
  return next(err);
}

exports.createProject = (req, res, next) => {
  const reqProject = req.body.project;

  const newProject = new Project(
    {
      name: reqProject.name,
      owner: reqProject.owner,
    },
  );

  newProject.save((err) => {
    if (err) {
      return onError(err, res, next);
    }

    return res.status(201).send({ project: newProject });
  });

  console.log('Successfully added project');
};

exports.getAllProjects = (req, res, next) => {
  Project.find({ name: { $ne: 'Inbox' } }, (err, allProjects) => {
    if (err) {
      console.log('error while finding projects');
      return onError(err, res, next);
    }

    res.send({ projects: allProjects });
  });
};

exports.getProjectInfo = (req, res, next) => {
  const targetId = req.params.projectId;
  if (targetId === 'undefined') {
    // res.status(400).send('Project id undefined');
  }
  console.log('getting project info for id: ', targetId);
  async.parallel({
    info: (callback) => {
      Project.findById(targetId, callback);
    },
    tasks: (callback) => {
      Task.find({ project: mongoose.Types.ObjectId(targetId) }, callback);
    },
  }, (err, results) => {
    if (err) {
      return onError(err, res, next);
    }

    res.send({ info: results.info, tasks: results.tasks });
  });
// }
};

exports.updateProject = (req, res, next) => {
  const projectId = req.params.projectId;
  const updatedProject = req.body.project;

  Project.findByIdAndUpdate(projectId, updatedProject, (err, oldProject) => {
    if (err) {
      return onError(err, res, next);
    }

    res.send({ oldProject });
  });
};

exports.deleteProject = (req, res, next) => {
  const projectId = req.params.projectId;
  async.parallel({
    infoResult: (callback) => {
      Project.findByIdAndDelete(projectId, callback);
    },
    tasksResult: (callback) => {
      // Delete the tasks associated with that project
      Task.deleteMany({ project: mongoose.Types.ObjectId(projectId) }, callback);
    },
  }, (err) => {
    if (err) {
      return onError(err, res, next);
    }

    res.status(204).json({ message: `Successfully deleted project ${projectId}` });
  });
};

exports.getProjectTasks = (req, res, next) => {
  const projectId = req.params.projectId;

  Task.find({ project: projectId }, (err, results) => {
    if (err) {
      return onError(err, res, next);
    }

    res.send(results);
  });
};

exports.getUserInbox = (req, res, next) => {
  const userId = req.params.userId;

  Project.findOne({ name: 'Inbox', owner: mongoose.Types.ObjectId(userId) }, (err, result) => {
    if (err) {
      return onError(err, res, next);
    }
    // Create a new inbox for the user if it doesn't exist, otherwise send current one
    if (!result) {
      console.log("This user's inbox doesn't exist. Creating new one");
      const newInbox = new Project(
        {
          name: 'Inbox',
          owner: userId,
        },
      );

      newInbox.save((err) => {
        if (err) {
          return onError(err, res, next);
        }

        return res.send({ info: newInbox, tasks: [] });
      });
    } else {
      const inboxInfo = result;
      Task.find({ project: mongoose.Types.ObjectId(inboxInfo._id) }, (error, tasksResult) => {
        if (error) {
          return onError(err, res, next);
        }
        res.send({ info: inboxInfo, tasks: tasksResult });
      });
    }
  });
};

exports.getUserProjects = (req, res, next) => {
  const userId = req.params.userId;
  Project.find({ owner: mongoose.Types.ObjectId(userId), name: { $ne: 'Inbox' } }, (err, projects) => {
    if (err) {
      return onError(err, res, next);
    }

    return res.send({ projects });
  });
};
