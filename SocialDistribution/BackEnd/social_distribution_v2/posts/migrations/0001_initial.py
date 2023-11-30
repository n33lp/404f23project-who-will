# Generated by Django 4.2.7 on 2023-11-30 09:12

from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Categories",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "category",
                    models.CharField(
                        blank=True, default=None, max_length=3000, null=True
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Post",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("content", models.CharField(blank=True, max_length=4000)),
                ("description", models.CharField(blank=True, max_length=4000)),
                ("post_image", models.CharField(max_length=1000000, null=True)),
                (
                    "post_date_time",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                (
                    "title",
                    models.CharField(
                        blank=True, default=None, max_length=3000, null=True
                    ),
                ),
                (
                    "source",
                    models.CharField(
                        blank=True, default=None, max_length=3000, null=True
                    ),
                ),
                (
                    "origin",
                    models.CharField(
                        blank=True, default=None, max_length=3000, null=True
                    ),
                ),
                (
                    "visibility",
                    models.CharField(
                        choices=[
                            ("public", "public"),
                            ("private", "private"),
                            ("friends only", "friends only"),
                        ],
                        max_length=30,
                    ),
                ),
                (
                    "categories",
                    models.ManyToManyField(blank=True, to="posts.categories"),
                ),
            ],
        ),
    ]
