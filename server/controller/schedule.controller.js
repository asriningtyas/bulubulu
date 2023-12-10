const moment = require('moment')
const cron = require('node-cron');
const response = require('../utils/response')
const { models: { Vet, User, Schedulled } } = require('../model/index')


const getTimeIntervals = async ({ vetId }) => {
    try {
        const dataVet = await Vet.findOne({
            where: {
                id: vetId
            }
        })

        if (!dataVet) {
            return []
        }
        const availableTime = dataVet.operationHours;
        const timeParts = availableTime.split(' - ');

        const startTime = moment(timeParts[0], 'HH:mm');
        const endTime = moment(timeParts[1], 'HH:mm');

        const timeIntervals = [];
        let currentTime = startTime.clone();

        while (currentTime.isBefore(endTime)) {
            timeIntervals.push(currentTime.format('HH:mm'));
            currentTime.add(1, 'hour');
        }

        return timeIntervals
    } catch (error) {
        return error
    }
}

const userSchedule = async ({ userId }) => {
    try {
        const scheduleUser = await Schedulled.findAll({
            where: {
                userId
            }
        })

        if (!scheduleUser.length) {
            return []
        }

        return scheduleUser;
    } catch (error) {
        return error
    }
}

const vetSchedule = async ({ vetId }) => {
    try {
        const scheduleUser = await Schedulled.findAll({
            where: {
                vetId
            }
        })

        if (!scheduleUser.length) {
            return []
        }

        return scheduleUser;
    } catch (error) {
        return error
    }
}

module.exports = {
    tes: (req, res) => {
        // Your date string
        const dateString = '11/09/2023 20:18';

        // Parse the date using Moment.js
        const scheduledDate = moment(dateString, 'L HH:mm');

        // Set up the cron expression
        const cronExpression = `${scheduledDate.minutes()} ${scheduledDate.hours()} ${scheduledDate.date()} ${scheduledDate.month() + 1} *`;

        // Schedule the job
        cron.schedule(cronExpression, () => {
            console.log('Job is running at the scheduled date and time!', dateString);
        });
        return res.send(dateString)
    },

    create: async (req, res) => {
        try {
            const { date, time, userId, vetId, symptom } = req.body;

            const dataUser = await User.findOne({ where: { id: userId, role: 'user' } });
            if (!dataUser) {
                return response({
                    res, statusCode: 404, message: 'User tidak ditemukan!', data: req.body, type: 'ERROR', name: 'create schedule'
                });
            }
            const dataVet = await Vet.findOne({ where: { id: vetId } });
            if (!dataVet) {
                return response({
                    res, statusCode: 404, message: 'Dokter Hewan tidak ditemukan!', data: req.body, type: 'ERROR', name: 'create schedule'
                });
            }

            const nowDate = moment().format('YYYY-MM-DD')
            if (moment(date).isBefore(nowDate)) {
                return response({
                    res, statusCode: 422, message: 'pilih tanggal sesuai ketentuan!', data: req.body, type: 'ERROR', name: 'create schedule'
                });
            }

            const timeIntervals = await getTimeIntervals({ vetId })

            if (!timeIntervals.includes(time)) {
                return response({
                    res, statusCode: 422, message: 'pilih waktu sesuai ketentuan!', data: req.body, type: 'ERROR', name: 'create schedule'
                });
            }

            let scheduleUser = await userSchedule({ userId })
            scheduleUser = scheduleUser.find((el) => el.date === date && el.time === time)

            if (scheduleUser) {
                return response({
                    res, statusCode: 400, message: 'User ini telah memiliki jadwal di waktu yang sama!', data: req.body, type: 'ERROR', name: 'create schedule'
                });
            }

            let scheduleVet = await vetSchedule({ vetId })
            scheduleVet = scheduleVet.find((el) => el.date === date && el.time === time)

            if (scheduleVet) {
                return response({
                    res, statusCode: 400, message: 'Dokter ini telah memiliki jadwal di waktu yang sama!', data: req.body, type: 'ERROR', name: 'create schedule'
                });
            }

            const data = await Schedulled.create({ date, time, userId, vetId, symptom, status: 'draft' });

            const dateString = `${date} ${time}`;
            const scheduledDate = moment(dateString, 'L HH:mm');

            const cronExpression = `${scheduledDate.minutes()} ${scheduledDate.hours()} ${scheduledDate.date()} ${scheduledDate.month() + 1} *`;

            cron.schedule(cronExpression, async () => {
                const update = await Schedulled.update({ status: 'Finished' }, { where: { id: data.id } })
                console.log('Job is running at the scheduled date and time!', update);
            });

            return response({
                res, statusCode: 200, message: 'Berhasil menambahkan jadwal temu', data, type: 'SUCCESS', name: 'create schedule'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Gagal menambahkan jadwal temu', data: error.stack.split('\n'), type: 'ERROR', name: 'create schedule'
            });
        }
    },

    getData: async (req, res) => {
        try {
            const data = await Schedulled.findAll({
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: Vet,
                        as: 'vet',
                    }
                ]
            });

            if (!data.length) {
                return response({
                    res, statusCode: 404, message: 'Data jadwal temu tidak ditemukan!', data: req.body, type: 'ERROR', name: 'get data schedule'
                });
            }

            return response({
                res, statusCode: 200, message: 'Berhasil mengambil data jadwal temu', data, type: 'SUCCESS', name: 'get data schedule'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Gagal mengambil data jadwal temu', data: error.stack.split('\n'), type: 'ERROR', name: 'get data schedule'
            });
        }
    },

    getByIds: async (req, res) => {
        try {
            const { status, by, id } = req.params

            let condition = {};
            switch (by) {
                case 'id':
                    condition = { id };
                    break;
                case 'user':
                    condition = { userId: id };
                    break;
                case 'vet':
                    condition = { vetId: id };
                    break;

                default:
                    break;
            }

            const isFinish = status === 'active' ? false : true
            const data = await Schedulled.findAll({
                where: { isFinish, ...condition },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: Vet,
                        as: 'vet',
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: { exclude: ['password'] }
                            },
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            })

            if (!data.length) {
                return response({
                    res, statusCode: 404, message: 'Data jadwal temu tidak ditemukan!', data: req.body, type: 'ERROR', name: 'get data schedule'
                });
            }

            return response({
                res, statusCode: 200, message: 'Berhasil mengambil data jadwal temu', data, type: 'SUCCESS', name: 'get data schedule'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Gagal mengambil data jadwal temu', data: error.stack.split('\n'), type: 'ERROR', name: 'get data schedule'
            });
        }
    },

    changeStatus: async (req, res) => {
        try {
            const { status, id, message } = req.body

            const dataSchedule = await Schedulled.findOne({
                where: {
                    id
                }
            })

            if (!dataSchedule) {
                return response({
                    res, statusCode: 404, message: 'data jadwal temu tidak ditemukan!', data: req.body, type: 'ERROR', name: 'changeStatus schedule'
                });
            }

            await Schedulled.update({ status, message }, {
                where: {
                    id
                }
            })

            const data = await Schedulled.findOne({
                where: {
                    id
                }
            })

            return response({
                res, statusCode: 200, message: 'Berhasil mengganti status jadwal temu', data, type: 'SUCCESS', name: 'changeStatus schedule'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Gagal mengganti status jadwal temu', data: error.stack.split('\n'), type: 'ERROR', name: 'changeStatus schedule'
            });
        }
    },

    cancel: async (req, res) => {
        try {
            const { message, id } = req.body

            const dataSchedule = await Schedulled.findOne({
                where: {
                    id
                }
            })

            if (!dataSchedule) {
                return response({
                    res, statusCode: 404, message: 'data jadwal temu tidak ditemukan!', data: req.body, type: 'ERROR', name: 'changcanceleStatus schedule'
                });
            }

            await Schedulled.update({ message, isCanceled: true }, {
                where: {
                    id
                }
            })

            const data = await Schedulled.findOne({
                where: {
                    id
                }
            })

            return response({
                res, statusCode: 200, message: 'Gagal membatalkan jadwal temu', data, type: 'SUCCESS', name: 'cancel schedule'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Gagal membatalkan jadwal temu', data: error.stack.split('\n'), type: 'ERROR', name: 'cancel schedule'
            });
        }
    },

    finish: async (req, res) => {
        try {
            const { message, id } = req.body

            const dataSchedule = await Schedulled.findOne({
                where: {
                    id
                }
            })

            if (!dataSchedule) {
                return response({
                    res, statusCode: 404, message: 'data jadwal temu tidak ditemukan!', data: req.body, type: 'ERROR', name: 'changcanceleStatus schedule'
                });
            }

            await Schedulled.update({ message, isFinish: true }, {
                where: {
                    id
                }
            })

            const data = await Schedulled.findOne({
                where: {
                    id
                }
            })

            return response({
                res, statusCode: 200, message: 'Gagal mengakhiri jadwal temu', data, type: 'SUCCESS', name: 'cancel schedule'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Gagal mengakhiri jadwal temu', data: error.stack.split('\n'), type: 'ERROR', name: 'cancel schedule'
            });
        }
    },

}