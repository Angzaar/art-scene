import './polyfill'
import { initBuilding } from './building'
import { enableBuilderHUD } from './dcl-builder-hud/ui/builderpanel'
import { initGalleries } from './galleries'
import { getExplorerConfiguration } from '~system/EnvironmentApi'
import { getPreview } from './helpers/functions'
import {getPlayer} from "@dcl/sdk/players";
import { utils } from "./helpers/libraries";
import { executeTask} from "@dcl/sdk/ecs";
import { joinServer, setLocalUserId } from './server'
import { initStores } from './stores'
import { initDominos } from './dominos'
import { setupUi } from './ui/ui'
import { initShops } from './shops'

let admins:string[] = ["0xceba6b4186aae99bc8c3c467601bd344b1d62764"]

export function main() {
  getPreview().then(()=>{
    let data:any
    try{
      checkPlayer(data)
    }
    catch(e){
        console.log('cannot run deprecated function get explorer configuration', e)
    }
})
}

async function checkPlayer(hardwareData:any){
  let player = getPlayer()
  console.log('player is', player)
  if(!player){
      console.log('player data not set, backing off and trying again')
      utils.timers.setTimeout(()=>{
          checkPlayer(hardwareData)
      }, 100)
  }
  else{
    await initBuilding()
    await initStores()
    await initDominos()
    await initStores()
    await initShops()
    createPlayer(hardwareData, player)
  }
}

function createPlayer(hardwareData:any, player:any){
  const playerData = setLocalUserId(player)
  if (playerData) {
      executeTask(async () => {
        setupUi()

        if(admins.includes(playerData.userId)){
          enableBuilderHUD(true)
        }

          // const sceneInfo = await getSceneInformation({})
          // if (!sceneInfo) return

          // const sceneJson = JSON.parse(sceneInfo.metadataJson)
          // console.log("scene json is", sceneJson)

          // if(!sceneJson.iwb) return
          // await setRealm(sceneJson, hardwareData.clientUri)

          joinServer()
      })
  }
}