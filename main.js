let repoUL = document.querySelector('.repo__list'),
    liFirstChild = document.querySelector('.repo__item'),
    repList = [],
    testCounter = 0,
    arrayLength;

const searchInput = document.querySelector('.input__search'),
    TOKEN = '9aae9c1f9249c12d94839323b5daac8ba83471a7';








































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
            tempObj.lastCommit = (JSON.parse(request.response).updated_at).slice(0, 10);
            // console.log(tempObj);
            repList.push(tempObj);
            testCounter += 1;
        } else {
            console.error(request.status);
        };
    });
    request.send();
};
// let pageNum = 1;

const createElement = (item, typeAdding) => {

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

    typeAdding === 'begin' ? repoUL.append(repoItem) : repoUL.insertBefore(repoItem, liFirstChild);
    liFirstChild = document.querySelector('.repo__item');
    let liItems = document.querySelectorAll('.repo__item');

    if (typeAdding !== 'begin') {
        // if (typeAdding + 1 <= pageNum * 10 && typeAdding + 1 > (pageNum - 1) * 10) {
        liItems[typeAdding + 1].remove();
        // }
        if (liItems[1].classList.contains('colorized')) liItems[1].classList.remove('colorized');
    }
};

const test = (repList) => {
    const request = new XMLHttpRequest(); //use constructor to create request
    url = 'https://api.github.com/repositories';
    request.open('GET', url); // obtain data from the server and send there our url
    request.setRequestHeader('Authorization', `token ${TOKEN}`);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) { //obtain positive data from the server
            // console.log(JSON.parse(request.response));
            const list = JSON.parse(request.response);
            arrayLength = list.length;

            list.forEach((item, i) => {
                // console.log(item);
                // tempObj = {
                //     name: item.name,
                //     stars: -1,
                //     lastCommit: (item.updated_at).slice(9),
                //     url: item.html_url
                // };
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
            console.log(repList);
            repList.forEach((item, i) => {
                // if (i >= (pageNum - 1) * 10 && i < (pageNum) * 10)
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
                page += "<span data-page=" + i * cnt + "  id=\"page" + (i + 1) + "\">" + (i + 1) + "</span>";
            }
            paginator.innerHTML = page;



            //выводим первые записи {cnt}
            let div_num = document.querySelectorAll(".repo__item");
            // console.log(div_num);
            for (let i = 0; i < div_num.length; i++) {
                if (i < cnt) {
                    div_num[i].style.display = "block";
                }
            }
            let main_page = document.getElementById("page1");
            main_page.classList.add("paginator_active");

            //листаем
            function pagination(event) {
                const e = event || window.event;
                const target = e.target;
                const id = target.id;

                if (target.tagName.toLowerCase() != "span") return;

                const num_ = id.substr(4);
                const data_page = +target.dataset.page;
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





        } else {
            console.error(request.status);
        };
    });
    request.send();
};

test(repList);

const checkDupls = (i) => {
    let liItems = document.querySelectorAll('.repo__item');
    console.log(liItems.length);
    liItems.forEach((item, ind) => {
        // console.log(item.classList[1]);
        // console.log(liItems[i].classList[1]);
        if (item.classList[1] === liItems[i].classList[1]) {
            // liItems[ind].remove();
            return;
        }
    });
}


searchInput.addEventListener('input', () => {
    let lst = [];


    repList.forEach((item, i) => {
        lst.push(item.name)
    });

    if (lst.includes(searchInput.value)) {
        createElement(repList[lst.indexOf(searchInput.value)], lst.indexOf(searchInput.value));
        checkDupls(lst.indexOf(searchInput.value));
    }


});