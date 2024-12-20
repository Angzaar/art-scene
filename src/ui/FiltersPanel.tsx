import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { BigBackground } from './BigBackground';
import { Color4 } from '@dcl/sdk/math';
import { loading, pageNumber, resultItems, showStoreUI, updateFirstDropdown,updateBodyShape, updateWearableCategoryIndex, updateNetwork, updateSecondDropdown,updateStatusDropdown, updateResults, updateStorePage, updateStoreSkip, updateStoreSearch, generateRarityButtons, selectedItems, updateStoreView, selectedItemPage, updateSelectedItemPage } from './createStoreUI';
import { CustomButton } from './CustomButton';
import { showChance } from './editChance';

let show = true

export function FiltersPanel(props:any) {
    // show = props.display
    return (
        <UiEntity
            key={resources.slug + "filters::panel"}
            uiTransform={{
                display: show ? 'flex' : 'none',
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
                    display: show ? 'flex' : 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '7%',
                }}
                uiText={{value:props.label ? props.label : "", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
            />

                {/* {props.firstDropdown ? 
            <Dropdown
                options={props.firstDropdown}
                selectedIndex={props.firstDropdownIndex ? props.firstDropdownIndex : 0}
                onChange={updateFirstDropdown}
                uiTransform={{
                    width: '100%',
                    height: '7%',
                    margin:{top:'3%'}
                }}
                // uiBackground={{color:Color4.Purple()}}//
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />

            : null } */}


            {/* <Dropdown
            options={props.wearableCategories}
            selectedIndex={props.wearableCategoriesIndex ? props.wearableCategoriesIndex : 0}
            onChange={updateWearableCategoryIndex}
            uiTransform={{
                display: props.firstDropdownIndex === 1 ? "flex": "none",
                width: '100%',
                height: '7%',
                margin:{top:'3%'}
            }}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            /> */}


{/* <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
        margin:{top:"2%"},
    }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
        margin:{right:"1%"},
    }}
>
<Dropdown
    options={props.secondDropdown}
    selectedIndex={props.seconDropdownIndex  ? props.seconDropdownIndex : 0}
    onChange={updateSecondDropdown}
    uiTransform={{
        width: '100%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Purple()}}//
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    />
</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
        margin:{left:"1%"},
    }}
>
<Dropdown
    options={props.statusDropdown}
    selectedIndex={props.statusDropdownIndex  ? props.statusDropdownIndex : 0}
    onChange={updateStatusDropdown}
    uiTransform={{
        width: '100%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Purple()}}//
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>
</UiEntity>

</UiEntity> */}


{/* <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        width: '80%',
        height: '100%',

    }}
>
<Input
uiTransform={{
    width:'100%',
    height:"100%"
}}
    onSubmit={(e) =>{ 
        console.log('search is', e)
        updateStoreSearch(e.trim())
    }}
    fontSize={sizeFont(20,15)}
    color={Color4.White()}
    placeholder={"Search"}
    placeholderColor={Color4.White()}
    />

</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        height: '100%',

    }}
></UiEntity>

</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 'auto',
        margin:{top:"2%"},
        flexWrap:'wrap'
    }}
>
    {
        generateRarityButtons()
    }
</UiEntity> */}
{/* 
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
        margin:{top:"2%"},
    }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
        margin:{right:"1%"},
    }}
>
<Dropdown
    options={props.networkDropdown}
    selectedIndex={props.networkDropdownIndex  ? props.networkDropdownIndex : 0}
    onChange={updateNetwork}
    uiTransform={{
        width: '100%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Purple()}}//
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    />
</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
        margin:{left:"1%"},
    }}
>
<Dropdown
    options={props.bodyShapesDropdown}
    selectedIndex={props.bodyShapesDropdownIndex  ? props.bodyShapesDropdownIndex : 0}
    onChange={updateBodyShape}
    uiTransform={{
        width: '100%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Purple()}}//
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>
</UiEntity>

</UiEntity> */}


<UiEntity
    uiTransform={{
        display: show ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
    }}
    uiText={{value:"Selected Items: " + selectedItems.length, textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
/>

<CustomButton 
    label={"View Selected"}
    func={()=>{
        updateSelectedItemPage(1)
        updateStoreView("selected")
    }}
    />


<CustomButton 
    label={"Edit CHANCE"}
    func={()=>{
        showStoreUI(false)
        showChance(true)
    }}
 />


<UiEntity
    uiTransform={{
        display: show ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
        positionType:'absolute',
        position:{bottom:"11%"}
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
                positionType:'absolute',
                position:{bottom:"3%"}
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

<CustomButton 
    label={"Close"}
    positionType="absolute"
    position={{bottom:'2%',left:'28%'}}
    func={()=>{
        showStoreUI(false)
    }}
    />

    </UiEntity>
        </UiEntity>
    )
}