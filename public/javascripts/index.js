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