import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Discounts } from "../entity/Discounts";
import { User } from "../entity/User";
import { Recycling } from "../entity/Recycling";
import {DeepPartial} from "typeorm";

export class DiscountsController {

    private discountsRepository = AppDataSource.getRepository(Discounts)
    private recyclingRepository = AppDataSource.getRepository(Recycling)
    private userRepository = AppDataSource.getRepository(User)

    // Get a by user ID
    async one(request: Request, response: Response) {
        try {
            const userID = parseInt(request.params.userId);

            console.log("Searching for discounts for user ID: ", userID);

            if (!userID) {
                console.log("No user ID provided.");
                return response.status(400).json({ message: "User ID is required." });
            }

            // Query discounts where the user ID matches
            const userDiscounts: Discounts[] = await this.discountsRepository.find({
                where: { user: { id: userID } },
                relations: ["user", "recycling"],
            });

            if (userDiscounts.length === 0) {
                return response.status(404).json({ message: "No discounts for this user!" });
            }

            console.log("These are the user's discounts: ", userDiscounts);

            return response.json(userDiscounts);
        } catch (error) {
            console.error("There was an error fetching the discounts: ", error);
            return response.status(500).json({ message: "An error occurred while fetching the discounts." });
        }
    }


    // Get all in recycling table
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const discounts = await this.discountsRepository.find({
                relations: ['recycling', 'user'],
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
            recyclingId,
            userID,
        } = req.body;

        if(!req.body){
            console.error("Error Fetching body");
        }else{
            console.log('Full request body:', req.body);

        }

        console.log('User:', userID);
        console.log('Recycling:', recyclingId);

        if (!discountCode || !userID) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        try {
            const user =  await this.userRepository.findOne({where:{id:userID}});
            const recycling = await this.recyclingRepository.findOne({where:{id:recyclingId}})

            if (user) {
                console.log("User found:", user);
            } else {
                console.log("User not found with ID:", userID);
            }

            if (recycling) {
                console.log("Recycling found:", recycling);
            } else {
                console.log("Recycling not found with ID:", recyclingId);
            }

            if (!user || !recycling) {
                console.log("User or Recycling not found.");
                return res.status(404).json({ success: false, message: "User or Recycling record not found." });
            }

            const savedDiscount = this.discountsRepository.create({
                discountCode,
                user,
                recycling,
            } as DeepPartial<Discounts>);

            console.log("Saving Discount Entity:", savedDiscount);

            console.log('**************************');
            console.log("User ID in Discount Entity:", savedDiscount.user?.id);
            console.log("Recycling ID in Discount Entity:", savedDiscount.recycling?.id);

            await this.discountsRepository.save(savedDiscount);

            console.log("Discount saved successfully:", savedDiscount);

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
        const recyclingID = Number(req.params.id);

        console.log("Recycling ID: ", recyclingID);

        if (!recyclingID) {
            return res.status(400).json({ error: 'Discount ID is missing' });
        }

        console.log('Received ID:', recyclingID);

        try {
            const discount =  await this.discountsRepository.findOne({
                where: {id: recyclingID},
                relations: ['recycling'],
            })

            if (!discount) {
                return res.status(404).json({ success: false, message: 'Discount Not Found!' });
            }

            //await this.discountsRepository.update(recyclingID, {user:null});

            if(discount.recycling){
                //await this.recyclingRepository.update(discount.recycling.id,{user:null});
                await this.recyclingRepository.delete(discount.recycling.id);
            }

            const deleteResult = await this.discountsRepository.delete(recyclingID);

            if(deleteResult.affected === 0) {
                return res.status(404).json({ success: false, message: "Discount Not Found!" });
            }

            console.log('Discount deleted successfully');
            return res.status(500).json({message: "Discount deleted successfully."})

        } catch (error) {
            console.error("Error Removing Discount: ", error);
            return res.status(500).json({success: false, message: "Error Removing Discount"});
        }
    }
}