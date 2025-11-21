const router = require("express").Router();
const auth = require("../middlewares/auth");
const controller = require("../controllers/perfil.controller");

router.get("/mine", auth, controller.mine);
router.put("/", auth, controller.actualizar);

module.exports = router;
