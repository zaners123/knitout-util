//TODO not finished - hooking on & off needs to be optimized

/*
This file makes a tube sock of:
   - A halfgauge 1x1 rib followed by a halfgauge stockinette
Then ties it off to close the tube
*/
const lib = require('../lib/knitout_util');
let k = new lib.KnitoutUtil();

const COLOR_STRIPEA = '6';
const X1=0;
const X2=50;

let X1Arr = []
let X2Arr = []

//Narrow funnel in halfslope
X1Arr = X1Arr.concat(k.shape_line(20,X1, X1+10))
X2Arr = X2Arr.concat(k.shape_line(20,X2, X2-10))

//Tube
X1Arr = X1Arr.concat(Array(20).fill(X1+10))
X2Arr = X2Arr.concat(Array(20).fill(X2-10))

//zigzag
X1Arr = X1Arr.concat(k.shape_zigzag(X1,X1+20,1,1))
X2Arr = X2Arr.concat(k.shape_zigzag(X2-20,X2   ,1,1))

//steep zigzag
X1Arr = X1Arr.concat(k.shape_zigzag(X1,X1+20,2,2))
X2Arr = X2Arr.concat(k.shape_zigzag(X2-20,X2   ,2,2))

k.run_autohook(k.wrap_serial(
	k.gen_bindon_tube_open(     k.STOCKINETTE,          COLOR_STRIPEA,                 X1,    X2),
	k.gen_arbtube(              k.STOCKINETTE,          COLOR_STRIPEA,   8, X1,    X2),
k.gen_arbtube_varying_sides(k.FULLGAUGE_STOCKINETTE,COLOR_STRIPEA,                 X1Arr, X2Arr),
	k.gen_bindoff_closed(                               COLOR_STRIPEA,                 X1,    X2,false)
),COLOR_STRIPEA)

k.write('out/funnel.k');
