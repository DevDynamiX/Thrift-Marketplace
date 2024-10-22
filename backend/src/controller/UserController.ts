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
            newUser.username = email;
            newUser.password = password; // Todo - Hash the password before saving
            newUser.firstName = firstName || '';
            newUser.lastName = lastName || '';
            newUser.role = { id: 2, name: 'User' };

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

    static async login(req: Request, res: Response) {
        const { email, password } = req.body; // Assuming you pass email and password in the request body

        try {
            const user = await AppDataSource.getRepository(User).findOneBy({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Add your password validation logic here
            if (user.password !== password) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Assuming User entity has a relation to UserRole
            const userRole = user.role; // Adjust this if your user role is retrieved differently

            // Return user details and role
            return res.json({
                id: user.id,
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                userRole: userRole.name,
                role: userRole.name,
            });
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ message: "An error occurred during login" });
        }
    }
}

export default UserController;