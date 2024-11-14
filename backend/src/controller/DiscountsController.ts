import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Discounts } from "../entity/Discounts";
import { User } from "../entity/User";
import { Recycling} from "../entity/Recycling";
import {DeepPartial} from "typeorm";

export class DiscountsController {

    private discountsRepository = AppDataSource.getRepository(Discounts)
    private recyclingRepository = AppDataSource.getRepository(Recycling)
    private userRepository = AppDataSource.getRepository(User)

    // Get all in recycling table
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const discounts = await this.discountsRepository.find({
                order: {id: 'asc'}
            });
            return response.json(discounts);
        } catch (error) {
            console.error("Error Fetching Discounts: ", error);
            return response.status(500).json({ message: "Error Fetching Discounts" });
        }
    }

    // Save a new item
    async save(req: Request, res: Response) {
        const {
            discountCode,
            userID,
            recyclingID,
        } = req.body;


        if (!discountCode || !userID) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        try {

            const user =  await this.userRepository.findOne({where:{id:userID}});
            if (!userID) {
                return res.status(400).json({ success: false, message: "User ID is required." });
            }

            const recycling = await this.recyclingRepository.findOne({where:{id:recyclingID}})

            const savedDiscount = this.discountsRepository.create({
                discountCode,
                user,
                recycling,
            } as DeepPartial<Discounts>);

            await this.discountsRepository.save(savedDiscount);

            console.log("Parsed Request Body:", req.body);

            return res.json({
                success: true,
                message: "Discount saved successfully.",
            });
        } catch (error) {
            console.error("Error Saving Discount: ", (error as Error).message);
            return res.status(500).json({ success: false, message: "Error saving to Discounts." });
        }
    }

    // Remove a item
    async remove(req: Request, res: Response, next: NextFunction) {
        const discountID = req.params.id;

        if (!discountID) {
            return res.status(400).json({ error: 'Discount ID is missing' });
        }

        console.log('Received ID:', discountID);

        try {
            const deleteResult = await this.discountsRepository.delete(discountID);

            if (deleteResult.affected === 0) {
                return res.status(404).json({ success: false, message: 'Discount Not Found!' });
            }

            console.log('Discount deleted successfully.');

            return res.status(200).json({message: "Discount has been removed"});

        } catch (error) {
            console.error("Error Removing Discount: ", error);
            return res.status(500).json({success: false, message: "Error Removing Discount"});
        }
    }
}