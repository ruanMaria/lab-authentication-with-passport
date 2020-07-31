'use strict';

const { Router } = require('express');
const router = Router();

const routeGuard = require('./../middleware/route-guard');



router.get('/', (req, res, next) => {
  res.render('index', { title: 'Welcome!' });
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('authentication/private');
});

const roleRouteGuard = require('./../middleware/role-route-guard');


router.get('/student', routeGuard, roleRouteGuard(['student', 'teacher']), (req, res, next) => {
  res.render('student');
});

router.get('/assistant', routeGuard, roleRouteGuard(['assistant', 'teacher']), (req, res, next) => {
  res.render('assistant');
});

router.get('/teacher', routeGuard, roleRouteGuard(['teacher']), (req, res, next) => {
  res.render('teacher');
});

module.exports = router;
