def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    p_id = db.post.insert(
        FirstName=request.vars.FirstName,
        fname=request.vars.fname,

    )
    print request.vars.FirstName
    print request.vars.fname
    p = db.post(p_id)
    return response.json(dict(post=p))






