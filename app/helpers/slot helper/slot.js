class Slots {

    // starttime;
    // endtime;
    // availableLimit
    // serviceCategory


    constructor(starttime, endtime, action, reason, availableLimit) {

        this.starttime = starttime
        this.endtime = endtime
        this.serviceCategory = {
            actionRequired: action,
            reasonForAppointment: reason
        }
        this.availableLimit = availableLimit
    }

}



module.exports = Slots