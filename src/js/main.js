const elemList = document.querySelector('#List');


init();

async function init() {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('/service-work.js')
    .then(reg => console.log('SW registered!', reg))
    .catch(err => console.log(err));
  }
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', function(event) {
      console.log('before install prompt fired');
      event.preventDefault();  // 取消預設的直接跳出通知設定
      deferredPrompt = event;  // 將監聽到的install banner事件傳到deferredPrompt變數
      
      return false;
  });
  if(deferredPrompt) {   // 確定我們有「攔截」到chrome所發出的install banner事件
    deferredPrompt.prompt();   // 決定要跳出通知

    // 根據用戶的選擇進行不同處理，這邊我指印出log結果
    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);
      
      if(choiceResult.outcome === 'dismissed'){
        console.log('User cancelled installation');
      }else{
        console.log('User added to home screen');
      }
    });
    deferredPrompt = null; // 一旦用戶允許加入後，之後就不會再出現通知
  }
  await getData();
  
}
function getData() {
  fetch('http://localhost:3000/webDev')
    .then((res) => res.json())
    .then((data) => data.forEach((item) => {
      console.log(item);
      elemList.innerHTML = data.map((item) => `<li class="text-white text-regular">${item.item}</li>`).join("");
    }))
    .catch((err) => console.log(err));
}