class Pattern {

	constructor(name, square) {
		this.name = name
		this.square = square

		function to_halfgauge(square, isFront) {
			let ret = []
			for (let line of square) {
				let line = []
				for (let element of line) {
					if (isFront) {
						line.push(element)
						line.push(' ')
					} else {
						line.push(' ')
						line.push(element)
					}
				}
				ret.push(line)
			}
			return ret
		}
		this.front = to_halfgauge(square,true)
		this.back = to_halfgauge(square,false)
	}

	get_front(halfgauge) {
		return this.front
	}
	get_back(halfgauge) {
		return this.back
	}
}

BROKENRIB = new Pattern([
	['k','p','k'],
	['k','p','k'],
	['p','p','p'],
	['k','k','k'],
])
STOCKINETTE = new Pattern([
	['k']
])
