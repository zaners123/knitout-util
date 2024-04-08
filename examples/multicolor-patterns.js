/*
This file makes a multicolor zig-zag
* */
const lib = require('../lib/knitout_util');
let k = new lib.KnitoutUtil();

const COLOR_A = '6';
const COLOR_B = '7';
const X1 = 30;
const X2 = 59;
const TOPRIB = 10;

let zig = X1+5;

k.rack(0)

k.run_autohook(
	k.wrap_serial(
		k.gen_arbsquare(k.RIB1X1,       COLOR_A, TOPRIB, X1, X2),
		k.gen_arbsquare(k.STOCKINETTE,  COLOR_A, 1, X1, zig),
	)
,COLOR_A,true,true,false)

k.run_autohook(
	k.gen_arbsquare(k.STOCKINETTE, COLOR_B, 1, zig+1, X2)
,COLOR_B, true, true, false)

function zigzag(pattern, angle, count) {
	let course = 1
	for (let x=0;x<count;x++) {
		while (zig <= X2-angle-2) {
			k.run(k.gen_arbsquare(pattern, COLOR_A, course+1, X1, zig,course))
			k.run(k.gen_arbsquare(pattern, COLOR_B, course+2, zig+1, X2,course))
			course++
			k.run(k.gen_arbsquare(pattern, COLOR_A, course+1, X1, zig,course))
			course++
			zig+=angle
		}
		while (zig >= X1+angle+2) {
			k.run(k.gen_arbsquare(pattern, COLOR_A, course+1, X1, zig,course))
			k.run(k.gen_arbsquare(pattern, COLOR_B, course+2, zig+1, X2,course))
			course ++
			k.run(k.gen_arbsquare(pattern, COLOR_A, course+1, X1, zig,course))
			course++
			zig-=angle
		}
	}
}

zigzag(k.STOCKINETTE, 1, 1)
zigzag(k.SEED, 4, 2)

// Doubleknit

var getPixels = require("get-pixels")
getPixels("image_test.png", function(err, pixels) {
	if(err) {
		console.log("Bad image path")
		return
	}
	let img = []
	let neg = []
	let shape = pixels.shape
	for (let y=shape[0]-1;y>=0;y--) {
		let posrow = []
		let negrow = []
		for (let x=0;x<shape[1];x++) {
			let black = pixels.get(x,y,0) > 127
			posrow.push(black?'k':'p')
			negrow.push(black?'p':'k')
		}
		img.push(posrow)
		neg.push(negrow)
	}
	for (let y=0; y<img.length; y++) {
		k.run(k.gen_arbsquare({'name':'imgpos'+y,'square':[img[y]]}, COLOR_A, y+1, X1, X1+img[y].length,y, false))
		k.run(k.gen_arbsquare({'name':'imgneg'+y,'square':[neg[y]]}, COLOR_B, y+1, X1, X1+img[y].length,y, false))
	}
	k.outhook(COLOR_B);
	k.outhook(COLOR_A);
	k.write('out/multicolor-patterns.k');
})








