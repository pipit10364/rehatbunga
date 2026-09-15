/**
 * Classic Block-Blast-style piece definitions.
 * Each shape is a list of [row, col] cell offsets from its top-left origin.
 * Sizes range from 1 to 5 cells, including squares, lines, L, T, S/Z and
 * small pentominoes, matching the request for "persegi/L/T dari 1-5 kotak".
 */
window.SHAPES = [
  // 1 cell
  [[0,0]],

  // 2 cells
  [[0,0],[0,1]],
  [[0,0],[1,0]],

  // 3 cells - lines
  [[0,0],[0,1],[0,2]],
  [[0,0],[1,0],[2,0]],

  // 3 cells - L tromino, 4 rotations
  [[0,0],[1,0],[1,1]],
  [[0,0],[0,1],[1,0]],
  [[0,0],[0,1],[1,1]],
  [[1,0],[1,1],[0,1]],

  // 4 cells - square
  [[0,0],[0,1],[1,0],[1,1]],

  // 4 cells - lines
  [[0,0],[0,1],[0,2],[0,3]],
  [[0,0],[1,0],[2,0],[3,0]],

  // 4 cells - L tetromino, 4 rotations
  [[0,0],[1,0],[2,0],[2,1]],
  [[0,0],[0,1],[0,2],[1,0]],
  [[0,0],[0,1],[1,1],[2,1]],
  [[1,0],[1,1],[1,2],[0,2]],

  // 4 cells - T tetromino, 4 rotations
  [[0,0],[0,1],[0,2],[1,1]],
  [[0,0],[1,0],[2,0],[1,1]],
  [[1,0],[1,1],[1,2],[0,1]],
  [[0,1],[1,0],[1,1],[2,1]],

  // 4 cells - S / Z
  [[0,1],[0,2],[1,0],[1,1]],
  [[0,0],[0,1],[1,1],[1,2]],

  // 5 cells - lines
  [[0,0],[0,1],[0,2],[0,3],[0,4]],
  [[0,0],[1,0],[2,0],[3,0],[4,0]],

  // 5 cells - plus pentomino
  [[0,1],[1,0],[1,1],[1,2],[2,1]],

  // 5 cells - big corner (L pentomino)
  [[0,0],[1,0],[2,0],[2,1],[2,2]],

  // 5 cells - P pentomino
  [[0,0],[0,1],[1,0],[1,1],[2,0]]
];

window.BLOCK_COLORS = [
  { fill: '#d9979f', deep: '#c07f88' }, // rose
  { fill: '#8a9a76', deep: '#71835e' }, // moss
  { fill: '#927794', deep: '#785f7a' }, // plum
  { fill: '#d7ac68', deep: '#bb8c49' }, // gold
  { fill: '#9ab7c2', deep: '#7a9ba7' }, // sky
  { fill: '#e0a58c', deep: '#c98868' }  // coral
];

function pickRandomShape(){
  const shape = window.SHAPES[Math.floor(Math.random() * window.SHAPES.length)];
  const color = window.BLOCK_COLORS[Math.floor(Math.random() * window.BLOCK_COLORS.length)];
  return { cells: shape, color };
}

function shapeBounds(cells){
  let maxR = 0, maxC = 0;
  cells.forEach(([r,c]) => {
    if (r > maxR) maxR = r;
    if (c > maxC) maxC = c;
  });
  return { rows: maxR + 1, cols: maxC + 1 };
}
