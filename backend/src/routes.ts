import { UserController } from "./controller/UserController";
import { AdminInventoryController } from "./controller/adminInventoryController";
import { upload } from "./middleware/inventoryUpload";
export const Routes = [
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

    //for admin DB
    {
        method: "get",
        route: "/inventory",
        controller: AdminInventoryController,
        action: "all",
    },
    {
        method: "get",
        route: "/inventory/:SKU",
        controller: AdminInventoryController,
        action: "one",
    },
    {
        method: 'post',
        route: '/inventory',
        controller: AdminInventoryController,
        action: "save",
        middleware: [upload.fields([
            { name: 'mainImage', maxCount:1 },
            { name: 'image2', maxCount:1 },
            { name: 'image3', maxCount:1 },
        ])]
    },
    {
        method: "delete",
        route: "/inventory/:id",
        controller: AdminInventoryController,
        action: "remove",
    },
    {
        method: "put",
        route: "/inventory/:SKU",
        controller: AdminInventoryController,
        action: "update",
    },

];
