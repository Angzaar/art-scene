import ReactEcs, {Dropdown, UiEntity} from '@dcl/sdk/react-ecs'
import {
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { BigBackground } from './BigBackground';
import { Color4 } from '@dcl/sdk/math';
import { ItemCard } from './ItemCard';
import { getGender, selectedItem, updateStoreView } from './createStoreUI';
import { convertETHNumber } from '../helpers/functions';
import { CustomButton } from './CustomButton';
import { openExternalUrl } from '~system/RestrictedActions';

let show = true

export function ItemView(props:any) {
    return (
        <UiEntity
            key={resources.slug + "item::view::panel"}
            uiTransform={{
                display: show && props.storeView === "item" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '93%',
                margin:{right:"2%"},
                flexWrap:'wrap'
            }}
        >

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '95%',
                    height: '50%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
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
            height: '90%',
        }}
        uiBackground={{color: selectedItem && selectedItem.data ? dclColors[selectedItem.data[selectedItem.category].rarity] : Color4.Black()}}
        >
                <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '90%',
        }}
        uiBackground={{
            textureMode:'stretch',
            texture: {
            src: selectedItem && selectedItem.thumbnail ? selectedItem.thumbnail : ""
            },
        }}
    />

        </UiEntity>

            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '50%',
                    height: '100%',
                }}
            >

                <UiEntity
                uiTransform={{
                    display: show ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin:{bottom:'1%', top:"2%"}
                }}
                uiText={{value:"Creator: ", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
                />

                <UiEntity
                uiTransform={{
                    display: show ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin:{bottom:'1%', top:"2%"}
                }}
                uiText={{value:"Collection: ", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
                />

                <UiEntity
                uiTransform={{
                    display: show ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin:{bottom:'1%', top:"2%"}
                }}
                uiText={{value:"Stock: " + (selectedItem && selectedItem.available), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
                />

                <UiEntity
                uiTransform={{
                    display: show ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin:{bottom:'1%'}
                }}
                uiText={{value:"Price: " + (selectedItem && convertETHNumber(selectedItem.price) + " MANA"), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
                />

                <UiEntity
                uiTransform={{
                    display: show ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '15%',
                    positionType:'absolute',
                    position:{bottom:0}
                }}
                >

                {/* <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    >

                        <CustomButton
                            label={"Buy"}
                            func={()=>{
                            }}
                            />
                    </UiEntity> */}

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                        margin:{left:'5%'}
                    }}
                    >

                        <CustomButton
                            label={"Marketplace"}
                            func={()=>{
                                openExternalUrl({url:resources.endpoints.dclMarketplaceItem + selectedItem.contractAddress + "/items/" + selectedItem.itemId})
                            }}
                            />
                    </UiEntity>

                </UiEntity>


            </UiEntity>

            </UiEntity>


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '95%',
        height: '40%',
    }}
>
    <UiEntity
        uiTransform={{
            display: show ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
        }}
        uiText={{value:"" + (selectedItem && selectedItem.name), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
    />

<UiEntity
uiTransform={{
flexDirection: 'row',
alignItems: 'flex-start',
justifyContent: 'flex-start',
width: '100%',
height: '15%',
}}
>
<UiEntity
uiTransform={{
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
width: '20%',
height: '100%',
}}
uiText={{value:"" + (selectedItem && selectedItem.data && selectedItem.data[selectedItem.category].rarity.toUpperCase()), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(30,20)}}
/>

<UiEntity
uiTransform={{
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
width: '30%',
height: '100%',
}}
uiText={{value:"" + (selectedItem && selectedItem.data && selectedItem.data[selectedItem.category].category.toUpperCase()), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(30,20)}}
/>

<UiEntity
uiTransform={{
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
width: '20%',
height: '100%',//
}}
uiText={{value:"" + getGender(selectedItem), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(30,20)}}
/>

</UiEntity>

<UiEntity
uiTransform={{
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
width: '100%',
height: '15%',
}}
uiText={{value:"" + (selectedItem && selectedItem.data && selectedItem.data[selectedItem.category].description), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(35,25)}}
/>
    </UiEntity>


    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                width: '5%',
                height: '5%',
                positionType:'absolute',
                position:{right:'2%', top:'3%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: resources.textures.atlas2
                },
                uvs:getImageAtlasMapping(uiSizes.rotateLeftArrowTrans)
            }}
            onMouseDown={()=>{
                console.log('clicked item')
                updateStoreView('main')
            }}
            />

        </UiEntity>
    )
}