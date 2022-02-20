const { Category } = require('../../models')

// -------------------- GET CATEGORY --------------------

exports.getCategories = async (req, res) => {
    try {
        const dataCategories = await Category.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        })

        res.status(200).send({
            status: "Success",
            data: dataCategories
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

// -------------------- CREATE CATEGORY --------------------

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body

        const checkName = await Category.findOne({
            where: {
                name
            }
        })

        if(checkName) {
            return res.status(500).send({
                status: "Failed",
                message: "Category already exist",
            })
        }

        const dataCategory = await Category.create({
            ...req.body
        })

        res.status(200).send({
            status: "Success",
            data: {
                name: dataCategory.name
            }
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

// -------------------- UPDATE CATEGORY --------------------

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { body } = req

        const findCategory = await Category.findOne({
            where: { id }
        })

        if(!findCategory) {
            return res.status(404).send({
                status: "failed",
                message: "Category not found"
            })
        }

        await Category.update(body,{
            where: { id }
        })

        const updateCategory = await Category.findOne({
            where: {
                id
            },
            attributes: ["id", "name"]
        })

        res.status(200).send({
            status : "Success",
            data: updateCategory
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

// -------------------- DELETE CATEGORY --------------------

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const findCategory = await Category.findOne({
            where : { id }
        })

        if(!findCategory) {
            return res.status(404).send({
                status: "failed",
                message: "Category not found"
            })
        }

        await Category.destroy({
            where : { id }
        })

        res.status(200).send({
            status: "success",
            id: findCategory.id
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}
