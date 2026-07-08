const flavor = document.querySelector('#flavor');
const result = document.querySelector('#result');

document.querySelector('#check').addEventListener('click', () => {
    if(flavor.value === 'chocolate') {
        result.textContent = '초코 아이스크림';
    } else if (flavor.value === 'vanilla') {
        result.textContent = '바닐라 아이스크림';
    } else {
        result.textContent = '딸기 아이스크림';
    }
});