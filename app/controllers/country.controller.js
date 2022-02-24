const CountryModal = require('../models/master/Country')

class Country {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createCountry(req, res) {
        // throw new Error("could not create a user")


        let country = new CountryModal({ ...req.body })

        await country.save()

        return res.status(200).send({
            message: "Country Created",
            result: country
        });
    }

    async getAllCountries(req, res) {

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.createdAt ? (req.query.createdAt == 'desc' ? -1 : 1) : 1

        const countries = await CountryModal.find({}).limit(limit).populate('country_headId').populate('Cities').populate('languages').skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            countries: countries,
        });
    }


    async getOneCountryAndRemove(req, res) {
        let countryId = req.params.id;
        let country = await CountryModal.findByIdAndRemove(countryId)
        let status = false
        if (country) {
            status = true
        }
        res.status(200).send({
            status: status,
            country: country,
        });

    }

    async getOneCountryAndUpdate(req, res) {
        let countryId = req.params.id;
        let country = await CountryModal.findById(countryId)
        if (!country) {
            return res.status(404).send({ message: "country doesnt exist" })
        }

        country.set(req.body)

        await country.save()

        res.status(200).send({
            status: true,
            country: country,
        });

    }
}

module.exports = Country;