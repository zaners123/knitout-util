// import the knitoutWriter code and instantiate it as an object
const knitout = require('./lib/knitout');
// passing in all eight carriers despite not using all of them
let k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8','9','10']});

// add some headers relevant to this job
//todo
// k.addHeader('Machine','SWG?');
// k.addHeader('Gauge','?');
k.addHeader('Position','Right');

// swatch variables
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

// bring in carrier using yarn inserting hook (end of yarn is held close)
k.inhook(CARRIER);//Takes yarn out AND grabs its end

function dir(course) {
	return (course%2===0)?'+':'-';
}
function loc(course,wale) {
	return (course%2===0?'f':'b')+wale;
}

/**
 * @param {number} courseEnd course to finish on (relative to let course)
 * @param {number} x1 left side of tube
 * @param {number} x2 right side of tube
 */
function tube(courseEnd, x1, x2) {
	if ((courseEnd-course)%2!==0) throw "courseLen%2 must be positive & even"
	while (course < courseEnd) {
		for (let wale = x1;wale<=x2;wale++) k.knit('+', loc(course, wale), CARRIER)
		course++;
		for (let wale = x2;wale>=x1;wale--) k.knit('-', loc(course, wale), CARRIER)
		course++;
	}
}

/**
 * Makes truncated cone with top width L1 and bottom width L2, centered by specified wale
 *
 * let dwdc = (L2 - L1) / (dwdc - course);
 * */
function cone(dwdc, x1, x2, goal_width) {
	if (course%2!==0)       throw "Start on even course";
	if (x2<=x1)             throw "x2<=x1";
	if (dwdc<-1 || dwdc>1)  throw "Not implemented";

	let growing = dwdc>0;
	let next_width = x2-x1;
	let lastSideAdded='-';
	while (Math.abs((x2-x1)-goal_width)>0) {
		next_width += dwdc
		let modRight = false
		let modLeft = false
		console.log(`width: ${next_width}`);
		if (Math.abs(next_width - (x2-x1))>1) {
			if (lastSideAdded==='-') {
				modRight = true
				lastSideAdded='+'
			} else {
				modLeft = true
				lastSideAdded='-'
			}
		}
		if (!modRight) {
			for (let wale = x1;wale<=x2;wale++) k.knit('+', loc(course, wale), CARRIER)
		} else if (modRight && growing) {
			for (let wale = x1;wale<=x2;wale++) k.knit('+', loc(course, wale), CARRIER)
			x2++;
			k.knit('+',loc(course,x2),CARRIER)
		} else {
			x2--;
			//shrink using end racking (non-ideal, should be done by skipping intermediate stitches to make it more even)
			for (let wale = x1;wale<=x2;wale++) k.knit('+', loc(course, wale), CARRIER)
			k.rack(-1);
		}
		course++;

		if (!modLeft) {
			for (let wale = x2;wale>=x1;wale--) k.knit('-', loc(course, wale), CARRIER)
		} else if (modLeft && growing) {
			for (let wale = x2;wale>=x1;wale--) k.knit('-', loc(course, wale), CARRIER)
			x1--;
			k.knit('-',loc(course,x1),CARRIER)
		} else {
			x1++;
			for (let wale = x2;wale>=x1;wale--) k.knit('-', loc(course, wale), CARRIER)
		}
		course++;
		k.rack(0);
	}
}


//initial tuck cast-on to the right
for (let wale=X1; wale<=X2; wale++) k.tuck(dir(course), loc(course,wale), CARRIER);
course++;

//initial tuck cast-on to the left
for (let wale = X2;wale>=X1;wale--) k.tuck(dir(course), loc(course,wale), CARRIER);
course++;

//start tube
tube(course+2, X1, X2)
k.releasehook(CARRIER)
tube(course+C1-2, X1, X2)
//fan out
cone(1, X1, X2, L2);
//middle tube
tube(course+C2, X3, X4)
//fan in
// cone(-1, X3, X4, L1);
//end tube
// tube(course+C3, X1, X2)

// bring the yarn out with the yarn inserting hook
k.outhook(CARRIER); // Cuts yarn

// write the knitout to a file called "seedstitch.k"
k.write('lantern.k');

return 0;

//rib on way back, skip last of the tucks
// for (let s=2; s<=width; s++) {
// 	if (s%2==front) {
// 		k.knit("+", "f"+s, carrier);
// 	}
// 	else {
// 		k.knit("+", "b"+s, carrier);
// 	}
// }
//
// // release the yarn inserting hook
// k.releasehook(carrier);
//
//
// // knit until we have the right swatch height
// let current_height = 0
// while (current_height<height) {
// 	for (let s=width; s>0; s--) {
// 		if (s%2==front) {
// 			k.knit("-", "f"+s, carrier);
// 		}
// 		else {
// 			k.knit("-", "b"+s, carrier);
// 		}
// 	}
//
//
// 	for (let s=width; s>0; s--) {
// 		if (s%2==front) {
// 			k.xfer("f"+s, "b"+s);
// 		}
// 		else {
// 			k.xfer("b"+s, "f"+s);
// 		}
// 	}
//
//
// 	current_height++;
//
// 	if (current_height >= height) {
// 		break;
// 	}
//
// 	for (let s=1; s<=width; s++) {
// 		if (s%2==front) {
// 			k.knit("+", "b"+s, carrier);
// 		}
// 		else {
// 			k.knit("+", "f"+s, carrier);
// 		}
// 	}
//
//
// 	for (let s=1; s<=width; s++) {
// 		if (s%2==front) {
// 			k.xfer("b"+s, "f"+s);
// 		}
// 		else {
// 			k.xfer("f"+s, "b"+s);
// 		}
// 	}
//
//
// 	current_height++;
// }



