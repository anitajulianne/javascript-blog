'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  allAuthorsLink: Handlebars.compile(document.querySelector('#template-all-authors-link').innerHTML),
}

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';

  function generateTitleLinks(customSelector = ''){
  /* [DONE] remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* [DONE] for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for (let article of articles) {
    /* [DONE] get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */
    /* [DONE] get the title from the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* [DONE] create HTML of the link */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

    /* [DONE] insert link into titleList */

    html = html + linkHTML;
  }
  console.log('html');

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();


/* CALCULATE TAGS PARAMS */

function calculateTagsParams(tags){

  const params = {max: 0, min:999999};

  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
  
}

/* CALCULATE TAG CLASS */

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  console.log('classNumber');
  return optCloudClassPrefix + classNumber;
}

/* GENERATE TAGS */

function generateTags(){

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* [DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {

    /* [DONE] find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
  tagsWrapper.innerHTML = '';

    /* [DONE] make html variable with empty string */
    let html = '';

    /* [DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* [DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* [DONE] START LOOP: for each tag */
    for(let tag of articleTagsArray) {

      /* [DONE] generate HTML of the link */
      const linkHTMLData = {id: tag, title: tag };
      const linkHTML = templates.tagLink(linkHTMLData);

      console.log(linkHTML);

      /* [DONE] add generated code to html variable */
      html = html + linkHTML;

       /* [NEW] check if this link is NOT already in allTags */
       if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* [DONE] END LOOP: for each tag */
    }

    /*[DONE] insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

  /*[DONE] END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags){

    /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    console.log('taglinkHTML:', tagLinkHTML);
    
  /* [NEW] END LOOP:  for each tag in allTags: */
  }

  /* [NEW] add HTML form allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);

}

generateTags();  


function tagClickHandler(event){

  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /*[DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /*[DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /*[DONE] find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /*[DONE] START LOOP: for each active tag link */
  for (let tagLinkActive of activeTags) { 

    /*[DONE] remove class active */
    tagLinkActive.classList.remove('active');

  /*[DONE] END LOOP: for each active tag link */
  }

  /*[DONE] find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /*[DONE] START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {

    /*[DONE] add class active */
    tagLink.classList.add('active');

  /*[DONE] END LOOP: for each found tag link */
  }

  /*[DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){

  /*[DONE] find all links to tags */
  const allLinksToTags = document.querySelectorAll('a[href^="#tag-"]');

  /*[DONE] START LOOP: for each link */
  for(let link of allLinksToTags) {

    /* [DONE] add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /*[DONE] END LOOP: for each link */
  }
}

addClickListenersToTags();



/* GENERATE AUTHORS */


function generateAuthors() {

  /* [NEW] create a new variable allAuthors with an empty array */
  let allAuthors = {};

  /*[DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /*[DONE] START LOOP: for every article: */
  for(let article of articles) {

    /*[DONE] find authors wrapper */
    const authorsWrapper = article.querySelector(optArticleAuthorSelector);

    /*[DONE] make html variable with empty string */
    let html = '';

    /*[DONE] get author from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    console.log(articleAuthor);

    // GENERATE HTML OF THE LINK 
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);

    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors.hasOwnProperty(articleAuthor)){
      /* [NEW] add generated code to allAuthors array */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    /*[DONE] insert HTML of all the links into the authors wrapper */
    authorsWrapper.innerHTML ='<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    

  /*[DONE] END LOOP: for every article: */
  }
  
  /* [NEW] find list of authors in right column */
  const authorsList = document.querySelector(optAuthorsListSelector);

  /* [new] create variable for all links html code */
  const allAuthorsData = {authors: []};

  /* [new] start loop: for each author in allAuthors */
  for(let articleAuthor in allAuthors){
    /* [new] generate code of a link and add it to allAuthorsHTML */
    allAuthorsData.authors.push({
      articleAuthor: articleAuthor,
      count: allAuthors[articleAuthor],
    });
  }

  /* [new] add html from allAuthorsHTML to authorsList */
  authorsList.innerHTML = templates.allAuthorsLink(allAuthorsData);

  console.log(allAuthorsData);
}


generateAuthors();

function authorClickHandler(event) {

  /*[DONE] prevent default action for this event */
  event.preventDefault();

  /*[DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /*[DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /*[DONE] make a new constant "tag" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');

  /*[DONE] find all tag links with class active */
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

  /*[DONE] START LOOP: for each active tag link */
  for(let authorLinkActive of activeAuthors) {

    /*[DONE] remove class active */
    authorLinkActive.classList.remove('active');

  /*[DONE] END LOOP: for each active tag link */
  }

  /*[DONE] find all tag links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  /*[DONE] START LOOP: for each found tag link */
  for(let authorLink of authorLinks) {

    /*[DONE] add class active */
    authorLink.classList.add('active');

  /*[DONE] END LOOP: for each found tag link */
  }

  /*[DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {

  /*[DONE] find all links to tags */
  const allLinksToAuthors = document.querySelectorAll('a[href^="#author-"]');

  /*[DONE] START LOOP: for each link */
  for(let link of allLinksToAuthors) {

    /*[DONE] add tagClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);

  /*[DONE] END LOOP: for each link */
  }
}
addClickListenersToAuthors();