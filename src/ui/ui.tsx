import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { createBuilderHUDPanel } from '../dcl-builder-hud/ui/builderpanel'
import { createDialogPanel } from './DialogPanel'
import { createNotificationUI } from './NotificationPanel'
import { uiSizer } from './helpers'
import { createLogo } from './logo'
import { createReservationAdmin } from './reservationAdmin'
import { createReservationCalendar } from './calendar'
import { createStoreUI } from './createStoreUI'
import { createEditChanceUI } from './editChance'
import { creatorChanceUI } from './createChanceUI'
import { createPlayChanceUI } from './createPlayChanceUI'
import { createSkinnyVerticalPanel } from './confirmMana'
import { createShopReservationAdmin } from './shopReservationAdmin'
import { createNewChance } from './createNewChance'
import { createSendChanceUI } from './sendChanceItems'
import { createDebugPanel } from './debugPanel'
import { createElizaChat } from './createElizaChatbox'
import { createElizaWelcomeUI } from './createElizaWelcome'
import { createAgentBasicsUI } from './agent-creation/agentBasics'
import { createAgentCreatorUI } from './createElizaCreator'
import { createAgentUIConfirm } from './agent-creation/confirmCreate'
import { createShowReservePopup } from './shopReservePopup'
import { createMannequinInfoPanel } from './mannequinInfoPanel'
import { questUI } from 'lsc-questing-dcl'
import { createShoppingUI } from './ShoppingUI'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(uiSizer)
}

export let uiComponent = () => [
  createBuilderHUDPanel("angzaar-art-scene"),
  createDialogPanel(),
  createNotificationUI(),
  createLogo(),
  createReservationAdmin(),
  createReservationCalendar(),
  createStoreUI(),
  createEditChanceUI(),
  creatorChanceUI(),
  createPlayChanceUI(),
  createSkinnyVerticalPanel(),
  createShopReservationAdmin(),
  createNewChance(),
  createSendChanceUI(),
  createDebugPanel(),
  createElizaChat(),
  createShowReservePopup(),
  createMannequinInfoPanel(),


  //eliza creation
  createElizaWelcomeUI(),
  createAgentBasicsUI(),
  createAgentCreatorUI(),
  createAgentUIConfirm(),
  questUI(),

  createShoppingUI()
]
