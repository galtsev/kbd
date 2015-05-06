import re
from django.db import models

# Create your models here.
STATUS = [
    ('backlog', 'backlog'),
    ('in process', 'in process'),
    ('hold', 'hold'),
    ('closed', 'closed'),
]

tag_re = re.compile(r'#\w+(?:\.\w+)*')


class Todo(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default='in process')
    date_updated = models.DateTimeField(auto_now=True, null=True)

    def __unicode__(self):
        return self.description[:60]

    def save(self, *args, **kwargs):
        super(Todo, self).save(*args, **kwargs)
        old_tags = set(t.tag for t in self.tag_set.all())
        new_tags = set(tag_re.findall(self.description))
        self.tag_set.filter(tag__in=list(old_tags-new_tags)).delete()
        for tag in new_tags-old_tags:
            Tag(todo=self, tag=tag).save()


class Tag(models.Model):
    todo = models.ForeignKey(Todo)
    tag = models.CharField(max_length=60)

    def __unicode__(self):
        return u'#'+self.tag