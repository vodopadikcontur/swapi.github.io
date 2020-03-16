const urlAPi = 'https://swapi.co/api/';
const divMain = document.querySelector('.main');
let countClick = 0;
//Создание переменной таблицы
let table = document.createElement('table');
//Добавление класса таблице
table.setAttribute("class", "table");
//Переменная заголовка страницы
let heading = `<h1 class="main-h">List of Star Wars films</h1>`;
//Добавление кода HTML в таблицу
table.innerHTML = `
<thead>
    <tr>
        <th class="table-th" data-sort='0'><i class="fas fa-arrows-alt-v" data-sort='0'></i> Episode</th>
        <th class="table-th" data-sort='1'><i class="fas fa-arrows-alt-v" data-sort='1'></i> Episode id</th>
        <th class="table-th" data-sort='2'><i class="fas fa-arrows-alt-v" data-sort='2'></i> Year</th>
    </tr>
</thead>`;
//Переменная с tbody
let tableBody = `<tbody class='body-table'>
                </tbody>`;
//Отрисовка таблицы
divMain.insertAdjacentElement('beforeend', table);
//Добавление tbody в таблицу
table.insertAdjacentHTML('beforeend', tableBody);
let bodyT = document.querySelector('.body-table');
//Переменная с лоадером
let loaderMain = document.querySelector('.main-loader');

//Скрытие таблицы
table.style.display = 'none';

//Запрос к API и получение фильмов
function apiFilms () {
    fetch (`${urlAPi}films/`)
    .then(res => res.json())
    .then(data => getFilms(data))
    .catch(dataError => error());
}

//Обработка данных по фильму и отрисовка
function getFilms(value) {
    //console.log(typeof value);
     //Скрытие лоадера
     setTimeout(loader, 1500);
     //Отображение таблицы
    table.style.display = '';
    //отрисовка заголовка
    divMain.insertAdjacentHTML('beforebegin', heading);
    for (let i = 0; i <value.results.length; i++) {
            //Загрузка информации о фильме в переменные
            let filmTitle = value.results[i].title;
            let filmDate = new Date(value.results[i].release_date);
            let filmEpisode = value.results[i].episode_id;
            let filmDirector = value.results[i].director;
            let filmCrawl = value.results[i].opening_crawl;
            let filmProducer = value.results[i].producer
            //Переменная с HTML-кодом и даннымы фильмов
            let drawTitle = `
            <tr class="table-tr"> 
                <td data-num="${i}" class="table-td">${filmTitle}</td>
                <td data-num="${i}" class="table-td">${filmEpisode}</td>
                <td data-num="${i}" class="table-td">${filmDate.getFullYear()}</td>
            </tr>`;
            //Отрисовка таблицы с данными фильма
            bodyT.insertAdjacentHTML('beforeend', drawTitle);
            let arrayPers = value.results[i].characters;
            //Создание модального окна с данными (режиссер + открывающие титры)
            let drawModal = `
            <div class="modal-container" data-num="${i}">
            <div class="overlay" data-modal="close"></div>
            <div  class="modal-wrap" data-num="${i}">
                <div class="modal">
                <div class="modal-content" data-num="${i}" id="${i}">
                <h1><i class="fas fa-brain"></i> Director</h1>
                <p>${filmDirector}</p>
                <h1><i class="fab fa-black-tie"></i> Producer</h1>
                <p>${filmProducer}</p>
                <h1><i class="far fa-comment-dots"></i> Opening crawl</h1>
                <p>${filmCrawl}</p>
                <h1><i class="far fa-address-card"></i> Characters</h1>
                </div>
                </div>
                </div>
                </div>`;
                //Отрисовка модального окна
            divMain.insertAdjacentHTML('beforeend', drawModal);
               //Перебор массива с URL персонажей
            for (let j = 0; j < arrayPers.length; j ++) {
                fetch (arrayPers[j])
                .then(res1 => res1.json())
                .then(data1 => getPer(data1, i, value.results[i])); 
        
                }
    }
}

//Отрисовка имен персонажей и их пола
function getPer (value, i, result) {
    let drawPer = `
    <p>Name - ${value.name} | Gender - ${value.gender} | Born - ${value.birth_year}</p>`;
    let div = document.getElementById(`${i}`);
    div.insertAdjacentHTML('beforeend', drawPer);
    }

//Открытие модального окна с персонажами по клику
window.onclick = (event) => {
    let number = event.target.getAttribute('data-num');
    let modalContainer = document.querySelector('.modal-container[data-num="' + number + '"]');
    let modalWrap = document.querySelector('.modal-wrap[data-num="' + number + '"]');
    if (event.target.tagName === 'TD') {
        loaderMain.style.display = 'block';
        setTimeout(loader, 2000);
        modalContainer.classList.add('active');
        modalWrap.classList.add('active');
    }
    if (event.target.className === 'overlay') {
        let modalContainerActive = document.getElementsByClassName('modal-container active');
        let modalWrapActive = document.getElementsByClassName('modal-wrap active');
        modalContainerActive[0].classList.remove('active');
        modalWrapActive[0].classList.remove('active');
    }
}

//сортировка

document.querySelector('tr').onclick = function sort (event) {
    let value = event.target.getAttribute('data-sort');
    countClick++;
    let arrowFirst = document.querySelector('.fa-arrows-alt-v[data-sort="' + value + '"]');
    if(arrowFirst)  arrowFirst.className = 'fas fa-arrow-down';
    if(countClick % 2 === 0) {
        
    let sortedRows = Array.from(table.rows)
      .slice(1)
      .sort((rowA, rowB) => rowA.cells[value].innerHTML > rowB.cells[value].innerHTML ? 1 : -1);
      table.tBodies[0].append(...sortedRows);
      //отрисовка стрелки
      let arrow = document.querySelector('.fa-arrow-up[data-sort="' + value + '"]');
      arrow.className = 'fas fa-arrow-down';
}

      else {
        let sortedRows = Array.from(table.rows)
        .slice(1)
        .sort((rowA, rowB) => rowA.cells[value].innerHTML < rowB.cells[value].innerHTML ? 1 : -1);
        table.tBodies[0].append(...sortedRows);
        //отрисовка стрелки
        let arrow = document.querySelector('.fa-arrow-down[data-sort="' + value + '"]');
         arrow.className = 'fas fa-arrow-up'; 
      }
}
//скрытие loader
function loader () {
    loaderMain.style.display = 'none';
}
//функция ошибки
function error () {
    divMain.innerHTML ='<h1 class="main-h">Error</h1>';
}
apiFilms();