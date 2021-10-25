'use strict';
import '@styles/index.css';

const convert_rem_to_pixels = (rem) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

const body_node = document.querySelector('body');

let primary_colors = ['#FAEBD7', '#080808'];
let is_dark_theme = true;
let defaut_colors = [primary_colors[+is_dark_theme], '#96cff0'];

const set_up_colors = () => {
  body_node.style = `--noorall_primary:${defaut_colors[0]}; --noorall_secondary: ${defaut_colors[1]};--noorall_scroll:${defaut_colors[1]}; --noorall_border_radius:16px`;
};
set_up_colors();


const color_preview_container_node = document.querySelector('#color_preview');
const nav_button_node = document.getElementById('_nav');

nav_button_node.addEventListener('click', () => {
  const is_active = nav_button_node.attributes.getNamedItem('__menu_icon__active');
  !is_active
    ? nav_button_node.setAttribute('__menu_icon__active', '')
    : nav_button_node.removeAttribute('__menu_icon__active');
  const { bottom, right } = nav_button_node.getBoundingClientRect();

  const all_childrens = [...nav_button_node.parentElement.children];
  const idx = all_childrens.indexOf(nav_button_node);
  const el = all_childrens[idx + 1];

  el.style.top = bottom + 16 + 'px';
  el.style.transform = 'none';
  el.style.right = !is_active ? window.innerWidth - right - 8 + 'px' : '-50%';
});







[...color_preview_container_node.children].forEach((el, idx) => {
  el.value = defaut_colors[idx];
  el.addEventListener('input', (e) => {
    defaut_colors[idx] = e.target.value;

    set_up_colors();
  });
});

const theme_button_node = document.getElementById('_theme_button');

theme_button_node.addEventListener('click', () => {
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

  const random_id = () => Math.random().toString(32);
  let elements = [];

  const recursive_find_children = function (el, parent_id) {
    for (var i = 0, iLength = el.children.length; i < iLength; i++) {
      const _id = random_id();
      elements.push({ el: el.children[i], _id, parent_id });
      if (el.children[i].children.length) recursive_find_children(el.children[i], _id);
    }

    return elements;
  };

  const codecontainer_id = random_id();
  recursive_find_children(codecontainer, codecontainer_id);

  elements.push({ el: codecontainer, _id: codecontainer_id });

  el.addEventListener('click', async () => {
    try {
      navigator.clipboard.writeText(codecontainer.outerHTML);
    } catch (error) {
      console.error('Async: Could not copy text: ', err);
    }
  });

  const spacing = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

  const genegate_spacing = (length) =>
    `${spacing}&nbsp;&nbsp;&nbsp;&nbsp;${Array.from({ length }, () => spacing).join('')}`;

  const genegate_code_html = (arr) => {
    if (!arr?.length || !arr) return '';

    return arr
      .map(({ tag_name, attributes, children, text, _id }, i) => {
        const length = nested_index_arr.find((__) => __._id === _id)?.idx;

        const start_code = `${genegate_spacing(length)}<span __stag>${tag_name}<i>${attributes
          .map(([key, value]) => (!value ? ` ${key}` : ` ${key}='${value}'`))
          .join(' ')}`;
        const check_text_content = !!text?.trim() ? `${genegate_spacing(length + 1)}<span>${text}</span>\n` : '';
        const check_of_end_tag = `${genegate_spacing(length)}<span __etag>${tag_name}</span>\n`;

        return `${start_code} </i></span>\n${check_text_content}${genegate_code_html(children)} ${check_of_end_tag}`;
      })
      .join('');
  };

  const root = [];
  const flat = [...elements].map(({ el, ...props }) => {
    const attributes = Object.values({ ...el.attributes }).map((__) => [__.name, __.value]);
    const text = el.childNodes[0].nodeValue || '';
    const tag_name = el?.tagName?.toLowerCase();

    return { ...props, tag_name, text, attributes };
  });

  flat.forEach((node) => {
    if (!node.parent_id) return root.push(node);

    const parentIndex = flat.findIndex((el) => el._id === node.parent_id);
    if (!flat[parentIndex].children) {
      return (flat[parentIndex].children = [node]);
    }

    flat[parentIndex].children.push(node);
  });

  let nested_index_arr = [];

  const get_nested_idx_and_push = (el, idx) => {
    if (!el.children?.length) {
      nested_index_arr.push({ _id: el._id, idx });
      return;
    }
    nested_index_arr.push({ _id: el._id, idx });

    return iterate_items_to_find_nested_idx(el.children, idx + 1);
  };

  const iterate_items_to_find_nested_idx = (arr, idx = 0) => {
    if (!arr) return;

    arr.forEach((el) => {
      get_nested_idx_and_push(el, idx);
    });
  };
  iterate_items_to_find_nested_idx(root);

  const code_html = genegate_code_html(root);
  el.innerHTML = `<code>\n${code_html}\n</code>`;
});
