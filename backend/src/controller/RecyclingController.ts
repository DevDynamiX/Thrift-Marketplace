import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Recycling } from "../entity/Recycling";
import { unlink } from 'fs';
import {DeepPartial} from "typeorm";

export class RecyclingController {

    private recyclingRepository = AppDataSource.getRepository(Recycling)

    // Get all in recycling table
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const recycling = await this.recyclingRepository.find({
                order: {id: "DESC"}
            });
            return response.json(recycling);
        } catch (error) {
            console.error("Error Fetching Recycling.tsx Inventory: ", error);
            return response.status(500).json({ message: "Error Fetching Recycling.tsx Inventory" });
        }
    }



    // Save a new item
    async save(req: Request, res: Response) {
        const {
            email,
            firstName,
            lastName,
            description,
            dropoffLocation,
        } = req.body;


        if (!email || !dropoffLocation ) {
            return res.status(400).json({ success: false, message: "Enter required fields." });
        }

        try {

            const savedItem = await this.recyclingRepository.save({
                email,
                firstName,
                lastName,
                description,
                dropoffLocation,
            } as DeepPartial<Recycling>);

            console.log("Parsed Request Body:", req.body);

            return res.json({
                success: true,
                message: "Item saved successfully.",
            });
        } catch (error) {
            console.error("Error Saving Item to Inventory: ", (error as Error).message);
            return res.status(500).json({ success: false, message: "Error saving to Inventory." });
        }
    }


    // Remove a item
    async remove(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'Item ID is missing' });
        }

        console.log('Received ID:', id);

        try {
            const deleteResult = await this.recyclingRepository.delete(id);

            if (deleteResult.affected === 0) {
                return res.status(404).json({ success: false, message: 'Item Not Found!' });
            }

            console.log('Item deleted successfully.');

            return res.status(200).json({message: "Item has been removed"});

        } catch (error) {
            console.error("Error Removing Item: ", error);
            return res.status(500).json({success: false, message: "Error Removing Item"});
        }
    }
}