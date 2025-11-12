const { User, Empleador, PerfilEmpleador } = require('../models');

// ==========================================================
// 🔹 Obtener perfil del empleador
// ==========================================================
exports.obtenerPerfil = async (req, res) => {
  try {
    const { empleadorId } = req.params;

    // Buscar al empleador por su ID e incluir el usuario y perfil
    const empleador = await Empleador.findOne({
      where: { id: empleadorId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'nombre', 'email'] },
        { model: PerfilEmpleador, as: 'perfil' }
      ]
    });

    if (!empleador) {
      return res.status(404).json({ message: 'No se encontró el empleador' });
    }

    res.json({
      id: empleador.id,
      nombre: empleador.user.nombre,
      email: empleador.user.email,
      telefono: empleador.telefono,
      empresa: empleador.empresa,
      perfil: empleador.perfil || null,
    });
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// ==========================================================
// 🔹 Crear o actualizar perfil del empleador
// ==========================================================
exports.actualizarPerfil = async (req, res) => {
  try {
    const { empleadorId } = req.params;
    const {
      ubicacion,
      categoria,
      experiencia,
      biografia,
      habilidades,
      //calificacion,
      //trabajosCompletados
    } = req.body;

    // Buscar al empleador por su ID
    const empleador = await Empleador.findByPk(empleadorId);

    if (!empleador) {
      return res.status(404).json({ message: 'No se encontró el empleador' });
    }

    // Verificar si ya existe el perfil
    let perfil = await PerfilEmpleador.findOne({ where: { empleadorId: empleador.id } });

    if (perfil) {
      // 🔄 Actualizar perfil existente
      await perfil.update({
        ubicacion,
        categoria,
        experiencia,
        biografia,
        habilidades,
        //calificacion,
        //trabajosCompletados
      });
    } else {
      // 🆕 Crear nuevo perfil
      perfil = await PerfilEmpleador.create({
        empleadorId: empleador.id,
        ubicacion,
        categoria,
        experiencia,
        biografia,
        habilidades,
        //calificacion,
        //trabajosCompletados
      });
    }

    res.json({ message: 'Perfil actualizado correctamente', perfil });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
