// constant file to hold consts in backend
module.exports = {
    postServerPort: 4000,
    staticServerPort: 5000,
    userServerPort: 6000,
    gatewayPort: 3000,
    defaultMediaPreviewPath: '/home/ubuntu/user-files/upload_8ee9c61efd5ba0d59b73c9c85ec34185',
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
