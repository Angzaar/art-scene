import { customFunction, customFunction2, displaySkinnyVerticalPanel } from "./confirmMana"

export function getView(view:string){
    let v = uiViews.find($=> $.view === view)
    return v ? v.props : undefined
}

export function buildPopupActionView(actionData:any){
    let data:any = {
        view:"Popup"
    }

    return data
}

export let uiViews:any[] = [   
{
view:"Confirm_Mana",
props:{
    label:"Confirm Send Mana",
    text:"To CHANCE it, you must send the required mana.",
    // slug:"welcome-view",//
    // view:"welcome",
    buttons:[
        {
            label:"Send Mana",
            func:(data:any)=>{
                displaySkinnyVerticalPanel(false)
                customFunction()
            }
        },
        {
            label:"Go back",
            func:()=>{
                displaySkinnyVerticalPanel(false)
                customFunction2()
            }
        }
    ]
}
},
{
    view:"Cancel_Lottery",
    props:{
        label:"Confirm Cancel CHANCE",
        text:"Would you like to cancel this CHANCE? All NFTs will be returned to you.",
        // slug:"welcome-view",//
        // view:"welcome",
        buttons:[
            {
                label:"Confirm",
                func:(data:any)=>{
                    displaySkinnyVerticalPanel(false)
                    customFunction()
                }
            },
            {
                label:"Go back",
                func:()=>{
                    displaySkinnyVerticalPanel(false)
                    customFunction2()
                }
            }
        ]
    }
    },
]