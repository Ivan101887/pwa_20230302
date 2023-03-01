const elemList = document.querySelector('#List')

init();

async function init() {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('/service-work.js')
    .then(reg => console.log('SW registered!', reg))
    .catch(err => console.log(err));
  }
  getData();
}
function getData() {
  fetch('http://localhost:3000/posts')
    .then((res) => res.json())
    .then((data) => data.forEach((item) => {
      console.log(item);
    }))
    .catch((err) => console.log(err));
}