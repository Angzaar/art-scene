import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';
import { sendServerMessage } from '../server';
import { BLOCKCHAINS, NFT_FRAMES, NFT_TYPES, SERVER_MESSAGE_TYPES } from '../helpers/types';
import { movePlayerTo } from '~system/RestrictedActions';
import { Transform, VisibilityComponent } from '@dcl/sdk/ecs';
import { formatTimeToHHMM, formatUnixTimestamp } from '../helpers/functions';
import { editEntities, entities, updateLocationMaterial, userReservation } from '../mainGallery';
import { utils } from '../helpers/libraries';
import { showLogo } from './logo';

export let showingAdminPanel = false
export let view = "main"
export let assetTypes:any[] = ["Change Asset Type", "Image", "Video", "NFT"]

export let locations:any[] = []
export let selectedIndex:number = 0
// export let selectedSrc:string = "" 
export let selectedItem:any
export let fixedAssetLocations:any[] = [0,1,2,3,26,27,28,29]

export function updateLocations(override?:boolean){
    locations.length = 0

    editEntities.forEach((config:any, id:number)=>{
        locations.push(config)
    })
    locations.unshift({label:"Select image to edit"})
    console.log('locations are', locations)

    editEntities.forEach((config:any, id:number)=>{
        VisibilityComponent.createOrReplace(config.parent, {visible:config.v})
        VisibilityComponent.createOrReplace(config.ent, {visible:config.v})
        updateLocationMaterial(config)
    })
}

export async function showReservationAdminPanel(value:boolean){
    showingAdminPanel = value

    if(showingAdminPanel){
        entities.forEach((config:any, id:number)=>{
            VisibilityComponent.createOrReplace(config.ent, {visible:false})
            VisibilityComponent.createOrReplace(config.parent, {visible:false})
        })
        updateLocations()
    }else{
        editEntities.forEach((config:any, id:number)=>{
            VisibilityComponent.createOrReplace(config.parent, {visible:false})
            VisibilityComponent.createOrReplace(config.ent, {visible:false})
        })

        entities.forEach((config:any, id:number)=>{
            VisibilityComponent.createOrReplace(config.ent, {visible:config.v})
            VisibilityComponent.createOrReplace(config.parent, {visible:config.v})
        })
        view = "main"//
    }
}

export function createReservationAdmin() {
    return (
        <UiEntity
            key={resources.slug + "admin-reservation-panel"}
            uiTransform={{
                display: showingAdminPanel ? 'flex' : 'none',
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
        uiText={{value:"Art Gallery Editor", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
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
        uiText={{value:"Reservation Starts: " + (userReservation ? (formatUnixTimestamp(userReservation.startDate) + " - "  + formatTimeToHHMM(userReservation.startDate)): ""), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
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
        uiText={{value:"Reservation Ends: " + (userReservation ? (formatUnixTimestamp(userReservation.endDate) + " - "  + formatTimeToHHMM(userReservation.endDate)): ""), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
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
    uiText={{value: "Edit Assets", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        view = "images"
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
        await showReservationAdminPanel(false)
        sendServerMessage('cancel-art-gallery-reservation', userReservation.id)
      }}
      uiText={{textWrap:'nowrap',  value: "Cancel Reservation", color:Color4.White(), fontSize:sizeFont(25,15)}}
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
        showReservationAdminPanel(false)
      }}
      uiText={{textWrap:'nowrap',  value: "Close", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity>

    </UiEntity>


     {/* audio holder */}
     <UiEntity
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
        uiText={{value:"Art Gallery Editor", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
    />

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'3%'}
        }}
        uiText={{value:"Reservation Starts: ", textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
    />

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '7%',
            margin:{bottom:'3%'}
        }}
        uiText={{value:"Reservation Ends: ", textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(25,15)}}
    />


    </UiEntity>

{/* images holder */}
<UiEntity
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
        uiText={{value:"Art Gallery Editor", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(35,25)}}
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
                let location = locations[index]
                let entity = editEntities.get(location.id)
                if(!entity){
                    return
                }
                let transform = Transform.get(entity.parent).position
                movePlayerTo({newRelativePosition:location.move, cameraTarget:{x:transform.x, y:transform.y, z:transform.z}})
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
                        reservationId:userReservation.id, 
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
        />


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
                    sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, b:selectedItem.b, id: selectedItem.id})
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
        />

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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, src:selectedItem.src, id: locations[selectedIndex].id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, src:selectedItem.src, id: locations[selectedIndex].id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, nft:selectedItem.nft, id: selectedItem.id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, nft:selectedItem.nft, id: selectedItem.id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, nft:selectedItem.nft, id: selectedItem.id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, nft:selectedItem.nft, id: selectedItem.id})
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
                    sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, nft:selectedItem.nft, id: selectedItem.id})
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
                    sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, nft:selectedItem.nft, id: selectedItem.id})
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
            sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, v:!locations[selectedIndex].v, id: locations[selectedIndex].id})
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
            sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, c:!selectedItem.c, id: selectedItem.id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, ti:selectedItem.ti, id: selectedItem.id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, ti:selectedItem.ti, id: selectedItem.id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, desc:selectedItem.desc, id: selectedItem.id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, desc:selectedItem.desc, id: selectedItem.id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, src:selectedItem.src, id: locations[selectedIndex].id})
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
        sendServerMessage('art-gallery-image-update', {reservationId:userReservation.id, src:selectedItem.src, id: locations[selectedIndex].id})
      }}
      uiText={{textWrap:'nowrap',  value: "Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity> */}

</UiEntity>
{/* //end of images */}

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
    view = 'main'
}}
/>
        </UiEntity>
    );
}