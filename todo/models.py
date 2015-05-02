from django.db import models

# Create your models here.
STATUS = [
    ('backlog', 'backlog'),
    ('in process', 'in process'),
    ('hold', 'hold'),
    ('closed', 'closed'),
]


class Todo(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default='in process')

    def __unicode__(self):
        return self.description[:60]