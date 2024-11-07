import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";

export class CartController {
    private cartRepository = AppDataSource.getRepository(Cart);
    private cartItemRepository = AppDataSource.getRepository(CartItem);

    //fetch all cart stuff
    async all(request: Request, response: Response, next: NextFunction) {
        const carts = await this.cartRepository.find({ relations: ["cartItems"] });
        return response.json(carts);
    }

   // fetch cart by id
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const cart = await this.cartRepository.findOne({
            where: { id },
            relations: ["cartItems"],
        });

        if (!cart) {
            return response.status(404).json({ message: "cant find cart" });
        }
        return response.json(cart);
    }

   // saving new cart
    async save(request: Request, response: Response, next: NextFunction) {
        const { userId } = request.body;

        const cart = Object.assign(new Cart(), {
            userId,
        });

        const savedCart = await this.cartRepository.save(cart);
        return response.status(201).json(savedCart);
    }

    // buying stuff
    async addItem(request: Request, response: Response, next: NextFunction) {
        const cartId = parseInt(request.params.id);
        const { itemName, itemPrice } = request.body;

        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ["cartItems"],
        });

        if (!cart) {
            return response.status(404).json({ message: "cant find cart" });
        }

        cart.cartItems = cart.cartItems??[];

        const cartItem = Object.assign(new CartItem(), {
            itemName,
            itemPrice,
            cart,
        });

        const savedCartItem = await this.cartItemRepository.save(cartItem);
        cart.cartItems.push(savedCartItem);
        await this.cartRepository.save(cart);

        return response.status(201).json(savedCartItem);
    }

    // removing
    async removeItem(request: Request, response: Response, next: NextFunction) {
        const cartId = parseInt(request.params.id);
        const itemId = parseInt(request.params.itemId);

        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ["cartItems"],
        });

        if (!cart) {
            return response.status(404).json({ message: "Cant find cart" });
        }

        cart.cartItems = cart.cartItems??[];

        const cartItem = cart.cartItems.find((item) => item.id === itemId);
        if (!cartItem) {
            return response.status(404).json({ message: "item not found" });
        }

        await this.cartItemRepository.remove(cartItem);
        cart.cartItems = cart.cartItems.filter((item) => item.id !== itemId);
        await this.cartRepository.save(cart);

        return response.status(200).json({ message: "item removed" });
    }

    // delete a cart
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let cartToRemove = await this.cartRepository.findOneBy({ id });

        if (!cartToRemove) {
            return response.status(404).json({ message: "cart ? not exists" });
        }

        await this.cartRepository.remove(cartToRemove);

        return response.status(200).json({ message: "removed cart" });
    }
}