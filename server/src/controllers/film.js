const { Film, Category } = require("../../models")

// -------------------- GET ALL FILM --------------------

exports.getFilms = async () => {
    let dataFilms = await Film.findAll({
        include: [
          {
            model: Category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt", "categoryId"],
        },
      });
      dataFilms = JSON.parse(JSON.stringify(dataFilms));
    
      return dataFilms.map((films) => {
        return {
          ...films,
        };
      });
}

// -------------------- GET FILM BY ID --------------------

exports.getFilm = async (req, res) => {
    const { id } = req.params;
  
    try {
      const dataFilm = await Film.findOne({
        where: {
          id,
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "categoryId"],
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });
  
      if (!dataFilm) {
        return res.send({
          status: "failed",
          message: "data not found",
        });
      }
  
      res.status(200).send({
        status: "success",
        data: { film: dataFilm },
      });

    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "server error",
      });
    }
  };

// -------------------- CREATE FILM --------------------

exports.createFilm = async (req, res) => {
    try {
        const { body } = req

        const dataFilm = await Film.create({
          ...body,
          thumbnail : req.file.filename,
        })

        const { id } = dataFilm

        const findFilm = await Film.findOne({
          where: {
            id
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "categoryId"],
          },
          include: [
            {
              model: Category,
              as: "category",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            }
          ]
        })

        res.status(200).send({
          status: "success",
          data: findFilm
        })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "server error",
      });
    }
}

// -------------------- UPDATE FILM --------------------

exports.updateFilm = async ( req, res ) => {
  try {
    const { id } = req.params
    const { body } = req

    const findFilm = await Film.findOne({
      where: { id }
    })
    
    if(!findFilm){
      return res.status(404).send({
        status: "failed",
        message: "Film not found"
      })
    }

    const dataFilm = {
      ...body,
      thumbnail: req.file.filename
    }

    await Film.update(dataFilm,{
      where: { id }
    })

    const updateFilm = await Film.findOne({
      where: { id },
      attributes: { exclude: ["updatedAt", "createdAt", "categoryId"] },
      include: [
        {
          model: Category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          }
        }
      ]
    })

    res.status(200).send({
      status: "Success",
      data: {
        film: updateFilm
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

// -------------------- DELETE FILM --------------------

exports.deleteFilm = async (req, res) => {
  try {
    const { id } = req.params

    const findFilm = await Film.findOne({ where: { id }})

    if(!findFilm) {
      return res.atatus(404).send({
        status: "failed",
        message: "Film not found",
      });
    }

    await Film.destroy({
      where: { id }
    })

    res.status(200).send({
      status: "success",
      data: {
        id: findFilm.id
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
