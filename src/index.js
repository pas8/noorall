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
  var elements = [];
  var recursiveFindChildren = function (el, parent_id) {
    for (var i = 0, iLength = el.children.length; i < iLength; i++) {
      const _id = random_id();
      elements.push({ el: el.children[i], _id, parent_id });
      if (el.children[i].children.length) recursiveFindChildren(el.children[i], _id);
    }
    return elements;
  };
  // codecontainer.

  recursiveFindChildren(codecontainer);

  el.addEventListener('click', async () => {
    try {
      navigator.clipboard.writeText(codecontainer.outerHTML);
    } catch (error) {
      console.error('Async: Could not copy text: ', err);
    }
  });

  let a = [];
  let idx = 0;
  let h = [];
  const spacing = '&nbsp;&nbsp;&nbsp;&nbsp;';
  const genegate_spacing = (length) => `${spacing}${spacing}${Array.from({ length }, () => spacing).join('')}`;

  const genegate_code_html = (arr) => {
    if (!arr?.length || !arr) return '';
    return arr
      .map(([{ tag_name, attributes, length, text, _arr }], i) => {
        const is_end = arr.length === i + 1;

        const end_code = is_end
          ? arr
              .filter(([{ length }]) => length != idx)
              .reverse()
              .map(([{ tag_name, length }]) => `${genegate_spacing(length)}<span __etag>${tag_name}</span>\n`)
          : '';

        const start_code = `${genegate_spacing(length)}<span __stag>${tag_name}<i>${attributes
          .map(([key, value]) => (!value ? ` ${key}` : ` ${key}='${value}'`))
          .join(' ')}`;
        const h = length > arr[i + 1]?.[0]?.length;

        const check_text_content = !!text?.trim() ? `${genegate_spacing(length + 1)}<span>${text}</span>\n` : '';
        const check_of_end_tag =
          length === idx || h ? `${genegate_spacing(length)}<span __etag>${tag_name}</span>\n` : '';

        // console.log(tag_name,length ,  arr[i+1]?.[0]?.length)

        return `${start_code} </i></span>\n${check_text_content} ${check_of_end_tag}${
          !!_arr.length ? genegate_code_html(_arr) : ''
        } ${end_code}`;
      })
      .join('');
  };

  const set_up_item_propertyies = (el, arr, _arr) => {
    const attributes = Object.values({ ...el.attributes }).map((__) => [__.name, __.value]);
    const text = el.childNodes[0].nodeValue || '';
    const tag_name = el?.tagName?.toLowerCase();

    arr.push([{ tag_name, attributes, length: idx, text, _arr }]);
    const children_count = [...el.children]?.length;
    return children_count;
  };

  // Create root for top-level node(s)
  const root = [];
  const flat = [...elements];

  flat.forEach((node) => {
    // No parentId means top level
    if (!node.parent_id) return root.push(node);

    // Insert node as child of parent in flat array
    const parentIndex = flat.findIndex((el) => el._id === node.parent_id);
    if (!flat[parentIndex].children) {
      return (flat[parentIndex].children = [node]);
    }

    flat[parentIndex].children.push(node);
  });


  const get_recursionion_children_props = (el, i, arr, _arr = []) => {
    // console.log(arr);
    // recursiveFindChildren(el)

    if (!arr || !el) return;
    idx = i;
    if (![el.children].length) return;

    const children_count = set_up_item_propertyies(el, arr, _arr);
    // console.log(children_count)
    // children_count

    if (children_count <= 1) return get_recursionion_children_props(el.children[0], i + 1, arr, _arr);

    return [...el.children].forEach((__, _i) => {
      let __arr = [];
      // let _idx = 0;
      // _idx = i;
      // get_recursionion_children_props(__, idx, __arr,arr);
      // if (!__arr.length) {
      // get_recursionion_children_props(__, idx, __arr,arr);
      // } else {
      // get_recursionion_children_props(__, idx, arr,__arr);

      // console.log(';',__arr);
      // }
      // console.log(arr,0, __arr)
      // get_recursionion_children_props(__, 0,arr, __arr);
      // console.log(__arr,arr)

      // if (!!__arr.length) {
      // get_recursionion_children_props(el, idx, arr, __arr);
      // }
      // if (!!_arr.length) {
      //   let __arr = [] ;
      //   get_recursionion_children_props(__, _idx, __arr, _arr);
      // }
      // console.log(_i, i, idx, _arr);
      // get_recursionion_children_props(, idx, arr, _arr);
      // console.log(_arr,_idx);
      // set_up_item_propertyies(__, _arr);
      // const code = genegate_code_html(_arr);
      // console.log(_arr)
      // console.log(_arr,arr)
      // console.log(_arr,_idx);
      // return arr.push({ code });
      return;
    });
  };

  get_recursionion_children_props(codecontainer, 0, a);
  const code_html = genegate_code_html(a);
  // console.log(a);
  el.innerHTML = `<code>\n${code_html}\n</code>`;
});
