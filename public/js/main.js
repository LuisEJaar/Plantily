//Navigation Bar
const navBar = {
    pageSetup: ()=> {
        const navButtons = document.querySelectorAll(".navButton")
        const clickedOut = document.querySelector(".plantSpace")
        const myGarden = document.querySelector("#garden")

        clickedOut.addEventListener("click",navBar.hideOverlays)
        
        for (let navButton of navButtons) {
            navButton.addEventListener("click", navBar.navButton)
        }

        myGarden.addEventListener("click", navBar.gardenButton)
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
    }
}

navBar.pageSetup()

//New Plant Button

const newPlant = {
}

newPlant.pageSetup()