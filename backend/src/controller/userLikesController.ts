import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Likes } from "../entity/userLikes";
import { Inventory} from "../entity/adminInventory";
import { User } from "../entity/User";

export class UserLikesController {

    private likesRepository = AppDataSource.getRepository(Likes)
    private inventoryRepository = AppDataSource.getRepository(Inventory)
    private userRepository = AppDataSource.getRepository(User)

    // Get all Likes
    async all(req: Request, res: Response) {
        console.log("Incoming request for likes:", req.query);

        const {userID} = req.query;
        console.log("userIDNumber", userID);

        if (!userID || isNaN(Number(userID))) {
            console.error("Invalid or missing userID:", userID);
            return res.status(400).json({
                success: false,
                likes: [],
                message: "Invalid or missing userID",
            });
        }

        const userIDNumber = Number(userID);

        try {
            const userLikes = await this.likesRepository.find({
                where: {user: {id: userIDNumber}},
                relations: ['unit'],
            });

            console.log("User Likes:", userLikes);

            return res.status(200).json({
                success: true,
                likes: userLikes,
                message: "User likes fetched successfully.",
            });
        }catch (error: any) {
                console.error("Error fetching user 'Likes':", error.message || error);
                return res.status(500).json({
                    success: false,
                    likes: [],
                    message: error.message || "An unexpected error occurred while fetching user likes.",
                });
            }
    }

    // Save a new like
    async save(req: Request, res: Response) {
        const {itemID, userID} = req.body;
        const userIDNumber = Number(userID);

        console.log("Request Body:", req.body);

        try {

            if (!itemID) {
                return res.status(400).json({ message: "item ID is required." });
            }

            const likeExists =  await this.likesRepository.findOne({
                where: {user: {id:userIDNumber }, unit: {id: itemID}},
                relations: ['unit'],
            });

            if(likeExists){
                return res.status(400).json({ success: false, message: "You've already liked this item." });
            }

            const user = await this.userRepository.findOne({ where: { id: userIDNumber } });
            const item = await this.inventoryRepository.findOne({ where: { id: itemID } });


            if(!user){
                return res.status(404).json({ success: false, message: "User not found. " });
            }
            if(!item){
                return res.status(404).json({ success: false, message: "Item not found in inventory. " });
            }

            const like = this.likesRepository.create({
                user,
                unit: item
            });

            const savedLike = await this.likesRepository.save(like);
            return res.status(201).json({
                message: 'Items added to "Likes": ',
                likes: savedLike})

        } catch (error) {
            console.error("Error saving Likes: ", error);
            return res.status(500).json({success: false, message: "Error saving to 'Likes'."});
        }
    }

    // Remove a Like
    async remove(req: Request, res: Response) {
        console.log("Received DELETE request to remove like");

        const {itemID, userID} = req.params;
        const itemIDNumber = Number(itemID);
        const userIDNumber = Number(userID);

        try {
            const likeToRemove =  await this.likesRepository.findOne({
                where: {unit: {id: itemIDNumber }, user: {id: userIDNumber}},
                relations: ['unit'],
            });

            console.log("Like found:", likeToRemove);

            if (!likeToRemove) {
                console.log("Like not found for item ID:", itemID, "userID:", userID);
                return res.status(404).json({message: "You have not liked this item!"});
            }

            await this.likesRepository.remove(likeToRemove)
            console.log("Item removed successfully from 'Likes'");

            return res.status(200).json({message: " Item removed from 'Likes'."});

        } catch(error){
            console.error("Error removing Like: ", error);
            return res.status(500).json({success: false, message: "Error removing Like."});
        }
    }

}