const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
var Leaders = require('../model/leaders');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((lead) => {
      res.statusCode= 200,
      res.setHeader('Content-Type','application/json'),
      res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
    .then((lead) => {
      console.log('Dish created : ',lead);
      res.statusCode= 200,
      res.setHeader('Content-Type','application/json'),
      res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode= 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
    .then((response) => {
      res.statusCode= 200,
      res.setHeader('Content-Type','application/json'),
      res.json(response);
    }, (err) => next(err))
    .catch((err) => next(err));
});


leaderRouter.route('/:leaderId')
.get(authenticate.verifyUser, (req,res,next) => {
  Leaders.findById(req.params.leaderId)
  .then((lead) => {
    res.statusCode=200,
    res.setHeader('Content-Type','application/json'),
    res.json(lead);
  },(err)=>next(err))
  .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {

  res.statusCode=403;
  res.end('POST operation not supported on /leaders/'+req.params.leaderId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  Leaders.findByIdAndUpdate(req.params.leaderId, {
    $set: req.body
  },
{
  new: true
})
.then((lead) => {
  res.statusCode=200,
  res.setHeader('Content-Type','application/json'),
  res.json(lead);
},(err)=>next(err))
.catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  Leaders.findByIdAndRemove(req.params.leaderId)
  .then((resp) => {
    res.statusCode=200,
    res.setHeader('Content-Type','application/json'),
    res.json(resp);
  },(err)=>next(err))
  .catch((err) => next(err));
});

module.exports = leaderRouter;
