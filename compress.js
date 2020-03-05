class Compress {
    constructor() {
        this.defaultSettings = {
            quality: 1,
            minQuality: 0.8,
            size: 3000 * 1024,
            maxWidth: 1920,
            maxHeight: 1920,
            resize: true,
        };
    }
    attach(file, options) {
        const imageOptions = {
            fileType: file.type,
            startSize: file.size,
        };
        const imageSettings = {
            ...this.defaultSettings,
            ...imageOptions,
            ...options,
        };
        return this.compressImage(file, imageSettings);
    }

    compressImage(file, imageSettings) {
        const {
            maxWidth,
            maxHeight,
            startSize,
            quality,
            size,
            minQuality,
            fileType,
        } = imageSettings;

        return new Promise(resolve => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = e => {
                    resolve(e.target.result);
                };
            })
            .then(src => new Promise(resolve => {
                const img = document.createElement('img');
                img.src = src;
                img.onload = () => {
                    resolve(img);
                };
            }))
            .then(img => {
                const {
                    width,
                    height
                } = Compress.resize(maxWidth, maxHeight, img.naturalWidth, img.naturalHeight);
                return Compress.imageToCanvas(width, height, img);
            })
            .then(canvas => this.loopCompression(canvas, startSize, quality, size, minQuality))
            .then(base64 => {
                const base64str = base64.replace(/^data:image\/\w+;base64,/, '');
                const imgExt = `data:${fileType};base64,`;
                const outFile = Compress.base64ToFile(base64str, imgExt);
                Compress.postFileOnPage(outFile);
                return outFile;
            });
    }

    loopCompression(canvas, size, quality = 1, targetSize, targetQuality = 1) {
        const base64str = canvas.toDataURL('image/jpeg', quality);
        const len = base64str.replace(/^data:image\/\w+;base64,/, '').length;
        const newSize = (len - 814) / 1.37;
        if (newSize > targetSize || quality > targetQuality) {
            return this.loopCompression(canvas, newSize, quality - 0.1, targetSize, targetQuality);
        }
        return base64str;
    }

    static postFileOnPage(outFile) {
        const fileURL = URL.createObjectURL(outFile);
        const imgFile = document.createElement('img');
        imgFile.src = fileURL;
        document.body.appendChild(imgFile);
    }

    static resize(maxWidth, maxHeight, width, height) {
        if (!maxWidth && !maxHeight) {
            return {
                width,
                height
            };
        }
        const originalAspectRatio = width / height;
        const targetAspectRatio = maxWidth / maxHeight;
        let outputWidth;
        let outputHeight;
        if (originalAspectRatio > targetAspectRatio) {
            outputWidth = Math.min(width, maxWidth);
            outputHeight = outputWidth / originalAspectRatio;
        } else {
            outputHeight = Math.min(height, maxHeight);
            outputWidth = outputHeight * originalAspectRatio;
        }
        return {
            width: outputWidth,
            height: outputHeight
        };
    }

    static imageToCanvas(width, height, image) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas;
    }

    static base64ToFile(base64, mime = 'image/jpeg') {
        const byteString = window.atob(base64);
        const content = [];
        for (let i = 0; i < byteString.length; i++) {
            content[i] = byteString.charCodeAt(i);
        }
        return new window.Blob([new Uint8Array(content)], {
            type: mime
        });
    }
}