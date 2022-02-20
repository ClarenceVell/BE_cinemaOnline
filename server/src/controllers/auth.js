const { Person } = require('../../models')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// -------------------- REGISTER --------------------

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body
        const data = req.body

        const schema = Joi.object({
            fullName: Joi.string().min(3).required(),
            email: Joi.string().email().min(6).required(),
            password: Joi.string()
              .pattern(/^[a-zA-Z0-9]{6,30}$/)
              .required(),
        });
      
        const { error } = schema.validate(data);
      
        if (error) {
        return res.send({
            status: "Validation Failed",
            message: error.details[0].message,
        });
        }

        const checkEmail = await Person.findOne({
            where : {
                email
            }
        })
        
        if (checkEmail) {
            return res.send({
                status : 'Failed',
                message : "Email already registered"
            })
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const dataPerson = await Person.create({
            ...data,
            password : hashedPassword
        })

        const updatePerson = await Person.findOne({
            where : {
                email
            }
        })

        const secretKey = process.env.SECRET_KEY
        const token = jwt.sign(
            {
                id : updatePerson.id,
                role: updatePerson.is_admin
            },
            secretKey
        )

        res.status(200).send({
            status: 'Success',
            data: {
                Person: {
                    email : dataPerson.email,
                    fullName: dataPerson.fullName,
                    token
                }
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
}

// -------------------- LOGIN --------------------

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });
      
        const { error } = schema.validate(req.body);
      
        if (error) {
            return res.send({
                status: "Validation failed",
                message: error.details[0].message,
            });
        }

        const emailExist = await Person.findOne({
            where : {
                email
            }
        })

        if (!emailExist){
            return res.send({
                status: 'failed',
                message: "Email and Password don't match"
            })
        }

        const isValidPassword = await bcrypt.compare(password, emailExist.password)

        if (!isValidPassword) {
            return res.send({
                status: 'failed',
                message: "Email and Password don't match"
            })
        }

        const secretKey = process.env.SECRET_KEY

        const token = jwt.sign(
            {
                id: emailExist.id,
                role: emailExist.is_admin
            },
            secretKey
        )

        res.send({
            status : 'success',
            data : {
                user: {
                    id: emailExist.id,
                    fullName: emailExist.fullName,
                    email: emailExist.email,
                    avatar: emailExist.avatar,
                    role: emailExist.is_admin,
                    token
                  },
            }
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
}

// -------------------- AUTH --------------------

exports.authUser = async (req, res) => {
    try {
        const id = req.userId

        const dataPerson = await Person.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["createdAt", "updateAt", "password"]
            }
        })

        if(!dataPerson){
            return res.status(404).send({
                status: 'Failed',
                message: 'user not found'
            })
        }

        res.status(200).send({
            status: 'Success',
            data : {
                user: {
                    id: dataPerson.id,
                    name: dataPerson.name,
                    email: dataPerson.email,
                    avatar: dataPerson.avatar,
                    phone: dataPerson.avatar,
                    role: dataPerson.is_admin
                }
            }
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'Failed',
            message: 'Server Error'
        })
    }
}
