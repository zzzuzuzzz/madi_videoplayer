export class PlaylistLoader {
    constructor() {
        this.content = [];
    }

    async loadContent() {
        if (await this.fileExists('./content.json')) {
            await this.loadFromJson();
            console.log('loaded from json');
        }

        if (await this.fileExists('./content.txt')) {
            await this.loadFromTxt();
            console.log('loaded from txt');
        }

        if (await this.fileExists('./content.xml')) {
            await this.loadFromXml();
            console.log('loaded from xml');
        }
    }

    getContent() {
        return this.content;
    }

    async fileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async loadFromJson() {
        try {
            const response = await fetch('content.json');
            const data = await response.json();
            if (Array.isArray(data)) {
                this.content = this.content.concat(data);
            }
        } catch (error) {
            console.error('Error loading JSON data:', error);
        }
    }

    async loadFromXml() {
        try {
            const response = await fetch('content.xml');
            const data = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const content = xmlDoc.getElementsByTagName("media");
            this.content = this.content.concat(Array.from(content[0].children).map(item => {
                const content = {
                    isVideo: item.tagName == "video",
                    src: item.getElementsByTagName("src")[0].textContent,
                    title: item.getElementsByTagName("title")[0].textContent
                }
                if (content.isVideo) {
                    content.thumbnail = item.getElementsByTagName("thumbnail")[0].textContent;
                }
                return content;
            }));
        } catch (error) {
            console.error('Error loading XML data:', error);
        }
    }

    async loadFromTxt() {
        try {
            const response = await fetch('content.txt');
            const data = await response.text();
            const lines = data.split('\n');
            this.content = this.content.concat(lines.map(line => {
                const txtContent = line.split(': ');
                if (txtContent[0] == "image") {
                    const [src, title] = txtContent[1].split(', ').map(item => item.trim());
                    return {src, title};
                }
                const [src, thumbnail, title] = txtContent[1].split(', ').map(item => item.trim());
                return {src, thumbnail, title, isVideo: txtContent[0] == "video"};
            }));
        } catch (error) {
            console.error('Error loading TXT data:', error);
        }
    }
}
