import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import {Cart} from "../entity/Cart";
import { getRepository } from "typeorm";
import {Inventory} from "../entity/adminInventory";

export class CartController {

    private cartRepository = AppDataSource.getRepository(Cart)
    private inventoryRepository = AppDataSource.getRepository(Inventory)

    async all(req:Request,res:Response){
       const { userID } = req.params;

       console.log("Fetching Cart for user: ", userID);

        try {
           const cartItems =  await this.cartRepository
               .createQueryBuilder("cart")
               .innerJoinAndSelect('cart.inventoryItem', 'inventory')
               .where('cart.userID  = :userID', {userID})
               .getMany()

           if (cartItems.length === 0) {
               return res.status(404).json({ message: "No items found in cart for this user" });
           }

           res.json({items: cartItems});

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
                where: {itemID, userID}
            });

            if(itemExists){
                return res.status(400).json({ success: false, message: "You've already added this item to cart." });
            }

            const cart =  this.cartRepository.create({itemID, userID});
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

        try {
            const itemToRemove = await this.cartRepository.findOne({where: {itemID: itemID, userID: userID}})

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



