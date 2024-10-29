import { AppDataSource } from "../../config/data-source";
import { NextFunction, Request, Response } from "express";
import { Inventory } from "../../core/entity/adminInventory";
import { unlink } from 'fs';
import { BaseInventoryController } from '../../core/base/controllers/BaseInventoryController'; // Assuming you create this file

export class AdminInventoryController implements BaseInventoryController {
    private inventoryRepository = AppDataSource.getRepository(Inventory);

    // Get all items in inventory table
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
        const id = parseInt(request.params.id);
        try {
            const inventory = await this.inventoryRepository.findOne({ where: { id } });

            if (!inventory) {
                return response.status(404).json({ message: "Item not found" });
            }
            return response.json(inventory);
        } catch (error) {
            console.error("Error Fetching Item: ", error);
            return response.status(500).json({ message: "Error Fetching Item" });
        }
    }

    // Save a new item
    async save(request: Request, response: Response, next: NextFunction) {
        const {
            adminID,
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
        } = request.body;

        if (!SKU || !itemName || !itemPrice) {
            return response.status(400).json({ success: false, message: "Enter required fields." });
        }

        if (onSale && !salePrice) {
            return response.status(400).json({ success: false, message: "Sale price is required." });
        }

        try {
            const files = request.files as { [key: string]: Express.Multer.File[] } | undefined;

            if (!files) {
                throw new Error("No files were uploaded.");
            }

            const mainImage = files['mainImage'] ? files['mainImage'][0].path : null;
            const image2 = files['image2'] ? files['image2'][0].path : null;
            const image3 = files['image3'] ? files['image3'][0].path : null;

            const inventory = Object.assign(new Inventory(), {
                adminID,
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
            });

            const savedItem = await this.inventoryRepository.save(inventory);
            return response.status(201).json({ success: true, data: savedItem }); // Updated success status to true
        } catch (error) {
            console.error("Error Saving Item to Inventory: ", error);
            return response.status(500).json({ success: false, message: "Error saving to Inventory." });
        }
    }

    // Remove an item
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        try {
            let itemToRemove = await this.inventoryRepository.findOneBy({ id });

            if (!itemToRemove) {
                return response.status(404).json({ success: false, message: "Item does not exist" });
            }

            await this.inventoryRepository.remove(itemToRemove);

            const imagePaths = [itemToRemove.mainImage, itemToRemove.image2, itemToRemove.image3]; // Fixed reference to image3

            imagePaths.forEach(imagePath => {
                if (imagePath) {
                    unlink(imagePath, (err) => {
                        if (err) console.error(`Error deleting image: ${imagePath}`, err);
                    });
                }
            });

            return response.status(200).json({ message: "Item has been removed" });

        } catch (error) {
            console.error("Error Removing Item: ", error);
            return response.status(500).json({ success: false, message: "Error Removing Item" });
        }
    }
}