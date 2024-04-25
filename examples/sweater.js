/*
This file makes a sweater consisting of:
 - A rib stitch collar
 - Shoulders that widen out
 - Sleeves ending in a rib stitch
 - A torso ending in a rib stitch
*/
const lib = require('../lib/knitout_util');
let k = new lib.KnitoutUtil();

const COLOR_CHEST   = '6'
const COLOR_LEFT    = '7'
const COLOR_RIGHT   = '8'

const CENTER = 50

const COURSES_COLLAR    = 24
const COURSES_CHEST     = 36//60
const COURSES_SLEEVES   = 20//42

const WALES_NECK = 40//60
const WALES_TORSO = 50//100
const WALES_SLEEVE = 30

const X3 = CENTER-WALES_NECK/2
const X4 = CENTER+WALES_NECK/2
const X2 = CENTER-WALES_TORSO/2
const X5 = CENTER+WALES_TORSO/2
const X1=X2-WALES_SLEEVE;
const X6=X5+WALES_SLEEVE

//main collar
k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_bindon_tube_open(k.RIB1X1, COLOR_LEFT, X3, X4),
	k.gen_arbtube(k.RIB1X1,COLOR_LEFT,COURSES_COLLAR, X3, X4))
,COLOR_LEFT,true,true,false))

let shoulderLeftX  = []
let shoulderRightX = []
const RADIUS = 12
shoulderLeftX.push(X3)
shoulderRightX.push(X4)
for (let i=0;i<=RADIUS;i++) {
	let dx = Math.round((X3-X1-RADIUS)+RADIUS*Math.sin(i* Math.PI/2/RADIUS))
	shoulderLeftX.push(X3-dx)
	shoulderRightX.push(X4+dx)
}

//main shoulder cone
k.run_serial(
	k.gen_arbtube_varying_sides(k.STOCKINETTE, COLOR_LEFT,shoulderLeftX, shoulderRightX),
	k.gen_arbtube(k.STOCKINETTE, COLOR_LEFT, 10, X1, X6)
)

function gap(x) {
	k.xfer('f'+(x+1),'b'+(x+1))
	k.rack(1)
	k.xfer('b'+(x+1),'f'+(x+2))
	k.rack(0)
}
for (let x of [X2-2,X2-1,X5,X5+1]) gap(x)

//sleeves
let sleeve_left  = k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.STOCKINETTE, COLOR_LEFT,COURSES_SLEEVES,X1,X2-2),
	k.gen_arbtube(k.RIB1X1,      COLOR_LEFT,24,X1,X2-2),
	k.gen_bindoff_hg_opentube(COLOR_LEFT, X1, X2-2)
),COLOR_LEFT,false,false,true);

let chest = k.wrap_serial(
	k.wrap_autohook(k.wrap_serial(
		k.gen_arbtube(k.STOCKINETTE, COLOR_CHEST,COURSES_CHEST,X2,X5),
		k.gen_arbtube(k.RIB1X1,      COLOR_CHEST,24,X2,X5),
		k.gen_bindoff_hg_opentube(COLOR_CHEST, X2, X5)
	),COLOR_CHEST)
)

let sleeve_right = k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.STOCKINETTE, COLOR_RIGHT,COURSES_SLEEVES,X5+2,X6),
	k.gen_arbtube(k.RIB1X1,      COLOR_RIGHT,24,X5+2,X6),
	k.gen_bindoff_hg_opentube(COLOR_RIGHT, X5+2, X6)
),COLOR_RIGHT);

k.run_parallel(sleeve_left, chest, sleeve_right)

k.write('out/sweater.k');
