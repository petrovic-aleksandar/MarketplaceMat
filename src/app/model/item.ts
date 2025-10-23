import { Image } from "./image"
import { ItemType } from "./item-type"
import { User } from "./user"

export interface Item {
    id: number,
    name: string,
    description: string,
    price: number,
    type: ItemType,
    active: boolean,
    createdAt: string,
    seller: User
    frontImage: Image,
    images: Image[]
}   
