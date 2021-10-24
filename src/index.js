'use strict';
import '@styles/index.css';

const body_node = document.querySelector('body');

let primary_colors = ['#FAEBD7', '#080808'];
let is_dark_theme = true;
let defaut_colors = [primary_colors[+is_dark_theme], '#5F9EA0'];

const set_up_colors = () => {
  body_node.style = `--noorall_primary:${defaut_colors[0]}; --noorall_secondary: ${defaut_colors[1]};--noorall_scroll:${defaut_colors[1]}`;
};
set_up_colors();
const color_preview_container_node = document.querySelector('#color_preview');

[...color_preview_container_node.children].forEach((el, idx) => {
  el.value = defaut_colors[idx];
  el.addEventListener('input', (e) => {
    defaut_colors[idx] = e.target.value;

    set_up_colors();
  });
});
const theme_button_node = document.getElementById('_theme_button');

theme_button_node.addEventListener('click', (el) => {
  const path_node = document.getElementById('_theme_button').children[0].children[0];
  const prev_d = path_node.getAttribute('d');
  const current_d = path_node.getAttribute('_d');

  path_node.setAttribute('d', current_d);
  path_node.setAttribute('_d', prev_d);
  is_dark_theme = !is_dark_theme;
  defaut_colors[0] = primary_colors[+is_dark_theme];
  set_up_colors();
});

[...(document.getElementsByTagName('pre') || [])].forEach((el) => {
  const __id = el.getAttribute('__id');
  const codecontainer = document.getElementById(__id);

  let arr = [];
  let idx = 0;

  const j = (el, i) => {
    idx = i;
    const attributes = Object.values({ ...el.attributes }).map((__) => [__.name, __.value]);
    arr.push([{ tag_name: el?.tagName?.toLowerCase(), attributes, length: idx }]);

    if (![...el.children]?.length) return;

    [...el.children].forEach((el) => {
      j(el, i + 1);
    });
  };

  j(codecontainer, 0);

  const spacing = '&nbsp;&nbsp;&nbsp;&nbsp;';
  const genegate_spacing = (length) => `${spacing}${spacing}${Array.from({ length }, () => spacing).join('')}`;

  const g = arr
    .map(
      ([{ tag_name, attributes, length }], i) =>
        `${genegate_spacing(length)}<span __stag>${tag_name} <i>${attributes
          .map(([key, value]) => (!value ? key : `${key}='${value}'`))
          .join(' ')} </i></span>\n${
          length === idx ? `${genegate_spacing(length)}<span __etag>${tag_name}</span>\n` : ''
        } ${
          arr.length === i + 1
            ? arr
                .filter(([{ length }]) => length != idx)
                .map(
                  ([{ tag_name, length }]) =>
                    `${genegate_spacing(idx - length -1)}<span __etag>${tag_name}</span>\n`
                )
            : ''
        }`
    )
    .join('');

  el.innerHTML = `<code>\n${g}\n</code>`;
  console.log(g, idx, arr.length);
  // el.innerHTML = `<code>${outer_html}</code>`;
});

// const h = [...(document.getElementsByTagName('pre') || [])].map((el) => el.children[0]);
