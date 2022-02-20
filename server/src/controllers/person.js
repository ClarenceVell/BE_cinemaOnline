const { Person, Transaction, Film, Category } = require('../../models')

// -------------------- GET ALL USER --------------------

exports.getPersons = async (req, res) => {
    try {
        const dataPerson = await Person.findAll({
            attributes : {
                exclude: ["createdAt", "updatedAt", "password", "is_admin"],
            }
        })

        res.status(200).send({
            status : 'Success',
            data : { Persons : dataPerson}
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error",
        });
    }
}

// -------------------- GET USER --------------------

exports.getPerson = async (req, res) => {
    const { id } = req.params;
  
    try {
      const dataPerson= await Person.findOne({
          where: {
              id,
          },
          attributes: ["id", "fullName", "email","phone", "avatar"],
          include : [
              {
                  model: Transaction,
                  as: "transaction",
                  attributes: {
                      exclude: ["updatedAt", "personId"]
                  },
                  include: [
                      {
                        model: Film,
                        as: "film",
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "categoryId", "filmUrl"],
                        },
                        include:[
                            {
                                model: Category,
                                as: "category",
                                attributes: {
                                    exclude: ["createdAt", "updateAt"]
                                }
                            }
                        ]
                      }
                  ]
              }
          ]
      })
  
      if (!dataPerson) {
        return res.status(404).send({
          status: "failed",
          message: "profile not found",
        });
      }
  
      res.status(200).send({
        status: "success",
        data: {
          person: dataPerson,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "server error",
      });
    }
  };

// -------------------- UPDATE PROFILE --------------------

exports.updatePerson = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;

        const findPerson = await Person.findOne({ where: { id } });

        if (!findPerson) {
            return res.status(404).send({
                status: "Error",
                message: "Person doesn't exist",
            });
        }
    
        const dataUpdated = {
        ...body,
        avatar : req.file.filename
        };

        const data = await Person.update(dataUpdated, {
            where : { id }
        })

        const updatePerson = await Person.findOne({
        where: {
            id,
        },
        attributes: {
            exclude: ["updatedAt", "createdAt", "password", "is_admin"],
        },
        });

        console.log(updatePerson)
        
        res.status(200).send({
            status: "success",
            data: { person: updatePerson },
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message:"server error"
        })
    }
}

// -------------------- DELETE PROFILE --------------------

exports.deletePerson = async (req, res) => {
    try {
        const { id } = req.params

        const findPerson = await Person.findOne({
            where: { id }
        })

        if(!findPerson){
            return res.status(404).send({
                status: "failed",
                message: "profile not found"
            })
        }

        res.status(200).send({
            status: "Success",
            data : id
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message:"server error"
        })
    }
}
