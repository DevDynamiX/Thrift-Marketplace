import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    // Get all users
    async all(request: Request, response: Response, next: NextFunction) {
        const users = await this.userRepository.find();
        return this.userRepository.find()
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
        const { firstName, lastName, age } = request.body;

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            age
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
    async register(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, email, password, gender, firebaseUid } = request.body;

        // Basic validation
        if (!firstName || !lastName || !email || !password || !gender) {
            return response.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            return response.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance
        const newUser = this.userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            gender,
            firebaseUid, // Save Firebase UID
        });

        // Save user to the database
        await this.userRepository.save(newUser);

        try {
            const savedUser = await this.userRepository.save(newUser);
            return response.status(201).json(savedUser);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Failed to register user" });
        }
    }
}