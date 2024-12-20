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
import { createChanceUI } from './editChance'
import { creatorChanceUI } from './createChanceUI'
import { createPlayChanceUI } from './createPlayChanceUI'
import { createSkinnyVerticalPanel } from './confirmMana'

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
  createChanceUI(),
  creatorChanceUI(),
  createPlayChanceUI(),
  createSkinnyVerticalPanel()
]
