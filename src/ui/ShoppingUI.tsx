import * as utils from '@dcl-sdk/utils'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import resources, { dclColors } from '../helpers/resources'
import { calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import { uiSizes } from './uiConfig'
import { shopping, exitShopping, getCurrentPageItems, nextPage, previousPage, getCurrentPage, getTotalPages, formatPrice, getRarityColor, showWearableInfoView, hideWearableInfoView, getSelectedWearable, getSelectedCollection, getSelectedCreator, isWearableInfoShowing, viewWearable, isLoading, performWearableSearch, clearAvatar, resetAvatar, manaUSDPrice, getTotalSupply } from '../wearableStore'

let view = "marketplace"
let selectedWearable:any = null
let hover = false
let hoveredWearable:any = null  
let selectedRarities: string[] = []
let searchQuery: string = ""
let selectedCategory: string = "All"
let selectedNetwork: string = "All Networks"
let selectedBodyType: string = "All Body Types"
let confirmBuy = false

function setHover(wearableId:string, isHovering:boolean){
    if(isHovering){
        hoveredWearable = wearableId
    } else {
        hoveredWearable = null
    }
}

function toggleRarity(rarity: string) {
    const index = selectedRarities.indexOf(rarity)
    if (index > -1) {
        selectedRarities.splice(index, 1)
    } else {
        selectedRarities.push(rarity)
    }
    console.log('Selected rarities:', selectedRarities)
    
    // Trigger new search with updated rarities
    performSearch()
}

function performSearch() {
    console.log('Performing search with:', {
        query: searchQuery,
        category: selectedCategory,
        rarities: selectedRarities,
        network: selectedNetwork,
        bodyType: selectedBodyType
    })
    
    console.log('🔍 Raw searchQuery value:', `"${searchQuery}"`)
    console.log('🔍 Trimmed searchQuery:', `"${searchQuery.trim()}"`)
    
    // Call the wearableStore search function
    performWearableSearch({
        query: searchQuery.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        rarities: selectedRarities.length > 0 ? selectedRarities : undefined,
        network: selectedNetwork !== 'All Networks' ? selectedNetwork : undefined,
        bodyType: selectedBodyType !== 'All Body Types' ? selectedBodyType : undefined
    })
}

function setSelectedWearable(wearable:any){
    selectedWearable = wearable
    view = "wearable-info"
}

function unsetSelectedWearable(){
    selectedWearable = null
    view = "marketplace"
}

export function createShoppingUI(){
    const selectedWearable = getSelectedWearable()
    const showInfo = isWearableInfoShowing()
    
    return (
      <UiEntity key={"" + resources.slug + "shopping::ui"}
        uiTransform={{
          width: '100%',
          height: '100%',
          display: shopping ? 'flex' : 'none',
        // display: 'none',
          justifyContent:'center',
          flexDirection:'row',
          alignItems:'center',
          alignContent:'center',
          positionType:'absolute',
        }}
      >
{/* Shop Container */}
<UiEntity
    uiTransform={{
    width: dimensions.width * 0.5,
    height: dimensions.height * 1,
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    positionType:'absolute',
    position: { right: 0 },
    padding: 20,
    }}
    uiBackground={{color:Color4.create(22/255,22/255,24/255, 1)}}
>

{/* loading container */}
<UiEntity
    uiTransform={{
    width: '100%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    display: isLoading ? 'flex' : 'none',
    }}
    uiText={{value:"Loading...", fontSize:sizeFont(55, 55), color:Color4.White(), textAlign:'middle-center'}}
/>

    {/* Marketplace Container */}
<UiEntity
    uiTransform={{
        width: '95%',
        height: '95%',
        display: view === "marketplace" && !isLoading ? 'flex' : 'none',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
    }}
    >

    {/* search filters */}
<UiEntity
        uiTransform={{
        width: '95%',
        height: '20%',
        justifyContent:'flex-start',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        }}
        // uiBackground={{color:Color4.Blue()}}
>
    {/* search inputs container */}
<UiEntity
        uiTransform={{
        width: '100%',
        height: '25%',
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
        }}
        // uiBackground={{color:Color4.Blue()}}
>

<UiEntity
        uiTransform={{
        width: '65%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
        }}
        // uiBackground={{color:Color4.Blue()}}
>
<UiEntity
        uiTransform={{
        width: '65%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Color4.White(),
        }}
        uiBackground={{color:Color4.create(37/255, 33/255, 41/255, 1)}}
>
     <Input
       color={Color4.Black()}
       onChange={(value) => {
         console.log('search input changed: ' + value)
         searchQuery = value
       }}
       onSubmit={(value) => {
         console.log('submitted value: ' + value)
         searchQuery = value
         performSearch()
       }}
       fontSize={sizeFont(35, 35)}
       placeholder={''}
       
       placeholderColor={Color4.Black()}
       uiTransform={{
         width: '90%',
         height: '90%',
       }}
       uiBackground={{color:Color4.create(37/255, 33/255, 41/255, 0)}}
     />
    </UiEntity>

    <UiEntity
        uiTransform={{
        width: '35%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
        margin:{left:'2%', right:'1%'},
        borderRadius: 20,
        borderWidth: 3,
        borderColor: Color4.White(),
        }}
        uiBackground={{color:Color4.create(1,46/255,81/255, 1)}}
        onMouseDown={()=>{
            console.log('clicked search')
            performSearch()
        }}
        uiText={{value:"Search", fontSize:sizeFont(35, 35), color:Color4.White(), textAlign:'middle-center'}}
>
    </UiEntity>

    </UiEntity>

    <UiEntity
        uiTransform={{
        width: '35%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        }}
        // uiBackground={{color:Color4.Blue()}}
>
 <Dropdown
      fontSize={sizeFont(55, 55)}
      uiTransform={{
      width: '100%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      alignItems:'center',
      alignContent:'center',
      }}
      onChange={(index:number)=>{
          console.log('selected index: ' + index)
          const categories = ['All', 'Head', 'Upper Body', 'Handwear', 'Lower Body', 'Feet', 'Accessories', 'Earring', 'Eyewear', 'Hat', 'Helmet', 'Mask', 'Tiara', 'Top Head', 'Skins']
          selectedCategory = categories[index]
          performSearch()
      }}
      options={[
          'All',
          'Head',
          'Upper Body', 
          'Handwear',
          'Lower Body',
          'Feet',
          'Accessories',
          'Earring',
          'Eyewear',
          'Hat',
          'Helmet',
          'Mask',
          'Tiara',
          'Top Head',
          'Skins'
      ]}
      />
</UiEntity>



    </UiEntity>

{/* rarity selectors container */}
<UiEntity
        uiTransform={{
        width: '100%',
        height: '20%',
        justifyContent:'flex-start',
        flexDirection:'row',
        alignItems:'flex-start',
        alignContent:'flex-start',
        flexWrap: 'wrap',
        margin:{top:'1%'},
        
        }}
        // uiBackground={{color:Color4.Blue()}}
>
    {/* Rarity Buttons */}
    {['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'unique'].map((rarity, index) => (
        <UiEntity
            key={rarity}
            uiTransform={{
            width: '12%',
            height: '100%',
            justifyContent:'center',
            flexDirection:'column',
            alignItems:'center',
            alignContent:'center',
            margin: { right: '1%', bottom: '2%' },
            borderRadius: 20,
            borderWidth: 2,
            borderColor: selectedRarities.includes(rarity) ? Color4.White() : Color4.create(0.5, 0.5, 0.5, 1),
            }}
            uiBackground={{
                color: selectedRarities.includes(rarity) 
                    ? getRarityColor(rarity) 
                    : Color4.create(0.2, 0.2, 0.2, 0.8)
            }}
            onMouseDown={() => {
                toggleRarity(rarity)
            }}
        >
            <UiEntity
                uiTransform={{
                width: '100%',
                height: '100%',
                justifyContent:'center',
                flexDirection:'column',
                alignItems:'center',
                alignContent:'center',
                }}
                uiText={{
                    value: rarity.charAt(0).toUpperCase() + rarity.slice(1), 
                    fontSize: sizeFont(25, 25), 
                    color: Color4.White(), 
                    textAlign: 'middle-center'
                }}
            />
        </UiEntity>
    ))}
</UiEntity>


{/* Wearable Status & Body Shape Row Container */}
<UiEntity
    uiTransform={{
    width: '100%',
    height: '15%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    margin:{top:'1%'},
    }}
>
<UiEntity
        uiTransform={{
        width: '33%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        margin:{right:'1%', left:'1%'},
        }}
        // uiBackground={{color:Color4.Blue()}}
>
 <Dropdown
      fontSize={sizeFont(55, 55)}
      uiTransform={{
      width: '100%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      alignItems:'center',
      alignContent:'center',
      }}
      onChange={(index:number)=>{
          console.log('selected network index: ' + index)
          const networks = ['All Networks', 'Eth', 'Polygon']
          selectedNetwork = networks[index]
          performSearch()
      }}
      options={[
          'All Networks',
          'Eth',
          'Polygon'
      ]}
      />
</UiEntity>

<UiEntity
        uiTransform={{
        width: '33%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        margin:{right:'1%', left:'1%'},
        }}
        // uiBackground={{color:Color4.Blue()}}
>
 <Dropdown
      fontSize={sizeFont(55, 55)}
      uiTransform={{
      width: '100%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      alignItems:'center',
      alignContent:'center',
      }}
      onChange={(index:number)=>{
          console.log('selected body type index: ' + index)
          const bodyTypes = ['All Body Types', 'BaseMale', 'BaseFemale']
          selectedBodyType = bodyTypes[index]
          performSearch()
      }}
      options={[
          'All Body Types',
          'BaseMale',
          'BaseFemale'
      ]}
      />
</UiEntity>

</UiEntity>

    
</UiEntity>

    {/* 3x3 Grid Container */}
    <UiEntity
        uiTransform={{
        width: '95%',
        height: '80%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        }}
    >

        {/* Grid Rows */}
        {Array.from({ length: 2 }, (_, rowIndex) => (
            <UiEntity
                key={`grid-row-${rowIndex}`}
                uiTransform={{
                width: '100%',
                height: `${100/2}%`,
                justifyContent:'space-between',
                flexDirection:'row',
                alignItems:'center',
                alignContent:'center',
                }}
            >
                {/* Grid Cells */}
                {Array.from({ length: 3 }, (_, colIndex) => {
                    const itemIndex = rowIndex * 3 + colIndex
                    const currentItems = getCurrentPageItems()
                    const wearable = currentItems[itemIndex]
                    
                    return (
                        <UiEntity
                            key={`grid-cell-${rowIndex}-${colIndex}`}
                            uiTransform={{
                            width: '30%',
                            height: '90%',
                            justifyContent:'center',
                            flexDirection:'column',
                            alignItems:'center',
                            alignContent:'center',
                            borderRadius: 20,
                                borderWidth: 5,
                                borderColor: Color4.create(37/255, 33/255, 41/255, 1)
                            }}
                            uiBackground={{
                                color: Color4.create(37/255, 33/255, 41/255, 1)
                            }}
                        >
                            {/* Image Square */}
                            <UiEntity
                                uiTransform={{
                                width: '100%',
                                height: '60%',
                                justifyContent:'center',
                                flexDirection:'column',
                                alignItems:'center',
                                alignContent:'center',
                                borderRadius: 20,
                                borderWidth: 5,
                                borderColor: Color4.White(),
                                }}
                                uiBackground={{
                                    color: wearable ? dclColors[wearable.rarity.toLowerCase()] : Color4.create(0.3, 0.2, 0.4, 0.8)
                                }}
                            >
                                {/* Wearable Image */}
                                {wearable && (
                                    <UiEntity
                                        uiTransform={{
                                        width: '100%',
                                        height: '100%',
                                        justifyContent:'center',
                                        flexDirection:'column',
                                        alignItems:'center',
                                        alignContent:'center',
                                        }}
                                        uiBackground={{
                                            texture: {
                                                src: wearable ? wearable.thumbnail : "images/atlas2.png",
                                            },
                                            textureMode: 'stretch'
                                        }}
                                    >

                                        </UiEntity>
                                )}
                            </UiEntity>

                            {/* info container */}
                            <UiEntity
                                uiTransform={{
                                width: '100%',
                                height: '40%',
                                justifyContent:'center',
                                flexDirection:'column',
                                alignItems:'center',
                                alignContent:'center',
                                }}
                            >
                                
                            {/* Item Name */}
                            <UiEntity
                                uiTransform={{
                                width: '97%',
                                height: '25%',
                                justifyContent:'center',
                                flexDirection:'column',
                                alignItems:'center',
                                alignContent:'center',
                            }}      
                            uiText={{
                                value: wearable ? wearable.name : "Empty Slot", 
                                fontSize: sizeFont(30, 25), 
                                color: Color4.White(), 
                                textAlign: 'middle-center'
                            }}
                            />

                            {/* Button Container */}
                            <UiEntity
                                uiTransform={{
                                width: '95%',
                                height: '65%',
                                justifyContent:'flex-start',
                                flexDirection:'column',
                                alignItems:'center',
                                alignContent:'center',
                                }}
                            >
                                {/* Buy Button */}
                                <UiEntity
                                    uiTransform={{
                                    width: '100%',
                                    height: '45%',
                                    justifyContent:'center',
                                    flexDirection:'column',
                                    alignItems:'center',
                                    alignContent:'center',
                                    }}
                                    uiText={{
                                        value: wearable ? formatPrice(wearable.price).toFixed(0) + " MANA" : " MANA", 
                                        fontSize: sizeFont(45, 45), 
                                        color: Color4.White(), 
                                        textAlign: 'middle-center'
                                    }}
                                />

                                {/* Info Button */}
                                <UiEntity
                                    uiTransform={{
                                    width: '100%',
                                    height: '20%',
                                    justifyContent:'center',
                                    flexDirection:'column',
                                    alignItems:'center',
                                    alignContent:'center',
                                    }}
                                    uiText={{value: "$" + (wearable ? (formatPrice(wearable.price) * manaUSDPrice).toFixed(2) : "0.00"), fontSize:sizeFont(35, 35), color:Color4.create(121/255,119/255,135/255,1), textAlign:'middle-center'}}
                                />

                                {/* Info Button */}
                                <UiEntity
                                    uiTransform={{
                                    width: '100%',
                                    height: '10%',
                                    justifyContent:'center',
                                    flexDirection:'column',
                                    alignItems:'center',
                                    alignContent:'center',
                                    margin:{top:'5%'},
                                    }}
                                    uiText={{value: wearable ? wearable.rarity.charAt(0).toUpperCase() + wearable.rarity.slice(1) : "", fontSize:sizeFont(35, 35), color:dclColors[wearable ? wearable.rarity.toLowerCase() : "common"], textAlign:'middle-center'}}
                                />
                            </UiEntity>
                                </UiEntity>

                            {/* hover container */}
                            <UiEntity
                                uiTransform={{
                                width: '100%',
                                height: '100%',
                                justifyContent:'center',
                                flexDirection:'column',
                                alignItems:'center',
                                alignContent:'center',
                                positionType:'absolute',
                                borderRadius: 20,
                                borderWidth: 10,
                                borderColor:wearable ? hoveredWearable === wearable.id ? Color4.Yellow() : Color4.create(0,0,0, 0) : Color4.create(0,0,0, 0),
                                }}
                                onMouseEnter={()=>{
                                    setHover(wearable.id, true)
                                }}
                                onMouseLeave={()=>{
                                    setHover(wearable.id, false)
                                }}
                                onMouseDown={()=>{
                                    showWearableInfoView(wearable)
                                    view = "wearable-info"
                                }}
                            />
                        </UiEntity>
                    )
                })}
            </UiEntity>
        ))}
    </UiEntity>

</UiEntity>


{/* Wearable Info Container */}
<UiEntity
    uiTransform={{
        width: '95%',
        height: '95%',
        display: isWearableInfoShowing() ? 'flex' : 'none',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
    }}
    >

{/* item info */}
<UiEntity
    uiTransform={{
    width: '100%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    display:!confirmBuy ? 'flex' : 'none',
    }}
>

<UiEntity
    uiTransform={{
    width: '100%',
    height: '50%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
>
<UiEntity
    uiTransform={{
    width: '50%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: Color4.White(),
    }}
    uiBackground={{
        color: getSelectedWearable() ? dclColors[getSelectedWearable()!.rarity.toLowerCase()] : Color4.create(0.3, 0.2, 0.4, 0.8)
    }}
>
    {/* Wearable Image */}
    {getSelectedWearable() && (
        <UiEntity
            uiTransform={{
            width: '100%',
            height: '100%',
            justifyContent:'center',
            flexDirection:'column',
            alignItems:'center',
            alignContent:'center',
            }}
            uiBackground={{
                texture: {
                    src: getSelectedWearable() ? getSelectedWearable()!.thumbnail : "images/atlas2.png",
                }
            }}
        />
    )}
</UiEntity>

<UiEntity
    uiTransform={{
    width: '50%',
    height: '100%',
    justifyContent:'flex-start',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
>

{/* collection info */}
<UiEntity
    uiTransform={{
    width: '90%',
    height: '20%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    margin:{top:'5%'},
    }}
    >

 {/* collection thumbnail */}
 <UiEntity
     uiTransform={{
     width: '30%',
     height: '100%',
     justifyContent:'center',
     flexDirection:'row',
     alignItems:'center',
     alignContent:'center',
     }}
     >
        <UiEntity
     uiTransform={{
     width: calculateSquareImageDimensions(10).width,
     height: calculateSquareImageDimensions(10).height,
     justifyContent:'center',
     flexDirection:'row',
     alignItems:'center',
     alignContent:'center',
     borderRadius: 100,
     borderWidth: 1,
     borderColor: Color4.White(),
     }}
       uiBackground={{
           color: Color4.Black()
       }}
     >
         <UiEntity
     uiTransform={{
     width: '90%',
     height: '90%',
     justifyContent:'center',
     flexDirection:'row',
     alignItems:'center',
     alignContent:'center',
     positionType:'absolute',
     }}
       uiBackground={{
           texture: {
               src: getSelectedCollection() ? `https://peer.decentraland.org/lambdas/collections/contents/${getSelectedCollection()!.urn}:0/thumbnail` : "images/atlas2.png",
           },
           textureMode: 'stretch',
       }}
     />
     </UiEntity>

     </UiEntity>

     <UiEntity
    uiTransform={{
    width: '70%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
    >
    {/* collection Name */}
    <UiEntity
    uiTransform={{
    width: '100%',
    height: '20%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}

     uiText={{
         value: "Collection", 
         fontSize: sizeFont(35, 35), 
         color: Color4.White(), 
         textAlign: 'middle-center'
     }}
    />

<UiEntity
    uiTransform={{
    width: '100%',
    height: '50%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}

     uiText={{
         value: getSelectedCollection() ? getSelectedCollection()!.name : "", 
         fontSize: sizeFont(45, 45), 
         color: Color4.White(), 
         textAlign: 'middle-center'
     }}
    />
    </UiEntity>


    </UiEntity>

{/* creator info */}
<UiEntity
    uiTransform={{
    width: '90%',
    height: '20%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    margin:{top:'5%'},
    }}
    >

 {/* creator thumbnail */}
 <UiEntity
     uiTransform={{
     width: '30%',
     height: '100%',
     justifyContent:'center',
     flexDirection:'row',
     alignItems:'center',
     alignContent:'center',
     }}
     >
        <UiEntity
     uiTransform={{
     width: calculateSquareImageDimensions(10).width,
     height: calculateSquareImageDimensions(10).height,
     justifyContent:'center',
     flexDirection:'row',
     alignItems:'center',
     alignContent:'center',
     borderRadius: 100,
     borderWidth: 1,
     borderColor: Color4.White(),
     }}
       uiBackground={{color:Color4.Black()}}
     >
         <UiEntity
     uiTransform={{
     width: '80%',
     height: '80%',
     justifyContent:'center',
     flexDirection:'row',
     alignItems:'center',
     alignContent:'center',
     positionType:'absolute',
     }}
       uiBackground={{
           texture: {
               src: getSelectedCreator() ? getSelectedCreator()!.snapshots.face : "images/atlas2.png",
           },
           textureMode: 'stretch'
       }}
     />
     </UiEntity>

     </UiEntity>

    <UiEntity
    uiTransform={{
    width: '70%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
    >

    <UiEntity
    uiTransform={{
    width: '70%',
    height: '20%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}

     uiText={{
         value: "Creator", 
         fontSize: sizeFont(35, 35), 
         color: Color4.White(), 
         textAlign: 'middle-center'
     }}
    />

        {/* creator Name */}
        <UiEntity
    uiTransform={{
    width: '70%',
    height: '50%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}

     uiText={{
         value: getSelectedCreator() ? getSelectedCreator()!.name : "", 
         fontSize: sizeFont(45, 45), 
         color: Color4.White(), 
         textAlign: 'middle-center'
     }}
    />
    </UiEntity>


    </UiEntity>


    <UiEntity
        uiTransform={{
        width: '90%',
        height: '10%',
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
        margin:{top:'10%'}
        }}
    >

<UiEntity
        uiTransform={{
        width: '50%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        }}
        uiText={{
            value: getSelectedWearable() ? "Price: " + formatPrice(getSelectedWearable()!.price).toFixed(0) + " MANA" : "", 
            fontSize: sizeFont(45, 45), 
            color: Color4.White(), 
            textAlign: 'middle-left'
        }}
    />


<UiEntity
        uiTransform={{
        width: '50%',
        height: '100%',
        justifyContent:'flex-end',
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
        }}
        uiText={{
            value: "" + (getSelectedWearable() ? "$" + (formatPrice(getSelectedWearable()!.price) * manaUSDPrice).toFixed(2) : "0.00"), 
            fontSize: sizeFont(35, 35), 
            color: Color4.create(121/255,119/255,135/255,1), 
            textAlign: 'middle-left'
        }}
    />

    </UiEntity>

    <UiEntity
        uiTransform={{
        width: '90%',
        height: '10%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        }}
        uiText={{
            value: getSelectedWearable() ? "Stock: " + getSelectedWearable()!.available + " / " + getTotalSupply(getSelectedWearable()!.data.wearable.rarity) : "", 
            fontSize: sizeFont(45, 45), 
            color: Color4.White(), 
            textAlign: 'middle-left'
        }}
    />

<UiEntity
    uiTransform={{
    width: '95%',
    height: '15%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    positionType:'absolute',
    position: { bottom: 0 },
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Color4.White(),
    display: getSelectedWearable() ? formatPrice(getSelectedWearable()!.price) > 1 ? 'flex' : 'none' : 'none',
    }}
    uiBackground={{color:Color4.create(1,46/255,81/255, 1)}}
    uiText={{value:"Buy with MANA", fontSize:sizeFont(45,45), color:Color4.White(), textAlign:'middle-center'}}
    onMouseDown={()=>{
        console.log('clicked buy wearable')
        confirmBuy = true
    }}
    />


</UiEntity>

</UiEntity>



<UiEntity
    uiTransform={{
    width: '100%',
    height: '50%',
    justifyContent:'flex-start',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'flex-start',
    }}
    >

    <UiEntity
    uiTransform={{
    width: '100%',
    height: '10%',
    justifyContent:'flex-start',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    margin:{bottom:'2%', top:'1%'}
    }}
    >

<UiEntity
    uiTransform={{
    width: '50%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    >

    <UiEntity
        uiTransform={{
        width: '50%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        margin:{left:'1%', right:'1%'},
        borderRadius: 20,
        borderWidth: 3,
        borderColor: Color4.White(),
        }}
        uiBackground={{color:Color4.create(1,46/255,81/255, 1)}}
        uiText={{value:"View Wearable", fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-center'}}
        onMouseDown={()=>{
            console.log('clicked view wearable')
            viewWearable(false)
        }}
        />

    <UiEntity
        uiTransform={{
        width: '50%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        margin:{left:'1%', right:'1%'},
        borderRadius: 20,
        borderWidth: 3,
        borderColor: Color4.White(),
        }}
        uiBackground={{color:Color4.create(1,46/255,81/255, 1)}}
        uiText={{value:"View on Avatar", fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-center'}}
        onMouseDown={()=>{
            console.log('clicked view on avatar')
            viewWearable(true)
        }}
        />

    </UiEntity>

    </UiEntity>

    <UiEntity
    uiTransform={{
    width: '100%',
    height: '10%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    >
    <UiEntity
        uiTransform={{
        width: '75%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        }}
        uiText={{value:"" + (getSelectedWearable() ? getSelectedWearable()!.name : ""), fontSize:sizeFont(55,55), color:Color4.White(), textAlign:'middle-left'}}
        />

<UiEntity
    uiTransform={{
    width: '25%',
    height: '100%',
    justifyContent:'flex-start',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    >

<UiEntity
    uiTransform={{
    width: '50%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    margin:{left:'1%', right:'1%'},
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Color4.White(),
    }}
    uiText={{value:"" + (getSelectedWearable() ? getSelectedWearable()!.data.wearable.rarity.charAt(0).toUpperCase() + getSelectedWearable()!.data.wearable.rarity.slice(1) : ""), fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-center'}}
    />

        <UiEntity
    uiTransform={{
    width: '50%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    margin:{left:'1%', right:'1%'},
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Color4.White(),
    }}
    uiText={{value:"" + (getSelectedWearable() ? getSelectedWearable()!.data.wearable.category.charAt(0).toUpperCase() + getSelectedWearable()!.data.wearable.category.slice(1) : ""), fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-center'}}
    />
    </UiEntity>

    </UiEntity>


<UiEntity
    uiTransform={{
    width: '100%',
    height: '5%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{value:"Description", fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-left'}}
    />

<UiEntity
    uiTransform={{
    width: '100%',
    height: '10%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{value:"" + (getSelectedWearable() ? getSelectedWearable()!.data.wearable.description : ""), fontSize:sizeFont(45,45), color:Color4.White(), textAlign:'middle-left'}}
    />

<UiEntity
    uiTransform={{
    width: '100%',
    height: '5%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    margin:{top:'1%'},
    }}
    uiText={{value:"Utility", fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-left'}}
    />

<UiEntity
    uiTransform={{
    width: '100%',
    height: '10%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{value:"" + (getSelectedWearable() ? getSelectedWearable()?.utility || "" : ""), fontSize:sizeFont(45,45), color:Color4.White(), textAlign:'middle-left'}}
    />

<UiEntity
    uiTransform={{
    width: '20%',
    height: '10%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    positionType:'absolute',
    position: { bottom: 0, left: 0 },
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Color4.White(),
    }}
    uiBackground={{color:Color4.create(0,0,0, 1)}}
    uiText={{value:"Go Back", fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-center'}}
    onMouseDown={()=>{
        console.log('clicked go back')
        hideWearableInfoView()
        view = "marketplace"
    }}
    />

    </UiEntity>
</UiEntity>

 {/* buy confirmation container */}
<UiEntity
    uiTransform={{
    width: '100%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    display: confirmBuy ? 'flex' : 'none',
    }}
>
    <UiEntity
    uiTransform={{
    width: '95%',
    height: '20%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    >

<UiEntity
    uiTransform={{
    width: '30%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: Color4.White(),
    }}
    uiBackground={{
        color: getSelectedWearable() ? dclColors[getSelectedWearable()!.rarity.toLowerCase()] : Color4.create(0.3, 0.2, 0.4, 0.8)
    }}
>
    {/* Wearable Image */}
    {getSelectedWearable() && (
        <UiEntity
            uiTransform={{
            width: '100%',
            height: '100%',
            justifyContent:'center',
            flexDirection:'column',
            alignItems:'center',
            alignContent:'center',
            }}
            uiBackground={{
                texture: {
                    src: getSelectedWearable() ? getSelectedWearable()!.thumbnail : "images/atlas2.png",
                },
                textureMode: 'stretch'
            }}
        />
    )}
</UiEntity>

<UiEntity
    uiTransform={{
    width: '55%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{value:"" + (getSelectedWearable() ? getSelectedWearable()!.name : ""), fontSize:sizeFont(55,55), color:Color4.White(), textAlign:'middle-center'}}
    />

    <UiEntity
    uiTransform={{
    width: '25%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{
        value: getSelectedWearable() ? "Price: " + formatPrice(getSelectedWearable()!.price).toFixed(0) + " MANA" : "", 
        fontSize: sizeFont(45, 45), 
        color: Color4.White(), 
        textAlign: 'middle-center'
    }}
    />

    </UiEntity>


    <UiEntity
    uiTransform={{
    width: '95%',
    height: '10%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    margin:{top:'5%'},
    }}
    >
         <UiEntity
    uiTransform={{
    width: '80%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
    >

<UiEntity
    uiTransform={{
    width: '100%',
    height: '70%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{value:"Total", fontSize:sizeFont(45,45), color:Color4.White(), textAlign:'middle-left'}}
    />

<UiEntity
    uiTransform={{
    width: '100%',
    height: '30%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{value:"When paying with MANA, gas fees are covered by Angzaar", fontSize:sizeFont(25,25), color:Color4.create(121/255,119/255,135/255,1), textAlign:'middle-left'}}
    />

    </UiEntity>

    <UiEntity
    uiTransform={{
    width: '20%',
    height: '100%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
    >

<UiEntity
    uiTransform={{
    width: '100%',
    height: '70%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{value:"MANA: " + (getSelectedWearable() ? formatPrice(getSelectedWearable()!.price).toFixed(0) : "0.00"), fontSize:sizeFont(45,45), color:Color4.White(), textAlign:'middle-right'}}
    />

<UiEntity
    uiTransform={{
    width: '100%',
    height: '30%',
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    }}
    uiText={{value:"$" + (getSelectedWearable() ? (formatPrice(getSelectedWearable()!.price) * manaUSDPrice).toFixed(2) : "0.00"), fontSize:sizeFont(35,35), color:Color4.create(121/255,119/255,135/255,1), textAlign:'middle-right'}}
    />

    </UiEntity>

    </UiEntity>

    <UiEntity
    uiTransform={{
    width: '95%',
    height: '10%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    margin:{top:'5%'},
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Color4.White(),
    display: getSelectedWearable() ? formatPrice(getSelectedWearable()!.price) > 1 ? 'flex' : 'none' : 'none',
    }}
    uiBackground={{color:Color4.create(1,46/255,81/255, 1)}}
    uiText={{value:"Confirm Purchase", fontSize:sizeFont(45,45), color:Color4.White(), textAlign:'middle-center'}}
    onMouseDown={()=>{
        console.log('clicked buy wearable')
        confirmBuy = true
    }}
    />

<UiEntity
    uiTransform={{
    width: '95%',
    height: '10%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    margin:{top:'5%'},
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Color4.White(),
    display: getSelectedWearable() ? formatPrice(getSelectedWearable()!.price) > 1 ? 'flex' : 'none' : 'none',
    }}
    uiBackground={{color:Color4.create(22/255,22/255,24/255, 1)}}
    uiText={{value:"Go Back", fontSize:sizeFont(45,45), color:Color4.White(), textAlign:'middle-center'}}
    onMouseDown={()=>{
        console.log('clicked go back')
        confirmBuy = false
    }}
    />

<UiEntity
    uiTransform={{
    width: '85%',
    height: '10%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    margin:{top:'5%'},
    }}
    uiText={{value:"Gas fees are covered by Angzaar", fontSize:sizeFont(45,45), color:Color4.White(), textAlign:'middle-center'}}
    />


</UiEntity>



</UiEntity>








{/* Pagination Controls */}
<UiEntity
uiTransform={{
width: '25%',
height: '5%',
justifyContent:'center',
flexDirection:'row',
alignItems:'center',
alignContent:'center',
positionType:'absolute',
position: { bottom: 0, right: 0 },
display: getCurrentPageItems().length > 0 && !isLoading && view === "marketplace" ? 'flex' : 'none',
}}
>
{/* Previous Page Button */}
<UiEntity
    uiTransform={{
    width: '15%',
    height: '50%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Color4.White(),
    margin:{right:'1%'},
    }}
    uiBackground={{color:Color4.create(22/255,22/255,24/255, 1)}} // Blue button
    onMouseDown={()=>{
        previousPage()
    }}
    uiText={{value:"←", fontSize:sizeFont(45, 45), color:Color4.White(), textAlign:'middle-center'}}
/>

{/* Page Info */}
{/* <UiEntity
    uiTransform={{
    width: '40%',
    height: '60%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    }}
    uiBackground={{color:Color4.create(0.1, 0.1, 0.1, 0.8)}} // Dark background
>
    <UiEntity
        uiTransform={{
        width: '100%',
        height: '100%',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        }}
        uiText={{
            value: `Page ${getCurrentPage() + 1} of ${getTotalPages()}`, 
            fontSize: sizeFont(12, 6), 
            color: Color4.White(), 
            textAlign: 'middle-center'
        }}
    />
</UiEntity> */}

{/* Next Page Button */}
<UiEntity
    uiTransform={{
    width: '15%',
    height: '50%',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'center',
    alignContent:'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Color4.White(),
    margin:{left:'1%'},
    }}
    uiBackground={{color:Color4.create(22/255,22/255,24/255, 1)}} // Blue button
    onMouseDown={async ()=>{
        await nextPage()
    }}
    uiText={{value:"→", fontSize:sizeFont(45, 45), color:Color4.White(), textAlign:'middle-center'}}
    />
</UiEntity>


</UiEntity>


    <UiEntity
         uiTransform={{
         width: dimensions.width * 0.2,
         height: dimensions.height * 0.05,
         justifyContent:'center',
         flexDirection:'row',
         alignItems:'center',
         alignContent:'center',
         positionType:'absolute',
         position: { bottom: 0, left: '20%' },
         }}
     >


     {/* Exit Button */}
     <UiEntity
         uiTransform={{
         width: '33%',
         height: '100%',
         justifyContent:'center',
         flexDirection:'column',
         alignItems:'center',
         alignContent:'center',
         borderRadius: 20,
        borderWidth: 3,
        borderColor: Color4.White(),
         }}
         uiBackground={{color:Color4.Black()}}
         onMouseDown={()=>{
             exitShopping()
         }}
         uiText={{value:"Exit Shop", fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-center'}}
     />

<UiEntity
         uiTransform={{
         width: '33%',
         height: '100%',
         justifyContent:'center',
         flexDirection:'column',
         alignItems:'center',
         alignContent:'center',
         borderRadius: 20,
        borderWidth: 3,
        borderColor: Color4.White(),
         }}
         uiBackground={{color:Color4.Black()}}
         onMouseDown={()=>{
             resetAvatar()
         }}
         uiText={{value:"Reset Avatar", fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-center'}}
     />


<UiEntity
         uiTransform={{
         width: '33%',
         height: '100%',
         justifyContent:'center',
         flexDirection:'column',
         alignItems:'center',
         alignContent:'center',
         borderRadius: 20,
        borderWidth: 3,
        borderColor: Color4.White(),
         }}
         uiBackground={{color:Color4.Black()}}
         onMouseDown={()=>{
             clearAvatar()
         }}
         uiText={{value:"Clear Avatar", fontSize:sizeFont(30,15), color:Color4.White(), textAlign:'middle-center'}}
     />
     </UiEntity>


      </UiEntity>

    )
}
