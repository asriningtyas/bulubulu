const path = require("path");
const fs = require('fs');
const cron = require('node-cron');
const response = require('../utils/response');
const { models: { User, Vet } } = require('../model/index');
const { Op } = require("sequelize");

module.exports = {

    register: async (req, res) => {
        try {
            // difine the request
            const { username, password, fullName, email, role } = req.body;

            // get user by username
            const dataUser = await User.findOne({
                where: {
                    username
                }
            });

            // validate is user with the username already registered
            if (dataUser) {
                return response({
                    res, statusCode: 409, message: 'Username ini sudah terdaftar', data: req.body, type: 'ERROR', name: 'register user'
                });
            }

            // create new user
            const image = `uploads/${username[0]}.jpg`
            const createData = await User.create({
                username, password, fullName, email, role, image
            });
            const data = await User.findOne({
                attributes: { exclude: ['password'] },
                where: {
                    id: createData.id
                }
            });
            return response({
                res, statusCode: 200, message: 'Daftar Berhasil', data, type: 'SUCCESS', name: 'register user'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error Register', data: error.stack.split('\n'), type: 'ERROR', name: 'register user'
            });
        }
    },

    login: async (req, res) => {
        try {
            // difine the request
            const { username, password } = req.body;

            // get user by username & password
            const data = await User.findOne({
                attributes: { exclude: ['password'] },
                where: { username, password },
            });

            // validate is user doesnt exists
            if (!data) {
                return response({
                    res, statusCode: 401, message: 'Username atau Password salah!', data: req.body, type: 'ERROR', name: 'login user'
                });
            }

            if (data.isLogin) {
                return response({
                    res, statusCode: 401, message: 'User Sedang Digunakan!', data: req.body, type: 'ERROR', name: 'login user'
                });
            }

            let dataVet = null;
            if (data.role === 'vet') {
                dataVet = await Vet.findOne({
                    where: { userId: data.id },
                })
            }

            const returnedData = {
                ...data.dataValues,
                idVet: dataVet?.dataValues?.id,
            }

            await User.update({ isLogin: true }, { where: { id: data.id } })

            const job = cron.schedule(`*/30 * * * *`, async () => {
                // Call the logout endpoint after 30 minutes
                const update = await User.update({ isLogin: false }, { where: { id: data.id } })
                console.log(update)
                job.destroy(); // Remove the cron job after it runs once
            }, {
                scheduled: false, // Do not start the job immediately
            });

            job.start(); // Start the job after setting up the schedule

            return response({
                res, statusCode: 200, message: 'Login Berhasil', data: returnedData, type: 'SUCCESS', name: 'login user'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error Login', data: error.stack.split('\n'), type: 'ERROR', name: 'login user'
            });
        }
    },

    logout: async (req, res) => {
        try {
            const { username } = req.body;

            const dataUser = await User.findOne({
                where: { username }
            })

            if (!dataUser) {
                return response({
                    res, statusCode: 404, message: 'User ini tidak ditemukan!', data: req.body, type: 'ERROR', name: 'logout user'
                });
            }
            await User.update({ isLogin: false }, { where: { id: dataUser.id } })

            return response({
                res, statusCode: 200, message: 'Logout Berhasil', data: dataUser, type: 'SUCCESS', name: 'logout user'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error Login', data: error.stack.split('\n'), type: 'ERROR', name: 'logout user'
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params
            const dataUser = await User.findOne({
                where: { id }
            })

            if (!dataUser) {
                return response({
                    res, statusCode: 404, message: 'User ini tidak ditemukan!', data: req.body, type: 'ERROR', name: 'get user'
                });
            }

            let data = dataUser;
            if (dataUser.role === 'vet') {
                const dataVet = await Vet.findOne({
                    where: { userId: dataUser.id },
                    attributes: { exclude: ['updatedAt', 'createdAt', 'id'] },
                })

                data = {
                    ...data.dataValues,
                    ...dataVet.dataValues
                }
            }

            return response({
                res, statusCode: 200, message: 'Berhasil', data, type: 'SUCCESS', name: 'get user'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error get User', data: error.stack.split('\n'), type: 'ERROR', name: 'get User'
            });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params
            const { experience, operationHours, operationDays, fullName, email, username } = req.body
            const dataUser = await User.findOne({
                where: { id }
            })

            if (!dataUser) {
                return response({
                    res, statusCode: 404, message: 'User ini tidak ditemukan!', data: req.body, type: 'ERROR', name: 'update user'
                });
            }

            await User.update({ fullName, email, username }, {
                where: { id }
            })

            await Vet.update({
                experience, operationHours, operationDays: JSON.stringify(operationDays)
            }, { where: { userId: id } });

            const data = await User.findOne({
                attributes: { exclude: ['password'] },
                where: { id }
            })

            return response({
                res, statusCode: 200, message: 'Update Berhasil', data, type: 'SUCCESS', name: 'update user'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error update User', data: error.stack.split('\n'), type: 'ERROR', name: 'update User'
            });
        }
    },

    updatePicture: async (req, res) => {
        try {
            const image = req.file.path; // Get the uploaded file path
            const { id } = req.params;

            if (image) {
                const dataUser = await User.findOne({ where: { id } })
                if (!dataUser) {
                    return response({
                        res, statusCode: 404, message: 'User ini tidak ditemukan!', data: req.body, type: 'ERROR', name: 'updatePicture'
                    });
                }
                // Save the user and file path to the database
                await User.update({ image }, { where: { id } }).catch(err => res.send(err));

                const data = await User.findOne({ where: { id } })
                return response({
                    res, statusCode: 200, message: 'Berhasil', data, type: 'SUCCESS', name: 'updatePicture'
                });
            }
            return res.send('gagal')

        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error updatePicture', data: error.stack.split('\n'), type: 'ERROR', name: 'updatePicture'
            });
        }
    },

    getPicture: async (req, res) => {
        try {
            const dataUser = await User.findOne({ where: { id: req.params.id } })
            if (!dataUser || !dataUser.image) {
                return response({
                    res, statusCode: 404, message: 'User ini tidak ditemukan!', data: req.body, type: 'ERROR', name: 'updatePicture'
                });
            }

            const filePath = path.join(__dirname, '..', dataUser.image);

            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath)
            }
            res.status(404).json({ message: 'File not found', dataUser });

        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error getPicture', data: error.stack.split('\n'), type: 'ERROR', name: 'getPicture'
            });
        }
    },

}