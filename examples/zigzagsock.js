/*
This file makes a multicolor zig-zag sock
* */
const lib = require('../lib/knitout_util');
let k = new lib.KnitoutUtil();

/**Make a zigzag shape*/
function shape_zigzag(X1, X2, angle=1,count=1) {
	let zig = Math.floor(X1+(X2-X1)/2);
	let ret = []
	for (let x=0;x<count;x++) {
		while (zig <= X2-angle-2) {
			ret.push(zig)
			zig+=angle
		}
		while (zig >= X1+angle+2) {
			ret.push(zig)
			zig-=angle
		}
		while (zig <= X1+Math.round((X2-X1)/2)) {
			ret.push(zig)
			zig+=angle
		}
	}
	return ret
}
/**Make a sine-wave shape*/
function shape_sinwave(X1, X2,courses) {
	let ret = []
	for (let x=0;x<courses;x++) {
		ret.push(Math.round((X2-X1)/2 + (X2-X1-6)/2*Math.sin(2 * Math.PI * x/(courses-1))))
	}
	return ret
}
function merge001122(arr1, arr2) {
	let ret = []
	let one,two = undefined
	do {
		one = arr1.shift()
		two = arr2.shift()
		ret.push(one)
		ret.push(two)
	} while (one !== undefined || two !== undefined)
	return ret
}

const COLOR_A = '6';
const COLOR_B = '7';
const X1 = 0;
const X2 = 36;

//make some cool patterns
const zig = shape_zigzag(X1, X2, 2)
const zigB = zig.slice().reverse()
const wave = shape_sinwave(X1,X2,24)

let halfwave = shape_sinwave(X1,X2,12)
const interleave = merge001122(halfwave, halfwave.slice().reverse())

k.run_autohook(k.gen_bindon_tube_open(k.RIB1X1, COLOR_A, X1, X2), COLOR_A, true, true, false)
k.run_autohook(k.gen_bindon_tube_open(k.RIB1X1, COLOR_B, X1, X2), COLOR_B, true, true, false)
k.knit_line_of_tube(k.STOCKINETTE.front[0], COLOR_B, X1, X2, '+','f')

k.run_serial(
	k.gen_tube_dualcarrier(k.RIB1X1,      COLOR_A, COLOR_B, X1, zig, zigB, X2),
	k.gen_tube_dualcarrier(k.STOCKINETTE, COLOR_A, COLOR_B, X1, zig, zigB, X2),
	k.gen_tube_dualcarrier(k.GARTER, COLOR_A, COLOR_B, X1,wave, wave, X2),
	k.gen_tube_dualcarrier(k.DIAGONAL, COLOR_A, COLOR_B, X1, interleave, interleave, X2),
	k.gen_bindoff_closed(COLOR_A, X1, X2,false)
)

k.outhook(COLOR_A)
k.outhook(COLOR_B)

k.write('out/zigzagsock.k');