//Navigation Bar
const navBar = {
    pageSetup: ()=> {
        const navButtons = document.querySelectorAll(".navButton")
        const clickedOut = document.querySelector(".plantSpace")

        clickedOut.addEventListener("click",navBar.hideOverlays)
        for (let navButton of navButtons) {
            navButton.addEventListener("click", navBar.navButton)
        }
    },
    navButton: (e)=> {
        let name = e.target.id
        let current = `#${name}` + "Overlay"
        const currentElement = document.querySelector(`${current}`)
        if (!currentElement.classList.contains("hidden")) {
            navBar.hideOverlays()
        } else {
            navBar.hideOverlays()
            currentElement.classList.remove("hidden")
        }
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

// const newPlant = {
//     pageSetup: ()=> {
//         const addPlant = document.querySelector("#addPlant")
//         addPlant.addEventListener("click", newPlant.plantIt)
//     }, 

//     plantIt: ()=> {
//         console.log("we planting")
//     }
// }

// newPlant.pageSetup()