import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { AspectRatio, AspectRatioSizes, dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';
import { sendServerMessage } from '../server';
import { BLOCKCHAINS, NFT_FRAMES, NFT_TYPES, SERVER_MESSAGE_TYPES } from '../helpers/types';
import { movePlayerTo, openExternalUrl } from '~system/RestrictedActions';
import { Transform, VisibilityComponent } from '@dcl/sdk/ecs';
import { formatTimeToHHMM, formatUnixTimestamp } from '../helpers/functions';
import { editEntities, entities, updateLocationMaterial } from '../mainGallery';
import { showLogo } from './logo';
import { shops, updateImageAspect, userShopReservation } from '../shops';

export let showingShopAdminPanel = false
export let view = "main"
export let assetTypes:any[] = ["Change Asset Type", "Image", "Video", "NFT"]

export let locations:any[] = []
export let selectedIndex:number = 0
export let selectedMannequinIndex:number = 0
export let shopId:number = 0
export let selectedItem:any
export let selectedMannequin:any
export let fixedAssetLocations:any[] = [0,1,2,3,26,27,28,29]
let newWearable:string = ""

export let mannequins:any[] = []

export function updateLocations(override?:boolean){
    locations.length = 0
    mannequins.length = 0

    if(!override){
        selectedIndex = 0
        selectedMannequinIndex = 0
    }
    
    let shop = shops.get(userShopReservation.shopId)
    if(!shop){
        return
    }

    shop.editImages.forEach((config:any, id:number)=>{
        locations.push(config)
    })
    locations.unshift({label:"Select image to edit"})
    console.log('locations are', locations)

    shop.mannequins.forEach((man:any)=>{
        mannequins.push(man)
    })
    mannequins.unshift({name:"Select Mannequin to edit"})
    console.log('Mannequin are', locations)

    shop.editImages.forEach((config:any, id:number)=>{
        VisibilityComponent.createOrReplace(config.parent, {visible:config.v})
        VisibilityComponent.createOrReplace(config.ent, {visible:config.v})
        updateLocationMaterial(config)
        console.log('updating edit image locaiton aspect', config)//
        updateImageAspect(config)
    })
}

export async function showShopReservationAdminPanel(value:boolean){
    showingShopAdminPanel = value

    shopId = userShopReservation.shopId

    let shop = shops.get(userShopReservation.shopId)
    if(!shop){
        console.log('no shop reservation panel')
        return
    }

    if(showingShopAdminPanel){
        shop.images.forEach((config:any, id:number)=>{//
            VisibilityComponent.createOrReplace(config.ent, {visible:false})
            VisibilityComponent.createOrReplace(config.parent, {visible:false})
        })
        updateLocations()
    }else{
        console.log('hiding all edit images')
        shop.editImages.forEach((config:any, id:number)=>{
            VisibilityComponent.createOrReplace(config.parent, {visible:false})
            VisibilityComponent.createOrReplace(config.ent, {visible:false})
        })

        shop.images.forEach((config:any, id:number)=>{
            VisibilityComponent.createOrReplace(config.ent, {visible:config.v})
            VisibilityComponent.createOrReplace(config.parent, {visible:config.v})
        })
        view = "main"
    }
}

export function updateEditMannequin(updatedMannequin:any){
    selectedMannequin = updatedMannequin
}

export function createShopReservationAdmin() {
    return (
        <UiEntity
            key={resources.slug + "admin-shop-reservation-panel"}
            uiTransform={{
                display: showingShopAdminPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(25, 446 / 431).width,
                height: calculateImageDimensions(45, 446 / 431).height,
                positionType: 'absolute',
                position: {right: '3%', bottom: '3%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
            }}
        >


            {/* main holder */}
            <UiEntity
        uiTransform={{
            display: view === "main" ? 'flex' : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '90%',
            height: '90%',
        }}
    >

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Shop " +  (userShopReservation && userShopReservation.shopId)  + " Editor", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
    />

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '5%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Reservation Starts: " + (userShopReservation ? (formatUnixTimestamp(userShopReservation.startDate) + " - "  + formatTimeToHHMM(userShopReservation.startDate)): ""), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
    />

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '5%',
            margin:{bottom:'3%'}
        }}
        uiText={{value:"Reservation Ends: " + (userShopReservation ? (formatUnixTimestamp(userShopReservation.endDate) + " - "  + formatTimeToHHMM(userShopReservation.endDate)): ""), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
    />


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '7%',
        margin: {top: "2%"}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Shop Layouts", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        view = "layouts"
    }}
/>


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '7%',
        margin: {top: "2%"}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Images", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        view = "images"
    }}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '7%',
        margin: {top: "2%"}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Mannequins", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        view = "mannequin"
    }}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '7%',
        margin: {top: "2%"}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Audio", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        view = "audio"
    }}
/>

{/* <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '7%',
        margin: {top: "2%"}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Other", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        view = "video"
    }}
/> */}

<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '10%',
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
uiText={{textWrap:'nowrap',value:"Elevator", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
}}
>
<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'images/atlas2.png'
            },
            uvs: userShopReservation && userShopReservation.shopId > 0 && shops.get(userShopReservation.shopId).elevator ?  getImageAtlasMapping(uiSizes.toggleOnTrans)  :getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            sendServerMessage('shop-toggle-elevator', {reservationId:userShopReservation.id, shopId:userShopReservation.shopId})
        }}
        />
    </UiEntity>
</UiEntity>


{/* buttons */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '10%',
    positionType:'absolute',
    position:{bottom:'3%', left:'7%'}
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          height: calculateImageDimensions( 7,getAspect(uiSizes.buttonPillBlack)).height,
          margin: {top:"5%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
      }}
      onMouseDown={async () => {
        showLogo(false)
        await showShopReservationAdminPanel(false)
        sendServerMessage('cancel-shop-reservation', userShopReservation.shopId)
      }}
      uiText={{value: "Cancel Reservation", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          height: calculateImageDimensions( 7,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"5%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        showShopReservationAdminPanel(false)
      }}
      uiText={{textWrap:'nowrap',  value: "Close", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

    </UiEntity>

<ImageEditorPanel/>
<MannequinEditorPanel/>
<MannequinEditorWearablesPanel/>
<MannequinEditorConfigPanel/>
<AudioEditorPanel/>

{/* global back button */}
    <UiEntity
uiTransform={{
    display: view !== "main" ? "flex" : "none",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: calculateImageDimensions(2, getAspect(uiSizes.backButton)).width,
    height: calculateImageDimensions(2, getAspect(uiSizes.backButton)).height,
    positionType:'absolute',
    position:{top:'5%', right:'10%'}
}}
uiBackground={{
    textureMode: 'stretch',
    texture: {
        src: 'images/atlas2.png'
    },
    uvs: getImageAtlasMapping(uiSizes.backButton)
}}
onMouseDown={() => {
    if(view === "wearables" || view === "man-config"){
        view = "mannequin"
        return
    }
    view = 'main'
}}
/>
        </UiEntity>
    );
}

function ImageEditorPanel(){
    return(
        <UiEntity
        key={resources.slug + "image::editor::panel"}
        uiTransform={{
            display: view === "images" ? 'flex' : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '90%',
            height: '90%',
        }}
    >

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Shop Image Editor", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
    />

<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width:'90%',
          height:'10%',
          margin: {top:"1%", bottom:'1%'},
      }}
      uiText={{textWrap:'nowrap',  value: "Choose Image Location", color:Color4.White(), fontSize:sizeFont(25,15), textAlign:'middle-left'}}
      />

<Dropdown
        options={[...locations.map(l => l.label)]}
        onChange={(index:number)=>{
            selectedIndex = index
            if(index === 0){
                selectedItem = undefined
            }else{
                selectedItem = locations[index]
                console.log('selected item', selectedItem)
                // let location = locations[index]
                // let entity = editEntities.get(location.id)
                // if(!entity){
                //     return
                // }
                // let transform = Transform.get(entity.parent).position
                // movePlayerTo({newRelativePosition:location.move, cameraTarget:{x:transform.x, y:transform.y, z:transform.z}})
            }
        }}
        uiTransform={{
        width: '90%',
        height: '7%',
        margin:{bottom:'1%'}
        }}
        fontSize={sizeFont(25,15)}
        color={Color4.White()}
        />
{/* 
<UiEntity
        uiTransform={{
            display: selectedIndex === 0 ? 'none': 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
        }}
        uiText={{value:"Asset Type: " + (selectedItem ? assetTypes[selectedItem.t + 1] : ""), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(20,15)}}
    />

<Dropdown
        options={[...assetTypes]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){}
            else{//
                    selectedItem.t = index-1
                    if(selectedItem.t === 2){
                        selectedItem.nft = {
                            c:"0x06012c8cf97bead5deae237070f9587f8e7a266d", tid:"558536", b:1, p:0
                        }
                    }else{
                        delete selectedItem.nft
                    }    
                    sendServerMessage('art-gallery-image-update', {
                        reservationId:userShopReservation.id, 
                        t:selectedItem.t, 
                        id: locations[selectedIndex].id,
                        nft: selectedItem.nft
                    })
            }
        }}
        uiTransform={{
        width: '90%',
        height: '7%',
        margin:{bottom:'3%'},
        display: fixedAssetLocations.includes(selectedIndex) ? 'none' : 'flex'
        }}
        fontSize={sizeFont(25,15)}
        color={Color4.White()}
        /> */}

{/* 
<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            display: fixedAssetLocations.includes(selectedIndex) ? 'none' : 'flex'//
        }}
        uiText={{value:"Asset Border: " + (selectedItem ? Object.values(NFT_FRAMES)[selectedItem.b] : ""), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(20,15)}}
    />

<Dropdown
        options={[...["Change Asset Border"],...Object.values(NFT_FRAMES)]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){}
            else{
                    selectedItem.b = index-1
                    sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, b:selectedItem.b, id: selectedItem.id})
            }
        }}
        uiTransform={{
        width: '90%',
        height: '7%',
        margin:{bottom:'3%'},
        display: fixedAssetLocations.includes(selectedIndex) ? 'none' : 'flex'
        }}
        fontSize={sizeFont(25,15)}
        color={Color4.White()}
        /> */}

{/* <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"URL: " + selectedSrc, textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
    /> */}



<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width:'90%',
          height:'10%',
          margin: {top:"1%"},
          display: selectedItem ? "flex" : "none"
      }}
      uiText={{textWrap:'nowrap',  value: "Choose Image Aspect", color:Color4.White(), fontSize:sizeFont(25,15), textAlign:'middle-left'}}
      />

<Dropdown
        options={[...Object.keys(AspectRatio).filter(key => isNaN(Number(key)))]}
        onChange={(index:number)=>{
            const selectedAspect = [...Object.keys(AspectRatio).filter(key => isNaN(Number(key)))][index];
            console.log('selected aspect', selectedAspect)
            sendServerMessage('shop-image-update', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, id: selectedItem.id, a:selectedAspect })

        }}
        selectedIndex={selectedItem ? [...Object.keys(AspectRatio).filter(key => isNaN(Number(key)))].indexOf(selectedItem.a) : 0}
        uiTransform={{
        width: '90%',
        height: '7%',
        margin:{bottom:'1%'},
        display: selectedItem ? "flex" : "none"
        }}
        fontSize={sizeFont(25,15)}
        color={Color4.White()}
        />


{/* img url row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: selectedItem && selectedItem.t === 0 ? "flex" : "none"
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
>

<Input
    onChange={(value:string)=>{
        selectedItem.src = value.trim()
    }}
    onSubmit={(value:string)=>{
        selectedItem.src = value.trim()
        sendServerMessage('shop-image-update', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, src:selectedItem.src, id: locations[selectedIndex].id})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'image url'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '90%',
        height: '100%',
    }}
    ></Input>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        sendServerMessage('shop-image-update', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, src:selectedItem.src, id: locations[selectedIndex].id})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

{/* contract address row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: selectedItem && selectedItem.t === 2 ? "flex" : "none"
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
>

<Input
    onChange={(value:string)=>{
        selectedItem.nft.c = value.trim()
    }}
    onSubmit={(value:string)=>{
        selectedItem.nft.c = value.trim()
        sendServerMessage('art-gallery-image-update', {shopId:userShopReservation.shopId,reservationId:userShopReservation.id, nft:selectedItem.nft, id: selectedItem.id})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'contract address'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '90%',
        height: '100%',
    }}
    ></Input>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, nft:selectedItem.nft, id: selectedItem.id})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

{/* token id row row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: selectedItem && selectedItem.t === 2 ? "flex" : "none"
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
>

<Input
    onChange={(value:string)=>{
        selectedItem.nft.tid = value.trim()
    }}
    onSubmit={(value:string)=>{
        selectedItem.nft.tid = value.trim()
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, nft:selectedItem.nft, id: selectedItem.id})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'token id'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '90%',
        height: '100%',
    }}
    ></Input>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, nft:selectedItem.nft, id: selectedItem.id})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

{/* blockchain and protocol row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: selectedItem && selectedItem.t === 2 ? "flex" : "none"
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<Dropdown
        options={[...["Change Chain"],...Object.values(BLOCKCHAINS)]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){}
            else{
                    selectedItem.nft.b = index-1
                    sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, nft:selectedItem.nft, id: selectedItem.id})
            }
        }}
        uiTransform={{
        width: '90%',
        height: '100%',
        }}
        fontSize={sizeFont(25,15)}
        color={Color4.White()}
        />
</UiEntity>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<Dropdown
        options={[...["Change Type"],...Object.values(NFT_TYPES)]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){}
            else{
                    selectedItem.nft.p = index-1
                    sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, nft:selectedItem.nft, id: selectedItem.id})
            }
        }}
        uiTransform={{
        width: '90%',
        height: '100%',
        }}
        fontSize={sizeFont(25,15)}
        color={Color4.White()}
        />
</UiEntity>

</UiEntity>

{/* visibility && clickable row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: selectedIndex !== 0 ? "flex" : "none"
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
        uiText={{textWrap:'nowrap',value:"Visibility", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

    </UiEntity>

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
}}
>
<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'images/atlas2.png'
            },
            uvs: selectedIndex > 0 ? locations[selectedIndex].v ?  getImageAtlasMapping(uiSizes.toggleOnTrans)  :getImageAtlasMapping(uiSizes.toggleOffTrans)  : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            sendServerMessage('shop-image-update', {reservationId:userShopReservation.id, shopId:userShopReservation.shopId, v:!locations[selectedIndex].v, id: locations[selectedIndex].id})
        }}
        />
    </UiEntity>
    </UiEntity>

    {/* <UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '15%',
}}
uiText={{textWrap:'nowrap',value:"Clickable", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

    </UiEntity>

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
}}
>
<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'images/atlas2.png'
            },
            uvs: selectedIndex > 0 ? selectedItem.c ?  getImageAtlasMapping(uiSizes.toggleOnTrans)  :getImageAtlasMapping(uiSizes.toggleOffTrans)  : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, c:!selectedItem.c, id: selectedItem.id})
        }}
        />
    </UiEntity>
    </UiEntity> */}


</UiEntity>


{/* pbr row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: selectedIndex !== 0 ? "flex" : "none"
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',////
}}
>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
        uiText={{textWrap:'nowrap',value:"Transparency", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

    </UiEntity>

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
}}
>
<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'images/atlas2.png'
            },
            uvs: selectedIndex > 0 ? locations[selectedIndex].m === 0 ?  getImageAtlasMapping(uiSizes.toggleOnTrans)  :getImageAtlasMapping(uiSizes.toggleOffTrans)  : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            sendServerMessage('shop-image-update', {reservationId:userShopReservation.id, shopId:userShopReservation.shopId, m:locations[selectedIndex].m === 1 ? 0 : 1, id: locations[selectedIndex].id})
        }}
        />
    </UiEntity>
    </UiEntity>


</UiEntity>

{/* title row */}
<UiEntity
uiTransform={{
    display: selectedItem && selectedItem.c ? "flex" :"none",
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    margin:{bottom:'1%'}
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
>

<Input
    onChange={(value:string)=>{
        selectedItem.ti = value.trim()
    }}
    onSubmit={(value:string)=>{
        selectedItem.ti = value.trim()
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, ti:selectedItem.ti, id: selectedItem.id})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'title info'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '90%',
        height: '100%',
    }}
    ></Input>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, ti:selectedItem.ti, id: selectedItem.id})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

{/* description row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: selectedItem && selectedItem.c ? "flex" :"none",
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
>

<Input
    onChange={(value:string)=>{
        selectedItem.desc = value.trim()
    }}
    onSubmit={(value:string)=>{
        selectedItem.desc = value.trim()
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, desc:selectedItem.desc, id: selectedItem.id})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'description info'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '90%',
        height: '100%',
    }}
    ></Input>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, desc:selectedItem.desc, id: selectedItem.id})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

{/* link row */}
{/* <UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
>

<Input
    onChange={(value:string)=>{
        selectedItem.src = value.trim()
    }}
    onSubmit={(value:string)=>{
        selectedItem.src = value.trim()
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, src:selectedItem.src, id: locations[selectedIndex].id})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'link url'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '90%',
        height: '100%',
    }}
    ></Input>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        sendServerMessage('art-gallery-image-update', {reservationId:userShopReservation.id, src:selectedItem.src, id: locations[selectedIndex].id})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity> */}

</UiEntity>
    )
}

function MannequinEditorPanel(){
    return(
<UiEntity
key={resources.slug + "mannequin::editor::panel"}
        uiTransform={{
            display: view === "mannequin" ? 'flex' : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '90%',
            height: '90%',
        }}
    >

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Mannequin Editor", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
    />

<Dropdown
        options={[...mannequins.map(m => m.name)]}
        onChange={(index:number)=>{
            // selectedIndex = index
            if(index === 0){
                selectedMannequin = undefined
            }else{
                selectedMannequin = mannequins[index]
                console.log('selectedMannequin', mannequins[index])
                // let location = locations[index]
                // let entity = editEntities.get(location.id)
                // if(!entity){
                //     return
                // }
                // let transform = Transform.get(entity.parent).position
                // movePlayerTo({newRelativePosition:location.move, cameraTarget:{x:transform.x, y:transform.y, z:transform.z}})
            }
        }}
        uiTransform={{
        width: '90%',
        height: '7%',
        margin:{bottom:'3%'}
        }}
        fontSize={sizeFont(25,15)}
        color={Color4.White()}
        />


<UiEntity
        uiTransform={{
            display: selectedMannequin || selectedMannequin !== undefined ? 'flex' :'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '86%',
        }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '7%',
        margin: {top: "2%"}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Wearables", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        view = "wearables"
    }}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '7%',
        margin: {top: "2%"}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Configuration", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        view = "man-config"
    }}
/>

    </UiEntity>

</UiEntity>
    )
}

function MannequinEditorConfigPanel(){
    return(
<UiEntity
key={resources.slug + "mannequin::editor::config::panel"}
        uiTransform={{
            display: view === "man-config" ? 'flex' : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '90%',
            height: '90%',
        }}
    >

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Mannequin Configuration", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
    />

<UiEntity
        uiTransform={{
            display: selectedMannequin || selectedMannequin !== undefined ? 'flex' :'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '86%',
        }}
    >

        {/* visibility && clickable row */}
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: selectedMannequin || selectedMannequin !== undefined ? "flex" : "none"
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
        uiText={{textWrap:'nowrap',value:"Visibility", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

    </UiEntity>

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
}}
>
<UiEntity
        uiTransform={{//
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'images/atlas2.png'
            },
            uvs: (selectedMannequin || selectedMannequin !== undefined) && selectedMannequin.v ?  getImageAtlasMapping(uiSizes.toggleOnTrans)  :getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            selectedMannequin.v = !selectedMannequin.v
            sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, v:selectedMannequin.v})
        }}
        />
    </UiEntity>
    </UiEntity>

    <UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
}}
>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
        uiText={{textWrap:'nowrap',value:"Male", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

    </UiEntity>

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
}}
>
<UiEntity
        uiTransform={{//
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'images/atlas2.png'
            },
            uvs: (selectedMannequin || selectedMannequin !== undefined) && selectedMannequin.b === "M" ?  getImageAtlasMapping(uiSizes.toggleOnTrans)  :getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            selectedMannequin.b = selectedMannequin.b === "F" ? "M" : "F"
            sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, b:selectedMannequin.b})
        }}
        />
    </UiEntity>
    </UiEntity>


</UiEntity>

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
        }}
        uiText={{value:"Name " + (selectedMannequin ? selectedMannequin.name: ""), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(20,15)}}
    />

{/* name entry row */}
<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
        }}
    >

<Input
    onChange={(value:string)=>{
        selectedMannequin.name = value.trim()
    }}
    onSubmit={(value:string)=>{
        selectedMannequin.name = value.trim()
        sendServerMessage('shop-mannequin-update', {manId: selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id,  name:selectedMannequin.name})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'Mannequin name'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '70%',
        height: '100%',
    }}
    ></Input>

<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
        }}
    >

<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
        uiText={{textWrap:'nowrap', value:"Update", fontSize:sizeFont(20,15)}}
        onMouseDown={()=>{
            sendServerMessage('shop-mannequin-update', {manId: selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id,  name:selectedMannequin.name})
        }}
    />

    </UiEntity>

    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
        }}
        uiText={{value:"Skin Color", textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(20,15)}}
    />


{/* skin color entry row */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '12%',
        }}
    >

        {/* red row */}
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
        uiText={{value:"Red: " + (selectedMannequin ? selectedMannequin.skinColor.r : ""), fontSize:sizeFont(20,15)}}
        />

<Input
    onChange={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.skinColor.r = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, skinColor:selectedMannequin.skinColor})

    }}
    onSubmit={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.skinColor.r = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, skinColor:selectedMannequin.skinColor})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'0-255'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '100%',
        height: '50%',
    }}
    ></Input>

        </UiEntity>

        {/* green row */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
        uiText={{value:"Green: " + (selectedMannequin ? selectedMannequin.skinColor.g : ""), fontSize:sizeFont(20,15)}}
        />

<Input
    onChange={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.skinColor.g = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, skinColor:selectedMannequin.skinColor})

    }}
    onSubmit={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.skinColor.g = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, skinColor:selectedMannequin.skinColor})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'0-255'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '100%',
        height: '50%',
    }}
    ></Input>

        </UiEntity>

        {/* blue row */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
        uiText={{value:"Blue: " + (selectedMannequin ? selectedMannequin.skinColor.b : ""), fontSize:sizeFont(20,15)}}
        />

<Input
    onChange={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.skinColor.b = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, skinColor:selectedMannequin.skinColor})

    }}
    onSubmit={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.skinColor.b = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, skinColor:selectedMannequin.skinColor})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'0-255'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '100%',
        height: '50%',
    }}
    ></Input>

        </UiEntity>


</UiEntity>



<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
        }}
        uiText={{value:"Hair Color", textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(20,15)}}
    />

{/* hair color entry row */}
<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '12%',
        }}
    >

        {/* red row */}
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
        uiText={{value:"Red: " + (selectedMannequin ? selectedMannequin.hairColor.r : ""), fontSize:sizeFont(20,15)}}
        />

<Input
    onChange={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.hairColor.r = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, hairColor:selectedMannequin.hairColor})

    }}
    onSubmit={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.hairColor.r = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, hairColor:selectedMannequin.hairColor})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'0-255'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '100%',
        height: '50%',
    }}
    ></Input>

        </UiEntity>

        {/* green row */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
        uiText={{value:"Green: " + (selectedMannequin ? selectedMannequin.hairColor.g : ""), fontSize:sizeFont(20,15)}}
        />

<Input
    onChange={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.hairColor.g = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, hairColor:selectedMannequin.hairColor})

    }}
    onSubmit={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.hairColor.g = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, hairColor:selectedMannequin.hairColor})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'0-255'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '100%',
        height: '50%',
    }}
    ></Input>

        </UiEntity>

        {/* blue row */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
        uiText={{value:"Blue: " + (selectedMannequin ? selectedMannequin.hairColor.b : ""), fontSize:sizeFont(20,15)}}
        />

<Input
    onChange={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.hairColor.b = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, hairColor:selectedMannequin.hairColor})

    }}
    onSubmit={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        selectedMannequin.hairColor.b = parseFloat(value.trim())
        sendServerMessage('shop-mannequin-update', {manId:selectedMannequin.id, shopId:userShopReservation.shopId, reservationId:userShopReservation.id, hairColor:selectedMannequin.hairColor})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'0-255'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '100%',
        height: '50%',
    }}
    ></Input>

        </UiEntity>


</UiEntity>

{/* eye color entry row */}

    </UiEntity>

</UiEntity>
    )
}

function MannequinEditorWearablesPanel(){
    return(
<UiEntity
key={resources.slug + "mannequin::editor::wearables::panel"}
        uiTransform={{
            display: view === "wearables" ? 'flex' : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '90%',
            height: '90%',
        }}
    >

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Mannequin Wearables", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
    />

<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    margin:{bottom:'2%'}
}}
>

<Input
    onChange={(value:string)=>{
        newWearable = value.trim()
    }}
    onSubmit={(value:string)=>{
        newWearable = value.trim()
        let items = newWearable.split("/")

        // setWearables((prevItems:any) => [...prevItems, "" + items[5] + ":" + items[7]]);
        // fetchWearableName(items[5] + ":" + items[7])
    
        sendServerMessage('shop-add-wearable', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, manId:selectedMannequin.id, wearable:items[5] + ":" + items[7]})
    
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'marketplace link'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '70%',
        height: '100%',
    }}
    ></Input>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        let items = newWearable.split("/")

        // setWearables((prevItems:any) => [...prevItems, "" + items[5] + ":" + items[7]]);
        // fetchWearableName(items[5] + ":" + items[7])//
    
        sendServerMessage('shop-add-wearable', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, manId:selectedMannequin.id, wearable:items[5] + ":" + items[7]})
    
      }}
      uiText={{textWrap:'nowrap',  value: "Add", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />

</UiEntity>

</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '90%',
        height: '80%',
    }}
>
    {
        view === "wearables" && 
        (selectedMannequin || selectedMannequin !== undefined) &&
        generateRows()
    }
</UiEntity>

    </UiEntity>
    )
}

function AudioEditorPanel(){
    return(
        <UiEntity
        key={resources.slug + "aduio::editor::panel"}
        uiTransform={{
            display: view === "audio" ? 'flex' : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '90%',
            height: '90%',
        }}
    >

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Shop Audio Editor", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
    />

<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '10%',
}}
>
<UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '70%',
    height: '100%',
}}
>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
        uiText={{textWrap:'nowrap',value:"Audio Enabled", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

    </UiEntity>

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
}}
>
<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'images/atlas2.png'
            },
            uvs: shopId !== 0 && shops.get(shopId).audio.e ?  getImageAtlasMapping(uiSizes.toggleOnTrans)  :getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            sendServerMessage('shop-audio-update', {reservationId:userShopReservation.id, shopId:userShopReservation.shopId, e:!shops.get(shopId).audio.e})
        }}
        />
    </UiEntity>
</UiEntity>

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'},
            display: shopId !== 0 && shops.get(shopId).audio.e ? "flex" : "none"
        }}
        uiText={{value:"Volume: " + (shopId !== 0 ? shops.get(shopId).audio.volume : 0), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
    />

<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: shopId !== 0 && shops.get(shopId).audio.e ? "flex" : "none"
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
>

<Input
    onChange={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        shops.get(shopId).audio.volume = parseFloat(value.trim())
    }}
    onSubmit={(value:string)=>{
        if(isNaN(parseFloat(value.trim()))){
            return
        }
        shops.get(shopId).audio.volume = parseFloat(value.trim())
        sendServerMessage('shop-audio-update', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, volume:shops.get(shopId).audio.volume})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'volume (0-1)'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '90%',
        height: '100%',
    }}
    ></Input>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        sendServerMessage('shop-audio-update', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, volume:shops.get(shopId).audio.volume})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'},
            display: shopId !== 0 && shops.get(shopId).audio.e ? "flex" : "none"
        }}
        uiText={{value:"Enter Audius Link", textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
    />

<UiEntity
uiTransform={{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    height: '7%',
    display: shopId !== 0 && shops.get(shopId).audio.e ? "flex" : "none"
}}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
>

<Input
    onChange={(value:string)=>{
        shops.get(shopId).audio.playlist = value.trim()
    }}
    onSubmit={(value:string)=>{
        shops.get(shopId).audio.playlist = value.trim()
        sendServerMessage('shop-audio-update', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, playlist:shops.get(shopId).audio.playlist})
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'playlist link'}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '90%',
        height: '100%',
    }}
    ></Input>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        sendServerMessage('shop-audio-update', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, playlist:shops.get(shopId).audio.playlist})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'1%'},
            display: shopId !== 0 && shops.get(shopId).audio.e ? "flex" : "none"
        }}
        uiText={{value:"" + (shopId !== 0 ? shops.get(shopId).audio.playlist : ""), textAlign:'middle-left', fontSize:sizeFont(25,15)}}
    />


<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions( 5,getAspect(uiSizes.buttonPillBlue)).height,
          margin: {top:"1%", bottom:'1%'},
          display: shopId !== 0 && shops.get(shopId).audio.e ? "flex" : "none"
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'images/atlas2.png'
          },
          uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
      }}
      onMouseDown={() => {
        openExternalUrl({url:"" + shops.get(shopId).audio.playlist})
      }}
      uiText={{textWrap:'nowrap',  value: "View Playlist", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />

    </UiEntity>
    )
}

function generateRows(){
    let arr:any[] = []
    selectedMannequin.wearables.forEach((wearable:any, i:number)=>{
        arr.push(
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin:{top:'1%'}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'images/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
            >

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
        alignContent:'center',
        alignItems:"center",
    }}
>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent:'center',
        alignItems:"center",
         width: calculateSquareImageDimensions(6).width,
      height: calculateSquareImageDimensions(6).height
    }}
    uiBackground={{color:wearable.data ? dclColors[wearable.data.data.wearable.rarity] : Color4.Black()}}
>
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
         width: '95%',
      height: '95%'
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: wearable.data ? wearable.data.thumbnail : ""
        },
    }}
/>
</UiEntity>

</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '60%',
        height: '100%',
    }}
    uiText={{value:"" + wearable.data ? wearable.data.name : "", fontSize:sizeFont(20,15), textAlign:'top-left'}}
>
    
</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '10%',
        height: '100%',
        alignContent:'center',
        alignItems:"center",
        margin:{right:'1%'}
    }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent:'center',
        alignItems:"center",
         width: calculateSquareImageDimensions(3).width,
      height: calculateSquareImageDimensions(3).height
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'images/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.trashButton)
    }}
    onMouseDown={()=>{
        console.log('remove wearble from mann')
        sendServerMessage('shop-remove-wearable', {shopId:userShopReservation.shopId, reservationId:userShopReservation.id, manId:selectedMannequin.id, index:i})
    }}
    />
    
</UiEntity>


            </UiEntity>
        )
    })
    return arr
}