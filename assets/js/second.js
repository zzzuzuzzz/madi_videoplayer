 function view(type) {
    if (type == 'txt') {

        let xhr = new XMLHttpRequest();

        xhr.open('GET', '/assets/DB.txt');
        xhr.send();
        xhr.onload = function () {
            if (xhr.status !== 200) {
                console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            } else {

                let id = Number(window.location.search.split('')[1]);
                let videoId;

                let array = xhr.response;
                array.split(';').forEach(element => {

                    let result = element.split('-/-');
                    videoId = result[0]

                    if (result[0] == id) {
                        document.getElementsByClassName('card-title')[0].textContent = result[1]
                        document.getElementsByClassName('card-text')[0].textContent = result[2]
                        whyType(result[4], result[3])
                    }

                    videoArray.push(result);

                    changeName(id)
                });
            }

            let el = document.getElementById(id);
            el.scrollIntoView()
        }
    } else if (type == 'xml') {
        const xmlString = `
					<media>
						<item>
							<id>7</id>
							<title>Картинка 1</title>
							<description>some text 7</description>
							<path>video_6</path>
							<type>img</type>
						</item>
						<item>
							<id>8</id>
							<title>Картинка 8</title>
							<description>some text ewwewewfewfew 8</description>
							<path>video_2</path>
							<type>img</type>
						</item>
					</media>
					`;

        function xmlToObject(xml) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            const items = xmlDoc.querySelectorAll('item');
            for (const item of items) {
                let itemData = [];
                console.log(item.children)
                for (const child of item.children) {
                    itemData.push(child.textContent);
                }
                videoArray.push(itemData);
            }
        }

        xmlToObject(xmlString);
    } else if ('json') {
        const jsonData = {
            "one": {
                "id": 5,
                "title": "Видео 5",
                "description": "опять природа 5",
                "path": "video_5",
                "type": "video"
            },
            "two": {
                "id": 6,
                "title": "Видео 6",
                "description": "some text 6",
                "path": "video_6",
                "type": "video"
            }
        };

        Object.values(jsonData).map(item =>
            videoArray.push([
                item.id.toString(),
                item.title,
                item.description,
                item.path,
                item.type
            ]));
    }
}


 view('txt')
 setTimeout(view, 2000, 'json')
 setTimeout(view, 2000, 'xml')

