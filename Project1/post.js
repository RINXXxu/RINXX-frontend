function getSearchKeyword() {
  const params = new URLSearchParams(window.location.search);
  return params.get('search');
}

// 高亮单个文本节点
function highlightTextNode(node, query) {
  const text = node.nodeValue;
  if (!text) return;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  if (!lowerText.includes(lowerQuery)) return;

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

// 高亮指定容器内的所有匹配文本
function highlightContainer(container, query) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
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

// 在文章加载完成后执行高亮
function applyHighlightIfNeeded() {
  const keyword = getSearchKeyword();
  if (!keyword) return;

  const content = document.getElementById('post-content');
  if (content) {
    highlightContainer(content, keyword);
  }

  const title = document.getElementById('post-title');
  if (title) {
    highlightContainer(title, keyword);
  }

  const category = document.getElementById('post-category');
  if (category){
    highlightContainer(category, keyword);
  }

  const date = document.getElementById('post-date');
  if(date){
    highlightContainer(date,keyword);
  }
}

const params = new URLSearchParams(window.location.search);
const articleId = Number(params.get("id"));

// 根据 id 查找文章
const article = articlesData.find((item) => item.id === articleId);

if (article) {
  document.getElementById("post-title").textContent = article.title;
  document.getElementById("post-category").textContent = article.category;
  document.getElementById("post-date").textContent = article.date;

  // 如果有 content 字段就展示完整内容，否则回退到 excerpt
  const contentText = Array.isArray(article.content)
    ? article.content.map(line => '\u3000\u3000' + line).join('\n')
    : (article.content || article.excerpt);

  document.getElementById("post-content").textContent = contentText;

  applyHighlightIfNeeded();
} else {
  // 文章不存在时的处理
  document.querySelector(".post-container").innerHTML =
    "<p>文章不存在或已被删除。</p>";
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