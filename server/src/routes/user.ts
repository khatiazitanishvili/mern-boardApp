import { body, param, validationResult, matchedData } from 'express-validator';
import express from "express";
import { IUser, User } from "../model/UserModel"
import { getUsers, createUser, updateUser, deleteUser, UserResource } from '../services/AdministerUsersService'
import { optionalAuthentication, requiresAuthentication } from './authentication';

const userRouter = express.Router();

let MAX_LENGTH_LINE_STRING = 1000;
let MAX_LENGTH_NAME_STRING = 100;



// Get User by ID
userRouter.get('/:userId', optionalAuthentication,
    param("userId").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json({ errors: errors.array() });
        }
        const userId = req.params?.userId

        try {
            const user = await User.findById(userId)
            res.send(user);
        } catch (err) {
            res.status(404)
            next(err);
        }
    });


// Create User
userRouter.post('/', requiresAuthentication,
    param('id').optional().isMongoId(),
    body('name').isString().isLength({ max: MAX_LENGTH_NAME_STRING }),
    body('email').isEmail().normalizeEmail(),
    body('admin').isBoolean().optional(),
    body('password').isLength({ max: MAX_LENGTH_NAME_STRING }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(400)
                .json({ errors: errors.array() });
        }

        const userId = req.params?.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        // Autorisierung
        if (user.toString() !== req.userId && !user.admin) {
            res.status(401).send("Only Admin can post");
            return;
        }

        try {
            const userData = matchedData(req) as UserResource;
            const createdUser = await createUser(userData)
            res.send(createdUser);
        } catch (err) {
            res.status(404)
            next(err);
        }
    })


// Update a User
userRouter.put('/:userId', requiresAuthentication,
    param("userId").isMongoId(),
    body('email').isEmail().normalizeEmail(),
    body('admin').isBoolean().optional(),
    body('name').isString().isLength({ max: MAX_LENGTH_NAME_STRING }),
    body('password').optional().isLength({ min: 2 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(400)
                .json({ errors: errors.array() });
        }
        const userId = req.params?.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        // Autorisierung
        if (user.toString() !== req.userId && !user.admin) {
            res.status(401).send("Only Admin can put");
            return;
        }

        try {
            // const userData = matchedData(req) as UserResource;
            //   const updatedUser = await updateUser(userData);

            const updatedUser = await updateUser(req.body);
            res.send(updatedUser);
        } catch (err) {
            res.sendStatus(400)
        }
    }
);


// Delete User
userRouter.delete('/:userId', requiresAuthentication,
    param("userId").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json({ errors: errors.array() });
        }
        const userId = req.params?.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        // Autorisierung
        if (user.toString() !== req.userId && !user.admin) {
            res.status(401).send("Only Admin can delete");
            return;
        }
        try {
            const deletedUser = await deleteUser(userId);
            res.send(deletedUser);
        } catch (err) {
            res.status(404)
            next(err);
        }
    })

export default userRouter;