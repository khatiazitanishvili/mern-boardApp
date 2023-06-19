import express from "express";
import { User } from "../model/UserModel"
import { getUsers, createUser, updateUser, deleteUser } from '../services/AdministerUsersService'
import { optionalAuthentication } from "./authentication";

const usersRouter = express.Router();


// router.get('/users', getUsers);

// Get all Users
usersRouter.get('/', optionalAuthentication,
    async (req, res, next) => {
        try {
            const users = await getUsers();
            // res.send({ users: users });
            res.send(users)
        } catch (err) {
            res.status(404);
            next(err)
        }
    });


export default usersRouter;