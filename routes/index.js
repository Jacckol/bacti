'use strict';

const express = require('express');
const router = express.Router();

// Legacy system
const action = require('../methods/actions');

// Rutas modernas
const userRoutes = require('./user.routes');
const trabajadorRoutes = require('./trabajador.routes');
const perfilLaboralRoutes = require('./perfilLaboral.routes');
const perfilRoutes = require('./perfil.routes');
const servicioRoutes = require('./servicio.routes');

// Rutas del módulo Empleador
const empleadorRoutes = require('../empleador/routes/empleador.routes');
const perfilEmpleadorRoutes = require('../empleador/routes/perfilEmpleadorRoutes');
const trabajoRoutes = require('../empleador/routes/trabajo.routes');
const postulacionRoutes = require('../empleador/routes/postulacion.routes');
const notificacionRoutes = require('../empleador/routes/notificacion.routes');

// RUTAS SERVX
router.use('/api', userRoutes);
router.use('/api/trabajadores', trabajadorRoutes);
router.use('/api/perfil-laboral', perfilLaboralRoutes);
router.use('/api/perfil', perfilRoutes);
router.use('/api/servicios', servicioRoutes);

// RUTAS EMPLEADOR
router.use('/api/empleadores', empleadorRoutes);
router.use('/api/perfil-empleador', perfilEmpleadorRoutes);
router.use('/api/trabajos', trabajoRoutes);
router.use('/api/postulaciones', postulacionRoutes);
router.use('/api/notificaciones', notificacionRoutes);

// LEGACY
router.post('/api/register', action.addNew);
router.post('/api/login', action.authenticate);
router.get('/api/getinfo', action.getinfo);

router.post('/api/addpost', action.addPost);
router.get('/api/getallpost', action.getAllPost);
router.get('/api/getpostbyid/:id', action.getPostbyId);
router.get('/api/getpostbyauthorid/:id', action.getPostbyAuthorId);
router.get('/api/searchpost/:title', action.searchPost);
router.put('/api/updatepost/:id', action.updatePost);
router.delete('/api/deletepost/:id', action.deletePost);

// TEST
router.get('/', (req, res) => res.send('THIS IS HOME'));
router.get('/dashboard', (req, res) => res.send('THIS IS DASHBOARD'));

module.exports = router;
