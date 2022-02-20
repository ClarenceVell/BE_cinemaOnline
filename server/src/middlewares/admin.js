const jwt = require("jsonwebtoken");

exports.admin = (req, res, next) => {
  try {
    let header = req.header("Authorization");

    let token = header.replace("Bearer ", "");

    if (!header || !token) {
      return res.status(403).send({
        status: "Failed",
        message: "Access Denied",
      });
    }
    const secretKey = process.env.SECRET_KEY;

    const verified = jwt.verify(token, secretKey);

    if (verified.role === 1) {
      return (req.userId = verified.id), (req.role = verified.role), next();
    } else {
      return res.status(403).send({
        status: "Failed",
        message: "You don't have authorization",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
