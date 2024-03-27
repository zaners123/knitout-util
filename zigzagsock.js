/*
This file makes a multicolor zig-zag sock
* */
const lib = require('./lib/knitout_util');
let k = new lib.KnitoutUtil();

const COLOR_A = '6';
const COLOR_B = '7';
const X1 = 0;
const X2 = 38;

let zig = Math.floor(X1+(X2-X1)/2);

k.rack(0)

k.inhook(COLOR_A)
k.knit_line_of_tube(k.STOCKINETTE, COLOR_A, X1, zig, '+','f')
k.releasehook(COLOR_A)

k.inhook(COLOR_B)
k.knit_line_of_tube(k.STOCKINETTE, COLOR_B, zig+1, X2, '-','f')
k.releasehook(COLOR_B)

function zigzag_tube(pattern, angle, count) {
	function step(course, zig) {
		let zigB = X2-(zig-X1)
		k.comment("ColorA CW  f- b+")
		k.knit_line_of_tube(pattern.front[course % pattern.front.length], COLOR_A, X1, zig,'-','f')
		k.knit_line_of_tube(pattern.back [course % pattern.back .length], COLOR_A, X1, zigB,'+','b')
		k.comment("ColorB CCW f+ b-")
		k.knit_line_of_tube(pattern.front[course % pattern.front.length], COLOR_B, zig+1, X2,'+','f')
		k.knit_line_of_tube(pattern.front[course % pattern.front.length], COLOR_B, zigB+1, X2,'-','b')
		k.comment("ColorB CW b+ f-")
		k.knit_line_of_tube(pattern.front[course % pattern.front.length], COLOR_B, zigB+1, X2,'+','b')
		k.knit_line_of_tube(pattern.front[course % pattern.front.length], COLOR_B, zig+1, X2,'-','f')
		k.comment("ColorA CCW b- f+")
		k.knit_line_of_tube(pattern.front[course % pattern.front.length], COLOR_A, X1, zigB,'-','b')
		k.knit_line_of_tube(pattern.back [course % pattern.back .length], COLOR_A, X1, zig,'+','f')
	}
	let course = 1
	for (let x=0;x<count;x++) {
		while (zig <= X2-angle-2) {
			step(course, zig)
			course++
			zig+=angle
		}
		while (zig >= X1+angle+2) {
			step(course, zig)
			course++
			zig-=angle
		}
	}
}

zigzag_tube(k.RIB1X1, 2, 1)
zigzag_tube(k.STOCKINETTE, 2, 5)

// tieoff. bindoff.
k.run_serial(
	k.wrap_autohook(k.gen_bindoffFront(COLOR_A, X1, zig), COLOR_A, false, false, true),
	k.wrap_autohook(k.gen_bindoffFront(COLOR_B, zig+1, X2), COLOR_B, false, false, true),
)

k.write('out/zigzagsock.k');