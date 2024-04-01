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
k.bindon_tube(COLOR_A, X1, X2)
k.releasehook(COLOR_A)

k.inhook(COLOR_B)
k.bindon_tube(COLOR_B, X1, X2)
k.knit_line_of_tube(k.STOCKINETTE.front[0], COLOR_B, X1, X2, '+','f')
k.releasehook(COLOR_B)

function zigzag_tube(pattern, angle, count) {
	function step(course, zig) {
		//be careful sewing between [zig-angle, zig] when going to right (and different thing when going left)
		let zigB = X2-(zig-X1)

		let front1 = pattern.front[course     % pattern.front.length]
		let front2 = pattern.front[(course+1) % pattern.front.length]
		let back1  = pattern.back [course     % pattern.back .length]
		let back2  = pattern.back [(course+1) % pattern.back .length]
		k.comment("colorA f+ f- b+ b-")
		k.knit_line_of_tube(front1,COLOR_A,X1,zig ,'+','f')
		k.knit_line_of_tube(front2,COLOR_A,X1,zig ,'-','f')
		k.knit_line_of_tube(back1 ,COLOR_A,X1,zigB,'+','b')
		k.knit_line_of_tube(back2 ,COLOR_A,X1,zigB,'-','b')
		k.comment("colorB f- f+ b- b+")
		k.knit_line_of_tube(front1,COLOR_B,zig +1,X2,'-','f')
		k.knit_line_of_tube(front2,COLOR_B,zig +1,X2,'+','f')
		k.knit_line_of_tube(back1 ,COLOR_B,zigB+1,X2,'-','b')
		k.knit_line_of_tube(back2 ,COLOR_B,zigB+1,X2,'+','b')
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
		while (zig <= X1+Math.round((X2-X1)/2)) {
			step(course, zig)
			course++
			zig+=angle
		}
	}
}

zigzag_tube(k.RIB1X1, 2, 1)
zigzag_tube(k.STOCKINETTE, 2, 2)

k.run(k.gen_bindoffFront(COLOR_A, X1, X2, true))

k.outhook(COLOR_A)
k.outhook(COLOR_B)

k.write('out/zigzagsock.k');