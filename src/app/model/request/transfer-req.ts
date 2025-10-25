export interface TransferReq {
    amount: number,
    type: string,
    buyerId?: number,
    sellerId?: number,
    itemId?: number
}