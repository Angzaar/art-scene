import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';
import { IWBButton } from './button';
import { sendServerMessage } from '../server';
import { getFormattedDayString, getStartOfDayTimestampUTC } from '../helpers/functions';
import { reservations } from '../mainGallery';

let show = false
let view = "calendar"


let displayedYear: number = new Date().getFullYear()
let displayedMonth: number = new Date().getMonth() // 0-based (0 = January)
let selectedDays: string[] = [] // List of selected days in YYYY-MM-DD format
let selectedHours: number[] = [] // List of selected days in YYYY-MM-DD format//
let selectedDay:string = ""
let locationId = ""
let maxAllowedDays = 7
let shopId:number = 0

let buttons:any[] = [
    {label:"Confirm", pressed:true, width:10, height:10, fontBigScreen:25, fontSmallScreen:20, func:()=>{
        const timestamp = getStartOfDayTimestampUTC(new Date(selectedDays[0]))

        sendServerMessage(locationId === "main" ? 'art-gallery-reservation' :  'shop-reservation', {locationId:locationId, startDate:timestamp, length:selectedDays.length})
        showReservationPopup(false)
        selectedDays.length = 0
        },
        displayCondition:()=>{
            return selectedDays.length > 0 ? true : false
        }
    },
    {label:"Cancel", pressed:false,  width:10, height:10, fontBigScreen:25, fontSmallScreen:20, func:()=>{
        showReservationPopup(false)
        selectedDays.length = 0
    }
}
]

export function showReservationPopup(value:boolean, id?:any){
    show = value

    if(show){
      view = "calendar"
      selectedHours.length = 0
      selectedDays.length = 0
      locationId = id

      console.log('id is', id)

      if(id){
        shopId = id
        maxAllowedDays = 14
      }else{
        maxAllowedDays = 7
      }
    }
}

export function createReservationCalendar() {
    return (
        <UiEntity
            key={resources.slug + "reservation-calendar-panel"}
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
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
            }}
        >

<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '95%',
                height: '95%',
            }}
            onMouseDown={()=>{
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '40%',
                height: '100%',
            }}
        >
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '10%',
            }}
            uiText={{value:maxAllowedDays === 14 ? "Shoppe " + shopId + " Calendar" : "Art Gallery Calendar", fontSize: sizeFont(40,30)}}
        />

{/* <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"Lot Size: " + locationSize, fontSize: sizeFont(25,15)}}
        />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"Scene Size: 60MB", fontSize: sizeFont(25,15)}}
        />
        </UiEntity>
 */}


<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '15%',
            }}
            uiText={{value:shopId !== 0 ?
              "Reservations grant you the ability to modify the banner images, the mannequins, and the audio in the Shoppe building."
              
              : "Reservations grant you the ability to modify the banner images across the building and stream video content into the center.", fontSize: sizeFont(30,15)}}
        />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '10%',
            }}
            uiText={{value:"**Premium reservations for longer periods will be activated later**", fontSize: sizeFont(30,15)}}
        />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '10%',
            }}
            uiText={{value:"Maximum Days - " + maxAllowedDays, fontSize: sizeFont(40,20)}}
        />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '10%',
            }}
            uiText={{value:"Days Selected - " + selectedDays.length, fontSize: sizeFont(40,20)}}
        />

        {generateButtons(buttons)}

        </UiEntity>


<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '60%',
                height: '100%',
            }}
        >


<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
        >
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            uiText={{value:"<", fontSize: sizeFont(40,30)}}
            onMouseDown={()=>{
                navigateMonth("backward")
            }}
        />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '10%',
            }}
            uiText={{value:"" + new Date(displayedYear, displayedMonth).toLocaleString('default', { month: 'long' }) + " " + displayedYear, fontSize: sizeFont(40,30)}}
        />


<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            uiText={{value:">", fontSize: sizeFont(40,30)}}
            onMouseDown={()=>{
                navigateMonth("forward")
            }}
        />


        </UiEntity>

        <UiEntity
            uiTransform={{
              display: view === "day" ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '10%',
            }}
            uiText={{value:"" + getFormattedDayString(selectedDay), fontSize: sizeFont(30,20)}}
        />

            {/* calendar grid */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
                flexWrap:'wrap',
                display: show && view === "calendar" ? "flex" :"none"
            }}
        >
               {
                show && 
                view === "calendar" && 
                generateCalendarGrid()
            }
        </UiEntity>
</UiEntity>
    
        </UiEntity>

        </UiEntity>
    );
}

export function generateButtons(data:any){
    let arr:any[] = []
    data.forEach((button:any)=>{
        arr.push(<IWBButton button={button} buttons={data.buttons} />)
    })
    return arr
}

// Function to check if a day can be selected
const canSelectDay = (date: string) => {
  if (selectedDays.length === 0) return true // First day can always be selected

  const firstDay = new Date(selectedDays[0])
  const lastDay = new Date(selectedDays[selectedDays.length - 1])
  const currentDay = new Date(date)

  // Check if the new day is contiguous
  const isContiguous =
    (currentDay.getTime() === firstDay.getTime() - 86400000) || // Previous day
    (currentDay.getTime() === lastDay.getTime() + 86400000)    // Next day

  // Ensure the total selection does not exceed the limit
  const withinLimit = selectedDays.length < maxAllowedDays

  return isContiguous && withinLimit
}

const canSelectHour = (hour: number): boolean => {
  if (selectedHours.length === 0) return true // First hour can always be selected

  const firstHour = selectedHours[0]
  const lastHour = selectedHours[selectedHours.length - 1]

  const maxAllowedHours = 4 // Maximum number of contiguous hours

  // Check if the new hour is contiguous
  const isContiguous = hour === firstHour - 1 || hour === lastHour + 1

  // Ensure the total selection does not exceed the limit
  const withinLimit = selectedHours.length < maxAllowedHours

  return isContiguous && withinLimit
}

// Function to handle day selection
const selectDay = (date: string) => {
  if (canSelectDay(date)) {
    selectedDays.push(date)
    selectedDays.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Keep days sorted
  } else {
    console.log("Cannot select this day: Maximum days exceeded or not contiguous.")
  }
}


// Navigation handlers for month navigation
const navigateMonth = (direction: "forward" | "backward") => {
  view = "calendar"
  selectedDay = ""

    if (direction === "forward") {
      if (displayedMonth === 11) {
        displayedMonth = 0
        displayedYear++
      } else {
        displayedMonth++
      }
    } else if (direction === "backward") {
      if (displayedMonth === 0) {
        displayedMonth = 11
        displayedYear--
      } else {
        displayedMonth--
      }
    }
  }

// Function to filter reservations by location and date
const getLocationReservations = (locationId: number) => {
  //   let location = locationsMap.get(locationId)
  //   if(!location || !location.reservations){
  //       return []
  //   }
  // return location.reservations
  return reservations
}

const getReservedDatesForMonth = (locationId: number) => {
  const reservedDates: Set<string> = new Set()
  const locationReservations:any = getLocationReservations(locationId)

  locationReservations.forEach((reservation:any) => {
    const start = new Date(reservation.startDate * 1000) // Convert to milliseconds
    const end = new Date(reservation.endDate * 1000)

    let current = new Date(start)
    while (current <= end) {
      const currentMonth = current.getMonth()
      const currentYear = current.getFullYear()

      if (currentMonth === displayedMonth && currentYear === displayedYear) {
        reservedDates.add(current.toISOString().split('T')[0]) // Format as YYYY-MM-DD
      }
      current.setDate(current.getDate() + 1)
    }
  })

  return reservedDates
  }

// Function to generate the calendar grid
const generateCalendarGrid = () => {

    const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1).getDay() // Day of the week
  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate() // Total days in the month
  const reservedDates = getReservedDatesForMonth(0)
  const today = new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format


  const rows = 5 // 5 rows for weeks
  const columns = 7 // 7 columns for days of the week
  const cells = []

  let dayCounter = 1 - firstDayOfMonth // Start counting days, considering the offset for the first day

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const date = new Date(displayedYear, displayedMonth, dayCounter).toISOString().split('T')[0]
      const isValidDay = dayCounter > 0 && dayCounter <= daysInMonth
      const isPastDay = isValidDay && date < today // Check if the day is in the past


      // Determine the cell color
      let cellColor = Color4.Gray() // Default for invalid days
      if (isValidDay) {
        if(isPastDay){}
        else if (reservedDates.has(date)) {
          cellColor = resources.colors.opaqueBlue // Reserved days
        } else if (selectedDays.includes(date)) {
          cellColor = resources.colors.opaquePurple // Selected days
        } else {
          cellColor = resources.colors.opaqueGreen// Open days
        }
      }

      cells.push(
        <UiEntity
          key={`${row}-${col}`} // Unique key for each cell
          uiTransform={{
            width: `${12}%`, // Divide width evenly across columns
            height: `12%`, // Divide height evenly across rows
            margin: { top: `1%`, left: `1%` },
          }}
          uiBackground={{ color: cellColor }}
          uiText={{ value: isValidDay ? String(dayCounter) : '', fontSize: 20 }}
          onMouseDown={() => {
            if (isValidDay && !isPastDay && !reservedDates.has(date)) {
              selectDay(date) // Handle day selection
              // toggleDaySelection(date) // Handle toggling day selection
            }
          }}
        />
      )

      dayCounter++ // Increment day counter
    }
  }
  return cells
  }
  
  
  