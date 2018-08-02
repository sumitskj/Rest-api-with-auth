var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

var Favorites = require('../model/favorites');
var authenticate = require('../authenticate');

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
.get( authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
})

.post( authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({"user":req.user._id})
    .then((favorites) => {
        if(favorites != null){
            var arr = req.body;
            for(var i= 0; i<arr.length ;i++){
                var found = false;
                for(var j=0; j<favorites.dishes.length; j++){
                    if(arr[i]==favorites.dishes[j]){
                        found=true;
                        break;
                    }
                }
                if(found==false)
                favorites.dishes.push(arr[i]);
            }
            favorites.save();
            res.statusCode =200;
            res.setHeader('Content-Type','application/json');
            res.json(favorites);
        }else{
            Favorites.create({"user":req.user._id, "dishes":req.body})
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    })
})
.put( authenticate.verifyUser,(req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/dishId');
})
.delete( authenticate.verifyUser, (req, res, next)=> {
    Favorites.remove({})
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})


favoritesRouter.route('/:dishId')
.get(authenticate.verifyUser,(req, res, next)=>{
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/dishId');
})
.post( authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id})
    .then((favorites) => {

        if(favorites != null ){
            var found=false;
            for(var i=0;i<favorites.dishes.length;i++){
                if(req.params.dishId == favorites.dishes[i]){
                    found=true;
                    break;
                }
            }
            if(found==false){
                favorites.dishes.push(req.params.dishId);
            }
            
            favorites.save();
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favorites);
        }else{
            Favorites.create({"user":req.user._id, "dishes":req.params.dishId })
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    })
})
.put(authenticate.verifyUser,(req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/dishId');
})
.delete( authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({'user': req.user._id})
    .then((favorite)=>{
        favorite.dishes.pull(req.params.dishId);
        favorite.save()
        .then((favorites)=>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorites);
        },
        (err)=>next(err))
        .catch((err)=>next(err));
    }, (err)=>next(err))
    .catch((err)=>next(err));
})
 

module.exports = favoritesRouter;