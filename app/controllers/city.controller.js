const CityModal = require('../models/master/City')

class City {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createCity(req, res) {
        // throw new Error("could not create a user")

        let city = new CityModal({ ...req.body })

        await city.save()

        return res.status(200).send({
            message: "City Created",
            result: city
        });
    }

    async getAllCities(req, res) {

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.createdAt ? (req.query.createdAt == 'desc' ? -1 : 1) : 1

        const cities = await CityModal.find({}).limit(limit).populate('city_headId').populate('languages').skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            cities: cities,
        });
    }

    async getOneCity(req, res) {
        let cityId = req.params.id;
        let city = await CityModal.findById(cityId).populate('city_headId').populate('languages').lean()
        if (!city) {
            return res.status(404).send({ message: "city  doesnt exist" })
        }

        res.status(200).send({
            status: true,
            city: city,
        });

    }

    async getOneCityAndRemove(req, res) {
        let cityId = req.params.id;
        let city = await CityModal.findByIdAndRemove(cityId)
        let status = false
        if (city) {
            status = true
        }
        res.status(200).send({
            status: status,
            city: city,
        });

    }

    async getOneCityAndUpdate(req, res) {
        let cityId = req.params.id;
        let city = await CityModal.findById(cityId)
        if (!city) {
            return res.status(404).send({ message: "city doesnt exist" })
        }


        city.set(req.body)

        await city.save()

        res.status(200).send({
            status: true,
            city: city,
        });

    }
}

module.exports = City;