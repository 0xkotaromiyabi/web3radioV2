// Polyfill/Guard for window.ethereum redefinition error
(function () {
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function (obj, prop, descriptor) {
        if (prop === 'ethereum' && obj === window && window.ethereum) {
            console.warn('Blocked attempt to redefine window.ethereum to avoid crash.');
            return obj;
        }
        return originalDefineProperty.apply(this, arguments);
    };
})();

// Detect extension mode and apply body class
if (window.chrome && window.chrome.runtime && window.chrome.runtime.id) {
    document.body.classList.add('extension-mode');
}
