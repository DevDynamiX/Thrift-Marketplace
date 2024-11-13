import { AppDataSource } from "../data-source";
import {NextFunction, Request, response, Response} from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    // Get all users
    async all(request: Request, response: Response, next: NextFunction) {
        const users = await this.userRepository.find();
        return response.json(users);
    }

    // Get a user by ID
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        return response.json(user);
    }

    // Save a new user
    async save(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body;
        const username = email;

        const user = Object.assign(new User(), {
            email,
            username,
            password
        })

        const savedUser = await this.userRepository.save(user);
        return response.status(201).json(savedUser);
    }

    // Remove a user
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return response.status(404).json({ message: "User does not exist" });
        }

        await this.userRepository.remove(userToRemove)

        return response.status(200).json({ message: "User has been removed" });
    }

    // Register a new user
    async register(req: Request, res: Response) {
        const { email, password, firstName, lastName, gender } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            // Create a new user instance
            const newUser = new User();
            newUser.email = email;
            newUser.username = email;
            newUser.password = await bcrypt.hash(password, 10);
            newUser.firstName = firstName || '';
            newUser.lastName = lastName || '';
            newUser.gender = gender || '';
            newUser.UserRole = { id: 2, name: 'User' };

            await this.userRepository.save(newUser);

            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
        } catch (error) {
            console.error('Registration Error:', error); // Log the actual error

            res.status(500).json({ message: "An internal server error occurred while registering the user." });
        }
    }

    // Login a user
    async login(req: Request, res: Response) {
        const JWT_SECRET = process.env.JWT_SECRET as string;
        const { username, password } = req.body;

        try {
            const user = await this.userRepository.findOne({
                where : { username },
                relations: ['UserRole']
            })

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Generate a unique token
            const uniqueTokenPayload = {
                id: user.id,
                email: user.email,
                username: user.username,
                uuid: uuidv4(), // Unique identifier
            };

            const token = jwt.sign(uniqueTokenPayload, JWT_SECRET, { expiresIn: '1h' });

            const { password: _, UserRole, ...userWithoutPassword } = user;
            const responseData = {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                user_role: UserRole.name,
                gender: user.gender,
                token: token
            };

            return res.json(responseData);
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}