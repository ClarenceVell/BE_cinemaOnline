const { Person, Transaction, Film, Category } = require('../../models')

// -------------------- CREATE TRANSACTION --------------------

exports.createTransaction = async (req, res) => {
    try {
        const { body } = req
        const { userId } = req

        const transaction = await Transaction.create({
            ...body,
            transferProof: req.file.filename,
            personId : userId
        })

        const { id } = transaction
        const findTransaction = await Transaction.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "personId", "filmId"],
            },
        })
        
        res.status(200).send({
            status : "success",
            data : findTransaction
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

// -------------------- GET ALL TRANSACTION --------------------

exports.getTransactions = async ( req, res ) => {
    try {
        const dataTransactions = await Transaction.findAll({
            attributes: {
                exclude: ["updatedAt", "filmId"]
            },
            include: [
                {
                    model: Person,
                    as: "person",
                    attributes: ["id", "fullName", "email"]
                },
                {
                    model: Film,
                    as: "film",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "categoryId", "filmUrl"]
                    },
                    include: [
                        {
                            model: Category,
                            as: 'category',
                            attributes: {
                                exclude: ["createdAt", "updatedAt"]
                            }
                        }
                    ]
                }
            ]
        })

        res.status(200).send({
            status: "success",
            data: dataTransactions
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

// -------------------- GET TRANSACTIONS BY APPROVE --------------------

exports.getTransactionsByUser =  async ( req, res) => {
    try {
        // const { userId } = req
        const dataTransactions = await Transaction.findAll({
            where: { status: "approve"},
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            include: [
                {
                    model: Film,
                    as: "film",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "categoryId", "filmUrl"]
                    },
                    include: [
                        {
                            model: Category,
                            as: "category",
                            attributes: {
                                exclude: ["createdAt", "updatedAt"]
                            }
                        }
                    ]
                }
            ]
        })

        res.status(200).send({
            status: "success",
            data: dataTransactions
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

// -------------------- UPDATE TRANSACTIONS --------------------

exports.updateTransaction = async ( req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const dataTransaction = { status }

        await Transaction.update(dataTransaction, {
            where: { id }
        })

        const updateTransaction = await Transaction.findAll({
            where: { id },
            attributes: { exclude: ["updateAt"]}
        })

        res.status(200).send({
            status: "Success",
            data : updateTransaction
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

// -------------------- DELETE TRANSACTION --------------------

exports.deleteTransaction = async ( req, res ) => {
    try {
        const { id } = req.params

        const findTransaction = await Transaction.findOne({
            where: { id }
        })

        if(!findTransaction){
            return res.status(404).send({
                status: "failed",
                message: "Transaction not found",
            }); 
        }

        await Transaction.destroy({
            where: { id }
        })

        res.status(200).send({
            status : "Success",
            data : { id }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}