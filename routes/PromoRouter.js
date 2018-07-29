const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var authenticate = require('../authenticate');
var Promotions = require('../model/promotions');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((lead) => {
      res.statusCode= 200,
      res.setHeader('Content-Type','application/json'),
      res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
    .then((lead) => {
      console.log('Promotions created : ',lead);
      res.statusCode= 200,
      res.setHeader('Content-Type','application/json'),
      res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode= 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
    .then((response) => {
      res.statusCode= 200,
      res.setHeader('Content-Type','application/json'),
      res.json(response);
    }, (err) => next(err))
    .catch((err) => next(err));
});


promoRouter.route('/:promoId')
.get((req,res,next) => {
  Promotions.findById(req.params.promoId)
  .then((lead) => {
    res.statusCode=200,
    res.setHeader('Content-Type','application/json'),
    res.json(lead);
  },(err)=>next(err))
  .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) => {

  res.statusCode=403;
  res.end('POST operation not supported on /promotions/'+req.params.promoId);
})
.put(authenticate.verifyUser, (req,res,next) => {
  Promotions.findByIdAndUpdate(req.params.promoId, {
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
.delete(authenticate.verifyUser, (req,res,next) => {
  Promotions.findByIdAndRemove(req.params.promoId)
  .then((resp) => {
    res.statusCode=200,
    res.setHeader('Content-Type','application/json'),
    res.json(resp);
  },(err)=>next(err))
  .catch((err) => next(err));
});

module.exports = promoRouter;
