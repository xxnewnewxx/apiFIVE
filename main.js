const API_KEY = `29a96ef9b757480189bbd02b34691b57`;
let articles = [];
let page = 1;
let totalPage = 1;
const pageSize = 8;
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${pageSize} `
);
let menus = document.querySelectorAll("#menu-list button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsByTopic(e))
);

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    console.log("무슨일이야", url);
    let response = await fetch(url);
    let data = await response.json();
    if (response.status == 200) {
      console.log("result", data);
      if (data.totalResults == 0) {
        page = 0;
        totalPage = 0;
        renderPagination();
        errorRender();
        throw new Error("일치하는 결과가 없습니다");
      }

      articles = data.articles;
      totalPage = Math.ceil(data.totalResults / pageSize);
      render();
      renderPagination();
    } else {
      page = 0;
      totalPage = 0;
      renderPagination();
      throw new Error(data.message);
    }
  } catch (e) {
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    // renderPagination(); 추후 페이지네이션 부르기
  }
};

////////////////  뉴스 카테고리 /////////////////////////////////////
const getLatestNews = async () => {
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${pageSize}`
  );
  await getNews();
};

const getNewsByTopic = async (event) => {
  const topic = event.target.textContent.toLowerCase();

  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${pageSize}&category=${topic}`
  );
  await getNews();
};

/////////   검색어로 조회하기 /////////////////
const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;

  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${pageSize}&q=${keyword}`
  );
  await getNews();
};

document.getElementById("search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getNewsByKeyword();
  }
});

const render = () => {
  let resultHTML = articles
    .map((news) => {
      return `<div class="news row">
        <div class="col-lg-4">
            <img class="news-img"
                src="${news.urlToImage}" 
                onerror="this.src='https://media.istockphoto.com/id/1399859917/pt/vetorial/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=sLIG7ZNWBtvCM1o_Po0X9Y3UUu0KajdLvrKlrsLlrk8='; this.onerror=null;" />
        </div>
        <div class="col-lg-8">
            <a class="title" target="_blank" href="${news.url}">${
        news.title
      }</a>
            <p>${
              news.description == null || news.description == ""
                ? "내용이 없는 기사입니다"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name || "no source"}  ${moment(
        news.publishedAt
      ).fromNow()}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = resultHTML;
};

/////////// 페이지 네이션 ////////////////////

const renderPagination = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;
  if (first >= 6) {
    paginationHTML = `<li class="page-item" onclick="pageClick(1)">
                          <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                        </li>
                        <li class="page-item" onclick="pageClick(${page - 1})">
                          <a class="page-link" href='#js-bottom'>&lt;</a>
                        </li>`;
  }
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                          <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                         </li>`;
  }

  if (last < totalPage) {
    paginationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                            <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                           </li>
                           <li class="page-item" onclick="pageClick(${totalPage})">
                            <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                           </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const pageClick = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};

/////// 에러 ////////////////////////
const errorRender = (message) => {
  document.getElementById(
    "news-board"
  ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

const openNav = () => {
  document.getElementById("noonaSidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("noonaSidenav").style.width = "0";
};

getLatestNews();
