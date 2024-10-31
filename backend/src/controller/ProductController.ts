import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import {Cart} from "../entity/Cart";
import {CartItem} from "../entity/CartItem";
import {Products} from "../entity/Products";

export class ProductController {
    async getAllProducts(req:Request,res:Response){
        const productRepo = AppDataSource.getRepository(Products)
        const products = await productRepo.find();
        res.json(products)
    }
}