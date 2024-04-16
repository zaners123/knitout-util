// import the knitoutWriter code and instantiate it as an object
const knitout = require('./knitout');

function* rangeInc(end, start) {
	do {
		yield start
		start += start > end ? -1 : 1;
	} while (start !== end)
	yield end
}
function* range(x1,x2, dir) {
	if (dir==='+') {
		for (let i=x1;i<=x2;i++) yield i;
	} else {
		for (let i=x2;i>=x1;i--) yield i;
	}
}

/**
 * Goal: Manage which hooks have thread to automatically optimize stuff
 * */
class KnitoutUtil extends knitout.Writer {

	constructor() {
		super({carriers:['1', '2', '3', '4', '5', '6', '7', '8','9','10']});
		super.addHeader('Position','Right');
		this.rack(0)
		this.BROKENRIB = {
			'name':'Broken Rib',
			'front':[
				['k',' ','p',' ','k',' '],
				['k',' ','p',' ','k',' '],
				['p',' ','p',' ','p',' '],
				['k',' ','k',' ','k',' '],
			],
			'back':[
				[' ','k',' ','p',' ','k'],
				[' ','k',' ','p',' ','k'],
				[' ','p',' ','p',' ','p'],
				[' ','k',' ','k',' ','k'],
			]
		}
		this.CHECKER3X3 = {
			'name':'Checker 3x3',
			'front':[
				['k',' ','k',' ','k',' ','p',' ','p',' ','p',' '],
				['k',' ','k',' ','k',' ','p',' ','p',' ','p',' '],
				['k',' ','k',' ','k',' ','p',' ','p',' ','p',' '],
				['p',' ','p',' ','p',' ','k',' ','k',' ','k',' '],
				['p',' ','p',' ','p',' ','k',' ','k',' ','k',' '],
				['p',' ','p',' ','p',' ','k',' ','k',' ','k',' '],
			],
			'back':[
				[' ','k',' ','k',' ','k',' ','p',' ','p',' ','p'],
				[' ','k',' ','k',' ','k',' ','p',' ','p',' ','p'],
				[' ','k',' ','k',' ','k',' ','p',' ','p',' ','p'],
				[' ','p',' ','p',' ','p',' ','k',' ','k',' ','k'],
				[' ','p',' ','p',' ','p',' ','k',' ','k',' ','k'],
				[' ','p',' ','p',' ','p',' ','k',' ','k',' ','k'],
			],
		}
		this.DIAGONAL = {
			'name':'Diagonal',
			'front':[
				['p',' ','k',' ','k',' ','k',' '],
				['k',' ','p',' ','k',' ','k',' '],
				['k',' ','k',' ','p',' ','k',' '],
				['k',' ','k',' ','k',' ','p',' '],
			],
			'back':[
				[' ','p',' ','k',' ','k',' ','k'],
				[' ','k',' ','p',' ','k',' ','k'],
				[' ','k',' ','k',' ','p',' ','k'],
				[' ','k',' ','k',' ','k',' ','p'],
			],
		}
		this.GARTER = {
			'name':'Garter',
			'front': [['k',' '], ['p',' ']],
			'back':  [[' ','k'], [' ','p']],
			'square':[['k'], ['p']]
		};
		this.RIB1X1 = {
			'name':'Rib 1x1',
			'front': [['k',' ','p',' ']],
			'back':  [[' ','k',' ','p']],
			'square':[['k','p']]
		}
		this.RIB2X2 = {
			'name':'Rib 2x2',
			'front': [['k',' ','k',' ','p',' ','p',' ']],
			'back':  [[' ','k',' ','k',' ','p',' ','p']],
			'square':[['k','k','p','p']]
		}
		this.SEED = {
			'name':'Seed',
			'front': [['k',' ','p',' '],['p',' ','k',' ']],
			'back':  [[' ','p',' ','k'],[' ','k',' ','p']],
			'square':[['k','p'],['p','k']]
		}
		this.STOCKINETTE = {
			'name':'Stockinette',
			'front':[['k',' ']],
			'back': [[' ','k']],
			'square': [['k']],
		}
		this.COMPACT_RIB1X1 = {//Note: This isn't half-gauge
			'name':'COMPACT Rib 1x1',
			'front': [['k','p',' ']],
			'back':  [['k',' ','p']],
			'square':[['k','p']]
		}
		this.COMPACT_RIB2X2 = {//Note: This isn't half-gauge
			'name':'COMPACT Rib 2x2',
			'front': [['k','k','p',' ','p',' ']],
			'back':  [['k','k',' ','p',' ','p']],
			'square':[['k','k','p','p']]
		}
		this.FULLGAUGE_STOCKINETTE = {//Note: This isn't half-gauge
			'name':'COMPACT Stockinette',
			'front':[['k']],
			'back': [['k']],
			'square': [['k']],
		}
	}

	//main overridden functions to track which hooks are loaded
	comment(str, log=false) {
		if (log) console.log(str)
		super.comment(str)
	}
	knit(dir,needle,carrier) {
		if (!(needle in this.needles)) {
			this.tuck(dir,needle,carrier)
			this.comment("Warn: Tucking instead of knitting ^")
		} else {
			super.knit(dir,needle,carrier)
		}
	}
	xfer(from,to) {
		if (!(from in this.needles)) this.comment("Warn: False Transfer Occurred "+from+"->"+to)
		super.xfer(from,to);
	}

	shape_line(courses, x1a, x1b) {
		let x1slope = (x1b-x1a)/courses;
		let goal_x1 = x1a, fgoal_x1=x1a
		let x1 = x1a//x1 on needle
		let course = 0
		let res = []
		while (course < courses) {
			fgoal_x1 += x1slope
			goal_x1 = Math.round(fgoal_x1)
			res.push(goal_x1)
			course++
			x1 = goal_x1
		}
		if (x1 !== x1b) throw "bad cone"
		return res
	}

	shape_zigzag(X1, X2, angle=1,count=1) {
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


	/**Bind-on a tube using a pattern
	 * The pattern is important to know what to skip
	 * This binds-on using a method of tucking even wales, tucking odd wales, then knitting one loop
	 * */
	gen_bindon_tube_open(pattern, carrier, X1, X2) {
		return function* g(k) {
			function kparray_to_bindons(kparray) {
				let evenarr = []
				let oddarr = []
				let even = true
				for (let i of kparray.keys()) {
					if (kparray[i] === ' ') {
						evenarr[i] = ' '
						oddarr[i] = ' '
					} else {
						evenarr[i] = even ? 'k' : ' '
						oddarr[i] = even ? ' ' : 'k'
						even = !even
					}
				}
				return [evenarr, oddarr]
			}

			let front = Array.prototype.concat(pattern.front[0], pattern.front[0])
			let back = Array.prototype.concat(pattern.back[0], pattern.back[0])

			let [fs_even, fs_odd] = kparray_to_bindons(front)
			let [bs_even, bs_odd] = kparray_to_bindons(back)
			k.comment("FS")
			k.knit_line_of_tube(fs_even, carrier, X1, X2, '+', 'f')
			yield {'dir': '+', 'wale': X2};
			k.knit_line_of_tube(fs_odd, carrier, X1, X2, '+', 'f')
			yield {'dir': '-', 'wale': X1};

			k.comment("BS")
			k.knit_line_of_tube(bs_even, carrier, X1, X2, '-', 'b')
			yield {'dir': '+', 'wale': X2};
			k.knit_line_of_tube(bs_odd, carrier, X1, X2, '-', 'b')
			yield {'dir': '-', 'wale': X1};

		}(this);
	}

	/**Knits a needle in a bindoff-friendly way*/
	bindoff_needle(carrier, bed, wale, dir) {
		this.knit(dir, bed + wale, carrier);//knit
		this.miss(dir, bed + (wale + ((dir==="+")?1:-1)), carrier);//pull
	}

	/**At wale loc, make a tieoff tail that could be knitted back in*/
	bindoff_tail(carrier, wale, facingRight=true,tailminwidth=1) {
		let w = tailminwidth
		for (let x of [w,w,w,w+1,w+1,w+2,w+2,w+3,w+3,w+3]) {
			let x1 = facingRight?wale:(wale-x)
			let x2 = facingRight?(wale+x):wale
			this.knit_line_of_tube(['k'],carrier, x1, x2, '-','f')
			this.miss("-", "f"+(x1-1), carrier);
			this.knit_line_of_tube(['k'],carrier, x1, x2, '+','f')
			this.miss("+", "f"+(x2+1), carrier);
		}
	}

	/**
	 * Bindoff a halfgauge tube in a way that leaves it open, such as a straw
	 * */
	gen_bindoff_halfgauge_tube_open(carrier, x1, x2) {
		if (x2%2!==0) x2++
		return function* g(k) {
			//bindoff front
			for (let wale = x1; wale < x2; wale += 2) {
				k.rack(0);
				k.xfer("f"+wale, "b"+wale);
				k.rack(2);
				k.xfer("b"+wale, "f" + (wale + 2));//transfer right
				k.bindoff_needle(carrier,'f',wale+2,'+')
			}

			//move front bindoff to back
			k.rack(1);
			k.xfer('f' + (x2+1), 'b' + (x2-1));
			k.bindoff_needle(carrier,'b',x2-1,'-')

			//bindoff back
			for (let wale = x2+1; wale > x1+1; wale -= 2) {
				k.rack(-1);
				k.xfer("b" + wale, "f" + (wale - 1));//transfer back to front
				k.rack(1);
				k.xfer("f" + (wale - 1), "b" + (wale - 2));//transfer front to back
				k.knit("-", "b" + (wale - 2), carrier);//knit
				if (wale - 2 >= x1) k.miss("-", "b" + (wale - 3), carrier);
				k.rack(0);
			}
			k.bindoff_tail(carrier, x1 + 1);
			k.rack(0);
		}(this);
	}

	/**
	 * Knits a single line following a single line of a pattern, assuming you want to transfer tube-style
	 * @param kparray 1D array of knits or pearls
	 * */
	knit_line_of_tube(kparray, carrier, x1, x2, dir, bed) {
		let dirinv = (dir==='+')?'-':'+'
		let bedinv = (bed==='f')?'b':'f'

		//1. xfer pearls to other bed
		for (let wale of range(x1,x2,dirinv)) {
			let front_stitch = kparray[(wale) % kparray.length];
			if (front_stitch === 'p') this.xfer(bed + wale, bedinv + wale);
		}
		//2. knit right all
		for (let wale of range(x1,x2,dir)) {
			let front_stitch = kparray[(wale) % kparray.length];
			if (front_stitch === 'k') this.knit(dir, bed    + wale, carrier);
			if (front_stitch === 'p') this.knit(dir, bedinv + wale, carrier);
		}
		//3. xfer pearls to bed
		for (let wale of range(x1,x2,dirinv)) {
			let front_stitch = kparray[(wale) % kparray.length];
			if (front_stitch === 'p') this.xfer(bedinv + wale, bed + wale);
		}
	}

	//main generators: These follow a form similar to
	// return function* g(k) {
	// k.knit(...)
	// yield {'dir': '+', 'wale': x2};
	// }(this)

	/**This can close/bindoff a knit.
	 *
	 * This can close a tube if it was preceded by stockinette tube, (such as the end of a sock, hat, etc)
	 * bindoffFront assumes you ended on a complete row of f+ stitches (such as having just done a line of 'knit + f1234')
	 * WARNING bindoffFront goes left-to-right, so if the carrier doesn't start on the left it doesn't work at all!
	 * */
	gen_bindoff_closed(carrier, x1, x2, facingRight = undefined) {
		let tailminwidth = 3
		return function* g(k) {
			for (let wale = x1; wale < x2-tailminwidth+1; wale++) {
				k.xfer("f"+wale,"b"+wale);//transfer front to back
				k.rack(1);//rack to right
				k.xfer("b"+wale,"f"+(wale+1));//transfer right

				k.knit("+", "f"+(wale+1), carrier);//knit
				if (wale+2 <= x2-tailminwidth+1) {
					k.miss("+", "f"+(wale+2), carrier);
				}
				k.rack(0);
			}
			k.xfer("b"+x2,"f"+x2)
			k.bindoff_tail(carrier, x2,facingRight,tailminwidth);
			yield {'dir': '+', 'wale': x2};
		}(this);
	}

	/**Can make a tube varying in diameter, useful for thigns like arcing shoulder side to round shoulders
	 * Consecutively calls gen_arbtube with arguments generated from diam_generator
	 *  more specifically, calls it from x1-offset to x2+offset where offset is diam_generator.next
	 * @param pattern A knit pattern, such as this.STOCKINETTETUBE
	 * @param carrier The yarn carrier
	 * @param x1Array leftside  wale to subtract successive diam_generator calls from
	 * @param x2Array rightside wale to add      successive diam_generator calls from
	 * @param starting_course
	 * */
	gen_arbtube_varying_sides(pattern, carrier, x1Array, x2Array, starting_course=0) {
		if (x1Array.length !== x2Array.length) throw "Different lengths"
		return function* g(k) {
			let x1Last = x1Array[0]
			let x2Last = x2Array[0]
			let course = 0
			for (let index = 0;index < x1Array.length; index++) {
				let x1 = x1Array[index]
				let x2 = x2Array[index]

				if (x1 < x1Last) {
					console.log("Grow by "+(x1Last-x1))
					//todo fix
					// for (let wale=x1Last-1;wale>=x1;wale--) {
					// 	k.knit('-','b'+wale,carrier)
					// 	k.split('-','b'+wale,'f'+wale,carrier)//TODO fix
					// }
				} else if (x1 > x1Last) {
					console.log("Shrink by "+(x1-x1Last))
					//Same as gen_bindoff_closed
				}

				//same for X2


				let tube = k.gen_arbtube(pattern, carrier,1,x1,x2,starting_course);
				let result = null;
				do {yield result = tube.next(result)} while (!result.done)

				x1Last = x1
				x2Last = x2
				course++
			}
		}(this)
	}

	/**
	 * Generate a repeating square of knits/pearls
	 * Great for 1x1 rib, 2x2 rib, seedstitch, garter, etc.
	 * @see gen_arbtube for the tube version
	 * */
	gen_arbsquare(pattern, carrier, num_courses, x1, x2,starting_course=0, xfer=true) {
		if (num_courses % pattern.square.length !== 0) {
			console.log("Note: arbsquare not divisible by "+pattern.name+"'s courses: "+
				num_courses+" % "+pattern.square.length+'='+(num_courses%pattern.square.length)+" (Carrier: "+carrier+")");
		}
		if ((x2-x1) % pattern.square[0].length !== 0) {
			console.log("Note: arbsquare not divisible by "+pattern.name+"'s wales: "+
				(x2-x1)+" % "+pattern.square[0].length+'='+((x2-x1)%pattern.square[0].length));
		}
		return function* g(k) {
			for (let course=starting_course;course<num_courses;course++) {
				let dir = course%2===0 ? '+' : '-'
				let square_next = pattern.square[course%pattern.square.length];

				//1. xfer
				if (xfer) {
					for (let wale of rangeInc(dir==='+'?x2:x1,dir==='+'?x1:x2)) {
						let stitch_next = square_next[(wale) % square_next.length];

						//bring anything on the back forward
						if (stitch_next === 'k' && !('b'+wale in this.needles)) k.xfer('b' + wale, 'f' + wale);

						//bring anything on the forward back
						if (stitch_next === 'p' && !('f'+wale in this.needles)) k.xfer('f' + wale, 'b' + wale);
					}
				}

				//2. knit
				for (let wale of rangeInc(dir==='+'?x2:x1,dir==='+'?x1:x2)) {
					let stitch = square_next[(wale) % square_next.length];
					if (stitch === 'k') k.knit(dir, 'f' + wale, carrier);
					if (stitch === 'p') k.knit(dir, 'b' + wale, carrier);
				}

				yield {'dir': dir, 'wale': x2};
			}
		}(this)
	}

	/**
	 * Generate a repeating tube of knits/pearls
	 * Great for 1x1 rib, 2x2 rib, seedstitch, garter, etc.
	 * */
	gen_arbtube(pattern, carrier, num_courses, x1, x2,starting_course=0) {
		let front = pattern.front;
		let back =  pattern.back;
		if (front.length !== back.length) throw "Arbitrary tube front != back";
		if (num_courses % front.length !== 0) {
			console.log("Note: arbtube not divisible by "+pattern.name+" courses: "+
				num_courses+" % "+front.length+'='+(num_courses%front.length));
		}
		if ((x2-x1) % front[0].length !== 0) {
			console.log("Note: arbtube not divisible by "+pattern.name+" wales: "+
				(x2-x1)+" % "+front[0].length+'='+((x2-x1)%front[0].length));
		}

		return function* g(k) {
			for (let course=starting_course;course<num_courses;course++) {
				let frontpattern = front[course%front.length];
				let backpattern = back[course%back.length];

				k.knit_line_of_tube(frontpattern, carrier, x1, x2, '+','f')
				yield {'dir': '+', 'wale': x2};
				k.knit_line_of_tube(backpattern, carrier, x1, x2, '-','b')
				yield {'dir': '-', 'wale': x1};
			}
		}(this)
	}

	/**Goal: Using only transfers, seamlessly switch between rib and seedstitch or soemthing similar
	 * */
	gen_tubeswitch_arbitrary(prev, next, carrier, x1, x2) {
		return function* g(k) {
			console.log(prev.name+ "-> "+next.name+":")

			//we only care about the last row done and the next row to do
			// let prev_front = prev.front[prev.front.length-1]
			// let prev_back =  prev.back [prev.back .length-1]
			let next_front = next.front[0]
			let next_back  = next.back [0]

			//plan 0 - Stalinsort-esque
			//drop worst stitch if stitch on both prev_front and prev_back
			//while dropping is undeniably worse than transferring, it sure is simpler
			/*for (let wale=x1;wale<=x2;wale++) {
				let pf = prev_front[(wale-x1)%prev_front.length] !== ' ';
				let pb = prev_back [(wale-x1)%prev_back .length] !== ' ';
				let nf = next_front[(wale-x1)%next_front.length] !== ' ';
				let nb = next_back [(wale-x1)%next_back .length] !== ' ';

				if (pf && pb && nf && !nb) k.drop('b'+wale);//A
				if (pf && pb && !nf&& nb ) k.drop('f'+wale);//B
				if (!pf&& pb && nf && !nb) k.drop('b'+wale);//C
				if (pf && !pb&& !nf&& nb ) k.drop('f'+wale);//D
			}*/

			//plan 1 - Greedy Algorithm (racks a bunch): Transfer using next available back hole into next available front knit
			//TODO how do I go from stockinette to something else?
			// You need to pass this function an absolute wale pattern
			function otherside(side) {
				return side==='b'?'f':'b';
			}
			let rackby = [0,1,-1,2,-2,-3,3];
			waleloop: for (let wale=x1;wale<=x2;wale++) {
				let pf = ('f'+wale in k.needles)
				let pb = ('b'+wale in k.needles)
				let nf = next_front[(wale)%next_front.length] !== ' ';
				let nb = next_back [(wale)%next_back .length] !== ' ';

				let drop = ' ';
				if (pf && pb && nf && !nb) drop = 'b';//A
				if (pf && pb && !nf&& nb ) drop = 'f';//B
				if (!pf&& pb && nf && !nb) drop = 'b';//C
				if (pf && !pb&& !nf&& nb ) drop = 'f';//D

				if (drop ===' ') continue
				let next_close = drop==='b'?next_back:next_front;

				for (let i=0;i<rackby.length;i++) {
					let throughhook = wale+rackby[i];
					if (otherside(drop)+throughhook in k.needles) continue;//spot taken, do not use
					for (let ii=1;ii<rackby.length;ii++) {
						let new_closehook = throughhook+rackby[ii]
						if (next_close[new_closehook%next_close.length]!==' ') continue;
						if (new_closehook < x1 || new_closehook > x2) continue;//Don't leave the bounds
						//destination safe to transfer to
						//transfer to throughhook, rack, transfer to new_closehook
						if (drop==='f') {
							k.rack(wale - throughhook)
						} else {
							k.rack(throughhook - wale)
						}
						k.xfer(drop+wale,otherside(drop)+throughhook);
						if (drop==='f') {
							k.rack(new_closehook - throughhook)
						} else {
							k.rack(throughhook - new_closehook)
						}
						k.xfer(otherside(drop)+throughhook,drop+new_closehook);
						console.log("\txfer'd "+drop+wale+" to "+otherside(drop)+throughhook+" to "+drop+new_closehook);
						continue waleloop
					}
				}
				console.log("\tSimple heuristic edge case. I can't swap, so I'll drop "+drop+wale);
				k.drop(drop+wale);
			}
			k.rack(0)
		}(this);
	}

	/**Knit "C" shapes down X1 to make a right angle
	 * @param pattern is the tube pattern used
	 * @param carrier starts/ends on hook X1
	 * @param x1 The leftmost hook
	 * @param x2 The rightmost hook
	 * @param {number} starting_course The course of the pattern started on (for patterns like diagonalstitch
	 * */
	gen_heel(pattern, carrier, x1, x2, starting_course=0) {
		let xMidF = this.shape_zigzag(x1,x2)
		xMidF = xMidF.slice(xMidF.length/2)

		return function* g(k) {
			let course = starting_course
			for (let index = 0; index< xMidF.length;index++) {
				let front1 = pattern.front[course     % pattern.front.length]
				let front2 = pattern.front[(course+1) % pattern.front.length]
				let back1  = pattern.back [course     % pattern.back .length]
				let back2  = pattern.back [(course+1) % pattern.back .length]

				let mid = xMidF[index]

				if (   mid-x1 < 2 || x2-mid < 2) throw "Midpoint in bad loc. Make sure "+x1+" < ("+mid+") < "+x2+"."

				k.comment("heel to "+mid+" f+ f- b+ b-")
				k.knit_line_of_tube(front1,carrier,x1,mid,'+','f')
				k.knit_line_of_tube(front2,carrier,x1,mid,'-','f')
				k.knit_line_of_tube(back1 ,carrier,x1,mid,'+','b')
				k.knit_line_of_tube(back2 ,carrier,x1,mid,'-','b')
				//This shouldn't yield since part of it never adds rows?
				// yield {'dir': '+', 'wale': x2};//two yields since this needs to make 2 rows at a time
				course+=2
			}
		}(this);
	}

	/**A tube where the left side is a different carrier than the right side. The dividing line is at xMidF and xMidB
	 * @param pattern is the tube pattern used
	 * @param carrierLeft starts/ends on hook X1
	 * @param carrierRight starts/ends on hook X2
	 * @param x1 The leftmost hook
	 * @param xMidF This is sewn on the front by carrierLeft, while xMidF+1 is sewn using carrierRight
	 * @param xMidB This is sewn on the back by carrierLeft, while xMidB+1 is sewn using carrierRight
	 * @param x2 The rightmost hook
	 * @param {number} starting_course The course of the pattern started on (for patterns like diagonalstitch
	 * */
	gen_tube_dualcarrier(pattern, carrierLeft, carrierRight, x1, xMidF, xMidB, x2, starting_course=0) {
		return function* g(k) {
			let course = starting_course
			for (let index = 0; index< xMidF.length;index++) {
				let front1 = pattern.front[course     % pattern.front.length]
				let front2 = pattern.front[(course+1) % pattern.front.length]
				let back1  = pattern.back [course     % pattern.back .length]
				let back2  = pattern.back [(course+1) % pattern.back .length]

				let frontMid = xMidF[index]
				let backMid  = xMidB[index]

				if (   frontMid-x1 < 2 || x2-frontMid < 2
					||  backMid-x1 < 2 || x2- backMid < 2) throw "Midpoint in bad loc. Make sure "+x1+" < ("+frontMid+","+backMid+") < "+x2+"."

				k.comment("colorA f+ f- b+ b-")
				k.knit_line_of_tube(front1,carrierLeft,x1,frontMid,'+','f')
				k.knit_line_of_tube(front2,carrierLeft,x1,frontMid,'-','f')
				k.knit_line_of_tube(back1 ,carrierLeft,x1,backMid,'+','b')
				k.knit_line_of_tube(back2 ,carrierLeft,x1,backMid,'-','b')
				k.comment("colorB f- f+ b- b+")
				k.knit_line_of_tube(front1,carrierRight,frontMid+1,x2,'-','f')
				k.knit_line_of_tube(front2,carrierRight,frontMid+1,x2,'+','f')
				k.knit_line_of_tube(back1 ,carrierRight,backMid+1,x2,'-','b')
				k.knit_line_of_tube(back2 ,carrierRight,backMid+1,x2,'+','b')
				yield {'dir': '+', 'wale': x2};
				yield {'dir': '+', 'wale': x2};//two yields since this needs to make 2 rows at a time
				course+=2
			}
		}(this);
	}

	/**Knit partial tube, such as every other knit, every third knit, prime knits, etc.
	 * @param {string} carrier
	 * @param {number} num_courses
	 * @param x1
	 * @param x2
	 * @param pattern
	 *
	 * @example To knit in a way where its on the top going right, then bottom going left, then top going right, etc, do:
	 *      f_knits = [1,0]
	 *      b_knits = [0,1]
	 * */
	gen_skiptube(carrier, num_courses, x1, x2, pattern) {
		let front0 = pattern.front[0]
		let back0 = pattern.back[0]
		function* g(k) {
			for (let course = 0; course < num_courses; course++) {
				for (let wale = x1; wale <= x2; wale++) {
					if (front0[(wale) % front0.length]!==' ') {
						k.knit('+', 'f' + wale, carrier);
					}
				}
				yield {'dir': '+', 'wale': x2};
				for (let wale = x2; wale >= x1; wale--) {
					if (back0[(wale) % back0.length]!==' ') {
						k.knit('-', 'b' + wale, carrier);
					}
				}
				yield {'dir': '-', 'wale': x1};
			}
		}
		return g(this);
	}

	/**
	 * @deprecated There should be a better alternative, useful for debugging
	 * @param {number} num_courses Number of passes to do
	 */
	gen_sleep(num_courses) {
		return function* g() {
			for (let course=0;course<=num_courses;course++) yield {};
		}();
	}

	//main run functions - These run patterns
	run(g) {
		let result = null;
		do {
			result = g.next(result)
		} while (!result.done)
	}

	/**
	 * @see wrap_serial
	 */
	run_serial(...glist) {
		this.run(this.wrap_serial(...glist))
	}

	/**@see wrap_autohook*/
	run_autohook(g, carrier, inhook=undefined, releasehook=undefined, outhook=undefined, solo_until_release=undefined) {
		this.run(this.wrap_autohook(g, carrier, inhook, releasehook, outhook, solo_until_release))
	}

	/**
	 * @param {Generator} glist
	 */
	run_parallel(...glist) {
		let result = null;
		let num_running;
		do {
			num_running = 0
			// console.log("Parallel - should all be same direction for most part")
			for (let i=0;i<glist.length;i++) {
				result = glist[i].next(result)
				if (!result.done) num_running++;
			}
			for (let i=glist.length-1;i>=0;i--) {
				result = glist[i].next(result)
			}
		} while (num_running > 0)
	}

	//main wrapper functions - These combine patterns

	/**
	 * @param {Generator} glist
	 * @return Generator
	 */
	wrap_serial(...glist) {
		let result = null;
		return function* wrap() {
			for (let g of glist) {
				do {
					result = g.next(result)
					yield result
				} while (!result.done)
			}
		}()
	}

	/**@param {Generator} g
	 * @param carrier
	 * @param inhook Automatically inhook at start
	 * @param releasehook Automatically release hook after two loops aka four passes
	 * @param outhook Automatically outhook at end
	 * @param solo_until_release Don't yield until you've done enough passes to releasehook.
	 *              This can prevent a specific error where the carrier collides with the yarn inserting hook
	 * @return Generator
	 * */
	wrap_autohook(g, carrier, inhook=true, releasehook=true, outhook=true, solo_until_release=true) {
		return function* wrap(k) {
			let result = null;
			let passes = 0;
			if (inhook) k.inhook(carrier);
			while (true) {
				result = g.next(result);
				if (solo_until_release && releasehook) {
					//Don't yield of solo_until_release
				} else {
					yield result;
				}

				passes++;

				// console.log(result);
				if (passes===4) {
					if (releasehook) {
						k.releasehook(carrier);
						releasehook = false;
					}
				}
				if (result.done) break;
			}
			if (releasehook) k.releasehook(carrier);
			if (outhook) k.outhook(carrier)
		}(this);
	}
}

module.exports = {
	KnitoutUtil: KnitoutUtil
};