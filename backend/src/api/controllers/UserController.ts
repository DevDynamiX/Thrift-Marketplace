import { AppDataSource } from "../../config/data-source";
import { Request, Response } from "express";
import { BaseUserController } from '../../core/base/controllers/BaseUserController';
import { User } from "../../core/entity/User";
import * as bcrypt from "bcrypt";

export class UserController implements BaseUserController {

    private userRepository = AppDataSource.getRepository(User)

    // Get all users
    async all(request: Request, response: Response): Promise<any> {
        const users = await this.userRepository.find();
        return response.json(users);
    }

    // Get a user by ID
    async one(request: Request, response: Response): Promise<any> {
        const id = parseInt(request.params.id);
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        return response.json(user);
    }

    // Save a new user
    async save(request: Request, response: Response): Promise<any> {
        const { email, password } = request.body;
        const user = Object.assign(new User(), { email, password });
        const savedUser = await this.userRepository.save(user);
        return response.status(201).json(savedUser);
    }

    // Remove a user
    async remove(request: Request, response: Response): Promise<any> {
        const id = parseInt(request.params.id);
        let userToRemove = await this.userRepository.findOneBy({ id });

        if (!userToRemove) {
            return response.status(404).json({ message: "User does not exist" });
        }

        await this.userRepository.remove(userToRemove);
        return response.status(200).json({ message: "User has been removed" });
    }

    // Register a new user
    async register(req: Request, res: Response): Promise<any> {
        const { email, password, firstName, lastName, gender, firebaseUid } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            const newUser = new User();
            newUser.email = email;
            newUser.username = email;
            newUser.password = await bcrypt.hash(password, 10); // Hash the password
            newUser.firstName = firstName || '';
            newUser.lastName = lastName || '';
            newUser.role = { id: 2, name: 'User' };

            await this.userRepository.save(newUser);

            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({ message: "An internal server error occurred while registering the user." });
        }
    }

    // Login a user
    async login(req: Request, res: Response): Promise<any> {
        const { username, password } = req.body;

        try {
            const user = await this.userRepository.findOne({
                where: { username },
                relations: ["role"],
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            //Password validation using bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const { password: _, role, ...userWithoutPassword } = user;
            const responseData = {
                ...userWithoutPassword,
                role: role ? role.name : null,
            };

            return res.json(responseData);
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ message: "An error occurred during login" });
        }
    }
}