import { UserController } from "./controller/UserController";
import {AdminInventoryController} from "./controller/adminInventoryController";
import {CartController} from "./controller/CartController";
import {OrderController} from "./controller/OrdersController";

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
    {
        method: "get",
        route: "/inventory",
        controller: AdminInventoryController,
        action: "all",
    },
    {
        method: "get",
        route: "/inventory/:id",
        controller: AdminInventoryController,
        action: "one",
    },
    {
        method: "post",
        route: "/inventory",
        controller: AdminInventoryController,
        action: "save",
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
    {
        method: "get",
        route: "/carts",
        controller: CartController,
        action: "all",
    },
    {
        method: "get",
        route: "/carts/:id",
        controller: CartController,
        action: "one",
    },
    {
        method: "post",
        route: "/carts",
        controller: CartController,
        action: "save",
    },
    {
        method: "post",
        route: "/carts/:id/items",
        controller: CartController,
        action: "addItem",
    },
    {
        method: "delete",
        route: "/carts/:id/items/:itemId",
        controller: CartController,
        action: "removeItem",
    },
    {
        method: "delete",
        route: "/carts/:id",
        controller: CartController,
        action: "remove",
    },
    {
     method: "post",
        route: "/orders",
        controller: OrderController,
        action: "createOrder",
    },
// Update user details(Ika added this code editing)
    {
        method: "put", // Update route
        route: "/users/:id", // URL to identify the user by ID
        controller: UserController,
        action: "update", // Call the 'update' method in UserController
    },
];
