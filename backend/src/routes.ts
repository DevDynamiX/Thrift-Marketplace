import { UserController } from "./controller/UserController";
import { AdminInventoryController } from "./controller/adminInventoryController";
import { upload } from "./middleware/inventoryUpload";
import { BaseUserController } from './core/base/controllers/BaseUserController';

// Type to represent valid actions from BaseController
type ControllerAction = keyof BaseUserController;

// Interface to define route structure
interface Route {
    method: 'get' | 'post' | 'put' | 'delete';
    route: string;
    controller: { new (): BaseUserController }; // Controller constructor
    action: ControllerAction; // Action to call on the controller
    middleware?: any[]; // Optional middleware array
}

export const Routes: Route[] = [
    // User Routes
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all",
    },
    {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one",
    },
    {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save",
    },
    {
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "remove",
    },
    {
        method: "post",
        route: "/register",
        controller: UserController,
        action: "register",
    },
    {
        method: "post",
        route: "/login",
        controller: UserController,
        action: "login",
    },

    //for admin DB
    // {
    //     method: "get",
    //     route: "/inventory",
    //     controller: AdminInventoryController,
    //     action: "all",
    // },
    // {
    //     method: "get",
    //     route: "/inventory/:SKU",
    //     controller: AdminInventoryController,
    //     action: "one",
    // },
    // {
    //     method: 'post',
    //     route: '/inventory',
    //     controller: AdminInventoryController,
    //     action: "save",
    //     middleware: [upload.fields([
    //         { name: 'mainImage', maxCount:1 },
    //         { name: 'image2', maxCount:1 },
    //         { name: 'image3', maxCount:1 },
    //     ])]
    // },
    // {
    //     method: "delete",
    //     route: "/inventory/:SKU",
    //     controller: AdminInventoryController,
    //     action: "remove",
    // },
];
