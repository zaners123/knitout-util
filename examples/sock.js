/*
This file makes a tube sock based on a wide variety of half-gauge patterns:
	- 1x1 Rib
	- Broken Rib
	- Seed
	- Garter
	- Diagonal
	- Checker
	- Stockinette
	- 2X2 Rib
Then ties it off to close the tube
*/
const lib = require('../lib/knitout_util');
let k = new lib.KnitoutUtil();

const COLOR_STRIPEA = '6';
const COLOR_STRIPEB = '7';
const COURSES_PER_STRIPE = 16;
const X1=0;
const X2=36;

k.run_serial(
	k.wrap_autohook(k.wrap_serial(
		k.gen_bindon_tube_open(k.RIB1X1, COLOR_STRIPEA, X1, X2),
		k.gen_arbtube(k.RIB1X1,COLOR_STRIPEA,COURSES_PER_STRIPE, X1, X2)
	),COLOR_STRIPEA),
	k.wrap_autohook(k.gen_arbtube(k.BROKENRIB  ,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),COLOR_STRIPEB),
	k.wrap_autohook(k.gen_arbtube(k.SEED       ,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),COLOR_STRIPEA),
	k.wrap_autohook(k.gen_arbtube(k.GARTER     ,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),COLOR_STRIPEB),
	k.wrap_autohook(k.gen_arbtube(k.DIAGONAL   ,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),COLOR_STRIPEA),
	k.wrap_autohook(k.gen_arbtube(k.CHECKER3X3 ,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),COLOR_STRIPEB),
	k.wrap_autohook(k.gen_arbtube(k.STOCKINETTE,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),COLOR_STRIPEA),
	k.wrap_autohook(k.wrap_serial(
		k.gen_arbtube(k.RIB2X2, COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
		k.gen_arbtube(k.STOCKINETTE,COLOR_STRIPEB, 4, X1, X2),
		k.gen_bindoff_closed(COLOR_STRIPEB, X1, X2)
	),COLOR_STRIPEB)
)

k.write('out/sock.k');
