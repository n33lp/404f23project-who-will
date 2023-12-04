# Generated by Django 4.2.7 on 2023-12-04 08:12

from django.db import migrations, models
import django.utils.timezone
import posts.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Categories',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('category', models.CharField(blank=True, default=None, max_length=3000, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('foreign', models.UUIDField(default=uuid.uuid4)),
                ('content', models.CharField(blank=True, max_length=4000)),
                ('description', models.CharField(blank=True, max_length=4000)),
                ('post_image', models.CharField(max_length=1000000, null=True)),
                ('post_date_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('title', models.CharField(blank=True, default=None, max_length=3000, null=True)),
                ('source', models.CharField(blank=True, default=None, max_length=3000, null=True, validators=[posts.models.validate_url])),
                ('origin', models.CharField(blank=True, default=None, max_length=3000, null=True, validators=[posts.models.validate_url])),
                ('visibility', models.CharField(choices=[('public', 'public'), ('private', 'private'), ('friends only', 'friends only')], max_length=30)),
                ('categories', models.ManyToManyField(blank=True, to='posts.categories')),
            ],
        ),
    ]
