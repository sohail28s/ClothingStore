

const sendSuccess = ({res, data={}, message = "Success"} ) => {
    res.status(201).json({status: "Success", data: data,  message: message})
}

module.exports = sendSuccess;

