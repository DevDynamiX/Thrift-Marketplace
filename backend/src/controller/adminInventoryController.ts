import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Inventory } from "../entity/adminInventory";
import { unlink } from 'fs';
import {DeepPartial} from "typeorm";

export class AdminInventoryController {

    private inventoryRepository = AppDataSource.getRepository(Inventory)

    // Get all in inventory table
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const inventory = await this.inventoryRepository.find();
            return response.json(inventory);
        } catch (error) {
            console.error("Error Fetching Inventory: ", error);
            return response.status(500).json({ message: "Error Fetching Inventory" });
        }
    }

    // Get an item by ID
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        try {
            const inventory = await this.inventoryRepository.findOne({
                where: {id}
            })

            if (!inventory) {
                return response.status(404).json({message: "Item not found"});
            }
            return response.json(inventory);
        } catch (error) {
            console.error("Error Fetching Item: ", error);
            return response.status(500).json({ message: "Error Fetching Item" });
        }
    }

    // Save a new item
    async save(req: Request, res: Response) {
        const {
            SKU,
            itemName,
            itemPrice,
            description,
            category,
            size,
            colour,
            sex,
            damage,
            material,
            onSale,
            salePrice,
            discountPercent,
        } = req.body;



        if (!SKU || !itemName || !itemPrice) {
            return res.status(400).json({ success: false, message: "Enter required fields." });
        }

        if (onSale && !salePrice) {
            return res.status(400).json({ success: false, message: "Sale price is required." });
        }

        try {
            const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;

            const mainImage = files?.['mainImage']?.[0]?.path || null;
            const image2 = files?.['image2']?.[0]?.path || null;
            const image3 = files?.['image3']?.[0]?.path || null;

            const savedItem = await this.inventoryRepository.save({
                SKU,
                itemName,
                itemPrice,
                description,
                category,
                size,
                colour,
                sex,
                damage,
                material,
                onSale,
                salePrice,
                discountPercent,
                mainImage,
                image2,
                image3
            } as DeepPartial<Inventory>);


            // Only return essential details
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
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        try {
            let itemToRemove = await this.inventoryRepository.findOneBy({id})

            if (!itemToRemove) {
                return response.status(404).json({success: false, message: "Item does not exist"});
            }

            await this.inventoryRepository.remove(itemToRemove)

            const imagePaths = [itemToRemove.mainImage, itemToRemove.image2, itemToRemove.image3];

            imagePaths.forEach(imagePath => {
                if(imagePath) {
                    unlink(imagePath, (err) => {
                        if (err) console.error(`Error deleting image: ${imagePath}`, err);
                    });
                }
            });

            return response.status(200).json({message: "Item has been removed"});

        } catch (error) {
            console.error("Error Removing Item: ", error);
            return response.status(500).json({success: false, message: "Error Removing Item"});
        }
    }
}