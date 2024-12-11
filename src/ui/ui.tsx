import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { createBuilderHUDPanel } from '../dcl-builder-hud/ui/builderpanel'
import { createDialogPanel } from './DialogPanel'
import { createNotificationUI } from './NotificationPanel'
import { uiSizer } from './helpers'
import { createLogo } from './logo'
import { createReservationAdmin } from './reservationAdmin'
import { createReservationCalendar } from './calendar'

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
  createReservationCalendar()
]
