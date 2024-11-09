import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Likes } from "../entity/userLikes";

export class UserLikesController {

    private likesRepository = AppDataSource.getRepository(Likes)

    // Get all Likes
    async all(req: Request, res: Response) {
        const likes = await this.likesRepository.find();
        return res.status(200).json(likes);
    }

    // Save a new like
    async save(req: Request, res: Response) {
        //TODO: add userID here
        const {itemID, userID} = req.body;

        console.log("Request Body:", req.body);

        try {

            if (!itemID) {
                return res.status(400).json({ message: "itemID is required." });
            }

            const likeExists =  await this.likesRepository.findOne({
                where: {itemID, userID}
            });

            if(likeExists){
                return res.status(400).json({ success: false, message: "You've already liked this item." });
            }

            const like = this.likesRepository.create({
                itemID,
                userID
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

        try {
            const likeToRemove = await this.likesRepository.findOne(
                {
                    where:
                        {itemID: itemID, userID: userID}
                })

            console.log("Like found:", likeToRemove);

            if (!likeToRemove) {
                console.log("Like not found for itemID:", itemID, "userID:", userID);
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