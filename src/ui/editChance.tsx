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
import { paginateArray } from '../helpers/functions';
import { colyseusLottery, localUserId, lotteryRoom, sendServerMessage } from '../server';
import { testStoreItems } from '../testItems';
import { createComponents } from '../helpers/blockchain';
import { yourChances } from './createChanceUI';
import { lotteryWallet } from '../lottery';
import { queue, showNotification } from './NotificationPanel';
import { NOTIFICATION_TYPES } from '../helpers/types';
import { chanceName, cooldown, cooldownType, cost, creatorName, showCreateChanceUI, win, winType } from './createNewChance';
import { showSendChancItemsUI } from './sendChanceItems';

let pendingItemsPageNumber = 1
let show:boolean = false
let loading = false
let allDone = false

export let editChanceView = "edit"

export async function updateEditChanceview(view:string, pending?:any){
    editChanceView = view

    if(view === "edit"){
        loading = true
        await refreshStore()
        loading = false
    }

    if(pending){
        // loading = true
        // fetchPendingChanceItems(pendingChance)
    }

    // if(!view){
    //     loading = false
    // }
}

export function showEditChance(value:boolean){
    show = value
}

export function createEditChanceUI() {
    return (
        <UiEntity
            key={resources.slug + "edit::chance-ui"}
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
                display: editChanceView === "edit" ? "flex" : "none",
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
            // uiBackground={{
            //     textureMode:'stretch',
            //     texture: {
            //     src: resources.textures.atlas1
            //     },
            //     uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            // }}
            // uiBackground={{color:Color4.Green()}}
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
    uiText={{value:"" + chanceName, textAlign:'middle-center', fontSize:sizeFont(35,25)}}
/>
                    
            
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '7%',
                        }}
                        uiText={{value:"Choose NFTs", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(30,20)}}
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
uiText={{value:"Please choose at least 1 NFT to be a part of your chance", textAlign:'top-center', fontSize:sizeFont(25,15)}}
/>

<Input
    uiTransform={{
        width:'100%',
        height:"7%"
    }}
    onChange={(e)=>{
        updateStoreSearch(e.trim())
    }}
        onSubmit={(e) =>{ 
            updateStoreSearch(e.trim())
        }}
        fontSize={sizeFont(20,15)}
        color={Color4.White()}
        placeholder={"Search Nfts"}
        placeholderColor={Color4.White()}
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
uiText={{value:"Selected Items: " + selectedItems.length, textAlign:'top-center', fontSize:sizeFont(30,20)}}
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
                     updateResults(true)
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
                    updateResults(true)
                  }
                  else{
                     updateStoreSkip(24)
                     updateResults()
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
        margin={'1%'}
        label={"Send NFTs"}
        func={()=>{
            // updateEditChanceview("sending")
            updateStorePage(1)
            updateResults(false, true)
            editChanceView = "sending"
            // showEditChance(false)
            // updateStoreView("main")
            // showStoreUI(false)
            // showCreateChanceUI(true)
            showEditChance(false)
            // showSendChancItemsUI(true,{
            //     id:'new',
            //     name:chanceName,
            //     items:selectedItems.map((item:any)=> item.contractAddress + ":" + item.tokenId + ":" + item.itemId + ":" + item.data[item.category].rarity),
            //     owner:localUserId,
            //     chanceToWin:win,
            //     costToPlay:cost,
            //     status:"pending",
            //     queue:[],
            //     processing:false,
            //     itemsReceived:[],
            //     chances:0
            // })

            sendServerMessage("setup-lottery", {
                name:chanceName,
                owner:localUserId,
                chanceToWin:win,
                costToPlay:cost,
                cooldown:cooldown,
                cooldownType:cooldownType,
                type:winType,
                creator:creatorName,
                items: selectedItems.map((item:any)=> item.contractAddress + ":" + item.tokenId + ":" + item.itemId + ":" + item.data[item.category].rarity)
            }, colyseusLottery)
        
            selectedItems.forEach((item:any)=>{
                item.chanceStatus = "NEED TO SEND"
            })
        }}
    />

    <CustomButton
        margin={'1%'}
        label={"Go Back"}
        func={()=>{
            showEditChance(false)
            updateStoreView("main")
            showStoreUI(false)
            showCreateChanceUI(true)
        }}
    />
</UiEntity>

            </UiEntity>
    </UiEntity>

    <ResultsPanel
        onClickFn={selectItem}
        view={"edit"}
        storeView={editChanceView}
        loading={loading}
        items={visibleItems}
        type={"nft-card"}
        />

         <ResultsPanel
         view={"sending"}
         storeView={editChanceView}
        onClickFn={selectItem}
        items={paginateArray([...selectedItems], selectedItemPage, 9)}
        type={"nft-card"}
        /> 

        </UiEntity>


        </UiEntity>
    )
}

// function createChance(){
//     sendServerMessage("setup-lottery", {
//         name:chanceName,
//         owner:localUserId,
//         chanceToWin:win,
//         costToPlay:cost,
//         items: selectedItems.map((item:any)=> item.contractAddress + ":" + item.tokenId + ":" + item.itemId + ":" + item.data[item.category].rarity)
//     }, colyseusLottery)
//     editChanceView = "sending"
//     selectedItems.forEach((item:any)=>{
//         item.chanceStatus = "PENDING"
//     })
//     updateEditChanceview('sending', {
//         id:'new',
//         name:chanceName,
//         items:selectedItems.map((item:any)=> item.contractAddress + ":" + item.tokenId + ":" + item.itemId + ":" + item.data[item.category].rarity),
//         owner:localUserId,
//         chanceToWin:win,
//         costToPlay:cost,
//         status:"pending",
//         queue:[],
//         processing:false,
//         itemsReceived:[],
//         chances:0
//     })
// }
