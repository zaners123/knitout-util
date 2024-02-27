/*
This file makes a tube sock based on a wide variety of tube stitch patterns such as:
	- 2x2 Rib stitch
	- Broken Rib Stitch
	- Seed Stitch
	- Garter Tube
	- Diagonal Tube
	- Checker Tube
Then ties it off to close the tube
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

//main rib
k.run(k.wrap_autohook(k.wrap_serial(
		// k.gen_caston(COLOR_STRIPEA,X1,X2),
		k.gen_arbtube(k.STOCKINETTE,COLOR_STRIPEA,10, X1, X2),
		k.gen_tubeswitch_arbitrary(k.STOCKINETTE, k.RIB2X2, COLOR_STRIPEA, X1, X2),
		k.gen_arbtube(k.RIB2X2,COLOR_STRIPEA,COURSES_RIB, X1, X2),
		k.gen_tubeswitch_arbitrary(k.RIB2X2, k.BROKENRIB, COLOR_STRIPEA, X1, X2)
),COLOR_STRIPEA))

k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.BROKENRIB,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
	k.gen_tubeswitch_arbitrary(k.BROKENRIB, k.SEED, COLOR_STRIPEB, X1, X2),
),COLOR_STRIPEB))

k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.SEED,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),
	k.gen_tubeswitch_arbitrary(k.SEED, k.GARTER, COLOR_STRIPEA, X1, X2),
),COLOR_STRIPEA))

k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.GARTER,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
	k.gen_tubeswitch_arbitrary(k.GARTER, k.DIAGONAL, COLOR_STRIPEB, X1, X2),
),COLOR_STRIPEB))

k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.DIAGONAL,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),
	k.gen_tubeswitch_arbitrary(k.DIAGONAL, k.CHECKER3X3, COLOR_STRIPEA, X1, X2),
),COLOR_STRIPEA))


k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.CHECKER3X3,COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
	k.gen_tubeswitch_arbitrary(k.CHECKER3X3, k.STOCKINETTE, COLOR_STRIPEB, X1, X2),
),COLOR_STRIPEB))


k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.STOCKINETTE,COLOR_STRIPEA, COURSES_PER_STRIPE, X1, X2),
	k.gen_tubeswitch_arbitrary(k.STOCKINETTE, k.RIB1X1, COLOR_STRIPEA, X1, X2),
),COLOR_STRIPEA))


k.run(k.wrap_autohook(k.wrap_serial(
	k.gen_arbtube(k.RIB1X1, COLOR_STRIPEB, COURSES_PER_STRIPE, X1, X2),
	k.gen_arbtube(k.STOCKINETTE,COLOR_STRIPEB, 4, X1, X2),
	k.gen_bindoffFront(COLOR_STRIPEB, X1, X2)
),COLOR_STRIPEB))

k.write('out/sock.k');
