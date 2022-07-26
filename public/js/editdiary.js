const editDiaryPage = {
    pageSetup: ()=> {
        const submitButton = document.getElementById("editSubmit")
        submitButton.addEventListener("click", editDiaryPage.editFunction)
    },

    editFunction: async ()=> {
        console.log("clicked")
        try {
            const response = await fetch("/editdiary", {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id': document.getElementById("_id").value,
                    "height": document.getElementById("plant_height").value,
                    "date": document.getElementById("date").value,
                    "notes": document.getElementById("plant_notes").innerText,
                    "entry": document.getElementById("entry").value
                })
            })
            location.assign("/")
        } catch(err) {
            console.log(err)
        }
    },
}

editDiaryPage.pageSetup()