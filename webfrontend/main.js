document.getElementById("fileInput").addEventListener("change", handleFiles);

function handleFiles(event) {
  const files = event.target.files;
  for (let file of files) {
    processFile(file);
  }
}

function processFile(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const base64 = e.target.result;
    EXIF.getData(file, function () {
      const dateTime = EXIF.getTag(this, "DateTimeOriginal");
      const formatted = formatExifDate(dateTime);
      sendToUnity(base64, formatted);
    });
  };
  reader.readAsDataURL(file);
}

function formatExifDate(str) {
  if (!str) return null;
  const parts = str.split(/[: ]/); // ["2023","12","01","08","20","30"]
  return `${parts[0]}-${parts[1]}-${parts[2]}T${parts[3]}:${parts[4]}:${parts[5]}`;
}

function sendToUnity(imageBase64, timestamp) {
  const payload = JSON.stringify({
    image: imageBase64,
    timestamp: timestamp
  });
  window.unityInstance.SendMessage("GameManager", "OnReceiveImageData", payload);
}