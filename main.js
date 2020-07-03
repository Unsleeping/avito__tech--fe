let repoUL = document.querySelector('.repo__list'),
    liFirstChild = document.querySelector('.repo__item'),
    repList = [],
    testCounter = 0,
    arrayLength;

const searchInput = document.querySelector('.input__search');

import TOKEN from './config.js';

//create repo object and push into repList
const getStars = (url, name, lastCommit, html_url) => {
    let tempObj = {
        name: name,
        stars: -1,
        lastCommit: lastCommit,
        url: html_url
    };
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.setRequestHeader('Authorization', `token ${TOKEN}`);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            if (testCounter === arrayLength - 1) {
                test(repList);
            }
            tempObj.stars = JSON.parse(request.response).stargazers_count;
            repList.push(tempObj);
            testCounter += 1;
        } else {
            console.error(request.status);
        };
    });
    request.send();
};


//create creation counter
window.counterCreation = 1;


//create repoCard
const createElement = (item, typeAdding, event) => {
    /*
                <li class="repo__item">
                    <div class="container">
                        <div class="rep__title">Name2</div>
                        <div class="rep__content">
                            <div class="rep__stars">10</div>
                            <div class="rep__last--commit">Updated on 11 May</div>
                            <a class="rep__link" href='#'>link</a>
                        </div>
                    </div>
                </li>
    */

    let repoItem = document.createElement('li'),
        repContainer = document.createElement('div'),
        repContent = document.createElement('div'),
        repLink = document.createElement('a');

    typeAdding === 'begin' ? repoItem.setAttribute('data-num', window.counterCreation) : repoItem.setAttribute('data-num', typeAdding + 1);
    window.counterCreation += 1;


    repoItem.classList.add('repo__item');
    repContainer.classList.add('container');
    repoItem.classList.add(`${item.name}`);
    repContent.classList.add('rep__content');

    if (typeAdding !== 'begin') {
        repoItem.classList.add('colorized');
    }

    let dataContainer = `
    <i class="fab fa-github" style="position:absolute;"></i>
    <div class="rep__title">${item.name}</div>
    `

    let dataContent = `
    <div class="rep__stars"><i class="far fa-star"></i> : ${item.stars}</div>
    <div class="rep__last--commit">Updated: ${item.lastCommit}</div>
    <a class="rep__link" href='${item.url}' target='_blank'>${item.url}</a>
    
    `;

    repContainer.insertAdjacentHTML('afterbegin', dataContainer);
    repContent.insertAdjacentHTML('afterbegin', dataContent);

    repContainer.insertAdjacentElement('beforeend', repContent);

    repoItem.insertAdjacentElement('afterbegin', repContainer);
    // console.log(repoItem);

    liFirstChild = document.querySelector('.repo__item');

    typeAdding === 'begin' ? repoUL.append(repoItem) : repoUL.insertBefore(repoItem, liFirstChild);

    let liItems = document.querySelectorAll('.repo__item');

    if (typeAdding !== 'begin') {
        // console.log(repoUL);
        repoItem.style.opacity = '.5';
        liItems[typeAdding + 1].remove();
        pagination(event)
        if (liItems[2].classList.contains('colorized')) liItems[2].classList.remove('colorized');
    }
};


//check active page in paginator (recolor another pages)
const checkActive = (id) => {
    const lst = document.querySelectorAll('.paginator__num');
    lst.forEach(item => {
        if (item.id !== id) item.style.color = '#333';
        else item.style.color = 'red';
    })
};


//create another counter
window.counter = 1;


//листаем paginator
function pagination(event) {
    const count = 100, //всего записей
        cnt = 10; //сколько отображаем

    let div_num = document.querySelectorAll(".repo__item");

    const e = event || window.event;
    const target = e.target;

    if (target.tagName.toLowerCase() != "span") return;

    let id = `page${window.counter}`;
    window.counter += 1;
    if (window.counter > 10) window.counter = 1;
    let main_page = document.getElementById(id);

    id = target.id;

    const num_ = id.substr(4);
    const data_page = +target.dataset.page;

    checkActive(id);
    main_page.classList.remove("paginator_active");
    main_page = document.getElementById(id);
    main_page.classList.add("paginator_active");

    let j = 0;
    for (let i = 0; i < div_num.length; i++) {
        let data_num = div_num[i].dataset.num;
        if (data_num <= data_page || data_num >= data_page)
            div_num[i].style.display = "none";

    }
    for (let i = data_page; i < div_num.length; i++) {
        if (j >= cnt) break;
        div_num[i].style.display = "block";
        j++;
    }
}


//obtain repos from the server
const test = (repList) => {
    const request = new XMLHttpRequest(); //use constructor to create request
    const url = 'https://api.github.com/repositories';
    request.open('GET', url); // obtain data from the server and send there our url
    request.setRequestHeader('Authorization', `token ${TOKEN}`);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) { //obtain positive data from the server
            const list = JSON.parse(request.response);
            arrayLength = list.length;

            list.forEach((item, i) => {
                getStars(item.url, item.name, item.updated_at, item.html_url);
            });
            repList.sort(function(a, b) {
                if (a.stars > b.stars) {
                    return -1;
                }
                if (a.stars < b.stars) {
                    return 1;
                }
                // a должно быть равным b
                return 0;
            });
            repList.forEach((item, i) => {
                createElement(item, 'begin');
            });

            //Paginator
            const count = 100, //всего записей
                cnt = 10, //сколько отображаем сначала
                cnt_page = Math.ceil(count / cnt); //кол-во страниц

            //выводим список страниц
            const paginator = document.querySelector(".paginator");
            let page = "";

            for (let i = 0; i < cnt_page; i++) {
                page += "<span class=paginator__num data-page=" + i * cnt + "  id=\"page" + (i + 1) + "\">" + (i + 1) + "</span>";
            }
            paginator.innerHTML = page;

            //выводим первые записи {cnt}
            let div_num = document.querySelectorAll(".repo__item");

            for (let i = 0; i < div_num.length; i++) {
                if (i < cnt) {
                    div_num[i].style.display = "block";
                }
            }

            let main_page = document.getElementById("page1");
            main_page.classList.add("paginator_active");

        } else {
            console.error(request.status);
        };
    });
    request.send();
};


test(repList);


// const checkDupls = (i) => {
//     let liItems = document.querySelectorAll('.repo__item');
//     // console.log(liItems.length);
//     liItems.forEach((item, ind) => {
//         // console.log(item.classList[1]);
//         // console.log(liItems[i].classList[1]);
//         if (item.classList[1] === liItems[i].classList[1]) {
//             // liItems[ind].remove();
//             return;
//         }
//     });
// }


//search repo.name in repos below (works after coming back on that page in this version)
searchInput.addEventListener('input', () => {
    let lst = [];

    repList.forEach((item, i) => {
        lst.push(item.name)
    });

    if (lst.includes(searchInput.value)) {
        console.log(lst.indexOf(searchInput.value));
        createElement(repList[lst.indexOf(searchInput.value)], lst.indexOf(searchInput.value), event);
        // checkDupls(lst.indexOf(searchInput.value));
    }
});


//create repoCard after click  (works only in console in this version)
window.addEventListener('click', (event) => {
    const lstCard = ['rep__last--commit', 'rep__stars', 'rep__link', 'rep__title']
    repList = repList.slice(0, 100);
    let repoFind = [];

    if (!lstCard.includes(event.target.className)) return;

    repList.forEach(item => {
        if (item.name === event.path[3].className.split(' ')[1]) {
            repoFind.push(item.url.slice(19, ));
        }
    });

    const findUrlPath = repoFind[0];
    const url = 'https://api.github.com/repos/' + `${findUrlPath}`;

    if (findUrlPath === undefined) return;

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.setRequestHeader('Authorization', `token ${TOKEN}`);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;
        if (request.status === 200) {
            const repo = JSON.parse(request.response);
            console.log(repo);
            let tempObj = {
                name: repo.name,
                stars: repo.stargazers_count,
                lastCommit: repo.updated_at,
                photo: repo.owner.avatar_url,
                nickname: 0,
                userlink: 0,
                languages: repo.language,
                description: repo.description,
                contributers: 0
            }
            console.log(tempObj);
        } else {
            console.error(request.status);
        };
    });
    request.send();
});