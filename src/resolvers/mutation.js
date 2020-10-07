const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {AuthenticationError,ForbiddenError} = require('apollo-server-express');
require('dotenv').config();
const gravatar = require('../util/gravatar');
const mongoose = require('mongoose');




module.exports = {
    newNote: async (parent, args,{Models,user}) => {

        if(!user) {
            throw AuthenticationError(" Вы должны войти в систему, чтоб создать запись!");
        }
        return await Models.Note.create({
            content: args.content,
            author: mongoose.Types.ObjectId(user.id)
        });
    },
    updateNote: async (parent, {content,id}, {Models, user}) => {

        if(!user) {
            throw AuthenticationError(" Вы должны войти в систему, чтоб обновить запись!");
        }
        // find a note
        const note = await Models.Note.FindById(id);
        // если владелец заметки и текущий пользователь не совпадают, выдать запрещенную ошибку
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("У вас нет прав на изменение этой записи");
        }

        
        return await Models.Note.findOneAndUpdate({
            _id: id,
        }, {
            $set: {
                content
            }
        }, {
            new: true
        });
    },
    deleteNote: async (parent, {id}, {Models,user}) => {

        if(!user) {
            throw AuthenticationError(" Вы должны войти в систему, чтоб удалить запись!");
        }

        // find a note
        const note = await Models.Note.FindById(id);
        // если владелец заметки и текущий пользователь не совпадают, выдать запрещенную ошибку
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("У вас нет прав на удаление этой записи");
        }
        try {
            // если пользователь владелец, то можем удалить

            await note.remove();
            /* await Models.Note.findOneAndRemove({
                _id: id
            }); */
            return true;
        } catch (err) {
            return false;
        }
    },

    signUp: async (parent, { username, email, password }, { Models }) => {
        // normalize email address
        email = email.trim().toLowerCase();
        // hash the password
        const hashed = await bcrypt.hash(password, 10);
        // create the gravatar url
        const avatar = gravatar(email);
        try {
            const user = await Models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });
            // create and return the json web token
            return jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            // if there's a problem creating the account, throw an error
            throw new Error('Error creating account');
            }
        },
    signIn: async (parent, { username, email, password }, { Models }) => {
            if (email) {
                // normalize email address
                email = email.trim().toLowerCase();
            }
            const user = await Models.User.findOne({
                $or: [{email}, {username}]
            });
            // if no user is found, throw an authentication error
            if (!user) {
                throw new AuthenticationError('Error signing in');
            }
            // if the passwords don't match, throw an authentication error
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new AuthenticationError('Error signing in');
            }
            // create and return the json web token
            return jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET);
        }
};