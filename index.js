const body_node = document.querySelector('body');

let primary_colors = ['#FAEBD7','#080808']
let defaut_colors = [primary_colors[0], '#5F9EA0'];

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
