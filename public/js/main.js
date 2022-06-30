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
            button.addEventListener("click", myGarden.editButton)
        }
    }, 

    deleteFunction: async (e)=> {
        const plantId = e.target.parentNode.children[0].innerHTML
        try {
            const response = await fetch("/deleteplant", {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id': plantId
                })
            })
            const data = await response.json()
            location.reload()
        } catch(err) {
            console.log(err)
        }
    }, 

    editButton: async (e)=> {
        const plantId = e.target.parentNode.children[0].innerHTML
        console.log(plantId)
        try {
            const response = await fetch(`/editplant/${plantId}`, {
                method: 'get'
            }) 
        } catch(err) {
            console.log(err)
        }
    }
}

myGarden.pageSetup()