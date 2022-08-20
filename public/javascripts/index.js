document.addEventListener('FilePond:addfilestart', (e) => {
    const buttons = document.querySelectorAll('.btn')
    for(const button of buttons){
        button.classList.add('disabled')
    } 
});

document.addEventListener('FilePond:addfile', (e) => {
    const buttons = document.querySelectorAll('.btn')
    for(const button of buttons){
        button.classList.remove('disabled')
    }
});

// plants/show modal changed buttons

const changeToggles = document.querySelectorAll(".enabler")

for(let changeToggle of changeToggles) {
    changeToggle.addEventListener('click', (e) => {
        let idString = e.target.id
        let targetId = idString.substring(0,idString.length-7)
        let targetInput = document.getElementById(`${targetId}`)
        if(targetInput.disabled === true){
            targetInput.disabled = false
        } else {
            targetInput.disabled = true
        }
        console.log(targetInput.disabled)
    })
}
