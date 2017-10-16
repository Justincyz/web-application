// This is the js for the default/index.html view.


function format_query (endpoint, params) {
    return endpoint + '?' + $.param(params);
}

function concat (source, target) {
    source.forEach(function (element) {
        target.push(element);
    })
}

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // will get 0 - 4 posts initially
    // then 4 more each call
    self.get_posts = function () {
        var vue = self.vue;

        var length = vue.posts.length;

        var url = get_posts_url + '?' + $.param({
            index: length,
            offset:  4
        });

        return $.getJSON(url, function (data) {
            concat(data.posts, vue.posts);
            vue.has_more = data.has_more;
        });
    }


    self.toggle_adding_post = function () {
        var vue = self.vue;
        vue.is_adding_post = !vue.is_adding_post;
        vue.add_post_content = undefined;
    }

    self.add_post = function () {
        var vue = self.vue;
        
        return $.post(add_post_url, {
            'post_content': $.trim(vue.add_post_content)
        }, function (data) {
            vue.posts.unshift(data.post);
            self.toggle_adding_post();
        });
    }


    self.del_post = function (post_id) {
        var vue = self.vue;
        
        return $.post(del_post_url, {
            'post_id': post_id
        }, function () {
            // splice is handled in the template by vue directive
        });
    },


    self.toggle_editing_post = function (post_index) {
        var vue = self.vue;

        if ($.isNumeric(post_index)) {
            vue.edit_post_content = vue.posts[post_index].post_content;
            console.log(vue.edit_post_content);
            vue.is_editing_post_with_index = post_index;
        }

        else {
            vue.edit_post_content = undefined;
            vue.is_editing_post_with_index = undefined;
        }
    },

    self.edit_post = function (post_id, post_index) {
        var vue = self.vue;
        
        return $.post(edit_post_url, {
            'post_id': post_id,
            'post_content': $.trim(vue.edit_post_content)
        }, function (data) {
            vue.posts[post_index] = data.post;
            self.toggle_editing_post();
        });
    }

    self.get_user = function () {
        var vue = self.vue;
        return $.getJSON(get_user_url, function (data) {
            vue.user = data.user;
            vue.is_logged_in = !! vue.user;
        });
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            posts: [],
            add_post_content: undefined,
            edit_post_content: undefined,
            has_more: false,
            user: undefined,
            is_logged_in: false,
            is_adding_post: false,
            is_editing_post_with_index: undefined
        },
        methods: {

            get_posts: self.get_posts,
            add_post: self.add_post,
            
            toggle_adding_post: self.toggle_adding_post,
            del_post: self.del_post,

            toggle_editing_post: self.toggle_editing_post,
            edit_post: self.edit_post
        }

    });

    self.get_user();

    self.get_posts().then(function () {
        $('#vue-div').show();
    });

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
