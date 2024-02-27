// import the knitoutWriter code and instantiate it as an object
const knitout = require('./knitout');

function* rangeInc(end, start) {
	do {
		yield start
		start += start > end ? -1 : 1;
	} while (start !== end)
	yield end
}

/**
 * Goal: Manage which hooks have thread to automatically optimize stuff
 * */
class KnitoutUtil extends knitout.Writer {

	constructor() {
		super({carriers:['1', '2', '3', '4', '5', '6', '7', '8','9','10']});
		super.addHeader('Position','Right');

		this.NUM_WALES = 100;
		this.hooks = []
		for (let wale=0;wale<this.NUM_WALES;wale++) {
			 this.hooks['b'+wale] = this.hooks['f'+wale] = 0;
		}

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
			//TODO there is a fairly simple way with rack(3) to make a checkertube using 3 less columns
			// 'rack':[0,0,0,3,3,3],//TODO something like this?
			//clears  V       V       V
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
			'front': [['k','p',' ']],
			'back':  [['k',' ','p']],
			'square':[['k','p']]
		}
		this.RIB2X2 = {
			'name':'Rib 2x2',
			'front': [['k','k','p',' ','p',' ']],
			'back':  [['k','k',' ','p',' ','p']],
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
			'front':['k'],
			'back': ['k'],
			'square': ['k'],
		}
	}

	//main overridden functions to track which hooks are loaded
	knit(dir,hook,carrier) {
		if (this.hooks[hook]===0) {
			super.tuck(dir,hook,carrier)
			super.comment("Warn: Meant to knit ^")
		} else {
			super.knit(dir,hook,carrier)
		}
		this.hooks[hook] = 1;
	}
	xfer(from,to) {
		if (this.hooks[from] === 0) {
			super.comment("Warn: No Transfer Occurred "+from+"->"+to)
		}
		this.hooks[to] += this.hooks[from];
		this.hooks[from] = 0
		super.xfer(from,to);
	}
	tuck(dir,hook,carrier) {
		this.hooks[hook]++;
		// this.carriers[carrier] = hook
		super.tuck(dir,hook,carrier);
	}

	dir(course) {
		return (course%2===0)?'+':'-';
	}
	loc(course,wale) {
		return (course%2===0?'f':'b')+wale;
	}

	//main generators
	// return function* g(k) {
	// yield {'dir': '+', 'wale': x2};
	// }(this)

	/**Casts on only one side of the stitch*/
	gen_caston(carrier, x1, x2) {
		return function* g(k) {
			k.knit('+','f'+(x2-3),carrier);
			k.knit('+','f'+(x2-2),carrier);
			k.knit('+','f'+(x2-1),carrier);
			k.knit('+','f'+(x2),carrier);

			yield {'dir': '+', 'wale': x2};
			yield {'dir': '+', 'wale': x2};
			yield {'dir': '+', 'wale': x2};
			yield {'dir': '+', 'wale': x2};
			yield {'dir': '+', 'wale': x2};//makeshief release carrer

			for (let wale = x2; wale > x1; wale -= 1) {
				//todo somehow this ripped the yarn I think?
				k.knit('-','b'+wale,carrier)
				k.miss('-','b'+(wale-1),carrier)
				k.xfer('f'+wale,'b'+wale)
				k.rack(-1)
				k.xfer('b'+wale,'f'+(wale-1))
				k.rack(0)
				k.knit('+','f'+(wale-1),carrier)
				k.tuck('+','f'+wale,carrier)
				k.xfer('b'+wale,'f'+wale)//TODO fs vs f
				k.rack(1)
				k.xfer('f'+wale,'b'+(wale-1))
				k.rack(0)
			}
			// k.knit('-','b'+(x1-1),carrier)
		}(this);

	}

	/**This can close/bindoff a knit.
	 *
	 * This can close a tube if it was preceded by stockinette tube, (such as the end of a sock, hat, etc)
	 * bindoffFront assumes you ended on a complete row of f+ stitches (such as having just done a line of 'knit + f1234')
	 *
	 * */
	gen_bindoffFront(carrier, x1, x2,then_drop=false) {
		return function* g(k) {
			for (let wale = x1; wale < x2; wale++) {
				k.xfer("f"+wale,"b"+wale);//transfer front to back
				k.rack(1.0);//rack to right
				k.xfer("b"+wale,"f"+(wale+1));//transfer right

				//what do these lines do?
				// this.rack(0.25);
				// if ((n-x1) % 2 === 1) this.tuck("+","b"+n, carrier);

				k.knit("+", "f"+(wale+1), carrier);//knit
				if (wale+2 <= x2) {
					k.miss("+", "f"+(wale+2), carrier);
				}
				k.rack(0.0);
			}
			k.xfer("b"+x2,"f"+x2)
			k.bindoffTail(carrier, x2,then_drop);
			yield {'dir': '+', 'wale': x2};
		}(this);
	}

	gen_bindoffTubeOpen(carrier, x1, x2) {
		return function* g(k) {
			for (let wale = x1; wale < x2; wale++) {
				//TODO
				throw "TODO"
			}
			k.bindoffTail(carrier, x2);
			yield {'dir': '+', 'wale': x2};
		}(this);
	}

	/**At wale loc, make a tieoff tail that could be knitted back in*/
	bindoffTail(carrier, loc,then_drop = false) {
		this.knit("-","f"+loc, carrier);
		this.knit("+","f"+loc, carrier);
		this.knit("-","f"+loc, carrier);
		this.knit("+","f"+(loc-1), carrier);
		this.knit("+","f"+loc, carrier);
		this.knit("-","f"+loc, carrier);
		this.knit("-","f"+(loc-1), carrier);
		this.knit("+","f"+(loc-2), carrier);
		this.knit("+","f"+(loc-1), carrier);
		this.knit("+","f"+loc, carrier);
		this.knit("-","f"+loc, carrier);
		this.knit("-","f"+(loc-1), carrier);
		this.knit("-","f"+(loc-2), carrier);

		for (let r = 0; r < 6; ++r) {
			this.knit("+","f"+(loc-3), carrier);
			this.knit("+","f"+(loc-2), carrier);
			this.knit("+","f"+(loc-1), carrier);
			this.knit("+","f"+loc, carrier);
			this.knit("-","f"+loc, carrier);
			this.knit("-","f"+(loc-1), carrier);
			this.knit("-","f"+(loc-2), carrier);
			this.knit("-","f"+(loc-3), carrier);
		}
		if(then_drop) {
			this.drop("f"+(loc-3))
			this.drop("f"+(loc-2))
			this.drop("f"+(loc-1))
			this.drop("f"+(loc))
		}
	}

	bindoffTubeOpen(carrier, x1, x2) {
		if ((x2-x1)%2!==0) throw "Make bindoff out of a multiple of 2 stitches"
		//reference drawing
		for(let wale=x1;wale<x2;wale+=2) {
			this.rack(1)
			this.xfer('f'+wale,'b'+(wale-1));
			this.rack(2);
			this.xfer('b'+(wale-1),'f'+(wale+1));
			this.rack(0);
			this.xfer('b'+wale,'f'+wale);
			this.rack(-1);
			this.xfer('f'+wale,'b'+(wale+1));
		}
		this.rack(0);
		for (let wale=x1;wale<=x2;wale+=2)   this.knit('+','f'+wale, carrier);
		for (let wale=x2-1;wale>=x1;wale-=2) this.knit('-','b'+wale, carrier);

		//bindoff front
		for (let wale = x1+1; wale < x2; wale+=2) {
			this.rack(-1.0);
			this.xfer("f"+wale,"b"+(wale+1));//transfer front to back
			this.rack(1.0);
			this.xfer("b"+(wale+1),"f"+(wale+2));//transfer right
			this.knit("+", "f"+(wale+2), carrier);//knit
			this.miss("+", "f"+(wale+3), carrier);
		}

		//move front bindoff to back
		this.rack(0.0);
		this.xfer('f'+(x2+1),'b'+(x2+1));
		this.knit('-','b'+(x2+1));
		this.miss("-","b"+(x2), carrier);

		//bindoff back
		for (let wale = x2+1; wale > x1-1; wale-=2) {
			this.rack(-1.0);
			this.xfer("b"+wale,"f"+(wale-1));//transfer back to front
			this.rack(1.0);
			this.xfer("f"+(wale-1),"b"+(wale-2));//transfer front to back
			this.knit("-", "b"+(wale-2), carrier);//knit
			if (wale-2 >= x1) this.miss("+", "b"+(wale-3), carrier);
			this.rack(0.0);
		}

		this.bindoffTail(carrier, x1+1);
	}

	/**Can make a tube varying in diameter, useful for thigns like arcing shoulder side to round shoulders
	 * Consecutively calls gen_arbtube with arguments generated from diam_generator
	 *  more specifically, calls it from x1-offset to x2+offset where offset is diam_generator.next
	 * @param pattern A knit pattern, such as this.STOCKINETTETUBE
	 * @param carrier The yarn carrier
	 * @param x1 leftside  wale to subtract successive diam_generator calls from
	 * @param x2 rightside wale to add      successive diam_generator calls from
	 * @param diam_generator
	 * */
	gen_arbtube_varyingdiameter(pattern, carrier, x1, x2, diam_generator) {
		if (x2<=x1) throw "x2<=x1";
		return function* g(k) {
			for (let offset of diam_generator()) {
				let tube = k.gen_arbtube(pattern, carrier,1,x1-offset,x2+offset);
				let result = null;
				do {
					console.log(k.carriers[carrier])
					//todo do something fancier than just casting on/off willy-nilly
					// consider some form of end split, rack xfer thing
					yield result = tube.next(result)
				} while (!result.done)
			}
		}(this)
	}

	/**Makes truncated cone:
	 *  - Starting at x1a through x2a
	 *  - Ending at 21b through x2b
	 *  - Length of courses
	 * */
	gen_arbcone(pattern, carrier, courses, x1a, x2a, x1b, x2b) {
		if (x2a<=x1a || x2b<=x1b) throw "x2<=x1";

		//slope going away from center
		let x1slope = (x1b-x1a)/courses;
		let x2slope = (x2b-x2a)/courses;

		if (Math.abs(x1slope)>1 || Math.abs(x2slope)>1) console.log("WARNING This can make big cone holes")

		return function* g(k) {
			let course = 0
			let goal_x1 = x1a, fgoal_x1=x1a
			let goal_x2 = x2a, fgoal_x2=x2a
			let x1 = x1a//x1 on hook
			let x2 = x2a//x2 on hook
			while (course < courses) {
				fgoal_x1 += x1slope
				goal_x1 = Math.round(fgoal_x1)
				fgoal_x2 += x2slope
				goal_x2 = Math.round(fgoal_x2)

				let tube = k.gen_arbtube(pattern, carrier,course+1,goal_x1,goal_x2,course);
				let result = null;
				do {
					//todo do something fancier than just casting on/off willy-nilly
					// consider some form of end split, rack xfer thing
					yield result = tube.next(result)
				} while (!result.done)

				// for (let wale = goal_x1;wale<=goal_x2;wale++) k.knit('+', 'f'+wale, carrier)
				// yield {'dir': '+', 'wale': goal_x2}
				// for (let wale = goal_x2;wale>=goal_x1;wale--) k.knit('-', 'b'+wale, carrier)
				// yield {'dir': '-', 'wale': goal_x1}

				course++
				x1 = goal_x1
				x2 = goal_x2
				// k.rack(0)
			}
			if (x1 !== x1b || x2 !== x2b) throw "bad cone"
		}(this)
	}

	/**
	 * Generate a repeating square of knits/pearls
	 * Great for 1x1 rib, 2x2 rib, seedstitch, garter, etc.
	 * @see gen_arbtube for the tube version
	 * */
	gen_arbsquare(pattern, carrier, num_courses, x1, x2,starting_course=0) {
		if (num_courses % pattern.square.length !== 0) {
			console.log("Note: arbsquare not divisible by "+pattern.name+"'s courses: "+
				num_courses+" % "+pattern.square.length+'='+(num_courses%pattern.square.length));
		}
		if ((x2-x1) % pattern.square[0].length !== 0) {
			console.log("Note: arbsquare not divisible by "+pattern.name+"'s wales: "+
				(x2-x1)+" % "+pattern.square[0].length+'='+((x2-x1)%pattern.square[0].length));
		}
		return function* g(k) {
			let dir = '+';
			for (let course=starting_course;course<num_courses;course++) {
				let square_next = pattern.square[course%pattern.square.length];

				//1. xfer
				for (let wale of rangeInc(dir==='+'?x2:x1,dir==='+'?x1:x2)) {
					let stitch_next = square_next[(wale - x1) % square_next.length];

					//bring anything on the back forward
					if (stitch_next === 'k' && k.hooks['b'+wale]!==0) k.xfer('b' + wale, 'f' + wale);

					//bring anything on the forward back
					if (stitch_next === 'p' && k.hooks['f'+wale]!==0) k.xfer('f' + wale, 'b' + wale);
				}

				//2. knit
				for (let wale of rangeInc(dir==='+'?x2:x1,dir==='+'?x1:x2)) {
					let stitch = square_next[(wale - x1) % square_next.length];
					if (stitch === 'k') k.knit(dir, 'f' + wale, carrier);
					if (stitch === 'p') k.knit(dir, 'b' + wale, carrier);
				}

				yield {'dir': dir, 'wale': x2};
				dir = dir==='+'?'-':'+';
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
				let front_i = front[course%front.length];
				let back_i = back[course%back.length];
				//1. xfer pright -> back
				for (let wale = x1; wale <= x2; wale++) {
					let front_stitch = front_i[(wale - x1) % front_i.length];
					if (front_stitch === 'p') k.xfer('f' + wale, 'b' + wale);
				}
				//2. knit right all
				for (let wale = x1; wale <= x2; wale++) {
					let front_stitch = front_i[(wale - x1) % front_i.length];
					if (front_stitch === 'k') k.knit('+', 'f' + wale, carrier);
					if (front_stitch === 'p') k.knit('+', 'b' + wale, carrier);
				}
				//3, xfr pright -> front
				for (let wale = x1; wale <= x2; wale++) {
					let front_stitch = front_i[(wale - x1) % front_i.length];
					if (front_stitch === 'p') k.xfer('b' + wale, 'f' + wale);
				}
				yield {'dir': '+', 'wale': x2};

				//4. xfer pleft -> front
				for (let wale = x2; wale >= x1; wale--) {
					let back_stitch = back_i[(wale - x1) % back_i.length];
					if (back_stitch === 'p') k.xfer('b' + wale, 'f' + wale);
				}
				//5. knit left all
				for (let wale = x2; wale >= x1; wale--) {
					let back_stitch = back_i[(wale - x1) % back_i.length];
					if (back_stitch === 'k') k.knit('-', 'b' + wale, carrier);
					if (back_stitch === 'p') k.knit('-', 'f' + wale, carrier);
				}
				//3, xfr pright -> back
				for (let wale = x2; wale >= x1; wale--) {
					let back_stitch = back_i[(wale - x1) % back_i.length];
					if (back_stitch === 'p') k.xfer('f' + wale, 'b' + wale);
				}
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
				let pf = k.hooks['f'+wale];
				let pb = k.hooks['b'+wale];
				let nf = next_front[(wale-x1)%next_front.length] !== ' ';
				let nb = next_back [(wale-x1)%next_back .length] !== ' ';

				let drop = ' ';
				if (pf && pb && nf && !nb) drop = 'b';//A
				if (pf && pb && !nf&& nb ) drop = 'f';//B
				if (!pf&& pb && nf && !nb) drop = 'b';//C
				if (pf && !pb&& !nf&& nb ) drop = 'f';//D

				if (drop ===' ') continue
				let next_close = drop==='b'?next_back:next_front;

				for (let i=0;i<rackby.length;i++) {
					let throughhook = wale+rackby[i];
					if (k.hooks[otherside(drop)+throughhook]) continue;//spot taken, do not use
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

	/**
	 * Immediately write a seedstitch, with nothing on either side of it, from course to courseEnd
	 * @param {string} carrier Carrier index (aka inhooked color)
	 * @param {number} course course to start on
	 * @param {number} courseEnd course to finish on
	 * @param {number} x1 left side of tube
	 * @param {number} x2 right side of tube
	 * @return {number} courseEnd
	 */
	seedstitch(carrier, course, courseEnd, x1, x2) {
		function forwardIfEven(wale) {return ((wale)%2===0)?'f':'b';}
		function backwardIfEven(wale) {return ((wale)%2===0)?'b':'f';}
		if ((courseEnd-course)%2!==0) throw "courseLen%2 must be positive & even"
		if ((x2-x1)%4!==0) throw "Make seedstitch out of a multiple of 4 stitches"
		while (course < courseEnd) {
			//alternate stitches right  fbfbfb
			for (let wale = x1;wale<=x2;wale++) this.knit('+', forwardIfEven(wale-x1)+wale, carrier)
			//transfer everything       bfbfbf
			for (let wale = x1;wale<=x2;wale++) this.xfer(forwardIfEven(wale-x1)+wale, backwardIfEven(wale-x1)+wale)
			course++;

			//alternate stitches left   bfbfbf
			for (let wale = x2;wale>=x1;wale--) this.knit('-', backwardIfEven(wale-x1)+wale, carrier)
			//transfer everything       bfbfbf
			for (let wale = x2;wale>=x1;wale--) this.xfer(backwardIfEven(wale-x1)+wale, forwardIfEven(wale-x1)+wale)
			course++;
		}
		return courseEnd;
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
					if (front0[(wale - x1) % front0.length]!==' ') {
						k.knit('+', 'f' + wale, carrier);
					}
				}
				yield {'dir': '+', 'wale': x2};
				for (let wale = x2; wale >= x1; wale--) {
					if (back0[(wale - x1) % back0.length]!==' ') {
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
				//todo should I store the result of this yield?
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