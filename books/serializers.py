from rest_framework import serializers
from .models import Author, Book


class AuthorSerializer(serializers.ModelSerializer):
    books_count = serializers.IntegerField(source='books.count', read_only=True)

    class Meta:
        model = Author
        fields = ["id", "name", "email", "books_count"]


class BookSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())
    author_details = AuthorSerializer(source='author', read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "description",
            "price",
            "published_date",
            "author",
            "author_details",
            "available",
            "created_at",
        ]


