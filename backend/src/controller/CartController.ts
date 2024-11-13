import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import {Cart} from "../entity/Cart";
import {Inventory} from "../entity/adminInventory";
import { User } from "../entity/User"

export class CartController {

    private cartRepository = AppDataSource.getRepository(Cart)
    private inventoryRepository = AppDataSource.getRepository(Inventory)
    private userRepository  = AppDataSource.getRepository(User)

    async all(req:Request,res:Response){
       const { userID } = req.query;
       const userIDNumber = Number(userID);

       console.log("Fetching Cart for user: ", userID);

        try {
            const userCart =  await this.cartRepository.find({
                where: { user: {id: userIDNumber} },
                relations: ["inventoryItem"],
            });

            console.log('User cart: ', userCart);

            return res.status(200).json(userCart);
        } catch(error){
           console.error("Error fetching items in cart: ", error);
           return res.status(500).json({message: "Error fetching cart: ", error});

       }
    }

    async save(req: Request, res: Response) {
        //TODO: add userID here
        const {itemID, userID} = req.body;

        console.log("Request Body:", req.body);

        try {
            if (!itemID) {
                return res.status(400).json({ message: "itemID is required." });
            }

            const itemExists =  await this.cartRepository.findOne({
                where: {user: {id: userID}, inventoryItem: {id:itemID}},
                relations: ['inventoryItem'],
            });

            if(itemExists){
                return res.status(400).json({ success: false, message: "You've already added this item to cart." });
            }

            const inventoryItem =  await this.inventoryRepository.findOne({
                where: {id:itemID}
            });

            if(!inventoryItem){
                return res.status(404).json({ message: "Item not found in inventory. " });
            }

            const user = await this.userRepository.findOne({where: {id: userID}, });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            const cart =  this.cartRepository.create({
                user,
                inventoryItem});

            const savedCart = await this.cartRepository.save(cart);

            return res.status(201).json({message:"Item added successfully."});

        } catch (error) {
            console.error("Error saving to Cart: ", error);
            return res.status(500).json({success: false, message: "Error saving to 'Cart'."});
        }
    }

    async remove(req: Request, res: Response) {
        console.log("Received DELETE request to remove item");

        const {itemID, userID} = req.params;
        const itemIDNumber = Number(itemID);
        const userIDNumber = Number(userID);

        console.log(`itemID: ${itemIDNumber}, userID: ${userID}`);

        try {
            const itemToRemove = await this.cartRepository.findOne(
                {
                    where:
                        {inventoryItem: {id:itemIDNumber},
                            user: {id: userIDNumber}},
                    relations: ['inventoryItem'],

                })

            console.log("Item found:", itemToRemove);

            if (!itemToRemove) {
                console.log("Item not found for itemID:", itemID, "userID:", userID);
                return res.status(404).json({message: "You have not added this item to cart!"});
            }

            await this.cartRepository.remove(itemToRemove)
            console.log("Item removed successfully from 'Cart'.");

            return res.status(200).json({message: " Item removed from 'Cart'."});

        } catch(error){
            console.error("Error removing from Cart: ", error);
            return res.status(500).json({success: false, message: "Error removing from Cart."});
        }
    }

    async clearCart(req:Request,res:Response){
        const itemRepo = AppDataSource.getRepository(Cart);
        await itemRepo.clear();
        return res.json({message:"Item cleared"});
    }
}



