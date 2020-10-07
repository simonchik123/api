const Models = require("../models");

module.exports = {
    notes: async (parent, args,{Models}) => {
        return await Models.Note.find();
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
    }
};