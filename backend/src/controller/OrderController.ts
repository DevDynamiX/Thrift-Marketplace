import {AppDataSource} from "../data-source";
import {NextFunction,Request,Response} from "express";
import {Orders} from "../entity/Orders";
import {request} from "node:http";

export class OrderController {
    async createOrder(req: Request, res: Response) {
        const orderRepo = AppDataSource.getRepository(Orders);

        try {
            console.log('recvied order body', req.body);

            const {orderNumber, email, total} = req.body;

            if (!orderNumber || !email || total === undefined) {
                console.log('Validation failed:', {orderNumber, email, total});
                return res.status(400).json({error: "Missing required fields"});
            }

            const order = new Orders(); // adds to table
            order.orderNumber = orderNumber;
            order.email = email;
            order.total = total;

            console.log('Created order entity:', order);

            const result = await orderRepo.save(order);
            console.log('Save result:', result);

            return res.status(201).json(result);
        } catch (error) {
            console.error('Detailed error in createOrder:', error);

            if (error instanceof Error) { // check for databse specific errors
                if (error.message.includes('duplicate')) {
                    return res.status(409).json({
                        error: "Order number already exists"
                    });
                }
            }

            return res.status(500).json({ // return json response error
                error: "Failed to create order",
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getOrders(req: Request, res: Response) {
        try {
            const orderRepo = AppDataSource.getRepository(Orders);
            const orders = await orderRepo.find();
            return res.status(200).json(orders);
        }
        catch (error) {
            console.error('Detailed error in getOrders:', error);
        }
    }
}