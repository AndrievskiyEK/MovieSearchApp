const bodyNode = document.body;
const searchInputNode = document.getElementById("searchInput");
const searchButtonNode = document.getElementById("searchBtn");
const searchResultNode = document.getElementById("searchResult");

const contenBtnCloseNode = document.getElementById("contenBtnClose");
const moviePageNode = document.querySelector(".movie__page");


//Функции
//---------------Функции поиска фильмов--------------
//получение данных с input
const searchMovie = (event) => {
    event.preventDefault();
    const searchRequest = searchInputNode.value;
    console.log(searchRequest);
    findMovies(searchRequest);
};
//Формирование запроса 
const findMovies = (searchRequest) => {
    //Проверка на пустую строку и тип данных
    if(!searchRequest || typeof searchRequest !== "string" || !searchRequest.trim()){
        alert("Введите название фильма на английском языке. Название не может быть пустым или состоять из пробела");
        return;
    }
    //Формируем запрос  
    fetch(`https://www.omdbapi.com/?apikey=12156971&s=${searchRequest}`)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw new Error('Ошибка при обмене с сервером');
    })
      .then((result) => {
        const movies = result.Search;
        console.log(movies);
        renderMoviesList(movies);
      })
};

const renderMoviesList = (movies) => {
    if (!Array.isArray(movies) || movies.length === 0) {
      alert(
        "Фильмы не найдены. Проверьте правильность ввода. Пишите на английском без очепяток."
      );
      return;
    }

    searchResultNode.innerHTML = "";

    movies.forEach((movie) => {
        /*----Шаблон из HTML----
        <li class="result__movie" id="${imdbID}">
            <img src="./resources/film_promo.png" alt="обложка фильма" class="result__movie-image"/>
            <div class="result__movie-wrapper">
                <h2 class="result__movie-title">Batman Begins</h2>
                <p class="result__movie-year">2005</p>
                <p class="result__movie-type">Фильм</p>
            </div>
        </li>*/
        const imdbID = movie.imdbID;
        const poster = movie.Poster;
        const title = movie.Title;
        const year = movie.Year;
        const type = movie.Type;

        //формируем DOM
        //объявляем элементы
        const movieItem = document.createElement("li");
        const moviePoster = document.createElement("img");
        const movieDescription = document.createElement("div");
        const movieDescriptionTitle = document.createElement("h2");
        const movieDescriptionYear = document.createElement("p");
        const movieDescriptionType = document.createElement("p");
        //добавляем класс к элементам
        movieItem.className = "result__movie";
        moviePoster.className = "result__movie-image";     
        movieDescription.className = "result__movie-wrapper";
        movieDescriptionTitle.className = "result__movie-title";
        movieDescriptionYear.className = "result__movie-year";
        movieDescriptionType.className = "result__movie-type";
        //добавляем информацию
        movieItem.setAttribute("data-action", "click")
        movieItem.id = imdbID; 
        moviePoster.alt = "обложка фильма";
        moviePoster.src = poster;  
        movieDescriptionTitle.innerText = title;
        movieDescriptionYear.innerText = year;
        movieDescriptionType.innerText = type;
        
        //Устанавливаем связь между элементами
        searchResultNode.appendChild(movieItem);
        movieItem.appendChild(moviePoster);
        movieItem.appendChild(movieDescription);
        movieDescription.appendChild(movieDescriptionTitle);
        movieDescription.appendChild(movieDescriptionYear);
        movieDescription.appendChild(movieDescriptionType);
    });
};

//---------------Функции выбора фильма и открытия карточки фильма--------------

// получаем ID фильма который выбрали
const searchIdMovieNode = (event) => {
    //Проверяем, что клик был не по списку с фильмом
    if (event.target.dataset.action !=="click")return;
    const movieCardNode = event.target.closest(".result__movie");
    const movieId = movieCardNode.id;
    console.log(movieId);
    console.log(typeof(movieId));
    requestMovieContent(movieId)
};


// Открываем окно с информацией о фильме
const requestMovieContent = (movieId) => {
     //Проверка на пустую строку и тип данных
     if(!movieId || typeof movieId !== "string" || !movieId.trim()){
        alert("Неверный IMDb ID фильма");
        return;
    }
  
    fetch(`https://www.omdbapi.com/?apikey=12156971&i=${movieId}`)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw new Error('Ошибка при обмене с сервером');
    })
      .then((result) => {
        const movie = result;
        console.log(movie);
        openMovieContent();
        renderMovieContent(result);
      })
};

// Открываем окно с подробностями о фильме: меняем атрибут на visible, фиксируем body, запускаем функцию отрисовки фильма
const openMovieContent = () => {
    console.log("12131231231"); 
    moviePageNode.classList.remove('movie__page-hide');   
};

const renderMovieContent = (result) => {
    if (!result || typeof result !== "object") {
        console.error("Неверный формат данных фильма.");
        return;
      }

    moviePageNode.innerHTML = "";
    let movieHTML = "";
    movieHTML =
    movieHTML +
    `<button id="contenBtnClose" class="movie__content-btn-close">←Назад к поиску</button>
    <div class="movie__info">
        <img src="${result.Poster}" alt="обложка фильма" class="movie__info-image" />
        <div class="movie__info-wrapper">
            <h2 class="movie__info-title">${result.Title}</h2>
            <ul class="info__list">
                <li class="list__property">
                    <p class="label">ГОД: </p>
                    <span class="property__value">2005</span>
                </li>
                <li class="list__property">
                    <p class="label">Рейтинг: </p>
                    <span class="property__value">${result.Year}</span>
                </li>
                <li class="list__property">
                    <p class="label">Дата выхода: </p>
                    <span class="property__value">${result.Rated}</span>
                </li>
                <li class="list__property">
                    <p class="label">Продолжительность: </p>
                    <span class="property__value">${result.Runtime}</span>
                </li>
                <li class="list__property">
                    <p class="label">Жанр: </p>
                    <span class="property__value">${result.Genre}</span>
                </li>
                <li class="list__property">
                    <p class="label">Режиссер: </p>
                    <span class="property__value">${result.Director}</span>
                </li>
                <li class="list__property">
                    <p class="label">Сценарий: </p>
                    <span class="property__value">${result.Writer}</span>
                </li>              
                <li class="list__property">
                    <p class="label">Актеры: </p>
                    <span class="property__value">${result.Actors}</span>
                </li>               
            </ul>                   
        </div>
    </div>
    <p class="movie__info-description label">${result.Plot}</p>
`;

    moviePageNode.innerHTML = movieHTML;
};

const closeMovieContent = () => {  
    moviePageNode.innerHTML = "";
    moviePageNode.classList.add('movie__page-hide');       
};


//------------------Обработчики событий------------------
searchButtonNode.addEventListener("click", searchMovie);
searchResultNode.addEventListener('click', searchIdMovieNode);
bodyNode.addEventListener("click", (event) => {
    if (event.target.id === "contenBtnClose") {
      closeMovieContent();
    }
});