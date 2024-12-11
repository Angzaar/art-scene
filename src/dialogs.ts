import { Dialog } from "dcl-npc-toolkit"
import { showDialogPanel } from "./ui/DialogPanel"
import { showReservationPopup } from "./ui/calendar"


export let welcomeDialog: Dialog[] = [
	{
		text: `Welcome to the Angzaar Art Gallery! Check out the latest artwork or reserve the entire building yourself! Once reserved, you can edit the building banner images and change the video and audio streams!`,
        isQuestion: true,
		buttons: [
            { label: `Reserve`, goToDialog:-1, triggeredActions:()=>{
				showDialogPanel(false)
                showReservationPopup(true)
			} },
            { label: `Close`, goToDialog:-1, triggeredActions:()=>{
				showDialogPanel(false)
			} },
		],
	}
]

export let alreadyPanel: Dialog[] = [
	{
		text: `Welcome back! To edit your reservation images, audio, or video, choose the Angzaar icon in the top right!`,
        isEndOfDialog: true,
	}
]