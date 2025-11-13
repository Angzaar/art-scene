import { engine, Transform, GltfContainer, AvatarShape, Entity, InputAction, pointerEventsSystem, MeshCollider, VirtualCamera, MainCamera, inputSystem, PointerEventType, raycastSystem, PrimaryPointerInfo, RaycastQueryType, ColliderLayer } from "@dcl/sdk/ecs"
import { Vector3, Quaternion, Color4 } from "@dcl/sdk/math"
import { MeshRenderer } from "@dcl/sdk/ecs"
import { Material } from "@dcl/sdk/ecs"
import { utils } from "./helpers/libraries"
import { randomImage } from "./helpers/functions"
import { MannequinManager } from "./services/mannequinManager"
import { Room } from "colyseus.js"
import { dclColors } from "./helpers/resources"
import { localUser } from "./server"

// Define WearableItem interface locally since we deleted marketplaceService
interface WearableItem {
  id: string
  name: string
  description: string
  image: string
  thumbnail: string
  rarity: string
  category: string
  urn: string
  price?: number
  available?: number
  sold?: number
  volume?: number
}

// New interface for Decentraland marketplace API response
interface MarketplaceWearable {
  id: string
  beneficiary: string
  itemId: string
  name: string
  thumbnail: string
  url: string
  urn: string
  category: string
  contractAddress: string
  rarity: string
  available: number
  isOnSale: boolean
  creator: string
  data: {
    wearable: {
      description: string
      category: string
      bodyShapes: string[]
      rarity: string
      isSmart: boolean
    }
  }
  network: string
  chainId: number
  price: string
  createdAt: number
  updatedAt: number
  reviewedAt: number
  firstListedAt: number
  soldAt: number
  minPrice: string
  maxListingPrice: string | null
  minListingPrice: string | null
  listings: number
  owners: any
  picks: {
    itemId: string
    count: number
    pickedByUser?: boolean
  }
}

// Detailed wearable info interface
interface DetailedWearable {
  id: string
  name: string
  thumbnail: string
  url: string
  category: string
  contractAddress: string
  itemId: string
  rarity: string
  price: string
  available: string
  isOnSale: boolean
  creator: string
  tradeId: string
  beneficiary: string
  createdAt: string
  updatedAt: string
  reviewedAt: string
  soldAt: string | null
  data: {
    wearable: {
      bodyShapes: string[]
      category: string
      description: string
      rarity: string
      isSmart: boolean
    }
  }
  network: string
  chainId: number
  urn: string
  firstListedAt: number
  tradeExpiresAt: number
  picks: {
    itemId: string
    count: number
  }
  utility: string
}

interface Collection {
  urn: string
  creator: string
  name: string
  contractAddress: string
  createdAt: number
  updatedAt: number
  reviewedAt: number
  isOnSale: boolean
  size: number
  network: string
  chainId: number
  firstListedAt: number | null
}

interface Creator {
  id: string
  name: string
  description: string
  ethAddress: string
  collections: number
  avatar: string
  snapshots: {
    face: string
    body: string
  }
}

// State management for wearables
let wearableItems: MarketplaceWearable[] = []
let currentPage = 0
export let isLoading = false
let selectedWearable: DetailedWearable | null = null
let showWearableInfo = false
let selectedCollection: Collection | null = null
let selectedCreator: Creator | null = null
let searchParams: {
  query?: string
  category?: string
  rarities?: string[]
} = {}
const ITEMS_PER_PAGE = 6 // 2x3 grid
const API_FETCH_SIZE = 24 // Fetch 24 items at a time from API


let galleryModel = "assets/gallery.glb"
let parent:Entity
let shopCamera:Entity
let shopMannequin:Entity
let shopFloor:Entity
let shopBackground:Entity
let shopAvatarClick:Entity
let cooldown = 1
let rayFrequency = 0.1
let mousePressed = false

export let manaUSDPrice = 0
let manaPricingTimer = 0

export let shopping = false

export async function fetchManaUSDPrice(){
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=decentraland&vs_currencies=usd`
  try {
    const response = await fetch(url)
    const data = await response.json()
    manaUSDPrice = data.decentraland.usd
    console.log('✅ Fetched mana USD price:', manaUSDPrice)
  } catch (error) {
    console.error('❌ Error fetching mana USD price:', error)
    manaUSDPrice = 0
  }
}


export function ManaPricingSystem(t: number) {
  if(manaPricingTimer > 0) {
    manaPricingTimer -= t
    return
  }
    fetchManaUSDPrice()
    manaPricingTimer = 60
}

// API Functions
async function fetchWearables(skip: number = 0): Promise<MarketplaceWearable[]> {
  try {
    const url = `https://marketplace-api.decentraland.org/v2/catalog?first=${API_FETCH_SIZE}&skip=${skip}&category=wearable&isOnSale=true&sortBy=newest`
    console.log(`🛍️ Fetching wearables from: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`✅ Fetched ${data.data.length} wearables`)
    return data.data
  } catch (error) {
    console.error('❌ Error fetching wearables:', error)
    return []
  }
}

// Fetch wearables with search parameters
export async function fetchWearablesWithSearch(params: {
  query?: string
  category?: string
  rarities?: string[]
  network?: string
  bodyType?: string
  skip?: number
}): Promise<MarketplaceWearable[]> {
  try {
    isLoading = true
    
    // Build URL parameters manually
    let urlParams: string[] = []
    
    // Add base parameters
    urlParams.push(`first=${API_FETCH_SIZE}`)
    urlParams.push('category=wearable')
    urlParams.push('isOnSale=true')
    urlParams.push('sortBy=newest')
    
    // Add search parameters
    console.log('🔍 Search params received:', params)
    if (params.query) {
      urlParams.push(`search=${encodeURIComponent(params.query)}`)
      console.log(`🔍 Adding search parameter: search=${params.query}`)
    } else {
      console.log('🔍 No search query provided')
    }
    
    if (params.category && params.category !== 'All') {
      urlParams.push(`wearableCategory=${encodeURIComponent(params.category.toLowerCase())}`)
    }
    
    if (params.rarities && params.rarities.length > 0) {
      // Add multiple rarity parameters (one for each rarity)
      params.rarities.forEach(rarity => {
        urlParams.push(`rarity=${encodeURIComponent(rarity)}`)
      })
    }
    
    if (params.network) {
      urlParams.push(`network=${encodeURIComponent(params.network.toLowerCase())}`)
    }
    
    if (params.bodyType && params.bodyType !== 'All Body Types') {
      // Convert body type to wearable gender format
      if (params.bodyType === 'BaseMale') {
        urlParams.push(`wearableGender=male`)
        urlParams.push(`wearableGender=unisex`)
      } else if (params.bodyType === 'BaseFemale') {
        urlParams.push(`wearableGender=female`)
        urlParams.push(`wearableGender=unisex`)
      }
    }
    
    // Add pagination
    if (params.skip) {
      urlParams.push(`skip=${params.skip}`)
    }
    
    const url = `https://marketplace-api.decentraland.org/v2/catalog?${urlParams.join('&')}`
    console.log(`🔍 Fetching wearables with search: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    if (data.data) {
      console.log(`✅ Fetched ${data.data.length} wearables`)
      return data.data
    }
    return []
  } catch (error) {
    console.error('❌ Error fetching wearables with search:', error)
    return []
  } finally {
    isLoading = false
  }
}

// Perform search and update results
export async function performWearableSearch(params: {
  query?: string
  category?: string
  rarities?: string[]
  network?: string
  bodyType?: string
}): Promise<void> {
  console.log('🔍 Performing wearable search with params:', params)
  
  // Store search parameters
  searchParams = params
  console.log(`🔍 Search parameters:`, JSON.stringify(searchParams, null, 2))
  
  // Reset to first page
  currentPage = 0
  
  // Fetch new results
  const results = await fetchWearablesWithSearch({
    ...params,
    skip: 0
  })
  
  wearableItems = results
  console.log(`✅ Search completed. Found ${results.length} items.`)
  console.log(`✅ Results:`, JSON.stringify(results, null, 2))
}

// Load initial wearables when shopping starts
export async function loadInitialWearables(): Promise<void> {
  if (isLoading) return
  
  isLoading = true
  console.log('🔄 Loading initial wearables...')
  
  const newItems = await fetchWearables(0)
  wearableItems = newItems
  currentPage = 0
  
  isLoading = false
  console.log(`✅ Loaded ${wearableItems.length} wearables`)
}

// Load more wearables for pagination
export async function loadMoreWearables(): Promise<void> {
  if (isLoading) return
  
  isLoading = true
  const skip = wearableItems.length
  console.log(`🔄 Loading more wearables (skip: ${skip})...`)
  
  const newItems = await fetchWearables(skip)
  wearableItems = [...wearableItems, ...newItems]
  
  isLoading = false
  console.log(`✅ Total wearables loaded: ${wearableItems.length}`)
}

// Get current page items
export function getCurrentPageItems(): MarketplaceWearable[] {
  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  return wearableItems.slice(startIndex, endIndex)
}

// Navigate to next page
export async function nextPage(): Promise<void> {
  const totalPages = Math.ceil(wearableItems.length / ITEMS_PER_PAGE)
  const nextPageIndex = currentPage + 1
  
  // If we need more items and haven't reached the end
  if (nextPageIndex >= totalPages && wearableItems.length > 0) {
    await loadMoreWearables()
  }
  
  if (currentPage < Math.ceil(wearableItems.length / ITEMS_PER_PAGE) - 1) {
    currentPage++
    console.log(`📄 Navigated to page ${currentPage + 1}`)
  }
}

// Navigate to previous page
export function previousPage(): void {
  if (currentPage > 0) {
    currentPage--
    console.log(`📄 Navigated to page ${currentPage + 1}`)
  }
}

// Get current page number
export function getCurrentPage(): number {
  return currentPage
}

// Get total pages
export function getTotalPages(): number {
  return Math.ceil(wearableItems.length / ITEMS_PER_PAGE)
}

// Format price from wei to ETH
export function formatPrice(priceWei: string): number {
  const price = parseFloat(priceWei) / Math.pow(10, 18)
  return price
}

// Fetch detailed wearable info
export async function fetchDetailedWearableInfo(contractAddress: string, itemId: string): Promise<DetailedWearable | null> {
  try {
    const url = `https://marketplace-api.decentraland.org/v1/items?contractAddress=${contractAddress}&itemId=${itemId}`
    console.log(`🔍 Fetching detailed info from: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    if (data.data && data.data.length > 0) {
      console.log(`✅ Fetched detailed info for ${data.data[0].name}`)
      console.log(`✅ Fetched detailed info for` + JSON.stringify(data.data[0], null, 2))
      return data.data[0]
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching detailed wearable info:', error)
    return null
  }
}

// Fetch collection info
export async function fetchCollectionInfo(contractAddress: string): Promise<Collection | null> {
  try {
    const url = `https://nft-api.decentraland.org/v1/collections?contractAddress=${contractAddress}`
    console.log(`🔍 Fetching collection info from: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    if (data.data && data.data.length > 0) {
      console.log(`✅ Fetched collection info for ${data.data[0].name}`)
      return data.data[0]
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching collection info:', error)
    return null
  }
}

// Fetch creator info
export async function fetchCreatorInfo(creatorAddress: string): Promise<Creator | null> {
  try {
    const url = `https://realm-provider.decentraland.org/lambdas/profiles/${creatorAddress}`
    console.log(`🔍 Fetching creator info from: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    if (data && data.avatars && data.avatars.length > 0) {
      const profile = data
      const avatar = profile.avatars[0]
      console.log(`✅ Fetched creator info for ${avatar.name}`)
      
      return {
        id: profile.id,
        name: avatar.name || creatorAddress,
        description: profile.description || "",
        ethAddress: creatorAddress,
        collections: profile.collections || 0,
        avatar: avatar.avatar || "",
        snapshots: {
          face: avatar.avatar?.snapshots?.face256 || "",
          body: avatar.avatar?.snapshots?.body || ""
        }
      }
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching creator info:', error)
    return null
  }
}

// Show wearable info
export async function showWearableInfoView(wearable: MarketplaceWearable): Promise<void> {
  console.log(`📋 Showing info for ${wearable.name}`)

  isLoading = true
  const detailedInfo = await fetchDetailedWearableInfo(wearable.contractAddress, wearable.itemId)
  if (detailedInfo) {
    selectedWearable = detailedInfo
    
    // Also fetch collection info
    const collectionInfo = await fetchCollectionInfo(wearable.contractAddress)
    if (collectionInfo) {
      selectedCollection = collectionInfo
      console.log(`✅ Loaded collection info:`, JSON.stringify(collectionInfo, null, 2))
      
      // Also fetch creator info
      const creatorInfo = await fetchCreatorInfo(collectionInfo.creator)
      if (creatorInfo) {
        selectedCreator = creatorInfo
        console.log(`✅ Loaded creator info: ${creatorInfo.name}`)
      }
    }
    
    showWearableInfo = true
    console.log(`✅ Loaded detailed info for ${detailedInfo.name}`)
  } else {
    console.error('❌ Failed to load detailed info')
  }
  isLoading = false
}

// Hide wearable info
export function hideWearableInfoView(): void {
  showWearableInfo = false
  selectedWearable = null
  selectedCollection = null
  selectedCreator = null
}

// Get selected wearable
export function getSelectedWearable(): DetailedWearable | null {
  return selectedWearable
}

// Get selected collection
export function getSelectedCollection(): Collection | null {
  return selectedCollection
}

// Get selected creator
export function getSelectedCreator(): Creator | null {
  return selectedCreator
}

// Check if wearable info is showing
export function isWearableInfoShowing(): boolean {
  return showWearableInfo
}

// Get rarity color based on rarity level using dclColors from resources
export function getRarityColor(rarity: string): Color4 {
  switch (rarity.toLowerCase()) {
    case 'common':
      return dclColors.common
    case 'uncommon':
      return dclColors.uncommon
    case 'rare':
      return dclColors.rare
    case 'epic':
      return dclColors.epic
    case 'legendary':
      return dclColors.legendary
    case 'mythic':
      return dclColors.mythic
    case 'exotic':
      return dclColors.exotic
    case 'unique':
      return dclColors.unique
    default:
      return dclColors.common // Default to common color
  }
}


export function createWearableStore(){
    parent = engine.addEntity()
    Transform.create(parent, {
        position:Vector3.create(72,0,-24),
        rotation:Quaternion.fromEulerDegrees(0,0,0)
    })

    let gallery = engine.addEntity()
    GltfContainer.create(gallery, {src:galleryModel})
    Transform.create(gallery, {parent:parent})

  //   let logo = engine.addEntity()
  //   Transform.create(logo, {parent:parent, position:Vector3.create(0, 10.7, 7.2), rotation:Quaternion.fromEulerDegrees(0,180,0), scale:Vector3.create(5,5,1)})
  //   MeshRenderer.setPlane(logo)
  //   Material.setBasicMaterial(logo, {texture:Material.Texture.Common({
	// 	src: '',
	// })})

  //   randomImage(logo, "wearables")
  //   utils.timers.setTimeout(()=>{
  //       randomImage(logo, "wearables")
  //   }, 1000 * 10)

    // Create mannequins for trending and newest wearables
    // createTrendingMannequins(parent)
    // createNewestMannequins(parent)
    // createCenterMannequins(parent)

    // Initialize marketplace system?/

    let shopClick = engine.addEntity()
    Transform.create(shopClick, {parent:parent, position:Vector3.create(0, 1, 1.5), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,3,1)})
    // MeshRenderer.setBox(shopClick)
    MeshCollider.setBox(shopClick)
    pointerEventsSystem.onPointerDown({entity:shopClick, opts:{
        hoverText:"Open Shop", maxDistance:15, button:InputAction.IA_POINTER, showFeedback:true
    }}, ()=>{
        console.log('clicked shop')
        startShopping()
    })

    let shopMannequinEntity = engine.addEntity()
    Transform.create(shopMannequinEntity, {parent:parent, position:Vector3.create(0, 0.5, 1.5), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)})
    AvatarShape.create(shopMannequinEntity, 
        {
            id:"", 
            name:"Shop Wearables!", 
            bodyShape:"urn:decentraland:off-chain:base-avatars:BaseMale", 
            wearables:[], 
            emotes:[]
        })
    engine.addSystem(ManaPricingSystem)
}


function createTrendingMannequins(parent: Entity) {
    console.log('🔥 CLIENT: Creating trending mannequins...')
    // Create 3 trending mannequins
    for (let i = 0; i < 3; i++) {
        const mannequinId = `trending_mannequin_${i + 1}`
        const position = Vector3.create(
            // 4 + (i * 3), // Spread them out horizontally
            6,
            1.25,
            -1 + (i * 1)
        )
        
        MannequinManager.createMannequin({
            id: mannequinId,
            position,
            rotation:Quaternion.fromEulerDegrees(0,-90,0),
            parent
        })
        console.log(`🔥 CLIENT: Created trending mannequin: ${mannequinId}`)
    }
}

function createNewestMannequins(parent: Entity) {
    console.log('🔥 CLIENT: Creating newest mannequins...')
    // Create 3 newest mannequins
    for (let i = 0; i < 3; i++) {
        const mannequinId = `newest_mannequin_${i + 1}`
        const position = Vector3.create(
            -4 - (i * 3), // Position them on the opposite side
            1.25,
            5
        )
        
        MannequinManager.createMannequin({
            id: mannequinId,
            position,
            parent
        })
        console.log(`🔥 CLIENT: Created newest mannequin: ${mannequinId}`)
    }
}

function createCenterMannequins(parent: Entity) {
    console.log('🔥 CLIENT: Creating center showcase mannequin...')
    // Create center showcase mannequin
    const mannequinId = 'center_showcase'
    const position = Vector3.create(0, 0.25, 8)
    
    MannequinManager.createMannequin({
        id: mannequinId,
        position,
        parent
    })
    console.log(`🔥 CLIENT: Created center showcase mannequin: ${mannequinId}`)
}

export function initializeMarketplaceSystem(room: Room) {
    console.log('Initializing marketplace system...')
    
    // Request initial marketplace data from server
    room.send('get-marketplace-data', {})
    
    // Set up room message listeners for marketplace updates
    room.onMessage('marketplace-data', async (data: any) => {
        console.log('🔥 CLIENT: Received marketplace-data:',    )
        // console.log('🔥 CLIENT: Full data object:', JSON.stringify(data, null, 2))
        console.log('🔥 CLIENT: Trending count:', data.trending?.length || 0)
        console.log('🔥 CLIENT: Newest count:', data.newest?.length || 0)
        await updateMannequinsWithData(data)
    })

    room.onMessage('marketplace-data-updated', async (data: any) => {
        console.log('🔥 CLIENT: Received marketplace-data-updated:', data)
        console.log('🔥 CLIENT: Trending count:', data.trending?.length || 0)
        console.log('🔥 CLIENT: Newest count:', data.newest?.length || 0)
        await updateMannequinsWithData(data)
    })
    
    console.log('Marketplace system initialized')
}

async function updateMannequinsWithData(data: any) {
    console.log('🔥 CLIENT: Updating mannequins with marketplace data:', JSON.stringify(data, null, 2))
    
    try {
        // Update trending mannequins
        if (data.trending && data.trending.length > 0) {
            console.log('🔥 CLIENT: Updating trending mannequins...')
            for (let i = 0; i < Math.min(3, data.trending.length); i++) {
                const mannequinId = `trending_mannequin_${i + 1}`
                // Log ONLY the #2 trending item (i === 1)
                if (i === 1) {
                    console.log('🟡 DEBUG #2 raw server item:', data.trending[i])
                }
                const wearable = transformToWearableItem(data.trending[i])
                if (i === 1) {
                    console.log('🟡 DEBUG #2 applying to', mannequinId)
                    console.log('🟡 DEBUG #2 name:', wearable.name)
                    console.log('🟡 DEBUG #2 category:', wearable.category)
                    console.log('🟡 DEBUG #2 urn:', wearable.urn)
                    console.log('🟡 DEBUG #2 wearable object:', wearable)
                }
                MannequinManager.updateMannequinWearables(mannequinId, [wearable])
            }
        } else {
            console.log('🔥 CLIENT: No trending data available')
        }//
        
        // Update newest mannequins
        // if (data.newest && data.newest.length > 0) {
        //     console.log('🔥 CLIENT: Updating newest mannequins...')
        //     for (let i = 0; i < Math.min(3, data.newest.length); i++) {
        //         const mannequinId = `newest_mannequin_${i + 1}`
        //         const wearable = transformToWearableItem(data.newest[i])
        //         console.log(`🔥 CLIENT: Updating ${mannequinId} with:`, wearable.name)
        //         MannequinManager.updateMannequinWearables(mannequinId, [wearable])
        //     }
        // } else {
        //     console.log('🔥 CLIENT: No newest data available')
        // }
        
        // Update center showcase with first trending item
        // if (data.trending && data.trending.length > 0) {
        //     const centerWearable = transformToWearableItem(data.trending[0])
        //     console.log('🔥 CLIENT: Updating center showcase with:', centerWearable.name)
        //     MannequinManager.updateMannequinWearables('center_showcase', [centerWearable])
        // }
        
        console.log('🔥 CLIENT: Mannequins updated successfully')
    } catch (error) {
        console.error('🔥 CLIENT: Error updating mannequins:', error)
    }
}

function transformToWearableItem(data: any): WearableItem {
    console.log('🔄 TRANSFORM: Raw server data:', data)
    console.log('🔄 TRANSFORM: Extracted URN:', data.urn)
    
    return {
        id: data.id || 'unknown',
        name: data.name || 'Unknown Wearable',
        description: data.description || data.data?.wearable?.description || data.data?.emote?.description || '',
        image: data.thumbnail || '',
        thumbnail: data.thumbnail || '',
        rarity: data.rarity || 'common',
        category: data.category || 'wearable',
        urn: data.urn || '',
        price: data.price ? parseFloat(data.price) : 0,
        available: data.available ? parseInt(data.available) : 0,
        sold: data.sold ? parseInt(data.sold) : 0,
        volume: data.volume || 0
    }
}

async function startShopping(){
    console.log('🛍️ Starting shopping...')
    shopping = true

    shopCamera = engine.addEntity()
    Transform.create(shopCamera, {parent:parent, position:Vector3.create(-1, 104.5, 4), rotation:Quaternion.fromEulerDegrees(0,180,0)})
    VirtualCamera.create(shopCamera, {})

    MeshRenderer.setBox(shopCamera)

    shopMannequin = engine.addEntity()
    Transform.create(shopMannequin, {parent:parent, position:Vector3.create(0, 103.5, 1.5), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(1,1,1)})
    AvatarShape.create(shopMannequin,//// 
        {
            id:"mannequin_store", 
            name:"", 
            bodyShape:"urn:decentraland:off-chain:base-avatars:BaseMale", 
            wearables:[], 
            emotes:[]
        })
    
    shopAvatarClick = engine.addEntity()
    Transform.create(shopAvatarClick, {parent:parent, position:Vector3.create(0, 103.5, 1.5), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(2,5,1)})
    MeshCollider.setBox(shopAvatarClick, ColliderLayer.CL_CUSTOM8)

    pointerEventsSystem.onPointerDown({entity:shopAvatarClick, opts:{
        hoverText:"", maxDistance:1000, button:InputAction.IA_POINTER, showFeedback:false
    }}, ()=>{
        console.log('clicked avatar')
    })
    pointerEventsSystem.onPointerUp({entity:shopAvatarClick, opts:{
        maxDistance:100, button:InputAction.IA_POINTER, showFeedback:false
    }}, ()=>{
        console.log('released avatar')
    })

    let camera = MainCamera.getMutable(engine.CameraEntity)
    camera.virtualCameraEntity = shopCamera

    shopFloor = engine.addEntity()
    Transform.create(shopFloor, {parent:parent, position:Vector3.create(0, 100, 0), rotation:Quaternion.fromEulerDegrees(90,0,0), scale:Vector3.create(15,15,1)})
    MeshRenderer.setBox(shopFloor)

    shopBackground = engine.addEntity()
    Transform.create(shopBackground, {parent:parent, position:Vector3.create(0, 107, -2), rotation:Quaternion.fromEulerDegrees(0,0,0), scale:Vector3.create(15,15,1)})
    MeshRenderer.setBox(shopBackground)

    Material.setPbrMaterial(shopFloor, {
        albedoColor: Color4.create(1,0,1, 1)
    })

    Material.setPbrMaterial(shopBackground, {
        albedoColor: Color4.create(1,0,1, 1)
    })

    // Load initial wearables when shopping starts
    loadInitialWearables()
    engine.addSystem(shopAvatarClickSystem)
}

function shopAvatarClickSystem(t: number) {

    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
      mousePressed = true
    }

    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_UP)) {
      mousePressed = false
    }

    if (!mousePressed) {
      cooldown = 0
      raycastSystem.removeRaycasterEntity(engine.CameraEntity)
      return
    }

    cooldown += t
    if (cooldown > rayFrequency) return
    cooldown = 0

    const pointerInfo = PrimaryPointerInfo.getOrCreateMutable(engine.RootEntity)
    let dir = pointerInfo.worldRayDirection

    raycastSystem.registerGlobalDirectionRaycast(
      {
        entity: engine.CameraEntity,
        opts: {
          queryType: RaycastQueryType.RQT_HIT_FIRST,
          direction: dir,
          continuous:true,
          collisionMask: ColliderLayer.CL_CUSTOM8
        },
      },
      function (raycastResult) {
        let result = raycastResult
        // console.log("raycastResult: ", JSON.stringify(raycastResult, null, 2))

        if(!result || !result.direction || result.hits.length === 0) return

         // Calculate rotation in degrees
        // Multiply by ROTATION_FACTOR to control how much the character rotates
        const rotationDegrees = 180 + (1 * result.direction.x * 360)
        
        // Update character rotation around y-axis
        const characterTransform = Transform.getMutable(shopMannequin)
        characterTransform.rotation = Quaternion.fromEulerDegrees(0, rotationDegrees, 0)

        // console.log("Direction X offset: ", result.direction.x)
        // console.log("Character rotation: ", rotationDegrees)
      }
    )
}

export function exitShopping(){
    console.log('exiting shopping')
    shopping = false
    // let camera = MainCamera.getMutable(engine.CameraEntity)
    // camera.virtualCameraEntity = engine.CameraEntity
    let camera = MainCamera.getMutable(engine.CameraEntity)
    camera.virtualCameraEntity = undefined

    engine.removeEntity(shopCamera)
    engine.removeEntity(shopMannequin)
    engine.removeEntity(shopFloor)
    engine.removeEntity(shopBackground)
    engine.removeEntity(shopAvatarClick)
    engine.removeSystem(shopAvatarClickSystem)
}

export function viewWearable(onAvatar:boolean){
    console.log('viewing wearable')
    let currentAvatar = AvatarShape.getMutableOrNull(shopMannequin)
    let currentWearables:any = []
    if(currentAvatar){
        currentWearables = currentAvatar.wearables
    }
    console.log('current wearables are', JSON.stringify(currentWearables, null, 2))
    
    currentWearables.push(getSelectedWearable()!.urn)

    AvatarShape.createOrReplace(shopMannequin, {
        id: "mannequin_store",
        emotes: [],
        bodyShape:localUser.bodyShape,
        wearables: currentWearables,
        showOnlyWearables: onAvatar ? false : true,
    })
}

export function resetAvatar(){
    console.log('resetting avatar')
    AvatarShape.createOrReplace(shopMannequin, {
        id: "mannequin_store",
        emotes: [],
        bodyShape: localUser.bodyShape,
        wearables: [...localUser.wearables],
        showOnlyWearables: false,
    })
}

export function clearAvatar(){
    console.log('clearing avatar')
    AvatarShape.createOrReplace(shopMannequin, {
        id: "mannequin_store",
        emotes: [],
        bodyShape: localUser.bodyShape,
        wearables: [],
        showOnlyWearables: false,
    })
}


export function getTotalSupply(rarity: string) {
  switch(rarity.toLowerCase()) {
    case "common":
      return 100000
    case "uncommon":
      return 10000
    case "rare":
      return 5000
    case "epic":
      return 1000
    case "legendary":
      return 100
    case "mythic":
      return 10
    case "exotic":
      return 50
    case "unique":
      return 1
  }
}