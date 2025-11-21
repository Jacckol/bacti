const { Perfil, PerfilLaboral } = require("../models");

// ====================================================
// GET /api/perfil/mine
// ====================================================
exports.mine = async (req, res) => {
  try {
    // 1️⃣ Buscar perfil guardado (tabla perfil)
    let perfil = await Perfil.findOne({
      where: { userId: req.user.id },
    });

    // 2️⃣ Si NO existe → tomar datos iniciales de perfiles_laborales
    if (!perfil) {
      const base = await PerfilLaboral.findOne({
        where: { userId: req.user.id },
      });

      if (!base) {
        return res.json({}); 
      }

      // devolver solo lo necesario
      return res.json({
        nombreCompleto: base.nombreCompleto,
        telefono: base.telefono,
        categoria: base.categoria,
        direccion: base.direccion,
        experiencia: base.experiencia,
        descripcion: "",
        habilidades: [],
        fotoPerfil: null,
        cv: null
      });
    }

    // 3️⃣ Si existe perfil en tabla `perfil`, devolverlo COMPLETO
    return res.json(perfil);

  } catch (err) {
    console.log("ERROR PERFIL:", err);
    return res.status(500).json({ error: "Error obteniendo perfil" });
  }
};

// ====================================================
// PUT /api/perfil
// ====================================================
exports.actualizar = async (req, res) => {
  try {
    let perfil = await Perfil.findOne({ where: { userId: req.user.id } });

    // 1️⃣ Si NO existe perfil → CREARLO
    if (!perfil) {
      perfil = await Perfil.create({
        userId: req.user.id,
        ...req.body,
      });
      return res.json({ perfil });
    }

    // 2️⃣ Si existe → ACTUALIZAR
    await perfil.update(req.body);

    return res.json({ perfil });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error actualizando perfil" });
  }
};
