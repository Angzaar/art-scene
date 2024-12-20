import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';
import { CustomButton } from './CustomButton';
import { selectedItemPage, selectedItems, selectItem, showStoreUI, storeView, updateStoreView } from './createStoreUI';
import { ResultsPanel } from './ResultsPanel';
import { paginateArray } from '../helpers/functions';
import { colyseusLottery, localUserId, lotteryRoom, sendServerMessage } from '../server';
import { testStoreItems } from '../testItems';
import { createComponents } from '../helpers/blockchain';
import { yourChances } from './createChanceUI';
import { lotteryWallet } from '../lottery';

let chanceName:string = ""
let cost:number = -1
let win:number = -1
let show:boolean = false
let loading = false
let allDone = false

export let editChanceView = "edit"
export let pendingChance:any

export function updateEditChanceview(view:string, pending?:any){
    editChanceView = view

    if(pending){
        pendingChance = pending.contractAddress + ":" + pending.tokenId
        loading = true
        fetchPendingChanceItems(pending)
    }

    if(!view){
        loading = false
    }
}

export function showChance(value:boolean){
    show = value

    if(!value){
        chanceName = ""
        cost = -1
        win = -1
        allDone = false
    }
}

export function createChanceUI() {
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
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '30%',
                height: '96%',
                margin:{left:'2%', top:'0%'}
            }}
            uiBackground={{
                textureMode:'stretch',
                texture: {
                src: resources.textures.atlas1
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '90%',
                        height: '100%',
                    }}
                >
            
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '7%',
                        }}
                        uiText={{value:"Edit CHANCE", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
                    />

                    <Input
                    uiTransform={{
                        width:'100%',
                        height:"7%"
                    }}
                    onChange={(e)=>{
                        chanceName = e.trim()
                    }}
                        onSubmit={(e) =>{ 
                            // updateStoreSearch(e.trim())
                            chanceName = e.trim()
                        }}
                        fontSize={sizeFont(20,15)}
                        color={Color4.White()}
                        placeholder={"CHANCE Name"}
                        placeholderColor={Color4.White()}
                        />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '5%',
        margin:{top:"2%"}
    }}
    uiText={{textWrap:'nowrap', value:"CHANCE Cost", fontSize:sizeFont(30,20), textAlign:'middle-left', color:Color4.White()}}
    /> 

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '5%',

    }}
    uiText={{value:"MANA  > 1, no decimals (eg 100)", fontSize:sizeFont(20,15), textAlign:'middle-left'}}
    />


<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '7%',
            margin:{top:"2%"}
        }}
    >

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            height: '100%',

        }}
    >
    <Input
    uiTransform={{
        width:'100%',
        height:"100%"
    }}
        onChange={(e)=>{
            cost = parseInt(e.trim())
        }}
        onSubmit={(e) =>{ 
            cost = parseInt(e.trim())
        }}
        fontSize={sizeFont(20,15)}
        color={Color4.White()}
        placeholder={"Enter Cost"}
        placeholderColor={Color4.White()}
        />

    </UiEntity>
    </UiEntity>


    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '5%',
        margin:{top:"2%"}
    }}
    uiText={{textWrap:'nowrap', value:"CHANCE Win %", fontSize:sizeFont(30,20), textAlign:'middle-left', color:Color4.White()}}
    /> 

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '5%',

    }}
    uiText={{value:"% chance (eg 55 or 75.5)", fontSize:sizeFont(20,15), textAlign:'middle-left'}}
    />


<UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: '7%',
                            margin:{top:"2%"}
                        }}
                    >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '70%',
                            height: '100%',

                        }}
                    >
                    <Input
                    uiTransform={{
                        width:'100%',
                        height:"100%"
                    }}
                    onChange={(e)=>{
                        win = parseFloat(e.trim())
                    }}
                    onSubmit={(e) =>{ 
                        win = parseFloat(e.trim())
                    }}
                        fontSize={sizeFont(20,15)}
                        color={Color4.White()}
                        placeholder={"Enter Win %"}
                        placeholderColor={Color4.White()}
                        />

                    </UiEntity>

                    </UiEntity>

    <CustomButton
        margin={'1%'}
        label={"Go Back"}
        func={()=>{
            showChance(false)
            updateStoreView("main")
            showStoreUI(true)
        }}
    />



    <CustomButton
        margin={'1%'}
        width="40%"
        label={"Create"}
        func={()=>{
            if(validateChance()){
                createChance()
            }else{
                console.log("error, not valid chance")
            }
        }}
            />


            </UiEntity>
    </UiEntity>

        <ResultsPanel
            viewOverride
            onClickFn={selectItem}
            items={paginateArray(selectedItems, selectedItemPage, 9)}
            type={"nft-card"}
            />
            

        </UiEntity>

        <UiEntity
            uiTransform={{
                display: editChanceView === "sending" ? "flex" : "none",
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
        >
    
    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '30%',
                height: '96%',
                margin:{left:'2%', top:'0%'}
            }}
            uiBackground={{
                textureMode:'stretch',
                texture: {
                src: resources.textures.atlas1
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '90%',
                        height: '100%',
                    }}
                >

{/* <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '7%',
            margin:{top:"5%"}
        }}
        uiText={{value:"CHANCE Pending!", textAlign:'middle-left', fontSize:sizeFont(35,25)}}
    /> */}
            
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '7%',
                            margin:{top:"5%"}
                        }}
                        uiText={{value:"CHANCE Pending!", textAlign:'middle-left', fontSize:sizeFont(35,25)}}
                    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
        margin:{top:"5%"}
    }}
    uiText={{value:"Please click on each nft to transfer to the CHANCE wallet. Your CHANCE will go live once all NFTs are received.", textAlign:'middle-left', fontSize:sizeFont(25,20)}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
        margin:{top:"15%"}//
    }}
    uiText={{value:"You may cancel your CHANCE at any time and your nfts will be returned to you.", textAlign:'middle-left', fontSize:sizeFont(25,20)}}
/>

<CustomButton
        customDisplay
        displayFunc={()=> {return allDone}}
        margin={'1%'}
        width="60%"
        label={"Send Later"}
        func={()=>{
            showChance(false)
            selectedItems.length = 0
        }}
            />

            </UiEntity>
    </UiEntity>

    <ResultsPanel
            viewOverride
            loading={loading}
            onClickFn={sendItem}
            items={paginateArray(selectedItems, selectedItemPage, 9)}
            type={"nft-card"}
            />
            

        </UiEntity>


        </UiEntity>
    )
}

function validateChance(){
    return chanceName !== "" && win >=0 && win <=100 && cost >=0
}

function createChance(){
    sendServerMessage("setup-lottery", {
        name:chanceName,
        owner:localUserId,
        chanceToWin:win,
        costToPlay:cost,
        items: selectedItems.map((item:any)=> item.contractAddress + ":" + item.tokenId + ":" + item.itemId + ":" + item.data[item.category].rarity)
    }, colyseusLottery)
    editChanceView = "sending"
    selectedItems.forEach((item:any)=>{
        item.chanceStatus = "PENDING"
    })
}

export async function sendItem(item:any){
    console.log('sending item', item)
    item.chanceStatus = "SENDING"

    let { collection } = await createComponents(item.contractAddress)
    try{
        let result:any = await collection.transferNFT(lotteryWallet, "" + item.contractAddress, item.tokenId)
        console.log('send nft result is', result)

        if(result.code || result === "error"){
            item.chanceStatus = "ERROR"
            return
        }

        item.chanceStatus = "DONE"
    
        let chanceEdit = yourChances.find((chance:any) => chance.id === pendingChance)
        if(!chanceEdit){
            console.log('chance edit does not exist')
            return
        }
    
        chanceEdit.itemsReceived.push(item)
    
        if(chanceEdit.items.length === chanceEdit.itemsReceived.length){
            console.log('all items are sent')
        }
    }
    catch(e){
        console.log('error transferring nft', e)
        item.chanceStatus = "PENDING"
    }
}

async function fetchPendingChanceItems(chance:any){
    chance.items.forEach(async(item:any, i:number)=>{
        let data:any
        if(resources.DEBUG){
            data = testStoreItems.data[i]
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
        
        if(chance.itemsReceived.includes(item)){
            data.chanceStatus = "DONE"
        }else{
            data.chanceStatus = "PENDING"
        }
        selectedItems.push(data)
    })
    loading = false
}