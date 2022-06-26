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

const myGarden = {
    pageSetup: () => {
        const deleteButtons = document.querySelectorAll(".deleteButton")
        const editButtons = document.querySelectorAll(".editButton")

        for(button of deleteButtons) {
            button.addEventListener("click", myGarden.deleteFunction)
        }

        for(button of editButtons){
            button.addEventListener("click", myGarden.editFunction)
        }
    }, 

    deleteFunction: async (e)=> {
        const plantName = e.target.id
        try {
            const response = await fetch('plants', {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'name': plantName
                })
            })
            const data = await response.json()
            location.reload()
        } catch(err) {
            console.log(err)
        }
    }, 

    editFunction: async (e)=> {
        console.log("Clicked Edit")
        const plantBox = e.target.parentNode.parentNode.parentNode.children[1]
        const name = plantBox.children[1].innerHTML
        const plant_date = plantBox.children[4].innerHTML
        const type = plantBox.children[7].innerHTML
        const height = plantBox.children[10].innerHTML
        const sun_exposure = plantBox.children[13].innerHTML
        const watering_schedule = plantBox.children[16].innerHTML

        try {
            const response = await fetch('plants', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "name": name,  
                    "plant_date": plant_date,
                    "type": type,
                    "height": height,
                    "sun_exposure": sun_exposure,
                    "watering_schedule": watering_schedule
                })
            })
            const data = await response.json()
            location.reload()
        } catch(err) {
            console.log(err)
        }
    }
}

myGarden.pageSetup()