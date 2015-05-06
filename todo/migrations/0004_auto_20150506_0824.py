# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def populate_date_updated(apps, schema_editor):
    Todo = apps.get_model('todo', 'Todo')
    for task in Todo.objects.all():
        task.date_updated = task.date_created
        task.save()

class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0003_todo_date_updated'),
    ]

    operations = [
        migrations.RunPython(populate_date_updated),
    ]
