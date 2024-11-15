import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Orders } from "../entity/Orders";
import {request} from "node:http";

export class OrderController {
    async createOrder(request: Request, response: Response, next: NextFunction) {
        const orderRepo = AppDataSource.getRepository(Orders);

        try {
            console.log('Received order data:', request.body);

            const { orderNumber, email,address, total } = request.body;

            if (!orderNumber || !email || total === undefined || !address) {
                console.log('Validation failed:', { orderNumber, email, total, address });
                return response.status(400).json({ error: "Missing required fields" });
            }

            const order = new Orders();
            order.orderNumber = orderNumber;
            order.email = email;
            order.total = total;
            order.address = address;

            console.log('Created order entity:', order);

            const result = await orderRepo.save(order);
            console.log('Save result:', result);

            // Send success response back to client
            return response.status(201).json(result);
        } catch (error) {
            console.error('Detailed error in createOrder:', error);
            console.error('Error stack trace:', error);

            let errorMessage = 'Failed to create order.';
            if (error) {
                errorMessage = `Failed to create order: ${error}`;
            }
            return response.status(500).json({ error: errorMessage });

        }
    }

    async getOrders(req: Request, res: Response) {
        try {
            console.log('LOG: 1');
            const orderRepo = AppDataSource.getRepository(Orders);
            console.log('LOG: 2');
            const orders = await orderRepo.find();
            console.log('LOG: 3');
            return res.status(200).json(orders);
        }
        catch (error) {
            console.log('LOG: 5 - Error');
            console.error('Detailed error in getOrders:', error);
        }
    }
}