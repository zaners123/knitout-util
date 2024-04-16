/*
This file makes a tube sock of:
   - A halfgauge 1x1 rib followed by a halfgauge stockinette
Then ties it off to close the tube
*/
const lib = require('../lib/knitout_util');
let k = new lib.KnitoutUtil();

const COLOR_STRIPEA = '6';
const X1=0;
const X2=40; //V1 is 36, V2 is 50

k.run_autohook(k.wrap_serial(
	k.gen_bindon_tube_open( k.STOCKINETTE,          COLOR_STRIPEA,                 X1, X2),
	k.gen_arbtube(          k.STOCKINETTE,          COLOR_STRIPEA,   8, X1, X2),
	k.gen_arbtube(          k.RIB1X1,               COLOR_STRIPEA,  64, X1, X2),
	k.gen_arbtube(          k.FULLGAUGE_STOCKINETTE,COLOR_STRIPEA, 250, X1, X2),
	k.gen_heel(             k.FULLGAUGE_STOCKINETTE,COLOR_STRIPEA,                 X1, X2),
	k.gen_arbtube(          k.FULLGAUGE_STOCKINETTE,COLOR_STRIPEA,  90, X1, X2),
	k.gen_bindoff_closed(COLOR_STRIPEA,                                            X1, X2,false)
),COLOR_STRIPEA)

k.write('out/sock.k');
