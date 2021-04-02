function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject();
    }

    const scriptElement = document.createElement('script');

    scriptElement.onload = function () {
      resolve();
    };
    scriptElement.onerror = function () {
      reject();
    };
    scriptElement.src = url;

    document.body.appendChild(scriptElement);
  });
}

export default loadScript;
