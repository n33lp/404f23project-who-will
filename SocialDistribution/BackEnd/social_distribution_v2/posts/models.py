from django.db import models
from django.utils import timezone 
# Create your models here.
class Post(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey('auth.User', related_name='posts', on_delete=models.CASCADE)
    content=models.CharField(max_length=4000)
    post_image=models.ImageField(upload_to="post_image",null=True,blank=True)
    post_date_time = models.DateTimeField(default=timezone.now)
    category=models.CharField(max_length=3000,default=None,blank=True,null=True)
    def __str__(self):
        return str(self.id)

