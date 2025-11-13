import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';
import { CustomButton } from './CustomButton';
import { pageNumber, refreshStore, resultItems, selectedItemPage, selectedItems, selectItem, showStoreUI, updateResults, updateStorePage, updateStoreSearch, updateStoreSkip, updateStoreView, visibleItems } from './createStoreUI';
import { ResultsPanel } from './ResultsPanel';
import { createComponents } from '../helpers/blockchain';
import { lotteries, lotteryWallet } from '../lottery';
import { chanceName, showCreateChanceUI } from './createNewChance';
import { paginateArray } from '../helpers/functions';
import { showNotification } from './NotificationPanel';
import { NOTIFICATION_TYPES } from '../helpers/types';
import { testStoreItems } from '../testItems';

let show:boolean = false
let loading:boolean = false

export let editChanceView = "edit"
export let pendingItems:any[] = []
export let visiblePendingItems:any[] = []
export let pendingChance:any

export function showSendChancItemsUI(value:boolean, pending?:any, fetch?:boolean){
    show = value

    if(pending){
        pendingItems.length = 0
        visiblePendingItems.length = 0
        pendingChance = pending
        console.log('new pending chance', pending)

        if(fetch){
            console.log('fetch new items')
            fetchPendingChanceItems(pending)
        }
    }

    if(!value){
        selectedItems.length = 0
        visibleItems.length = 0
    }
}

export function createSendChanceUI() {
    return (
        <UiEntity
            key={resources.slug + "send::chance-ui"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '65%',
                height: '75%',
                positionType: 'absolute',
                position: {right: '17%', bottom: '12%'}
            }}
        >
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
            }}
            onMouseDown={()=>{}}
            onMouseUp={()=>{}}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '96%',
                margin:{left:'2%', top:'0%'}
            }}
        >

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '80%',
                        height: '80%',
                    }}
                >


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
        margin:{bottom:'5%'}
    }}
    uiText={{value:"" + (pendingChance && pendingChance.name), textAlign:'middle-center', fontSize:sizeFont(35,25)}}
/>
                    
            
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '7%',
                        }}
                        uiText={{value:"Send NFTs", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(30,20)}}
                    />

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '7%',
    margin:{bottom:"5%"}
}}
uiText={{value:"Please click on each NFT to send to the CHANCE system.", textAlign:'top-center', fontSize:sizeFont(25,15)}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '7%',
    margin:{bottom:"5%"}
}}
uiText={{value:"Chance Items: " + (pendingChance && pendingChance.items.length), textAlign:'top-center', fontSize:sizeFont(30,20)}}
/>


<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '7%',
    margin:{bottom:"5%"}
}}
uiText={{value:"Items Received: " + (pendingChance && (pendingChance.itemsReceived.length + "/"+ pendingChance.items.length)), textAlign:'top-center', fontSize:sizeFont(30,20)}}
/>

<UiEntity
    uiTransform={{
        display: show ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
    }}
    uiText={{value:"Page: " + pageNumber, textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
/>

<UiEntity
                  uiTransform={{
                    display: loading ? "none" : "flex", 
                    width: '100%',
                    height: '10%',
                    flexDirection:'row',
                    justifyContent:'center',
                  }}
                  // uiBackground={{color:Color4.Teal()}}
                >
                  <UiEntity
                    uiTransform={{
                    width: calculateImageDimensions(5, 369/129).height,
                    height: calculateImageDimensions(5, 369/129).height,
            
                    flexDirection:'column',
                    justifyContent:'center',
                    alignContent:'center',
                    margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode:'stretch',
                        texture: {
                        src: resources.textures.atlas2
                        },
                        uvs: getImageAtlasMapping(uiSizes.leftArrow)
                    }}
                    uiText={{value:"<", fontSize:sizeFont(20, 10), color:Color4.White()}}
                    onMouseDown={()=>{
                      if(pageNumber - 1 >= 1){
                         updateStorePage(pageNumber - 1)
                         updateResults(true, true)
                      }
                      else{
                        updateStorePage(1)
                      }
                    }}
            />
            <UiEntity
                    uiTransform={{
                    width: calculateImageDimensions(5, 369/129).height,
                    height: calculateImageDimensions(5, 369/129).height,
            
                    flexDirection:'column',
                    justifyContent:'center',
                    alignContent:'center',
                    margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode:'stretch',
                        texture: {
                        src: resources.textures.atlas2
                        },
                        uvs: getImageAtlasMapping(uiSizes.rightArrow)
                    }}
                    uiText={{value:">", fontSize:sizeFont(20, 10), color:Color4.White()}}
                    onMouseDown={()=>{
                      updateStorePage(pageNumber + 1)
                      if(resultItems.length >= pageNumber * 9){
                        updateResults(true, true)
                      }
                      else{
                         updateStoreSkip(24)
                         updateResults(undefined, true)
                      }
                    }}
            />
    </UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '20%',
        positionType:'absolute',
        position:{bottom:"10%"}
    }}
>
<CustomButton
width={10}
        margin={'1%'}
        label={"Send Later"}
        func={()=>{
            showSendChancItemsUI(false)
            updateStoreView("main")
        }}
    />

<CustomButton
width={10}
        margin={'1%'}
        label={"Cancel CHANCE"}
        func={()=>{
            showSendChancItemsUI(false)
            updateStoreView("main")
        }}
    />
</UiEntity>

            </UiEntity>
    

    
    </UiEntity>

        <ResultsPanel
        viewOverride
            onClickFn={sendItem}
            items={visibleItems}
            type={"nft-card"}
            /> 

        </UiEntity>


        </UiEntity>
    )
}

export async function sendItem(item:any){
    console.log('sending item', item)

    if(item.chanceStatus === "DONE"){
        return
    }
    
    item.chanceStatus = "SENDING"

    if(resources.DEBUG){
        completeItem(item)
    }
    else{
        let { collection } = await createComponents(item.contractAddress)
        try{
            let result:any = await collection.transferNFT(lotteryWallet, "" + item.contractAddress, item.tokenId)
            console.log('send nft result is', result)
    
            if(result.code || result === "error"){
                item.chanceStatus = "ERROR"
                return
            }
    
            completeItem(item)
        }
        catch(e){
            console.log('error transferring nft', e)
            item.chanceStatus = "NEED TO SEND"
        }
    }
}

function completeItem(item:any){
    item.chanceStatus = "DONE"        
    pendingChance.itemsReceived.push(item)

    console.log('pending chance is', pendingChance)

    if(pendingChance.items.length === pendingChance.itemsReceived.length){
        console.log('all items are sent')
        showSendChancItemsUI(false)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your " + pendingChance.name + " CHANCE is live!", animate:{enabled:true, return:true, time:5}})

        let lottery = lotteries.find((lottery:any)=> lottery.id === pendingChance.id)
        if(!lottery){
            return
        }
        console.log('lottery found to update')
        lottery.status = "active"
    }
}

async function fetchPendingChanceItems(chance:any){
    console.log('get chance pending items', chance)
    for(let i = 0; i < chance.items.length; i++){
        let item = chance.items[i]
        let data:any
        if(resources.DEBUG){
            data = {...testStoreItems.data[0]}
        }else{
            let url = "https://marketplace-api.decentraland.org/v1/nfts?contractAddress="+item.split(":")[0] + "&tokenId=" + item.split(":")[1]
            try{
                let res = await fetch(resources.DEBUG ? resources.endpoints.proxy + url : url)
                let json = await res.json()
                console.log('fetch item json is', json)
                data = json.data[0]
            }
            catch(e){
                console.log('errorfetching pending chance item', e)
            }
        }

        if(data){
            let itemSplit = item.split(":")
            let truncatedItem = itemSplit[0] + ":" + itemSplit[1]
            console.log('truncated item is', truncatedItem)
            
            // data = ""
    
            if(chance.itemsReceived.includes(truncatedItem)){
                // console.log('item found')
                // pendingItems.push("DONE")
                data.nft.chanceStatus = "DONE"
            }else{
                // console.log('item not found')
                data.nft.chanceStatus = "NEED TO SEND"
                // pendingItems.push('PENDING')
            }
            selectedItems.push(data)
        }
    }
    // chance.items.forEach(async(item:any, i:number)=>{
    //     let data:any
    //     if(resources.DEBUG){
    //     //     data = {...testStoreItems.data[0]}
    //     // }else{
    //         let url = "https://marketplace-api.decentraland.org/v1/nfts?contractAddress="+item.split(":")[0] + "&tokenId=" + item.split(":")[1]
    //         try{
    //             let res = await fetch(resources.DEBUG ? resources.endpoints.proxy + url : url)
    //             let json = await res.json()
    //             console.log('fetch item json is', json)
    //             data = json.data[0]
    //         }
    //         catch(e){
    //             console.log('errorfetching pending chance item', e)
    //         }
    //     }

    //     if(data){
    //         let itemSplit = item.split(":")
    //         let truncatedItem = itemSplit[0] + ":" + itemSplit[1]
    //         console.log('truncated item is', truncatedItem)
            
    //         // data = ""
    
    //         if(chance.itemsReceived.includes(truncatedItem)){
    //             // console.log('item found')
    //             // pendingItems.push("DONE")
    //             data.nft.chanceStatus = "DONE"
    //         }else{
    //             // console.log('item not found')
    //             data.nft.chanceStatus = "PENDING"
    //             // pendingItems.push('PENDING')
    //         }
    //         pendingItems.push(data)
    //     }
    // })
    loading = false
    // updatePendingItemsPage()
}