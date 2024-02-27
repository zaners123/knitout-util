/*
The goal is to do:
	1. a tube tie-on
	2. 1" of 2x2 rib
	3. About 200 seed-stitch loops with stripes
	4. A tube-closing tieoff
*/
const lib = require('./lib/lib');
let k = new lib.SmartWriter();

const COLOR_CHEST   = '6'
const COLOR_LEFT    = '7'
const COLOR_RIGHT   = '8'

const CENTER = 50

const COURSES_COLLAR    = 26
const COURSES_CHEST     = 32//60
const COURSES_SLEEVES   = 26//42

const WALES_NECK = 40//60
const WALES_TORSO = 40//100
const WALES_SLEEVE = 24

const X3 = CENTER-WALES_NECK/2
const X4 = CENTER+WALES_NECK/2
const X2 = CENTER-WALES_TORSO/2
const X5 = CENTER+WALES_TORSO/2
const X1=X2-WALES_SLEEVE;
const X6=X5+WALES_SLEEVE

//main collar
k.run(k.wrap_autohook(
	k.gen_arbtube(k.RIBTUBE1x1,COLOR_LEFT,COURSES_COLLAR, X3, X4),
	COLOR_LEFT,true,true,false)
)

//main shoulder cone
k.run(k.gen_arbtube(k.GARTERTUBE, COLOR_LEFT, 5, X3, X4));

k.run(k.gen_arbtube_varyingdiameter(k.GARTERTUBE, COLOR_LEFT,X3, X4, function*() {
	yield 0
	const RADIUS = 12
	for (let i=0;i<=RADIUS;i++) {
		let val = (X3-X1-RADIUS)+RADIUS*Math.sin(i* Math.PI/2/RADIUS)
		val = Math.round(val/2)*2
		yield val
	}
}))

function gap(x) {
	k.xfer('f'+(x+1),'b'+(x+1))
	k.rack(1)
	k.xfer('b'+(x+1),'f'+(x+2))
	k.rack(0)
}
for (let x of [X2-2,X5]) gap(x)

//sleeves
let sleeve_left  = k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.GARTERTUBE, COLOR_LEFT,COURSES_SLEEVES,X1,X2-2),
	//k.gen_bindoffTubeOpen(COLOR_LEFT,X1,X2-2)
),COLOR_LEFT,false,false,true);

let chest = k.wrap_serial(
	k.wrap_autohook(k.wrap_serial(
		k.gen_arbtube(k.GARTERTUBE, COLOR_CHEST,COURSES_CHEST,X2,X5),
		// k.gen_bindoffTubeOpen(COLOR_CHEST,X2,X5)
	),COLOR_CHEST)
)

let sleeve_right = k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.GARTERTUBE, COLOR_RIGHT,COURSES_SLEEVES,X5+2,X6),
	// k.gen_bindoffTubeOpen(COLOR_CHEST,X2,X5)
),COLOR_RIGHT);

k.run_parallel(sleeve_left, chest, sleeve_right)
// k.bindoffTubeOpen(COLOR_LEFT, X1, X2)
// k.bindoffTubeOpen(COLOR_RIGHT, X5+2, X6)

k.write('out/top.k');
