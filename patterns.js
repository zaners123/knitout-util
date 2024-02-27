/*
This file makes a line of basic stitch patterns, as listed below
* */
const lib = require('./lib/lib');
let k = new lib.SmartWriter();

const COLOR = '6';
const LEN_SQUARE = 32;

k.run(
	k.wrap_autohook(
		k.wrap_serial(
			k.gen_arbsquare(k.STOCKINETTE,  COLOR, LEN_SQUARE, 10, 10+LEN_SQUARE),
			k.gen_arbsquare(k.RIB1X1,       COLOR, LEN_SQUARE, 10, 10+LEN_SQUARE),
			k.gen_arbsquare(k.RIB2X2,       COLOR, LEN_SQUARE, 10, 10+LEN_SQUARE),
			k.gen_arbsquare(k.SEED,         COLOR, LEN_SQUARE, 10, 10+LEN_SQUARE),
			k.gen_arbsquare(k.GARTER,       COLOR, LEN_SQUARE, 10, 10+LEN_SQUARE),
		)
	,COLOR)
)
k.write('out/patterns.k');