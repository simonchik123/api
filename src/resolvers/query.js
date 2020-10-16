const Models = require("../models");

module.exports = {
    notes: async (parent, args,{Models}) => {
        return await Models.Note.find().limit(100);
    },
    note: async (parent, args,{Models}) => {
        return await Models.Note.findById(args.id);            
    },

    user: async (parent,{username},{Models}) =>{
        return await Models.User.findOne({username});
    },

    users: async (parent,args,{Models}) =>{
        return await Models.User.find();
    },

    me: async(parent,args,{Models,user}) =>{
        return await Models.User.findById(user.id);
    },
    noteFeed: async (parent, { cursor }, { Models }) => {
        // Ограничим кол-во запрашиваемых элементов
        const limit = 10;
        // знчение по дефолту для след страницы
        let hasNextPage = false;
        // если курсор не передан, запрос по умолчанию будет пуст,
        // это приведет к извлечению всех заметок из базы данных
        let cursorQuery = {};
        // если есть курсор
        // наш запрос ищет статьи с ObjectId меньше чем курсор (ID статьи)
        if (cursor) {
        cursorQuery = { _id: { $lt: cursor } };
        }
        // найдем limit + 1 сатей в БД, отсортируем от новых к старым
        let notes = await Models.Note.find(cursorQuery).sort({ _id: -1 }).limit(limit + 1);

        // если колво статей превышает лимит
        // установим hasNextPage to true и откинем статьи согласно limit
        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }
        // новый курсор стал ID одной из старых сатей вконце массива
        const newCursor = notes[notes.length - 1]._id;
        return {
                notes,
                cursor: newCursor,
                hasNextPage
            };
        }
};