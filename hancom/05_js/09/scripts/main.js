const IMG_A = "https://picsum.photos/100?random=1";
const IMG_B = "https://picsum.photos/100?random=2";

const myImage = document.querySelector('#pic');

myImage.setAttribute('src', IMG_A);

myImage.onclick = () => {
    const mySrc = myImage.getAttribute('src');
    if(mySrc === IMG_A) {
        myImage.setAttribute('src', IMG_B);
    } else {
        myImage.setAttribute('src', IMG_A);
    }
};