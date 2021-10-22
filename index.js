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
