{
    "page": {
        "title": "{{ page.title | escape }}",
        "level": "1.1",
        "depth": 1,
        {% if page.previous %}
        "previous": {
            "title": "{{page.previous.title}}",
            "level": "1.0",
            "depth": 1,
            "path": "{{page.previous.path}}",
            "ref": "{{page.previous.path}}",
            "articles": []
        },
        {% endif %}
        {% if page.next %}
        "next": {
            "title": "{{page.next.title}}",
            "level": "1.2",
            "depth": 1,
            "path": "{{page.next.path}}",
            "ref": "{{page.next.path}}",
            "articles": []
        },
        {% endif %}
        "dir": "ltr"
    },

    {%- include metadata.json.tpl -%}
}
