import ReactEcs, {Dropdown, UiEntity} from '@dcl/sdk/react-ecs'
import {
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { BigBackground } from './BigBackground';
import { Color4 } from '@dcl/sdk/math';
import { ItemCard } from './ItemCard';
import { selectItem, updateStoreView } from './createStoreUI';

let show = true

export function ResultsPanel(props:any) {
    // show = props.display
    return (
        <UiEntity
            key={resources.slug + "results::panel"}
            uiTransform={{
                display: props.viewOverride ? "flex" : show && props.storeView === props.view ? 'flex' : 'none',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '70%',
                height: '93%',
                margin: props.margin ? props.margin : {right:"2%"},
                flexWrap:'wrap'
            }}
            // uiBackground={{color:Color4.Blue()}}
        >
            {props.loading ? 

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
                uiText={{value:"LOADING...", fontSize:sizeFont(50,40)}}
            />
            :

            generateResultItems(props.items, props.onClickFn)
            // <UiEntity
            //     uiTransform={{
            //         flexDirection: 'row',
            //         alignItems: 'flex-start',
            //         justifyContent: 'flex-start',
            //         width: '100%',
            //         height: '100%',
            //         margin: props.margin ? props.margin : {right:"2%"},
            //         flexWrap:'wrap',
            //     }}
            // >
            //     {generateResultItems(props.items, selectItem)}
            //     </UiEntity>
            
        }

        {props.showBack ?
        
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
                updateStoreView(props.showBack)
            }}
            />
        : 
        null
        }
        </UiEntity>
    )
}

function generateResultItems(items:any, func:any){
    let arr:any[] = []

    items.forEach((item:any, i:number)=>{
        arr.push(<ItemCard item={item} func={func}/>)
    })

    return arr
}