import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import {Cart} from "../entity/Cart";
import {CartItem} from "../entity/CartItem";

export class CartController {
    async getCartItems(req:Request,res:Response){
        const cartRepo = AppDataSource.getRepository(Cart);
        const cart = await cartRepo.findOne({where:{id:1},relations:['items']});
        return res.json(cart?cart.items:[]);
    }

    async addItemToCart(req:Request,res:Response){
        const{name,price,quantity} = req.body;
        const cartRepo = AppDataSource.getRepository(Cart);
        const itemRepo = AppDataSource.getRepository(CartItem);

        let cart = await cartRepo.findOne({where:{id:1}});
        if (!cart) {
            cart =new Cart();;
            await cartRepo.save(cart);
        }

        const item = new CartItem();
        item.name = name;
        item.price = price;
        item.quantity = quantity;
        item.cart = cart;

        await itemRepo.save(item);
        return res.json(item);
    }
    async removeItemFromCart(req:Request,res:Response){
        const itemId = parseInt(req.params.id);
        const itemRepo = AppDataSource.getRepository(CartItem);

        const item = await itemRepo.findOne({where:{id:1}});
        if (!item) {
            await itemRepo.remove(item);
        }
        return res.json({message:"Item removed"});
    }
    async clearCart(req:Request,res:Response){
        const itemRepo = AppDataSource.getRepository(CartItem);
        await itemRepo.clear();
        return res.json({message:"Item cleared"});
    }
}

