import { UserController } from "./controller/UserController";
import {AdminInventoryController} from "./controller/adminInventoryController";
import {CartController} from "./controller/CartController";
import {OrderController} from "./controller/OrderController";
import {RecyclingController} from "./controller/RecyclingController";
import {UserLikesController} from "./controller/userLikesController";
import {DiscountsController} from "./controller/DiscountsController";

export const Routes = [

    //routes for user table
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

    //routes for admin table
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

    //routes for carts table
    {
        method: "get",
        route: "/cart/:userID",
        controller: CartController,
        action: "all",
    },
    {
        method: "post",
        route: "/cart",
        controller: CartController,
        action: "save",
    },

    {
        method: "delete",
        route: "/cart/:itemID/:userID",
        controller: CartController,
        action: "remove",
    },


    //routes for orders table
    {
        method: "post",
        route: "/orders",
        controller: OrderController,
        action: "createOrder",
    },

    //routes for recycling table
    {
        method: "get",
        route: "/recycling",
        controller: RecyclingController,
        action: "all",
    },
    {
        method: "post",
        route: "/recycling",
        controller: RecyclingController,
        action: "save",
    },
    {
        method: "delete",
        route: "/recycling/:id",
        controller: RecyclingController,
        action: "remove",
    },
    {
        method: "get",
        route: "/orders",
        controller: OrderController,
        action: "getOrders",
    },

    //routes for user likes table
    {
        method: "get",
        route: "/likes",
        controller: UserLikesController,
        action: "all",
    },
    {
        method: "post",
        route: "/likes",
        controller: UserLikesController,
        action: "save",
    },
    {
        method: "delete",
        route: "/likes/:itemID/:userID",
        controller: UserLikesController,
        action: "remove",
    },
    {
        method: "put",
        route: "/users/:id",
        controller: UserController,
        action: "update",
    },


    //for discounts table
    {
        method: "get",
        route: "/discounts",
        controller: DiscountsController,
        action: "all",
    },
    {
        method: "get",
        route: "/discounts/:userId",
        controller: DiscountsController,
        action: "one",
    },
    {
        method: "post",
        route: "/discounts",
        controller: DiscountsController,
        action: "save",
    },
    {
        method: "delete",
        route: "/discounts/:recyclingID",
        controller: DiscountsController,
        action: "remove",
    },
    {
        method: "get",
        route: "/discounts/:id",
        controller: DiscountsController,
        action: "one",
    },

];