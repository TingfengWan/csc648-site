/*
Author: Eric Ngo, Ting Feng
Date: April 1st, 2020
*/
// constant file to hold consts in backend
module.exports = {
    postServerPort: 4000,
    staticServerPort: 5000,
    userServerPort: 6000,
    gatewayPort: 3000,
    userContentServerPort: 7000,
    defaultMediaPreviewPath: '/home/ubuntu/user-files/icons8-file-preview-64.png',
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
    postMapper: (result, hide_content=false, is_purchased=false) => {
        return result.map(post => {
            let locations = [];
            let categories = [];
            if ( post.locations ) {
                locations = post.locations.split(", ")
            }
            if ( post.categories ) {
                categories = post.categories.split(", ");
            }
            if ( hide_content ) {
                post.media_content = null;
            }
            if ( post.cost > 0 && !is_purchased ) {
                post.media_content = null;
            }
            return {
                id: post.id,
                creator_email: post.creator_email,
                creator_phone_number: post.creator_phone_number,
                title: post.title,
                create_time: post.create_time,
                file_name: post.file_name,
                has_file: post.has_file,
                cost: post.cost,
                approver_email: post.approver_email,
                post_body: post.post_body,
                is_approved: post.is_approved,
                media_preview: post.media_preview,
                media_content: post.media_content,
                locations: locations,
                categories: categories,
                license: post.license
            };
        });
    }
}
