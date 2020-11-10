        /*****

        get Menu

        *****/

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
        let fag;
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


        document.addEventListener("DOMContentLoaded", start);

        function start() {
            getMenu(pageName);
        }

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
            console.log('Categories', categories);

            console.log('createMenu');

            // Hent menu
            let menu = await getData(menuName, '');
            console.log('menuName', menuName);

            // Hent menu detaljer
            let menuDetails = await getData(menu[0].taxonomy, menu[0].ID);
            console.log('menuDetails', menuDetails);

            if (menuDetails.items.length > 0) {
                createMenu(menuDetails.items);
            }

        }

        function createMenu(menuItems) {

            function constructMenu(menuItems) {
                console.log('constructMenu', menuItems);

                var nav_html = '';

                for (let i = 0; i < menuItems.length; i++) {
                    let title = menuItems[i]['title'];
                    let href = `${menuItems[i]['title']}.html`;
                    href = href.toLowerCase();
                    let submenu = menuItems[i]['children'];
                    let typeLabel = menuItems[i]['type_label'];
                    let objectType = menuItems[i]['object'];

                    if (typeLabel === 'fag') {
                        href = `fagsingleview.html?id=${menuItems[i]['object_id']}`;
                    } else if (typeLabel === 'Category') {
                        let objectId = menuItems[i]['object_id'];

                        let categoryDetails = categories.find(category => category.id === objectId);
                        console.log('categoryDetails', categoryDetails);

                        if (categoryDetails.indtast_target_link != '') {
                            href = categoryDetails.indtast_target_link;
                        }
                    } else if (typeLabel === 'Custom Link') {
                        href = menuItems[i]['url'];
                    }

                    if (submenu != null) {
                        nav_html += `<li class="list__item"><a class="list__link has-submenu" href="${href}">${title} <span class="list__link-arrow">⌄</span></a>`;
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

            sideNavigationContainer.innerHTML = `<ul class="list">${constructMenu(menuItems)}</ul>`;

            let submenuButtons = document.querySelectorAll(".list__link.has-submenu");

            submenuButtons.forEach(submenuButton => {
                let buttonHeight = submenuButton.offsetHeight;
                console.log(buttonHeight);
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
                        submenuButton.parentNode.querySelector(".list__submenu").classList.toggle("is-open");
                    }
                    console.log(`Du klikkede på `, target);

                });
            });
        }
