const dateToSlashed = d => `${d.getUTCFullYear()}/${d.getUTCMonth()+1}/${d.getUTCDate()}`

const dateStringify = (date) => {
	const diff = new Date() - date
	const minute = 1000*60
	const hour = minute*60
	const day = hour*24
	const month = day * 30
	const year = day * 365
	if(diff < minute){
		return 'just now'
	}
	if(diff < 2 * hour){
		return  ~~ (diff/minute) + ' minutes ago'
	}
	if(diff < 2 * day){
		return ~~ (diff/hour) + ' hours ago'
	}
	if(diff < 11 * day){
		return ~~ (diff/day) + ' days ago'
	}
	if(diff < year){
		return dateToSlashed(date)
	}
}

export default dateStringify
