//Navigation Bar
const navBar = {
    pageSetup: ()=> {
        const scheduleButton = document.querySelector("#schedule")
        const addButton = document.querySelector("#navAdd")
        const eduButton = document.querySelector("#edu")
        const contactButton = document.querySelector("#contact")
        const clickedOut = document.querySelector(".plantSpace")

        clickedOut.addEventListener("click",navBar.hideOverlays)
        scheduleButton.addEventListener("click", navBar.calendar)
        addButton.addEventListener("click", navBar.add)
        eduButton.addEventListener("click", navBar.edu)
        contactButton.addEventListener("click", navBar.contact)
    },
    calendar: ()=> {
        console.log("Clicked calendar")
        navBar.hideOverlays()
        const scheduleOverlay = document.querySelector("#scheduleOverlay")
        scheduleOverlay.classList.remove("hidden")
    },
    add: ()=> {
        console.log("Clicked add")
        navBar.hideOverlays()
        const addOverlay = document.querySelector("#addOverlay")
        addOverlay.classList.remove("hidden")
    }, 
    edu: ()=> {
        console.log("Clicked edu")
    },  
    contact: ()=> {
        console.log("Clicked contact")
        navBar.hideOverlays()
        const contactOverlay = document.querySelector("#contactOverlay")
        contactOverlay.classList.remove("hidden")
    },
    hideOverlays: () => {
        const overlays = document.querySelectorAll(".navExtension")
        for(let overlay of overlays){
            overlay.classList.add("hidden")
        }
        console.log("hid all overlays")
    }
}

navBar.pageSetup()

//New Plant