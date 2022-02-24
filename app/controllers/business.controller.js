const BusinessModal = require('../models/master/Business')

class Business {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createBusiness(req, res) {
        // throw new Error("could not create a user")


        let business = new BusinessModal({ ...req.body })

        await business.save()

        return res.status(200).send({
            message: "Business Created",
            result: business
        });
    }

    async getAllBusiness(req, res) {

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.createdAt ? (req.query.createdAt == 'desc' ? -1 : 1) : 1

        const business = await BusinessModal.find({}).limit(limit).skip((page - 1) * limit).populate('CountryId').sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            business: business,
        });
    }

    async getOneBusinessAndRemove(req, res) {
        let businessId = req.params.id;
        let business = await BusinessModal.findByIdAndRemove(businessId)
        let status = false
        if (business) {
            status = true
        }
        res.status(200).send({
            status: status,
            business: business,
        });

    }

    async getOneBusinessAndUpdate(req, res) {
        let businessId = req.params.id;
        let business = await BusinessModal.findById(businessId)
        if (!business) {
            return res.status(404).send({ message: "business doesnt exist" })
        }



        business.set(req.body)

        await business.save()

        res.status(200).send({
            status: true,
            business: business,
        });

    }
}

module.exports = Business;