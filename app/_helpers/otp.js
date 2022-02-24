const promisify = require("promisify-node");

const generatePassword = promisify('generate-password');

module.exports = async () => {
    let promise = new Promise(async (resolve, reject) => {
        let otp = await generatePassword.generate({
            length: 6,
            numbers: true,
            symbols: false,
            uppercase: false,
            exclude: 'abcdefghijklmnopqrstuvwxyz'
        })
        resolve(otp)
    })

    return promise;

}