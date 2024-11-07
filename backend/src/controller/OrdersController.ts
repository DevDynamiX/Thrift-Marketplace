import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Orders } from "../entity/Orders";

export class OrderController {
    async createOrder(request: Request, response: Response, next: NextFunction) {
        const orderRepo = AppDataSource.getRepository(Orders);

        try {
            console.log('Received order data:', request.body);

            const { orderNumber, email, total } = request.body;

            if (!orderNumber || !email || total === undefined) {
                console.log('Validation failed:', { orderNumber, email, total });
                return response.status(400).json({ error: "Missing required fields" });
            }

            const order = new Orders();
            order.orderNumber = orderNumber;
            order.email = email;
            order.total = total;

            console.log('Created order entity:', order);

            const result = await orderRepo.save(order);
            console.log('Save result:', result);

            // Send success response back to client
            return response.status(201).json(result);
        } catch (error) {
            console.error('Detailed error in createOrder:', error);
            return response.status(500).json({ error: `Failed to create order: ${error}` });
        }
    }
}
