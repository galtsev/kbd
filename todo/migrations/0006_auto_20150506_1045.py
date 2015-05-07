# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import re

from django.db import models, migrations

def extract_tags(apps, schema_editor):
    Todo = apps.get_model('todo', 'Todo')
    Tag = apps.get_model('todo', 'Tag')
    tag_re = re.compile(r'#\w+(?:\.\w+)*')
    for task in Todo.objects.all():
        for tag in set(tag_re.findall(task.description)):
            Tag(todo=task,tag=tag).save()


def remove_tags(apps, schema_editor):
    Tag = apps.get_model('todo', 'Tag')
    Tag.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0005_tag'),
    ]

    operations = [
        migrations.RunPython(extract_tags, remove_tags),
    ]
