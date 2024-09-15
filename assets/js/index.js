class DB 
{
    all()
    {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'assets/DB.txt');
        xhr.send();
        xhr.onload = function() {
            if (xhr.status != 200) {
                console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            } else {
                let array = xhr.response;
                let div = document.getElementById('cardsField')

                array.split(';').forEach(element => {
                    let result = element.split('-/-');

                    let mainDiv = document.createElement('div')
                    mainDiv.className = 'col-sm-4 mb-2'

                    let a = document.createElement('a')
                    a.href = '/detail.html?' + result[0]
                    a.className = 'card'

                    let img = document.createElement('img')
                    img.src = '/assets/images/' + result[3] + '.png'
                    img.className = 'card-img-top'
                    img.alt = 'Видео превью'

                    let bodyDiv = document.createElement('div')
                    bodyDiv.className = 'card-body'

                    let h = document.createElement('h5')
                    h.className = 'card-title'
                    h.textContent = result[1]

                    let p = document.createElement('p')
                    p.className = 'card-text'
                    p.textContent = result[2]

                    bodyDiv.append(h)
                    bodyDiv.append(p)

                    a.append(img)
                    a.append(bodyDiv)

                    mainDiv.append(a)

                    div.append(mainDiv)
                });
            }
        };
    }
};

let dataBase = new DB;
dataBase.all()

