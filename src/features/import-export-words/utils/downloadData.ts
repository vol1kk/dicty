export default function downloadData<T>(data: T, fileName = "data") {
  const encodedData = encodeURIComponent(JSON.stringify(data));
  const jsonString = `data:text/json;charset=utf-8,` + encodedData;

  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${fileName}.json`;

  link.click();
}
