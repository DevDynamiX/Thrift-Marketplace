import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Likes } from "../entity/userLikes";
import { Inventory} from "../entity/adminInventory";

export class UserLikesController {

    private likesRepository = AppDataSource.getRepository(Likes)
    private inventoryRepository = AppDataSource.getRepository(Inventory)

    // Get all Likes
    async all(req: Request, res: Response) {
        const {userID} = req.query;

        if (!userID) {
            return res.status(400).json({error: "User not found"});
        }

        try {
            const userLikes = await this.likesRepository.find({
                where: { userID: '1'},
                relations: ['unit'],
            });

            return res.status(200).json(userLikes);
        } catch (error) {
            console.error("Error fetching user 'Likes'. ", error);
            return res.status(500).json({success: false, message: "Error fetching user 'Likes'"});
        }
    }

    // Save a new like
    async save(req: Request, res: Response) {
        //TODO: add userID here
        const {itemID, userID} = req.body;

        console.log("Request Body:", req.body);

        try {

            if (!itemID) {
                return res.status(400).json({ message: "item ID is required." });
            }

            const likeExists =  await this.likesRepository.findOne({
                where: {userID, unit: {id: itemID}},
                relations: ['unit'],
            });

            if(likeExists){
                return res.status(400).json({ success: false, message: "You've already liked this item." });
            }

            const item = await this.inventoryRepository.findOne({ where: { id: itemID } });

            if(!item){
                return res.status(404).json({ success: false, message: "Item not found in inventory. " });
            }

            const like = this.likesRepository.create({
                userID,
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


        try {
            const likeToRemove =  await this.likesRepository.findOne({
                where: {unit: {id: itemIDNumber }, userID},
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