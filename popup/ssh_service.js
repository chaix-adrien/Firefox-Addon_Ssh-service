const header = {
  method: "GET",
  headers: new Headers({
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`firefox:ffext&`)}`
  })
};

function getDiskSpace() {
  fetch(endpoint + "disk/", header)
    .then(r => r.json())
    .then(r => {
      document.getElementById("space").style.width = r.percent + "%";
      document.getElementById("spaceAmount").innerText = r.left;
      document.getElementById("spaceAmount").style.opacity = 1;

    })
    .catch(r => {
      console.error(r);
    });
}

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function connect() {
  ip = document.querySelector("#ip").value;
  port = document.querySelector("#port").value;
  localStorage.setItem("ip", ip);
  localStorage.setItem("port", port);
}

function toggleNewService(btn) {
  const container = document.querySelector("#newServiceContainer");
  container.style.height = container.style.height === "20px" ? "0px" : "20px";
}

function saveServices() {
  localStorage.setItem(ip + ":" + port + ".services", JSON.stringify(services));
}

function toggleService(node) {
  const sw = node.querySelector(".serviceStatus");
  const on = sw.checked;
  fetch(endpoint + (sw.checked ? "start/" : "stop/") + node.serviceName, header)
    .then(r => r.json())
    .then(r => {
      sw.checked = r.running;
    })
    .catch(e => {
      sw.checked = !sw.checked;
    });
}
function addNewService(serviceName) {
  const node = htmlToElement(
    '<div class="flex service"><label class="deleteService">X</label><label class="serviceName">' +
    serviceName +
    '</label><div class="dash"></div><label class="switch"><input class="serviceStatus" type="checkbox" /><span class="slider round"></span></label></div>'
  );
  node.serviceName = serviceName;
  node.querySelector(".deleteService").onclick = () =>
    deleteService(serviceName);
  node.querySelector(".serviceStatus").onclick = () => toggleService(node);
  fetch(endpoint + serviceName, header)
    .then(r => r.json())
    .then(r => {
      node.querySelector(".serviceStatus").checked = r.running;
    })
    .catch(e => console.error(e));
  servicesContainer.appendChild(node);
  if (!services.includes(serviceName)) {
    services.push(serviceName);
    saveServices();
  }
}

function changeAdress() {
  ip = document.querySelector("#ip").value;
  localStorage.setItem("ip", ip);
  port = document.querySelector("#port").value;
  localStorage.setItem("port", port);
  endpoint = "http://" + ip + ":" + port + "/";
  servicesContainer.innerText = "";
  localStorage.setItem("lastEndpoint", endpoint)
  services =
    JSON.parse(localStorage.getItem(ip + ":" + port + ".services")) || [];
  services.forEach(s => addNewService(s));
  getDiskSpace();
}

function deleteService(serviceName) {
  services = services.filter(e => e !== serviceName);
  saveServices();
  Array.prototype.slice.call(servicesContainer.children).forEach(e => {
    if (e.querySelector(".serviceName").innerText === serviceName)
      servicesContainer.removeChild(e);
  });
}
const servicesContainer = document.querySelector(".services");

document.getElementById("openDevice").onclick = () => {
  const device = document.querySelector(".device")
  device.style.height = (device.style.height === "0px") ? "20px" : "0px"
}

document.querySelector("#addNewService").onclick = () => {
  addNewService(document.querySelector("#newServiceName").value);
  document.querySelector("#newServiceName").value = "";
};
document.querySelector("#connect").onclick = connect;
document.querySelector("#openNewService").onclick = () =>
  toggleNewService(document.querySelector("#openNewService"));
document.querySelector("#connect").onclick = changeAdress;
var ip = (document.querySelector("#ip").value = localStorage.getItem("ip"));
var port = (document.querySelector("#port").value = localStorage.getItem(
  "port"
));
var endpoint = "http://" + ip + ":" + port + "/";
var services =
  JSON.parse(localStorage.getItem(ip + ":" + port + ".services")) || [];
services.forEach(s => addNewService(s));
getDiskSpace();
