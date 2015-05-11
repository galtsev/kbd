{% extends "./base.swig" %}
{% block head %}
    <title>Dan's todo list</title>
    <link rel="stylesheet" href="{{ static_url }}todo/css/todo_list.css" />
    <script src="{{ static_url }}todo/js/libs.js"></script>
    <script src="{{ static_url }}todo/js/main.js" ></script>
{% endblock %}

{% block body %}
    <div class="content">
        <h2>My React todo list</h2>
        <div id="list"></div>
    </div>
    <script>
        render_root();
    </script>
    </div>
{% endblock %}