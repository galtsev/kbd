# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField()),
                ('description', models.TextField()),
                ('status', models.CharField(max_length=20, choices=[(b'backlog', b'backlog'), (b'in process', b'in process'), (b'hold', b'hold'), (b'closed', b'closed')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
