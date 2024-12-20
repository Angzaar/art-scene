import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources, { dclColors } from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { FiltersPanel } from './FiltersPanel';
import { ResultsPanel } from './ResultsPanel';
import { paginateArray } from '../helpers/functions';
import { ItemView } from './ItemView';
import { CustomButton } from './CustomButton';
import { localUserId } from '../server';
import { testStoreItems } from '../testItems';

let show = false
export let loading = true

let nftTypeDropdowns:any = [
    "NFT Type",
    "All",
    "Wearables",
    // "Emotes"
]

let wearableCategories:any[] = [
    "All",
    "Head",
    "Facial Hair",
    "Hair",
    "Eyes",
    "Eybrows",
    "Mouth",
    "Upper Body",
    "Handwear",
    "Lower Body",
    "Feet",
    "Accessories",
    "Earring",
    "Eyewear",
    "Hat",
    "Helmet",
    "Mask",
    "Tiara",
    "Top Head",
    "Skins"
]

let sortFilters:any[] = [
    "Sort Type",
    "Newest",
    "Recently Listed",
    "Recently Sold",
    "Cheapest",
    "Most Expensive"
]

let saleStatuses:any =[
    "Item Status",
    "On Sale",
    "Only Minting",
    "Only Listings",
    "Not For Sale"
]

let chainType:any =[
    "Network",
    "Ethereum",
    "Polygon"
]

let bodyShapes:any =[
    "Body Shapes",
    "All Bodies",
    "Male",
    "Female"
]

export async function showStoreUI(value:boolean){
    show = value
    if(show){
        resultItems.length = 0
        loading = true
        await refreshItems()
        visibleItems = paginateArray([...resultItems], pageNumber, 9)
    }else{
        resetFilters()
    }
}

export function createStoreUI() {
    return (
        <UiEntity
            key={resources.slug + "store-ui"}
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
        >
            <FiltersPanel
                wearableCategories={[...wearableCategories]}
                wearableCategoriesIndex={wearableCategoriesIndex}

                statusDropdown={[...saleStatuses]}
                statusDropdownIndex={statusDropdownIndex}

                networkDropdown={[...chainType]}
                networkDropdownIndex={networkDropdownIndex}

                bodyShapesDropdown={[...bodyShapes]}
                bodyShapesDropdownIndex={bodyShapesDropdownIndex}

                display={true}

                firstDropdown={[...nftTypeDropdowns]}
                firstDropdownIndex={firstDropdownIndex}

                secondDropdown={[...sortFilters]}
                seconDropdownIndex={secondDropdownIndex}

                label="DecentCHANCE - Your Items"
            />

            <ResultsPanel
                onClickFn={selectItem}
                storeView={storeView}
                view={"main"}
                loading={loading}
                items={paginateArray(resultItems, pageNumber, 9)}
                type={"nft-card"}
                />

                <ResultsPanel
                    storeView={storeView}
                    onClickFn={selectItem}
                    margin={{top:'5%', right:'2%'}}
                    view={"selected"}
                    // loading={loading}
                    items={paginateArray(selectedItems, selectedItemPage, 9)}
                    type={"nft-card"}
                    showBack="main"
                    />


            <ItemView
                selectedItem={selectedItem}
                storeView={storeView}
                />

        </UiEntity>
        </UiEntity>
    )
}

export function updateFirstDropdown(index:number){
    firstDropdownIndex = index
    if(index !== 0){
        updateResults()
    }
}

export function updateWearableCategoryIndex(index:number){
    wearableCategoriesIndex = index
    if(index !== 0){
        updateResults()
    }
}

export function updateSecondDropdown(index:number){
    secondDropdownIndex = index
    if(index !== 0){
        itemSort = sortFilters[secondDropdownIndex].toLowerCase().replace(" ", "_")
        updateResults()
    }
}

export function updateStatusDropdown(index:number){
    statusDropdownIndex = index
    if(index !== 0){
        updateResults()
    }
}

export function updateNetwork(index:number){
    networkDropdownIndex = index
    if(index !== 0){
        updateResults()
    }
}

export function updateBodyShape(index:number){
    bodyShapesDropdownIndex = index
    if(index !== 0){
        itemSort = sortFilters[secondDropdownIndex].toLowerCase().replace(" ", "_")
        updateResults()
    }
}

export function updateStoreSearch(value:string){
    storeSearch = value
    updateResults()
}

function resetFilters(){
    firstDropdownIndex = 1
    secondDropdownIndex = 1
    statusDropdownIndex = 4
    networkDropdownIndex = 1
    bodyShapesDropdownIndex = 1
    wearableCategoriesIndex = 0
    firstAmount = 27
    itemSort = sortFilters[secondDropdownIndex].toLowerCase().replace(" ", "_")
    requestURL = ""
    pageNumber = 1
    storeView = "main"
    storGender = "all"
    storeSearch = ""
    storeRarities.length = 0
    selectedItemPage = 1
}

let marketplaceEndpoint = "https://marketplace-api.decentraland.org/v1/"
let requestURL:string = ""

export let pageNumber:number = 1
export let selectedItemPage:number = 1
export let firstDropdownIndex:number = 1
export let secondDropdownIndex:number = 1
export let statusDropdownIndex:number = 4
export let networkDropdownIndex:number = 1
export let bodyShapesDropdownIndex:number = 1
export let wearableCategoriesIndex:number = 0
export let storeSkip:number = 0
export let resultItems:any[] = []
export let visibleItems:any[] = []
export let storeRarities:any[] = []
export let selectedItem:any
export let storeView = "main"
export let storeSearch = ""
export let storGender = "all"
export let storeType = "nfts"
export let selectedItems:any[] = []

let firstAmount = 27
let itemSort:string = sortFilters[secondDropdownIndex].toLowerCase().replace(" ", "_")

export function getGender(item:any){
    if(!item){
        return ""
    }

    let gender = ""
    if(item.data){
        let genders = item.data[item.category].bodyShapes
        if(genders.length === 2){
            return "UNISEX"
        }

        if(genders[0] === "BaseMale"){
            return "MALE"
        } 

        if(genders[0] === "BaseFemale"){
            return "FEMALE"
        } 
    }

    return gender
}

export function updateStorePage(value:number){
    pageNumber = value
}

export function selectItem(item:any){
    console.log('selected item', item)
    let itemIndex = selectedItems.findIndex((it:any)=> it.id === item.id)
    if(itemIndex >= 0){
        selectedItems.splice(itemIndex, 1)
    }else{
        selectedItems.push(item)
    }
    console.log('selected items', selectedItems)
}

function urlBuilder(){
    requestURL = marketplaceEndpoint +  storeType + "?"
    requestURL += "first=" + firstAmount + "&"
    requestURL += "sortBy=" + itemSort + "&"

    storeRarities.forEach((rarity:string)=>{
        requestURL += "rarity=" + rarity.toLowerCase() + "&"
    })

    switch(firstDropdownIndex){
        case 1:
        break;

        case 2:
        case 3:
            requestURL += "category=" + nftTypeDropdowns[firstDropdownIndex].toLowerCase()  + "&"
        break
    }

    if(bodyShapesDropdownIndex === 2){
        requestURL += "wearableGender=male&wearableGender=unisex&"
    }

    if(bodyShapesDropdownIndex === 3){
        requestURL += "wearableGender=female&wearableGender=unisex&"
    }

    if(wearableCategoriesIndex > 0){
        requestURL += "wearableCategory=" + wearableCategories[wearableCategoriesIndex].toLowerCase().replace(" ", "_") + "&"
    }

    requestURL += "owner=" + localUserId + "&"

    requestURL += "search=" + storeSearch

    console.log('url is now', requestURL)
}

export function updateStoreSkip(value:number){
    firstAmount += value
}

export function updateSelectedItemPage(value:number){
    selectedItemPage = value
}

export function updateStoreView(view:string, item?:any){
    storeView = view
    if(item){
        selectedItem = item
    }
}

export function updateStoreRarities(rarity:string){
    console.log('updating store rarity')
    if(storeRarities.includes(rarity)){
        storeRarities.splice(storeRarities.findIndex((rar:any)=> rar === rarity), 1)
    }else{
        storeRarities.push(rarity)
    }
    updateResults()
}

export function generateRarityButtons(){
    let arr:any[] = []
    for(let key in dclColors){
        arr.push(
            <CustomButton
            rarity
            margin={'1%'}
            label={"" + key.toUpperCase()}
            func={()=>{
                updateStoreRarities(key)
            }}
                />)
    }
    return arr
}

export async function updateResults(paginate?:boolean){
    console.log('paginate', paginate)
    if(!paginate){
        await refreshItems()
    }

    visibleItems = paginateArray([...resultItems], pageNumber, 9)
    console.log('visible items are now', visibleItems)

    storeView = "main"
    // marketplaceLoadingSpinner.hide()
}

export async function refreshItems(){
    loading = true

    let data:any

    if(resources.DEBUG){
        data = testStoreItems
    }else{
        await urlBuilder()
        data = await getData(requestURL)
        if(data === null){
            return
        }
    }

    console.log('data is', data)
    resultItems = [...data.data]
    loading = false
}

async function getData(url:string){
    try{
      let response = await fetch(resources.DEBUG ? resources.endpoints.proxy + url : url)
      let json = await response.json()
      return json
    }
    catch(e){
      console.log('get store data error', e)
      return null
    }
  }