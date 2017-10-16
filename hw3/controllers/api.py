# These are the controllers for your ajax api.

def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])

def get_posts():
    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""

    index = int(request.vars.index)

    offset = int(request.vars.offset)

    posts = db().select(db.post.ALL, orderby=~db.post.created_on, limitby=(index, index + offset))

    # set user names on the posts for ui
    for post in posts:
        post.user_name = get_user_name_from_email(post.user_email)

    # last set (less than 4 posts left)
    is_last_set = len(posts) < offset

    # last set of exactly 4 posts and there are no more after
    has_no_more = len(db().select(db.post.ALL, limitby=(index + offset, index + offset + 2))) == 0

    return response.json({
        'posts': posts,
        'has_more': not (is_last_set or has_no_more)
        })


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature(hash_vars=False)
def add_post():
    """Here you get a new post and add it.  Return what you want."""

    post_id = db.post.insert(post_content=request.vars.post_content)

    post = db.post(post_id);

    # set user name on the post for ui
    post.user_name = get_user_name_from_email(post.user_email)

    return response.json({
        'post': post
    })


@auth.requires_signature(hash_vars=False)
def del_post():
    """Used to delete a post."""
    db(db.post.id == request.vars.post_id).delete()
    return response.json({})


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature(hash_vars=False)
def edit_post():
    """Here you get a new post and add it.  Return what you want."""

    post_id = request.vars.post_id

    db(db.post.id == post_id).update(post_content=request.vars.post_content)

    post = db.post(post_id);

    # set user name on the post for ui
    post.user_name = get_user_name_from_email(post.user_email)

    return response.json({
        'post': post
    })

def get_user():
    return response.json({
        'user': auth.user
    })

