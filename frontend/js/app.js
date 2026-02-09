(function () {
  'use strict';

  var searchForm = document.getElementById('searchForm');
  var searchInput = document.getElementById('searchInput');
  var limitSelect = document.getElementById('limitSelect');
  var searchBtn = document.getElementById('searchBtn');
  var messageEl = document.getElementById('message');
  var loadingEl = document.getElementById('loading');
  var resultsList = document.getElementById('resultsList');
  var paginationEl = document.getElementById('pagination');

  var currentQuery = '';
  var currentOffset = 0;
  var currentLimit = 10;

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = 'message ' + (type || 'info');
    messageEl.hidden = false;
  }

  function hideMessage() {
    messageEl.hidden = true;
  }

  function setLoading(loading) {
    loadingEl.hidden = !loading;
    searchBtn.disabled = loading;
  }

  function formatPrice(value) {
    if (value == null || value === '') return '';
    var n = parseFloat(value);
    return isNaN(n) ? value : '$' + n.toFixed(2);
  }

  function renderProduct(product) {
    var li = document.createElement('li');
    li.className = 'result-card';

    var name = product.name || 'Unnamed';
    var brandCat = [product.brand, product.category].filter(Boolean).join(' · ') || '—';
    var desc = product.description || '';
    var score = product.score != null ? 'Relevance: ' + parseFloat(product.score).toFixed(2) : '';

    li.innerHTML =
      '<p class="name">' + escapeHtml(name) + '</p>' +
      '<p class="brand-category">' + escapeHtml(brandCat) + '</p>' +
      (desc ? '<p class="description">' + escapeHtml(desc) + '</p>' : '') +
      '<div class="meta">' +
        (product.price != null && product.price !== '' ? '<span>Price: ' + escapeHtml(formatPrice(product.price)) + '</span>' : '') +
        (product.rating != null && product.rating !== '' ? '<span>Rating: ' + escapeHtml(String(product.rating)) + '</span>' : '') +
        (score ? '<span class="score">' + escapeHtml(score) + '</span>' : '') +
      '</div>';

    return li;
  }

  function escapeHtml(str) {
    if (str == null) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderResults(items) {
    resultsList.innerHTML = '';
    if (!items || items.length === 0) {
      showMessage('No results found. Try different keywords.', 'empty');
      return;
    }

    hideMessage();
    items.forEach(function (product) {
      resultsList.appendChild(renderProduct(product));
    });
  }

  function renderPagination(count, limit, offset, hasMore) {
    paginationEl.innerHTML = '';
    if (count <= 0 && offset === 0) {
      paginationEl.hidden = true;
      return;
    }

    var hasPrev = offset > 0;
    var hasNext = hasMore;

    paginationEl.hidden = false;
    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = !hasPrev;
    prevBtn.addEventListener('click', function () {
      if (!hasPrev) return;
      currentOffset = Math.max(0, offset - limit);
      doSearch(currentQuery, currentLimit, currentOffset);
    });

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = !hasNext;
    nextBtn.addEventListener('click', function () {
      if (!hasNext) return;
      currentOffset = offset + limit;
      doSearch(currentQuery, currentLimit, currentOffset);
    });

    var start = offset + 1;
    var end = offset + count;
    var pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = start + '–' + end + (hasMore ? '+' : '');

    paginationEl.appendChild(prevBtn);
    paginationEl.appendChild(pageInfo);
    paginationEl.appendChild(nextBtn);
  }

  function doSearch(q, limit, offset) {
    currentQuery = q;
    currentOffset = offset;
    currentLimit = limit;

    var params = new URLSearchParams({
      q: q,
      limit: String(limit),
      offset: String(offset),
    });
    var url = '/search?' + params.toString();

    setLoading(true);
    hideMessage();
    resultsList.innerHTML = '';
    paginationEl.hidden = true;

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Search failed: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        setLoading(false);
        var items = Array.isArray(data) ? data : [];
        renderResults(items);
        var hasMore = items.length === limit;
        renderPagination(items.length, limit, offset, hasMore);
      })
      .catch(function (err) {
        setLoading(false);
        showMessage(err.message || 'Something went wrong. Please try again.', 'error');
      });
  }

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = (searchInput.value || '').trim();
    if (!q) {
      showMessage('Please enter a search term.', 'info');
      return;
    }
    var limit = parseInt(limitSelect.value, 10) || 10;
    doSearch(q, limit, 0);
  });

  limitSelect.addEventListener('change', function () {
    if (currentQuery) {
      currentLimit = parseInt(limitSelect.value, 10) || 10;
      doSearch(currentQuery, currentLimit, 0);
    }
  });
})();
