// constant file to hold consts in backend
module.exports = {
    postServerPort: 4000,
    staticServerPort: 5000,
    userServerPort: 6000,
    gatewayPort: 3000,
    userContentServerPort: 7000,
    defaultMediaPreviewPath: '/home/ubuntu/user-files/upload_8ee9c61efd5ba0d59b73c9c85ec34185',
    FS_ROOT: process.env.fs_root || '/home/ubuntu/user-files/',
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
    },
    postMapper: (result) => {
        return result.map(post => ({
            id: post.id,
            creator_email: post.creator_email,
            title: post.title,
	        create_time: post.create_time,
            file_name: post.file_name,
            has_file: post.has_file,
            cost: post.cost,
            approver_email: post.approver_email,
            post_body: post.post_body,
            is_approved: post.is_approved,
            media_preview: post.media_preview,
        }));
    }
}
