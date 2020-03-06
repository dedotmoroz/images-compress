Скачайте index.html и compress.js в одну папку.
Откройте index.html и загрузите изображение. Сжатая копия появится на странице.

Класс Compress имеет публичный метод attach, который инициализирует работы скрипта.

     const compress = new Compress(); 
     compress.attach(file, options);

Где атрибут file - обьект File (https://developer.mozilla.org/ru/docs/Web/API/File)

атрибут options - данные для обработки файла. 

         {
            quality: 1,
            minQuality: 0.8,
            size: 3000 * 1024,
            maxWidth: 1920,
            maxHeight: 1920,
            resize: true,
        }
