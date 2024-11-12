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
        const { email, password } = request.body;

        const user = Object.assign(new User(), {
            email,
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
    const { email, password, firstName, lastName, gender, firebaseUid } = req.body;

    // Simple validation (you can add more checks here)
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Create a new user instance
        const newUser = new User();
        newUser.email = email;
        newUser.password = password; // For testing, handling raw password (DO NOT do this in production)
        newUser.firstName = firstName || '';
        newUser.lastName = lastName || '';
        newUser.gender = gender || '';
        newUser.firebaseUid = firebaseUid || '';

        // Save the user to the database
        await this.userRepository.save(newUser);

        // Respond with a plain object containing user details (without circular references)
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
    } catch (error) {
        console.error('Registration Error:', error); // Log the actual error

        // Send a generic error message
        res.status(500).json({ message: "An internal server error occurred while registering the user." });
    }
}
}