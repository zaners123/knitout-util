/*
The goal is to do:
	1. a tube tie-on
	2. 1" of 2x2 rib
	3. About 200 seed-stitch loops with stripes
	4. A tube-closing tieoff
*/
const lib = require('./lib/lib');
let k = new lib.SmartWriter();

const COLOR_RIB     = '6';
const COLOR_CONE    = '6';
const COLOR_PALM    = '6';
const COLOR_PINKIE  = '6';
const COLOR_THUMB   = '7';
const COLOR_RING    = '7';
const COLOR_MIDDLE  = '8';
const COLOR_INDEX   = '9';

const COURSES_RIB   = 50;
const COURSES_CONE  = 30;
const COURSES_PALM  = 24;
const COURSES_THUMB = 30;
const COURSES_INDEX = 40;
const COURSES_MIDDLE= 46;
const COURSES_RING  = 44;
const COURSES_PINKIE= 30;

const X1=30
const X2=40
const X3=50
const X4=60
const X5=70
const X6=84//thumb

//main rib
k.run(
	k.wrap_autohook(
		k.wrap_serial(
			// k.gen_skiptube(COLOR_RIB,4,X1,X5,k.RIBTUBE1x1),
			k.gen_arbtube(k.RIBTUBE1x1,COLOR_RIB,COURSES_RIB, X1, X5),
			k.gen_switch_arbitrary(COLOR_RIB,X1,X5,k.RIBTUBE1x1,k.STOCKINETTETUBE),
		)
	,COLOR_RIB,true,true,false)
)

//main palm
k.run(k.gen_arbtube(k.STOCKINETTETUBE, COLOR_CONE, 5, X1, X5));
k.run(k.gen_arbcone(k.STOCKINETTETUBE, COLOR_CONE, COURSES_CONE, X1, X5, X1, X6))

function fingergap(x) {
	k.xfer('f'+(x+1),'b'+(x+1))
	k.rack(1)
	k.xfer('b'+(x+1),'f'+(x+2))
	k.rack(0)
}

//thumb finger gap
fingergap(X5);

let thumb = k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.STOCKINETTETUBE, COLOR_THUMB, COURSES_THUMB, X5+2, X6),
	k.gen_bindoffFront(COLOR_THUMB,X5+2,X6,true)
),COLOR_THUMB)

let palm = k.gen_arbtube(k.STOCKINETTETUBE, COLOR_PALM, COURSES_PALM, X1, X5)

//main palm and thumb
k.run_parallel(palm,thumb)

//main fingers
let pinkie  = k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.STOCKINETTETUBE, COLOR_PINKIE,COURSES_PINKIE,X1,X2),
	k.gen_bindoffFront(COLOR_PINKIE,X1,X2)
),COLOR_PINKIE,false,false,true);

let ring   = k.wrap_serial(
	k.wrap_autohook(k.wrap_serial(
		k.gen_arbtube(k.STOCKINETTETUBE, COLOR_RING,COURSES_RING,X2+2,X3),
		k.gen_bindoffFront(COLOR_RING, X2+2, X3)
	),COLOR_RING)
)
let middle = k.wrap_serial(
	k.wrap_autohook(k.wrap_serial(
		k.gen_arbtube(k.STOCKINETTETUBE, COLOR_MIDDLE,COURSES_MIDDLE,X3+2,X4),
		k.gen_bindoffFront(COLOR_MIDDLE, X3+2, X4)
	),COLOR_MIDDLE)
)
let index  = k.wrap_serial(
	k.wrap_autohook(k.wrap_serial(
		k.gen_arbtube(k.STOCKINETTETUBE, COLOR_INDEX,COURSES_INDEX,X4+2,X5),
		k.gen_bindoffFront(COLOR_INDEX, X4+2, X5)
	),COLOR_INDEX)
)

//other finger gaps
for (let x of [X2,X3,X4]) fingergap(x)

k.run_parallel(pinkie,ring,middle,index)

k.write('out/glove.k');
