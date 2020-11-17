window.addEventListener("DOMContentLoaded", start);

let meta;

let pageUrl = window.location.pathname;
console.log(pageUrl);
let htmlName = pageUrl.substring(pageUrl.lastIndexOf('/') + 1).replace('.html', '');
console.log(htmlName);
const pageName = htmlName;
const menuPageName = pageUrl.substring(pageUrl.lastIndexOf('/') + 1);
console.log('menuPageName', menuPageName);
const globalmenuContainer = document.querySelector(".js_globalmenu");

//henter url med SEO
const urlMeta = `https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/pages?slug=${pageName}`;

async function start() {
    //    console.log("nået start");

    getMenu(pageName);

    const globalmenuTemplate = document.querySelector(".js_globalmenu_template").content;
    const jsonUrl = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/pages?per_page=100";
    document.querySelector(".js_header_burger_icon").addEventListener("click", toggleHeaderBurgerIcon);

    async function fetchData() {
        const response = await fetch(jsonUrl);
        const jsonData = await response.json();
        json = jsonData;
        //        console.log(json);
        show(jsonData);
    }


    async function hentMeta() {
        const respons = await fetch(urlMeta);
        meta = await respons.json();

        console.log(meta);
        getMeta();
    }

    function show(menupunkter) {
        console.log("show menupunkter", menupunkter.length);

        menupunkter.sort((a, b) => a.menu_order - b.menu_order);

        console.log(menupunkter);

        menupunkter.forEach(menupunkt => {

            if (menupunkt.parent == 0 && menupunkt.slug != "forside" && menupunkt.slug != "det-praktiske" && menupunkt.slug != 'fagkatalog' && menupunkt.slug != "hojskole") {
                const template = globalmenuTemplate.cloneNode(true);

                template.querySelector(".js_globalmenu_menupunkt").textContent = menupunkt.title.rendered;
                template.querySelector(".js_globalmenu_menupunkt").href = `${menupunkt.slug}.html`;

                globalmenuContainer.appendChild(template);
            }
        });
    }

    function toggleHeaderBurgerIcon() {
        console.log("toggle menu");

        document.querySelector(".js_globalmenu").classList.toggle("css_globalmenu_hidden");

        let isHidden = document.querySelector(".js_globalmenu").classList.contains("css_globalmenu_hidden");

        if (isHidden == true) {
            document.querySelector(".js_header_burger_icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        } else {
            document.querySelector(".js_header_burger_icon").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        }

    }

    hentMeta();
    fetchData();
}


function getMeta() {
    document.querySelector(".js_meta_title").textContent = meta[0].seo_titel;
    document.querySelector(".js_meta_description").content = meta[0].seo_beskrivelse;
    document.querySelector(".js_meta_tags").content = meta[0].seo_tag;
}

/***** Vertikal menu  *****/

/*****

get Menu

*****/
/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("menu_transition").style.top = "0";
    document.getElementById("menu_transition").style.boxShadow = "0px 0px 3px rgba(155, 155, 155, 0.2)";
  } else {
    document.getElementById("menu_transition").style.top = "-150px";
    document.getElementById("menu_transition").style.boxShadow = "0px 0px 5px rgba(155, 155, 155, 0.2)";
  }
   prevScrollpos = currentScrollPos;
}

/*****

Globale variabler

*****/

// website url (index page)
let baseUrl = 'https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/';
let apiRoute;

// API route
let apiRouteMenu = 'wp-api-menus/v2/';
let apiRouteContent = 'wp/v2/';

// Routes
let urlRoutePage = 'page';
let urlRouteCategories = 'category';
let urlRoutePosts = 'posts';
let urlRouteMenu = 'menus';

// Parameters
let parameterGetOneHundred = '?per_page=100';

// Post types
let urlRouteFacilitet = 'facilitet';
let urlRouteFag = 'fag';
let urlRoutePersonale = 'person';

// pages, categories and posts data
let pages;
let categories;
let personale;
let faciliteter;

/*****

Globale templates og containers

*****/

// Container
let sideNavigationContainer = document.querySelector(".js_side_navigation");

// Templates
// Link
let sideNavigationLinkTemplate = document.querySelector(".js_side_navigation_link_template").content;
// List
let sideNavigationListTemplate = document.querySelector(".js_side_navigation_list_template").content;
// List item
let sideNavigationListItemTemplate = document.querySelector(".js_side_navigation_list_item_template").content;

async function getData(urlRoute, urlParameter) {

    if (urlRoute === 'category') {
        urlRoute = 'categories';
        apiRoute = apiRouteContent;
    } else if (urlRoute === 'post') {
        urlRoute = 'posts';
        apiRoute = apiRouteContent;
    } else if (urlRoute === 'page') {
        urlRoute = 'pages';
        apiRoute = apiRouteContent;
    } else if (urlRoute === 'nav_menu') {
        urlRoute = 'menus/';
    } else if (urlRoute === pageName) {
        urlRoute = 'menus';
        apiRoute = apiRouteMenu;
    } else {
        apiRoute = apiRouteContent;
    }

    let response = await fetch(`${baseUrl}${apiRoute}${urlRoute}${urlParameter}`);

    let data = await response.json();

    return data;
}

async function getMenu(menuName) {
    categories = await getData(urlRouteCategories, parameterGetOneHundred);
    //            console.log('Categories', categories);
    //
    //            console.log('createMenu');

    // Hent array liste med menuer
    let allMenus = await getData(menuName, '');
    //            console.log('menuName', menuName);
    //            console.log('allMenus', allMenus);

    // Hent alle menuer der skal vises på siden
    let menusOnPage = document.querySelectorAll("[data-menu]");

    menusOnPage = Array.prototype.slice.call(menusOnPage);
    //            console.log('menus', menusOnPage);

    for (let menu of menusOnPage) {
        //                console.log(menu.dataset.menu);
        //                console.log(menusOnPage);

        // Find den rigtige menu
        let findMenu = allMenus.find(allmenus => allmenus.name === menu.dataset.menu);

        // Hent menu detaljer
        let menuDetails = await getData(findMenu.taxonomy, findMenu.ID);

        if (menuDetails.items.length > 0) {
            createMenu(menuDetails, menu);
        }
    }

    let submenuButtons = document.querySelectorAll(".list__link.has-submenu");

    submenuButtons.forEach(submenuButton => {
        let buttonHeight = submenuButton.offsetHeight;
        //                console.log(buttonHeight);
        submenuButton.addEventListener("click", function (element) {
            // Hvad der er blevet klikket på
            let target = element.target;
            let targetSubmenu = submenuButton.parentNode.querySelector(".list__submenu");

            // Hvis det er vores pil, så stop a linket i at sende os til en anden side
            if (target.classList.contains("list__link-arrow")) {
                element.preventDefault();
                //                        if (targetSubmenu.classList.contains("is-open")) {
                //                            targetSubmenu.style.height = `0px`;
                //                        } else {
                //                            targetSubmenu.style.height = `${buttonHeight}px`;
                //                        }
                submenuButton.classList.toggle("is-open");
                submenuButton.parentNode.querySelector(".list__submenu").classList.toggle("is-open");
            }
            console.log(`Du klikkede på `, target);

        });
    });

}

function createMenu(menuDetails, menu) {

    function constructMenu(menuItems) {
        //                console.log('constructMenu', menuItems);

        var nav_html = '';

        for (let i = 0; i < menuItems.length; i++) {
            let title = menuItems[i]['title'];
            let href = `${menuItems[i]['title']}.html`;
            href = href.toLowerCase();
            let submenu = menuItems[i]['children'];
            let typeLabel = menuItems[i]['type_label'];
            let objectType = menuItems[i]['object'];

            if (typeLabel === 'fag') {
                href = `fag.html?id=${menuItems[i]['object_id']}`;
            } else if (typeLabel === 'facilitet') {

            } else if (typeLabel === 'Category') {
                let objectId = menuItems[i]['object_id'];

                let categoryDetails = categories.find(category => category.id === objectId);
                //                        console.log('categoryDetails', categoryDetails);

                if (categoryDetails.indtast_target_link != '') {
                    href = categoryDetails.indtast_target_link;
                }
            } else if (typeLabel === 'Page') {
                href = `${menuItems[i]['object_slug']}.html`;
            } else if (typeLabel === 'Custom Link') {
                href = menuItems[i]['url'];
            }

            if (submenu != null) {
                nav_html += `<li class="list__item"><a class="list__link has-submenu" href="${href}">${title} <span class="list__link-arrow"></span></a>`;
                nav_html += '<ul class="list__submenu">';


                nav_html += constructMenu(submenu);
                nav_html += '</ul>';
            } else {
                // Link til fagsingleview.html hvis det er en post, som har post typen "fag".
                nav_html += `<li class="list__item"><a class="list__link" href="${href}">${title}</a>`;
            }
            nav_html += '</li>';
        }
        return nav_html;
    }

    //            console.log('menuDetails', menuDetails)
    //            console.log('menu', menu);
    menu.innerHTML = `<ul class="list">${constructMenu(menuDetails.items)}</ul>`;

    console.log('globalMenuContainer', globalmenuContainer);
    const globalMenuItems = globalmenuContainer.querySelector(`a[href="${menuPageName}"]`);

    if (globalMenuItems != null) {
        globalMenuItems.classList.add("is-active");
    }

    console.log('globalMenuItems', globalMenuItems);

}
