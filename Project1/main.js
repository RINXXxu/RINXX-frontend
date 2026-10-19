// ================================================================
//  核心逻辑
//  ═══════════════════════════════════════════════════════════════════

// --- 提取分类 ---
// TODO 1: 从 articlesData 中提取所有分类
const categories = [];

// --- 状态 ---
let articles = [...articlesData];
let currentCategory = "all";
let searchQuery = "";

// --- 本地收藏 ---
const FAVORITES_KEY = "blog_favorites";

// (选做) TODO 2: 实现获取收藏列表
function getFavorites() {
  // 从 localStorage 读取
}

// (选做) TODO 3: 实现保存收藏列表
function saveFavorites(favorites) {
  // 写入 localStorage
}

// (选做) TODO 4: 实现切换收藏状态
function toggleFavorite(articleId) {
  // 添加或移除收藏
}

// (选做) TODO 5: 实现检查是否已收藏
function isFavorited(articleId) {
  // 返回 true/false
}

// --- DOM 引用 ---
const grid = document.getElementById("articlesGrid");
const searchInput = document.getElementById("searchInput");
const filterContainer = document.getElementById("categoryFilters");
const tagCloud = document.getElementById("tagCloud");
const recentList = document.getElementById("recentList");
const favoriteList = document.getElementById("favoriteList");
const totalArticlesEl = document.getElementById("totalArticles");
const totalCategoriesEl = document.getElementById("totalCategories");
const themeSwitch = document.getElementById("themeToggle");
const menuSwitch = document.getElementById("menuToggle");
const menu = document.getElementById("navMenu");
const body = document.body;
const text = document.getElementById("text");

function getCurrentTheme(){
  return body.classList.contains("dark") ?"dark":"light";
}

function applyTheme(theme){
  if(theme==="dark"){
    body.classList.add("dark");
  }else{
    body.classList.remove("dark");
  }

  updateThemeText();
}

function updateThemeText(){
  const theme=getCurrentTheme();
  themeSwitch.textContent=theme==="dark" ?"☀" :"🌙";
}

themeSwitch.addEventListener("click",()=>{
  const next=getCurrentTheme()==="dark" ?"light" :"dark";
  applyTheme(next);
});

function changeMenu(){
  const state=window.getComputedStyle(menu).display;
  if(state==="none"){
    menu.style.display="block";
  }else{
    menu.style.display="none";
  }
}

menuSwitch.addEventListener("click",changeMenu);

// ================================================================
//  TODO 6: 实现 getFilteredArticles 函数
//  根据 currentCategory 和 searchQuery 筛选文章
// ================================================================
function getFilteredArticles() {
  // 补全代码
}

// ================================================================
//  TODO 7: 实现 renderArticles 函数
//  渲染文章列表，每篇文章显示：
//  - 分类、日期
//  - 标题、摘要
//  - 收藏按钮 (☆/⭐)
// ================================================================
function renderArticles() {
  grid.innerHTML=articlesData.map(article=>
    `
    <article class="article-card" data-id="${article.id}">
      <div class="article-meta">
        <span class="article-category">${article.category}</span>
        <span>${article.date}</span>
      </div>
      <h3>${article.title}</h3>
      <p>${article.excerpt}</p>
    </article>
    `).join('');

  if (searchQuery) {
    applySearch();
  }  
}

grid.addEventListener("click",(e)=>{
  const card=e.target.closest(".article-card");
  if (!card){
    return;
  }
  const articleId=card.dataset.id;
  // 先构造基础的相对 URL
  let url = `post.html?id=${encodeURIComponent(articleId)}`;
  
  // 如果存在搜索词，添加 search 参数
  if (searchQuery && searchQuery.trim()) {
    url += `&search=${encodeURIComponent(searchQuery.trim())}`;
  }
  window.location.href = url;
});

// ================================================================
// (选做)  TODO 8: 实现 renderTags 函数
//  统计每个分类的文章数量，生成标签
// ================================================================
function renderTags() {
  // 补全代码
}

// ================================================================
//  TODO 9: 实现 renderRecent 函数
//  按日期排序，取前 5 篇
// ================================================================
function renderRecent() {
  // 补全代码
}

// ================================================================
// (选做)  TODO 10: 实现 renderFavorites 函数
//  渲染收藏列表
// ================================================================
function renderFavorites() {
  // 补全代码
}

// ================================================================
//  TODO 11: 实现 renderStats 函数
//  计算文章总数、分类数
// ================================================================
function renderStats() {
  // 补全代码
}

// ================================================================
//  TODO 12: 实现 updateFilterButtons 函数
//  高亮当前选中的分类按钮
// ================================================================
function updateFilterButtons() {
  // 补全代码
}

// ================================================================
//  TODO 13: 实现 renderAll 函数
//  调用所有渲染函数
// ================================================================
function renderAll() {
  renderArticles();
  // 补全代码
}

// ================================================================
// (选做) TODO 14: 实现 handleFavorite 函数
//  点击收藏按钮时切换收藏状态
// ================================================================
function handleFavorite(e) {
  // 补全代码
}

// ================================================================
//  (选做) TODO 15: 实现 handleSearch 函数
//  输入搜索时更新 searchQuery 并重新渲染
// ================================================================
function removeHighlights(){
  document.querySelectorAll('mark.highlight').forEach(mark => {
    const parent=mark.parentNode;
    if(parent){
      parent.replaceChild(document.createTextNode(mark.textContent),mark);
      parent.normalize();
    }
  });
}

function highlightTextNode(node,query){
  const text=node.nodeValue;
  if(!text){
    return ;
  }

  const lowerText=text.toLowerCase();
  const lowerQuery=query.toLowerCase();

  const parent = node.parentNode;
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerQuery, lastIndex);

  while (index !== -1) {
    if (index > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
    }
  
  const mark = document.createElement('mark');
    mark.className = 'highlight';
    mark.textContent = text.slice(index, index + query.length);
    fragment.appendChild(mark);

    lastIndex = index + query.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  parent.replaceChild(fragment, node);
}

function highlightCard(card, query) {
  const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentNode.tagName === 'MARK') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => highlightTextNode(node, query));
}

function applySearch(){
  const query=searchQuery.trim();
  removeHighlights();

  document.querySelectorAll('.article-card').forEach(card =>{
    if(!query){
      card.style.display="";
      return ;
    }

    if(card.textContent.toLowerCase().includes(query.toLowerCase())){
      card.style.display='';
      highlightCard(card, query);
    }else{
      card.style.display="none";
    }
  })
}

function handleSearch(e) {
  searchQuery=e.target.value;
  text.textContent="相关文章";
  applySearch();

  if(!searchQuery){
    text.textContent="全部文章";
  }
}

// ================================================================
//  TODO 16: 实现 handleFilter 函数
//  点击分类按钮时切换分类
// ================================================================
function handleFilter(e) {
  // 补全代码
}

// ================================================================
//  TODO 17: 实现 initTheme 函数
//  从 localStorage 读取主题偏好，切换暗色模式
// ================================================================
function initTheme() {
  // 补全代码
}

// ================================================================
//  TODO 18: 实现 initMobileMenu 函数
//  移动端菜单展开/收起
// ================================================================
function initMobileMenu() {
  // 补全代码
}

(function () {
  var btn = document.getElementById('backToTop');
  var threshold = 500;

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function toggleBackToTop() {
    if (getScrollTop() > threshold) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop(); // 页面刚加载时也判断一次，防止刷新后停留在页面中部

  btn.addEventListener('click', function () {
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  });
})();

// ================================================================
//  TODO 19: 实现 init 函数
//  初始化所有功能
// ================================================================
function init() {
  renderAll();
  searchInput.addEventListener('input', handleSearch);
  // 1. 生成分类按钮
  // 2. 绑定分类点击事件
  // 3. 调用 renderAll()
  // 4. 绑定搜索事件
  // 5. 调用 initTheme()
  // 6. 调用 initMobileMenu()
  // 7. 控制台输出启动信息
}

document.addEventListener("DOMContentLoaded", init);
