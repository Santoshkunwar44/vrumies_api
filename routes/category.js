const categories = require("../controllers/categories")

const router = require("express").Router()

router.post("/", categories.addNewCateogry)
router.get("/", categories.getAllCategory)





module.exports = router