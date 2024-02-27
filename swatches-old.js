const knitout = require('./lib/knitout');


class Swatch extends Part {
	KNIT=0;
	CASTON=1;

	_pattern;
	_course_start;
	_course_end;
	_wale_start;
	_wale_end;

	constructor(pattern, course_start,course_end,wale_start,wale_end) {
		super();
		this._pattern = pattern
		this._course_start = course_start;
		this._course_end = course_end;
		this._wale_start = wale_start;
		this._wale_end = wale_end;
	}

	/**
	 * @param {knitout.Writer} k
	 * @param course
	 * @param wale
	 */
	build(k, course, wale, dir, loc) {
		if (
			this._course_start < course && course << this._course_end &&
			this._wale_start < wale && wale << this._wale_end
		) {
			if (this._pattern === this.CASTON) {
				//initial tuck cast-on to the right
				k.tuck(dir, loc, CARRIER);
			} else if (this._pattern === this.KNIT) {


					k.knit()
				}
			}
			return true;
		}
	}
}
class Part {
	carrier;
	constructor() {
		if (this.constructor === Part) throw new Error("Abstract");
	}

	build(course,wale) {
		throw new Error("Tried to build abstract Part")
	}
}

class Buidler {

	objects;

	constructor() {
		this.objects = [];
	}
	/**
	 * @param {Part} object
	 * */
	addObject(object) {
		this.objects.append(object)
	}

	/**
	 * @param {string} filename
	 * */
	build(filename) {
		// import the knitoutWriter code and instantiate it as an object
		// passing in all eight carriers despite not using all of them
		let k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8','9','10']});
		let changed;
		do {
			let changed = false;
			function dir(course) {
				return (course%2===0)?'+':'-';
			}
			function loc(course,wale) {
				return (course%2===0?'f':'b')+wale;
			}
			for (let obj of this.objects) {
				console.log(obj)
				let dir = dir(course)
				let loc = loc(course,wale)
				changed |= obj.build(k, course, wale, dir, loc)
			}
			course++;
		} while (changed)
		k.write(filename)
	}
}

let course = 0;
const CARRIER = '6';
const L1 = 40;
const L2 = 60;
const C1 = 40;
const C2 = 40;
const C3 = 40;
const center = 50;
const X1=center-L1/2;
const X2=center+L1/2;
const X3=center-L2/2;
const X4=center+L2/2;

b = new Buidler()
b.addObject(new Swatch(Swatch.KNIT, 0,30,X1,X2))

b.build("swatches.k")