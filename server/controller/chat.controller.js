const response = require('../utils/response');
const { models: { Chat, User, Vet } } = require('../model/index');

module.exports = {

    generateRoomId: (req, res) => {
        try {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomID = '';

            for (let i = 0; i < 7; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomID += characters.charAt(randomIndex);
            }

            return response({
                res, statusCode: 200, message: 'generateRoomId Berhasil', data: randomID, type: 'SUCCESS', name: 'generateRoomId'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error generateRoomId', data: error.stack.split('\n'), type: 'ERROR', name: 'generateRoomId'
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { userId, vetId } = req.params

            const dataChat = await Chat.findOne({
                where: { userId, vetId }
            });

            if (!dataChat) {
                return response({
                    res, statusCode: 404, message: 'dataChat Tidak Ditemukan!', data: dataChat, type: 'NOTFOUND', name: 'getById'
                });
            }

            return response({
                res, statusCode: 200, message: 'getById Berhasil', data: dataChat, type: 'SUCCESS', name: 'getById'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error getById', data: error.stack.split('\n'), type: 'ERROR', name: 'getById'
            });
        }
    },

    getByVetId: async (req, res) => {
        try {
            const { vetId } = req.params

            const dataChat = await Chat.findAll({
                where: { vetId },
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

            if (!dataChat.length) {
                return response({
                    res, statusCode: 404, message: 'dataChat Tidak Ditemukan!', data: dataChat, type: 'NOTFOUND', name: 'getByVetId'
                });
            }

            const uniqueData = [];
            const seen = new Set();

            for (const item of dataChat.reverse()) {
                // Create a string representation of the item using both userId and vetId
                const key = `${item.userId}_${item.vetId}`;

                // Check if the key is not in the "seen" set
                if (!seen.has(key)) {
                    // Add the key to the set to mark it as "seen"
                    seen.add(key);
                    // Push the unique item to the new array
                    uniqueData.push(item);
                }
            }

            return response({
                res, statusCode: 200, message: 'getByVetId Berhasil', data: uniqueData, type: 'SUCCESS', name: 'getByVetId'
            });
        } catch (error) {
            return response({
                res, statusCode: 500, message: 'Error getByVetId', data: error.stack.split('\n'), type: 'ERROR', name: 'getByVetId'
            });
        }
    }

}