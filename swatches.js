// import the knitoutWriter code and instantiate it as an object
const knitout = require('./lib/knitout');
// passing in all eight carriers despite not using all of them
let k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8','9','10']});
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
// function loc(course,wale) {
// 	return (course%2===0?'f':'b')+wale;
// }

/**
 * @param {number} courseEnd course to finish on (relative to let course)
 * @param {number} x1 left side of tube
 * @param {number} x2 right side of tube
 */
function knit(courseEnd, x1, x2) {
	if ((courseEnd-course)%2!==0) throw "courseLen%2 must be positive & even"
	while (course < courseEnd) {
		for (let wale = x1;wale<=x2;wale++) k.knit('+', 'f'+wale, CARRIER)
		course++;
		for (let wale = x2;wale>=x1;wale--) k.knit('-', 'f'+wale, CARRIER)
		course++;
	}
}

//initial tuck cast-on to the right
for (let wale=X1; wale<=X2; wale++) k.tuck(dir(course), 'f'+wale, CARRIER);
course++;

//initial tuck cast-on to the left
for (let wale = X2;wale>=X1;wale--) k.tuck(dir(course), 'f'+wale, CARRIER);
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


