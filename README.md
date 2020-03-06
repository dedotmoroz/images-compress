Скачайте index.html и compress.js в одну папку.<br>
Откройте index.html и загрузите изображение. Сжатая копия появится на странице.<br>
Класс Compress имеет публичный метод attach, который инициализирует работы скрипта.<br>

     const compress = new Compress(); 
     compress.attach(file, options);

Где атрибут file - обьект File (https://developer.mozilla.org/ru/docs/Web/API/File) <br>
атрибут options - данные для обработки файла. <br>

         {
            quality: 1,
            minQuality: 0.8,
            size: 3000 * 1024,
            maxWidth: 1920,
            maxHeight: 1920,
            resize: true,
        }
