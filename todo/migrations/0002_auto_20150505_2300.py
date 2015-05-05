# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='todo',
            name='status',
            field=models.CharField(default=b'in process', max_length=20, choices=[(b'backlog', b'backlog'), (b'in process', b'in process'), (b'hold', b'hold'), (b'closed', b'closed')]),
            preserve_default=True,
        ),
    ]
