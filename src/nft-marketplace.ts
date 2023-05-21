import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemBought, ItemCancelled, ItemListed, ActiveItem } from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemId = getIdFromEventParams(event.params.tokenId, event.params.nftAddress);
  
  let itemBought = ItemBought.load(itemId);
  let activeItem = ActiveItem.load(itemId);

  if(!itemBought) itemBought = new ItemBought(itemId);

  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  itemBought.buyer = event.params.buyer
  itemBought.price = event.params.price

  activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let itemId = getIdFromEventParams(event.params.tokenId, event.params.nftAddress);
  
  let itemCancelled = ItemCancelled.load(itemId);
  let activeItem = ActiveItem.load(itemId);

  if(!itemCancelled) itemCancelled = new ItemCancelled(itemId);

  // itemCancelled.seller = event.params.seller
  itemCancelled.nftAddress = event.params.nftAddress
  itemCancelled.tokenId = event.params.tokenId

  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000dEaD")

  itemCancelled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemId = getIdFromEventParams(event.params.tokenId, event.params.nftAddress);
  let activeItem = ActiveItem.load(itemId);

  let itemListed = ItemListed.load(itemId);
  if(!itemListed) itemListed = new ItemListed(itemId);

  itemListed.seller = event.params.seller
  itemListed.nftAddress = event.params.nftAddress
  itemListed.tokenId = event.params.tokenId
  itemListed.price = event.params.price


  if(!activeItem) activeItem = new ActiveItem(itemId);

  activeItem.seller = event.params.seller
  activeItem.nftAddress = event.params.nftAddress
  activeItem.tokenId = event.params.tokenId
  activeItem.price = event.params.price

  itemListed.save()
  activeItem.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address) : string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
