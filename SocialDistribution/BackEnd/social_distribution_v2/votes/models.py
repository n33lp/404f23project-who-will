from django.db import models
from posts.models import Post
from comments.models import Comment
# Create your models here.
class Vote(models.Model):
    id = models.AutoField(primary_key=True)
    post=models.ForeignKey(Post,related_name='votes',on_delete=models.CASCADE,default=None,blank=True,null=True)
    comment=models.ForeignKey(Comment,related_name='votes',on_delete=models.CASCADE,default=None,blank=True,null=True)
    up_vote_by = models.ForeignKey('auth.User',related_name='up_vote_user',on_delete=models.CASCADE,default=None,blank=True,null=True)
    def __str__(self):
        return self.post.content