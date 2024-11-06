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
            const inventory = await this.inventoryRepository.find({
                order: {id: "DESC"}
            });
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
            mainImage,
            image2,
            image3
        } = req.body;


        if (!SKU || !itemName ||  (onSale ? false : !itemPrice)) {
            return res.status(400).json({ success: false, message: "Enter required fields." });
        }

        if (onSale && !salePrice) {
            return res.status(400).json({ success: false, message: "Sale price is required." });
        }

        try {
            //checking if SKU exists
            const existingItem =  await this.inventoryRepository.findOne({where: { SKU }});

            if (existingItem) {
                return res.status(400).json({ success: false,  message: "Item with this SKU already exists" })
            }


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
                mainImage: mainImage?.uri || null,
                image2: image2?.uri || null,
                image3: image3?.uri || null,
            } as DeepPartial<Inventory>);

            console.log("Parsed Request Body:", req.body);
            console.log('Files:', req.files);

            return res.json({
                success: true,
                message: "Item saved successfully.",
            });
        } catch (error) {
            console.error("Error Saving Item to Inventory: ", (error as Error).message);
            return res.status(500).json({ success: false, message: "Error saving to Inventory." });
        }
    }

    //update an item
    async update(req: Request, res: Response) {
        const { SKU } = req.params;

        const existingItem =  await this.inventoryRepository.findOne({where: {SKU}});

        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const {
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
        } = req.body;

        console.log(req.body);

        try {
            const existingItem = await this.inventoryRepository.findOne({where: {SKU}});

            if (!existingItem) {
                return res.status(404).json({success:false, message: 'Item Not Found!'});
            }

            existingItem.itemName = itemName;
            existingItem.itemPrice = itemPrice;
            existingItem.description = description;
            existingItem.category = category;
            existingItem.size = size;
            existingItem.colour = colour;
            existingItem.sex = sex;
            existingItem.damage = damage;
            existingItem.material = material;
            existingItem.onSale = onSale;
            existingItem.salePrice = salePrice;
            existingItem.discountPercent = discountPercent;

            if (mainImage && mainImage.uri) {
                existingItem.mainImage = mainImage.uri;
            }
            if (image2 && image2.uri) {
                existingItem.image2 = image2.uri;
            }
            if (image3 && image3.uri) {
                existingItem.image3 = image3.uri;
            }

            console.log("Main Image:", existingItem.mainImage);
            console.log("Image 2:",existingItem.image2);
            console.log("Image 3:",existingItem.image3);

            await this.inventoryRepository.save(existingItem);

            return res.json({
                success: true,
                message: "Item updated successfully.",
                item: existingItem
            });
        } catch (error) {
            console.error("Error Saving Item to Inventory: ", error);
            return res.status(500).json({success: false, message: 'Error Updating Item.'});
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
           const deleteResult = await this.inventoryRepository.delete(id);

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