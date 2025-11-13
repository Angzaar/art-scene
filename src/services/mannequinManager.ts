import { engine, Transform, AvatarShape, Entity } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"

// Define WearableItem interface locally
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
import { utils } from "../helpers/libraries"

export interface MannequinConfig {
  id: string
  position: Vector3
  rotation?: Quaternion
  scale?: Vector3
  parent?: number
}

export interface MannequinData {
  entity: number
  config: MannequinConfig
  currentWearables: WearableItem[]
  lastUpdate: number
}

export class MannequinManager {
  private static mannequins: Map<string, MannequinData> = new Map()
  private static updateInterval: any | null = null
  private static readonly UPDATE_INTERVAL = 60000 // 60 seconds

  /**
   * Create a new mannequin
   */
  static createMannequin(config: MannequinConfig, initialWearables: WearableItem[] = []): string {
    const entity = engine.addEntity()
    
    // Create avatar shape with a sane base so body-part wearables render
    AvatarShape.create(entity as Entity, {
      id: config.id,
      emotes: [],
      // Always include base avatar parts; append any provided initial wearables
      wearables: [
        'urn:decentraland:off-chain:base-avatars:BaseMale',
        'urn:decentraland:off-chain:base-avatars:eyes_00',
        'urn:decentraland:off-chain:base-avatars:mouth_00',
        ...initialWearables.map(w => w.urn)
      ],
      showOnlyWearables: true,//
    })

    // Set transform
    Transform.create(entity, {
      position: config.position,
      rotation: config.rotation || Quaternion.fromEulerDegrees(0, 0, 0),
      scale: config.scale || Vector3.create(1, 1, 1),
      parent: config.parent as Entity
    })

    // Store mannequin data
    const mannequinData: MannequinData = {
      entity,
      config,
      currentWearables: initialWearables,
      lastUpdate: Date.now()
    }

    this.mannequins.set(config.id, mannequinData)
    return config.id
  }

  /**
   * Update mannequin wearables
   */
  static updateMannequinWearables(mannequinId: string, wearables: WearableItem[]): boolean {
    const mannequin = this.mannequins.get(mannequinId)
    if (!mannequin) {
      console.log(`Mannequin ${mannequinId} not found`)
      return false
    }

    console.log(`mannequin ${mannequin.entity} wearable is ` + wearables.map(w => w.urn))

    try {
      console.log(`🔄 MANNEQUIN: Updating ${mannequinId} with URNs:`, wearables.map(w => w.urn))
      
      // Update avatar shape wearables; ensure base avatar parts are present
      AvatarShape.createOrReplace(mannequin.entity as Entity, {
        id: mannequinId,
        emotes: [],
        wearables: [
          'urn:decentraland:off-chain:base-avatars:BaseMale',
          'urn:decentraland:off-chain:base-avatars:eyes_00',
          'urn:decentraland:off-chain:base-avatars:mouth_00',
          ...wearables.map(w => w.urn)
        ],
        showOnlyWearables: true,
      })

      // Update stored data
      mannequin.currentWearables = wearables
      mannequin.lastUpdate = Date.now()

      console.log(`Updated mannequin ${mannequinId} with ${wearables.length} wearables:`, wearables.map(w => w.name))
      return true
    } catch (error) {
      console.error(`Error updating mannequin ${mannequinId}:`, error)
      return false
    }
  }

  /**
   * Get mannequin data
   */
  static getMannequin(mannequinId: string): MannequinData | undefined {
    return this.mannequins.get(mannequinId)
  }

  /**
   * Get all mannequins
   */
  static getAllMannequins(): Map<string, MannequinData> {
    return new Map(this.mannequins)
  }

  /**
   * Remove mannequin
   */
  static removeMannequin(mannequinId: string): boolean {
    const mannequin = this.mannequins.get(mannequinId)
    if (!mannequin) {
      return false
    }

    try {
      engine.removeEntity(mannequin.entity as Entity)
      this.mannequins.delete(mannequinId)
      console.log(`Removed mannequin ${mannequinId}`)
      return true
    } catch (error) {
      console.error(`Error removing mannequin ${mannequinId}:`, error)
      return false
    }
  }

  /**
   * Start automatic updates for all mannequins
   */
  static startAutoUpdates(
    trendingCallback: () => Promise<WearableItem[]>,
    newestCallback: () => Promise<WearableItem[]>
  ): void {
    if (this.updateInterval) {
      console.log('Auto updates already running')
      return
    }

    console.log('Starting mannequin auto updates every 60 seconds')
    
    this.updateInterval = utils.timers.setInterval(async () => {
      try {
        await this.updateAllMannequins(trendingCallback, newestCallback)
      } catch (error) {
        console.error('Error during auto update:', error)
      }
    }, this.UPDATE_INTERVAL)
  }

  /**
   * Stop automatic updates
   */
  static stopAutoUpdates(): void {
    if (this.updateInterval) {
      utils.timers.clearInterval(this.updateInterval)
      this.updateInterval = null
      console.log('Stopped mannequin auto updates')
    }
  }

  /**
   * Update all mannequins with fresh data
   */
  private static async updateAllMannequins(
    trendingCallback: () => Promise<WearableItem[]>,
    newestCallback: () => Promise<WearableItem[]>
  ): Promise<void> {
    console.log('Updating all mannequins...')
    
    const trendingWearables = await trendingCallback()
    const newestWearables = await newestCallback()

    // Update trending mannequins (first 3)
    const trendingMannequins = Array.from(this.mannequins.entries())
      .filter(([id]) => id.includes('trending'))
      .slice(0, 3)

    trendingMannequins.forEach(([id, mannequin], index) => {
      if (trendingWearables[index]) {
        this.updateMannequinWearables(id, [trendingWearables[index]])
      }
    })

    // Update newest mannequins (next 3)
    const newestMannequins = Array.from(this.mannequins.entries())
      .filter(([id]) => id.includes('newest'))
      .slice(0, 3)

    newestMannequins.forEach(([id, mannequin], index) => {
      if (newestWearables[index]) {
        this.updateMannequinWearables(id, [newestWearables[index]])
      }
    })

    console.log('Mannequin update completed')
  }

  /**
   * Get mannequin statistics
   */
  static getStats(): {
    totalMannequins: number
    trendingMannequins: number
    newestMannequins: number
    lastUpdate: number
  } {
    const mannequins = Array.from(this.mannequins.values())
    const trendingCount = mannequins.filter(m => m.config.id.includes('trending')).length
    const newestCount = mannequins.filter(m => m.config.id.includes('newest')).length
    const lastUpdate = Math.max(...mannequins.map(m => m.lastUpdate))

    return {
      totalMannequins: this.mannequins.size,
      trendingMannequins: trendingCount,
      newestMannequins: newestCount,
      lastUpdate
    }
  }

  /**
   * Clear all mannequins
   */
  static clearAll(): void {
    this.stopAutoUpdates()
    
    for (const [id] of this.mannequins) {
      this.removeMannequin(id)
    }
    
    console.log('Cleared all mannequins')
  }
}
