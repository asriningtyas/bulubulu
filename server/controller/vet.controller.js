const response = require('../utils/response')
const { models: { Vet, User, DataUser } } = require('../model/index');

module.exports = {
    get: async (req, res) => {
        try {
            const data = await Vet.findAll({
                attributes: { exclude: ['updatedAt', 'createdAt'] },
                include: {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password', 'updatedAt', 'createdAt', 'id'] },
                }
            });

            const flattenedData = data.flatMap(item => {
                const { user, ...rest } = item;
                delete rest.dataValues.user;
                return {
                    ...rest.dataValues,
                    ...user.dataValues,
                    operationDays: JSON.parse(rest.dataValues.operationDays)
                };
            });

            return response({
                res, statusCode: 200, message: 'Daftar dokter hewan', data: flattenedData, type: 'SUCCESS', name: 'get vet'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error get vet', data: error.stack.split('\n'), type: 'ERROR', name: 'get vet'
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Vet.findOne({
                where: { id },
                attributes: { exclude: ['updatedAt', 'createdAt'] },
                include: {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password', 'updatedAt', 'createdAt', 'id'] },
                }
            });

            if (!data) {
                return response({
                    res, statusCode: 404, message: 'Dokter hewan tidak ditemukan!', data: req.body, type: 'ERROR', name: 'get vet'
                });
            }

            const { user, ...rest } = data;
            delete rest.dataValues.user;
            const flattenedData = {
                ...rest.dataValues,
                ...user.dataValues,
                operationDays: JSON.parse(rest.dataValues.operationDays)
            };

            return response({
                res, statusCode: 200, message: 'Dokter hewan ditemukan', data: flattenedData, type: 'SUCCESS', name: 'get vet'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error get vet', data: error.stack.split('\n'), type: 'ERROR', name: 'get vet'
            });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params
            const { experience, operationHours, operationDays, fullName, email, username } = req.body
            const vetData = await Vet.findOne({
                where: { id }
            })

            if (!vetData) {
                return response({
                    res, statusCode: 404, message: 'Data tidak ditemukan!', data: req.body, type: 'ERROR', name: 'update vet'
                });
            }

            await Vet.update({
                experience, operationHours, operationDays: JSON.stringify(operationDays)
            }, { where: { id } });

            await User.update({ fullName, email, username }, {
                where: { id: vetData.userId }
            });

            const data = await Vet.findOne({
                where: { id },
                include: {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password', 'updatedAt', 'createdAt', 'id'] },
                }
            })

            return response({
                res, statusCode: 200, message: 'Berhasil memperbaharui data!', data, type: 'SUCCESS', name: 'update vet'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error update vet', data: error.stack.split('\n'), type: 'ERROR', name: 'update vet'
            });
        }
    }
}