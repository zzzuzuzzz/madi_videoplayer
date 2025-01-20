export default class DB {
    constructor() {
        this.db = [];
    }
    async readFile(fileType, filePath) {
        return new Promise(async (resolve, reject) => {
            try {
                switch (fileType) {
                    case 'txt':
                        const txtResponse = await fetch(filePath);
                        if (!txtResponse.ok) {
                            throw new Error(`Ошибка загрузки TXT файла: ${txtResponse.status} ${txtResponse.statusText}`);
                        }
                        const txtContent = await txtResponse.text();
                        const array = txtContent.split(';');
                        const data = array.map(element => {
                            let el = element.split('-/-')
                            return {
                                title: el[0],
                                description: el[1],
                                path: el[2],
                                type: el[3]
                            }
                        });
                        resolve(data);
                        break;

                    case 'json':
                        const jsonResponse = await fetch(filePath);
                        if (!jsonResponse.ok) {
                            throw new Error(`Ошибка загрузки JSON файла: ${jsonResponse.status} ${jsonResponse.statusText}`);
                        }
                        const jsonData = await jsonResponse.json();
                        resolve(Object.values(jsonData));
                        break;

                    case 'xml':
                        const xmlResponse = await fetch(filePath);
                        if (!xmlResponse.ok) {
                            throw new Error(`Ошибка загрузки XML файла: ${xmlResponse.status} ${xmlResponse.statusText}`);
                        }
                        const xmlText = await xmlResponse.text();

                        try {
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                            const items = xmlDoc.querySelectorAll('item');
                            const data = Array.from(items).map(item => {
                                const resultObj = Array.from(item.children).reduce((Obj, current) => {
                                    Obj[current.tagName] = current.textContent;
                                    return Obj
                                }, {});
                                resultObj.type = item.getAttribute('type');
                                return resultObj;
                            });
                            resolve(data);
                        } catch (error) {
                            reject(new Error(`Ошибка разбора XML: ${error.message}`));
                        }
                        break;

                    default:
                        reject(new Error(`Неподдерживаемый тип файла: ${fileType}`));
                        break;
                }
            } catch (error) {
                reject(new Error(`Ошибка чтения файла: ${error.message}`));
            }
        });
    }
    async loadAllData() {
        try {
            const [
                txtData,
                jsonData,
                xmlData
            ] = await Promise.all([
                this.readFile('txt', '/assets/DB.txt'),
                this.readFile('json', '/assets/DB.json'),
                this.readFile('xml', '/assets/DB.xml'),
            ]);
            this.db = [...txtData, ...jsonData, ...xmlData];
            this.db.forEach((item, index) => {
                item.id = (index + 1).toString()
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }
}