export interface Transfer {
    id: number,
    amount: number,
    time: Date,
    type: string,
    buyer: string,
    seller: string,
    item: string
}