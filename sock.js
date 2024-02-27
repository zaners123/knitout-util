/*
The goal is to do:
	1. a tube tie-on
	2. 1" of 2x2 rib
	3. About 200 seed-stitch loops with stripes
	4. A tube-closing tieoff
*/
const lib = require('./lib/lib');
let k = new lib.SmartWriter();

const COLOR_STRIPEA = '6';
const COLOR_STRIPEB = '7';

const COURSES_RIB = 30;
const COURSES_PER_STRIPE = 16;
const WALES = 36;

const CENTER = 51;
const X1=CENTER-WALES/2;
const X2=CENTER+WALES/2;

//main waste knit
// let waste_f = [1,1,1,0,1,0];
// let waste_b = [1,1,0,1,0,1];
//
// k.run(k.wrap_autohook(
// 	k.gen_skiptube(COLOR_WASTE,10,X1,X2,waste_f,waste_b),
// 	COLOR_WASTE
// ))
//
// main single waste loop
// k.run(k.wrap_autohook(
// 	k.gen_skiptube(COLOR_WASTESINGLE,1,X1,X2,waste_f,waste_b),
// 	COLOR_WASTESINGLE))

//main rib
k.run(k.wrap_autohook(k.wrap_serial(
		// k.gen_caston(COLOR_STRIPEA,X1,X2),
		k.gen_arbtube(k.STOCKINETTETUBE,COLOR_STRIPEA,10, X1, X2),
		k.gen_switch_arbitrary(COLOR_STRIPEA,X1,X2,k.STOCKINETTETUBE,k.RIBTUBE2x2),
		k.gen_arbtube(k.RIBTUBE2x2,COLOR_STRIPEA,COURSES_RIB, X1, X2),
		k.gen_switch_arbitrary(COLOR_STRIPEA,X1,X2,k.RIBTUBE2x2,k.BROKENRIB_TUBE)
),COLOR_STRIPEA))

k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.BROKENRIB_TUBE,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
	k.gen_switch_arbitrary(COLOR_STRIPEB,X1,X2,k.BROKENRIB_TUBE,k.SEEDTUBE),
),COLOR_STRIPEB))

k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.SEEDTUBE,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),
	k.gen_switch_arbitrary(COLOR_STRIPEA,X1,X2,k.SEEDTUBE,k.GARTERTUBE),
),COLOR_STRIPEA))

k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.GARTERTUBE,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
	k.gen_switch_arbitrary(COLOR_STRIPEB,X1,X2,k.GARTERTUBE,k.DIAGONALTUBE),
),COLOR_STRIPEB))

k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.DIAGONALTUBE,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),
	k.gen_switch_arbitrary(COLOR_STRIPEA,X1,X2,k.DIAGONALTUBE,k.CHECKERTUBE3x3),
),COLOR_STRIPEA))


k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.CHECKERTUBE3x3,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
	k.gen_switch_arbitrary(COLOR_STRIPEB,X1,X2,k.CHECKERTUBE3x3,k.STOCKINETTETUBE),
),COLOR_STRIPEB))


k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.STOCKINETTETUBE,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),
	k.gen_switch_arbitrary(COLOR_STRIPEA,X1,X2,k.STOCKINETTETUBE,k.RIBTUBE1x1),
),COLOR_STRIPEA))


k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.RIBTUBE1x1, COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
	k.gen_arbtube(k.STOCKINETTETUBE,COLOR_STRIPEB, 4, X1, X2),
	k.gen_bindoffFront(COLOR_STRIPEB, X1, X2)
),COLOR_STRIPEB))

k.write('out/sock.k');
