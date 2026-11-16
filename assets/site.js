/**
 * サイトの動き
 *
 * ・スクロールするとヘッダーに境界線が出る
 * ・画面に入った要素をふわっと表示する
 *
 * 【いちばん大事なこと】
 * 動きは飾りなので、**何が起きても内容が見えなくなってはいけない**。
 * 隠す指定（js-reveal）は <head> のスクリプトが付け、このファイルが外します。
 * 監視が働かない環境（タブが裏に居る、古いブラウザ等）に備えて、
 * 一定時間で必ず全部表示する保険も入れてあります。
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- ヘッダー ---
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- スクロールで現れる ---
  var targets = document.querySelectorAll('.reveal');

  function showAll() {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('shown'); });
  }

  if (!targets.length || reduced || !('IntersectionObserver' in window)) {
    showAll();
    root.classList.remove('js-reveal');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('shown');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

  // 並んだ要素が一斉に動くと落ち着かないので、少しずつ遅らせる
  Array.prototype.forEach.call(targets, function (el, i) {
    el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
    observer.observe(el);
  });

  // 保険。監視が働かなくても、2.5秒後には必ず全部表示する
  window.setTimeout(showAll, 2500);
})();
