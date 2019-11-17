
const header = {
  method: "POST",
  headers: new Headers({
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`firefox:ffext&`)}`
  })
};


function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

browser.contextMenus.create({
  id: "remote-dl",
  title: "Télecharger sur la Raspy",
  contexts: ["link"],
  "icons": {
    "16": "./icon/icon.png",
    "32": "./icon/icon.png"
  }
}, onCreated);

browser.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case "remote-dl":
      console.log(info, tab);
      const lastEndpoint = localStorage.getItem('lastEndpoint')
      console.log(lastEndpoint)
      header.body = JSON.stringify({ target: info.linkUrl })
      fetch(lastEndpoint + "dl/", header).then(console.log).catch(console.log)
      break;
  }
})
