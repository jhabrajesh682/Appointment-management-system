const axios = require('axios')
const key = process.env.SMSKEY

module.exports = async (x) => {
    console.log("sms called");
    console.log("xxxx❌ ",x)

    try {

        let api = `http://msg.mtalkz.com/V2/http-api.php?apikey=${key}&senderid=STEMZG&number=${x.number}&message=${x.body}&format=json`
        console.log(api);

        let a = await axios.get(`${api}`)
        let { data, status } = a
        console.log("smssend======>🔥🔥🔥" );

        console.log(data);



    } catch (error) {
        throw new Error("Sms failed")
    }
}