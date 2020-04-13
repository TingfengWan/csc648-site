// constant file to hold consts in backend
module.exports = {
    postServerPort: 4000,
    staticServerPort: 5000,
    userServerPort: 6000,
    gatewayPort: 3000,
    sanitizer: (str) => {
	if ( !str || str === '')
		return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return str.replace(reg, (match)=>(map[match]));
    }
}
